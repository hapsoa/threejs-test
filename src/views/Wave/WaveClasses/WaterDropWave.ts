import * as THREE from 'three';
import {
  Attributes,
  Properties,
  Point
} from '@/views/Wave/WaveClasses/WaveInterface';
import { RGBA_ASTC_10x10_Format, Vector3 } from 'three';

interface GrowingCircle {
  radius: number;
  effectRange: number;
}

export default class WaterDropWave {
  public mesh!: THREE.Mesh;
  public attributes!: Attributes;
  public properties!: Properties;

  private horizonCount: number = 20;
  private verticalCount: number = 20;
  private segmentWidth: number = 20;

  // mesh의 중점 (30, 30, 0)
  private meshCenterPoint!: Point;
  private growingCircle!: GrowingCircle;

  public constructor() {
    const geometry = new THREE.BufferGeometry();

    const indices: number[] = [];
    this.horizonCount = 20;
    this.verticalCount = 20;
    this.segmentWidth = 3;

    this.meshCenterPoint = {
      x: (this.segmentWidth * this.horizonCount) / 2,
      y: (this.segmentWidth * this.horizonCount) / 2,
      z: 0
    };
    this.growingCircle = {
      radius: 0,
      effectRange: Math.PI
    };
    console.log('this.meshCenterPoint', this.meshCenterPoint);

    this.properties = {
      position: new Float32Array(this.horizonCount * this.verticalCount * 3),
      color: new Float32Array(this.horizonCount * this.verticalCount * 4)
    };
    this.properties.color.fill(1);

    this.attributes = {
      position: new THREE.BufferAttribute(this.properties.position, 3),
      color: new THREE.BufferAttribute(this.properties.color, 4)
    };

    for (let i = 0; i < this.verticalCount; i++) {
      for (let j = 0; j < this.horizonCount; j++) {
        // 아래왼쪽부터 가로로 한줄씩 채운다.
        this.properties.position.set(
          [i * this.segmentWidth, j * this.segmentWidth, 0],
          (this.horizonCount * j + i) * 3
        );
        if (i < this.horizonCount - 1 && j < this.verticalCount - 1) {
          const standardIndex: number = this.horizonCount * j + i;
          indices.push(
            standardIndex,
            standardIndex + this.horizonCount,
            standardIndex + 1
          );
          indices.push(
            standardIndex + this.horizonCount,
            standardIndex + this.horizonCount + 1,
            standardIndex + 1
          );
        }
      }
    }

    // 신버전
    geometry.setIndex(indices);
    geometry.addAttribute('position', this.attributes.position);
    geometry.addAttribute('color', this.attributes.color);

    const material = new THREE.MeshBasicMaterial({
      side: THREE.DoubleSide,
      vertexColors: THREE.VertexColors
      // color: '#00ff00'
    });
    this.mesh = new THREE.Mesh(geometry, material);
  }

  public update(tick: number, light: Point) {
    // this.growingCircle.radius += 1 / 10;
    // if (this.growingCircle.radius > this.horizonCount * this.segmentWidth) {
    //   this.growingCircle.radius = 0;
    // }

    // 가로축들이 sin(x + a) 기준으로 이동하여 물결 애니메이션을 만든다.
    for (let i = 0; i < this.verticalCount; i++) {
      // const sinValue = Math.sin(tick / 10 + i / 5) * 2;
      for (let j = 0; j < this.horizonCount; j++) {
        // 점점커지는 원의 반지름과 mesh의 vertex 거리를 계산하는 로직을 만든다.
        const vertex = new THREE.Vector3(
          this.attributes.position.getX(this.horizonCount * i + j),
          this.attributes.position.getY(this.horizonCount * i + j),
          this.attributes.position.getZ(this.horizonCount * i + j)
        );

        // // 중점과 vertex의 거리를 구한다.
        // const distance: number = this.distanceOf2Points(
        //   vertex,
        //   this.meshCenterPoint
        // );

        const centerPoint = new Vector3(
          this.meshCenterPoint.x,
          this.meshCenterPoint.y,
          this.meshCenterPoint.z
        );

        const distance = vertex.distanceTo(centerPoint);

        const zValue: number = Math.sin(distance / 3 - tick / 30);

        this.attributes.position.setZ(this.horizonCount * i + j, zValue);

        // 빛에따라 색상을 달리한다 (해당 vertex의 법선벡터와 빛벡터의 내적을 구한다.)
        const innerProductValue = this.makeInnerProductAboutVertexNormalAndLightVector(
          {
            attributes: this.attributes,
            light,
            horizonIndex: j,
            verticalIndex: i,
            vertex
          }
        );

        let colorR: number = 1;
        let colorG: number = 1;
        let colorB: number = 1;
        if (i % 3 === 0) {
          colorR = 0;
        }
        if (i % 3 === 1) {
          colorG = 0;
        }
        if (i % 3 === 2) {
          colorB = 0;
        }

        this.attributes.color.setXYZ(
          this.horizonCount * i + j,
          Math.abs(innerProductValue * colorR),
          Math.abs(innerProductValue * colorG),
          Math.abs(innerProductValue * colorB)
        );
      }
    }

    // attribute가 update가능하도록 만들어주는 boolean 변수
    this.attributes.position.needsUpdate = true;
    this.attributes.color.needsUpdate = true;
  }

  /**
   * 해당 vertex의 법선벡터와 빛벡터를 내적값을 반환하는 함수이다.
   */
  private makeInnerProductAboutVertexNormalAndLightVector(o: {
    attributes: Attributes;
    light: Point;
    horizonIndex: number;
    verticalIndex: number;
    vertex: Point;
  }) {
    // 색상을 마우스빛에따라 변화시킨다.

    const lightVector = new THREE.Vector3(
      o.light.x - o.vertex.x,
      o.light.y - o.vertex.y,
      o.light.z - o.vertex.z
    ).normalize();

    // 같은 면을 이루는 이웃 vertex를 찾아, 평면과 평행한 벡터 2개를 만들어야 한다.
    const neighborVectors = this.makeHorizonWaveVertexNeighborVectors({
      positionAttribute: this.attributes.position,
      vertex: o.vertex,
      horizonCount: this.horizonCount,
      verticalCount: this.verticalCount,
      horizonIndex: o.horizonIndex,
      verticalIndex: o.verticalIndex
    });
    const neighborVector1: THREE.Vector3 = neighborVectors[0];
    const neighborVector2: THREE.Vector3 = neighborVectors[1];

    // 외적을 구할 수 있다.
    const normalVector = neighborVector1.cross(neighborVector2).normalize();

    // 외적된 벡터와 빛벡터가 같은 방향을 보고 있어야 한다.
    // 외적벡터가 z값으로 판단할 수 있다.
    if (normalVector.z < 0) {
      normalVector.x = -normalVector.x;
      normalVector.y = -normalVector.y;
      normalVector.z = -normalVector.z;
    }

    // 빛벡터와 법선벡터의 내적을 구한다.
    const innerProductValue: number = normalVector.dot(lightVector);
    return innerProductValue;
  }

  /**
   * 해당 vertex를 포함하는 평면과 평행한 벡터 2개를 만들어주는 함수이다.
   * @param o.vertex : 해당 vertex
   */
  private makeHorizonWaveVertexNeighborVectors(o: {
    positionAttribute: THREE.BufferAttribute;
    vertex: Point;
    horizonCount: number;
    verticalCount: number;
    horizonIndex: number;
    verticalIndex: number;
  }) {
    let neighborVertex1!: Point;
    let neighborVertex2!: Point;
    if (
      o.verticalIndex < o.verticalCount - 1 &&
      o.horizonIndex < o.horizonCount - 1
    ) {
      neighborVertex1 = {
        x: o.positionAttribute.getX(
          o.horizonCount * o.verticalIndex + o.horizonIndex + 1
        ),
        y: o.positionAttribute.getY(
          o.horizonCount * o.verticalIndex + o.horizonIndex + 1
        ),
        z: o.positionAttribute.getZ(
          o.horizonCount * o.verticalIndex + o.horizonIndex + 1
        )
      };
      neighborVertex2 = {
        x: o.positionAttribute.getX(
          o.horizonCount * (o.verticalIndex + 1) + o.horizonIndex
        ),
        y: o.positionAttribute.getY(
          o.horizonCount * (o.verticalIndex + 1) + o.horizonIndex
        ),
        z: o.positionAttribute.getZ(
          o.horizonCount * (o.verticalIndex + 1) + o.horizonIndex
        )
      };
    } else if (
      o.verticalIndex < o.verticalCount - 1 &&
      o.horizonIndex === o.horizonCount - 1
    ) {
      neighborVertex1 = {
        x: o.positionAttribute.getX(
          o.horizonCount * o.verticalIndex + o.horizonIndex - 1
        ),
        y: o.positionAttribute.getY(
          o.horizonCount * o.verticalIndex + o.horizonIndex - 1
        ),
        z: o.positionAttribute.getZ(
          o.horizonCount * o.verticalIndex + o.horizonIndex - 1
        )
      };
      neighborVertex2 = {
        x: o.positionAttribute.getX(
          o.horizonCount * (o.verticalIndex + 1) + o.horizonIndex
        ),
        y: o.positionAttribute.getY(
          o.horizonCount * (o.verticalIndex + 1) + o.horizonIndex
        ),
        z: o.positionAttribute.getZ(
          o.horizonCount * (o.verticalIndex + 1) + o.horizonIndex
        )
      };
    } else if (
      o.verticalIndex === o.verticalCount - 1 &&
      o.horizonIndex < o.horizonCount - 1
    ) {
      neighborVertex1 = {
        x: o.positionAttribute.getX(
          o.horizonCount * o.verticalIndex + o.horizonIndex + 1
        ),
        y: o.positionAttribute.getY(
          o.horizonCount * o.verticalIndex + o.horizonIndex + 1
        ),
        z: o.positionAttribute.getZ(
          o.horizonCount * o.verticalIndex + o.horizonIndex + 1
        )
      };
      neighborVertex2 = {
        x: o.positionAttribute.getX(
          o.horizonCount * (o.verticalIndex - 1) + o.horizonIndex
        ),
        y: o.positionAttribute.getY(
          o.horizonCount * (o.verticalIndex - 1) + o.horizonIndex
        ),
        z: o.positionAttribute.getZ(
          o.horizonCount * (o.verticalIndex - 1) + o.horizonIndex
        )
      };
    } else {
      neighborVertex1 = {
        x: o.positionAttribute.getX(
          o.horizonCount * o.verticalIndex + o.horizonIndex - 1
        ),
        y: o.positionAttribute.getY(
          o.horizonCount * o.verticalIndex + o.horizonIndex - 1
        ),
        z: o.positionAttribute.getZ(
          o.horizonCount * o.verticalIndex + o.horizonIndex - 1
        )
      };
      neighborVertex2 = {
        x: o.positionAttribute.getX(
          o.horizonCount * (o.verticalIndex - 1) + o.horizonIndex
        ),
        y: o.positionAttribute.getY(
          o.horizonCount * (o.verticalIndex - 1) + o.horizonIndex
        ),
        z: o.positionAttribute.getZ(
          o.horizonCount * (o.verticalIndex - 1) + o.horizonIndex
        )
      };
    }
    const neighborVector1 = new THREE.Vector3(
      o.vertex.x - neighborVertex1.x,
      o.vertex.y - neighborVertex1.y,
      o.vertex.z - neighborVertex1.z
    );
    const neighborVector2 = new THREE.Vector3(
      o.vertex.x - neighborVertex2.x,
      o.vertex.y - neighborVertex2.y,
      o.vertex.z - neighborVertex2.z
    );

    return [neighborVector1, neighborVector2];
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
}
