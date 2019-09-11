import * as THREE from 'three';
import { Attributes, Properties, Point } from '@/interfaces/GeometryInterfaces';

// @ts-ignore
import vs from '!!raw-loader!./default.vert';
// @ts-ignore
import fs from '!!raw-loader!./default.frag';

export default class Scatter {
  public mesh!: THREE.Mesh;
  public attributes!: Attributes;
  public properties!: Properties;

  private segmentCount: number = 3000;
  private segmentWidth: number = 3;

  private material!: THREE.Material;

  // 중점 (0, 0, 0)
  private centerPoint: Point = {
    x: 0,
    y: 0,
    z: 0
  };

  /**
   * Scatter객체 생성 시 초기화를 진행한다.
   */
  public constructor() {
    const geometry = new THREE.BufferGeometry();

    // vertexOrder(순서), radius(반지름), radian(각도), 를 한번에 담는다.
    // => radianPosition
    this.properties = {
      // 삼각형의 점 갯수 * (x, y, z), (r, g, b, a) 개수
      position: new Float32Array(this.segmentCount * 3 * 3),
      color: new Float32Array(this.segmentCount * 3 * 4),
      radianPosition: new Float32Array(this.segmentCount * 3 * 4)
    };
    this.properties.color.fill(1);

    this.attributes = {
      position: new THREE.BufferAttribute(this.properties.position, 3),
      color: new THREE.BufferAttribute(this.properties.color, 4),
      radianPosition: new THREE.BufferAttribute(
        this.properties.radianPosition,
        4
      )
    };

    // 중점을 기준으로 랜덤한 위치의 삼각형을 여러개 만든다.
    for (let i = 0; i < this.segmentCount; i++) {
      const randomRaidus: number = Math.round(Math.random() * 100 - 50);
      const randomRadian: number = Math.random() * 2 * Math.PI;
      const randomZPosition: number = Math.random() * 2 * Math.PI;
      this.properties.radianPosition.set(
        [i * 3, randomRaidus, randomRadian, randomZPosition],
        i * 12
      );
      this.properties.radianPosition.set(
        [i * 3 + 1, randomRaidus, randomRadian, randomZPosition],
        i * 12 + 4
      );
      this.properties.radianPosition.set(
        [i * 3 + 2, randomRaidus, randomRadian, randomZPosition],
        i * 12 + 8
      );
    }

    // for (let i = 0; i < this.segmentCount; i++) {
    //   const randomX: number = Math.round(Math.random() * 100 - 50);
    //   const randomY: number = Math.round(Math.random() * 100 - 50);
    //   this.properties.position.set([randomX, randomY, 0], i * 9);
    //   this.properties.position.set(
    //     [randomX + this.segmentWidth, randomY, 0],
    //     i * 9 + 3
    //   );
    //   this.properties.position.set(
    //     [randomX + this.segmentWidth / 2, randomY + this.segmentWidth, 0],
    //     i * 9 + 6
    //   );
    // }

    geometry.addAttribute('position', this.attributes.position);
    geometry.addAttribute('color', this.attributes.color);
    geometry.addAttribute('radianPosition', this.attributes.radianPosition);

    this.material = new THREE.RawShaderMaterial({
      uniforms: {
        time: { value: 1.0 },
        segmentWidth: { value: 3.0 }
      },
      vertexShader: vs,
      fragmentShader: fs,
      side: THREE.DoubleSide,
      transparent: true
    });

    this.mesh = new THREE.Mesh(geometry, this.material);
  }

  /**
   * 매 frame 그리는 함수이다.
   * @param tick
   * @param light
   */
  public update(tick: number, light: Point) {
    // console.log('tick', tick);
    (this.material as THREE.RawShaderMaterial).uniforms.time.value = tick;

    // for (let i = 0; i < this.segmentCount; i++) {
    //   const vertex = new THREE.Vector3(
    //     this.attributes.position.getX(this.segmentCount * i + i),
    //     this.attributes.position.getY(this.segmentCount * i + i),
    //     this.attributes.position.getZ(this.segmentCount * i + i)
    //   );
    // }

    // attribute가 update가능하도록 만들어주는 boolean 변수
    this.attributes.position.needsUpdate = true;
    this.attributes.color.needsUpdate = true;
    (this.material as THREE.RawShaderMaterial).needsUpdate = true;
  }

  /**
   * 두 점 사이의 거리를 구하는 함수이다.
   * @param point1
   * @param point2
   */
  private distanceOf2Points(point1: Point, point2: Point): number {
    return Math.sqrt(
      (point1.x - point2.x) * (point1.x - point2.x) +
        (point1.y - point2.y) * (point1.y - point2.y)
    );
  }

  /**
   * 원의 한 정점의 x, y좌표를 통해 각도를 구하는 함수이다.
   * @param x : 원의 x좌표
   * @param y : 원의 y좌표
   */
  private getDegreeByCirclePosition(x: number, y: number) {
    return (Math.atan2(y, x) * 180) / Math.PI;
  }
}
