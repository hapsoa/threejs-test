/**
 * 기본 Three.js + vue
 */
import _ from 'lodash';
import { Component, Vue } from 'vue-property-decorator';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { BufferGeometry, BufferAttribute, DoubleSide } from 'three';

interface HorizonWaveAttributes {
  position: THREE.BufferAttribute;
  color: THREE.BufferAttribute;
}

interface HorizonWaveProperties {
  position: Float32Array;
  color: Float32Array;
}

interface Point {
  x: number;
  y: number;
  z: number;
}

@Component({})
export default class Wave extends Vue {
  private container!: HTMLElement;
  private camera!: THREE.PerspectiveCamera;
  private scene!: THREE.Scene;
  private renderer!: THREE.WebGLRenderer;
  // camera controls
  private controls!: OrbitControls;

  private tick: number = 0;
  private horizonWaveMesh!: THREE.Mesh;
  private horizonWaveAttributes!: HorizonWaveAttributes;
  private horizonWaveProperties!: HorizonWaveProperties;

  private horizonCount: number = 20;
  private verticalCount: number = 20;
  private segmentWidth: number = 3;

  private light = {
    x: 0,
    y: 0,
    z: 50
  };

  private init() {
    this.container = document.getElementById('container') as HTMLElement;

    // 카메라 생성 (fov: 작아질수록 가까이, aspect: 화면비율, near: 어느시점부터 보이기, far: 어디까지 보이기)
    this.camera = new THREE.PerspectiveCamera(
      70,
      this.container.clientWidth / this.container.clientHeight,
      0.01,
      1000
    );
    this.camera.position.z = 50;
    this.camera.up = new THREE.Vector3(0, 0, 1);

    // 화면 (ex. 방)
    this.scene = new THREE.Scene();

    const geometry = new THREE.BufferGeometry();

    const indices: number[] = [];
    // const vertices: number[] = [];
    const horizonCount: number = 20;
    const verticalCount: number = 20;
    const segmentWidth: number = 3;

    this.horizonWaveProperties = {
      position: new Float32Array(horizonCount * verticalCount * 3),
      color: new Float32Array(horizonCount * verticalCount * 4)
    };
    this.horizonWaveProperties.color.fill(0);

    this.horizonWaveAttributes = {
      position: new BufferAttribute(this.horizonWaveProperties.position, 3),
      color: new BufferAttribute(this.horizonWaveProperties.color, 4)
    };

    for (let i = 0; i < verticalCount; i++) {
      for (let j = 0; j < horizonCount; j++) {
        // 구버전
        // vertices.push(i * segmentWidth, j * segmentWidth, 0);
        // 신버전
        // 아래왼쪽부터 가로로 한줄씩 채운다.
        this.horizonWaveProperties.position.set(
          [i * segmentWidth, j * segmentWidth, 0],
          (horizonCount * j + i) * 3
        );
        if (i < horizonCount - 1 && j < verticalCount - 1) {
          const standardIndex: number = horizonCount * j + i;
          indices.push(
            standardIndex,
            standardIndex + horizonCount,
            standardIndex + 1
          );
          indices.push(
            standardIndex + horizonCount,
            standardIndex + horizonCount + 1,
            standardIndex + 1
          );
        }

        let testColor1: number = 1;
        let testColor2: number = 1;
        let testColor3: number = 1;
        if (i % 3 === 0) {
          testColor1 = 1;
        }
        if (i % 3 === 1) {
          testColor2 = 1;
        }
        if (i % 3 === 2) {
          testColor3 = 1;
        }

        this.horizonWaveProperties.color.set(
          [testColor1, testColor2, testColor3, 1],
          (horizonCount * j + i) * 4
        );
      }
    }

    // 구버전
    // geometry.addAttribute(
    //   'position',
    //   new THREE.Float32BufferAttribute(vertices, 3)
    // );
    // 신버전
    geometry.setIndex(indices);
    geometry.addAttribute('position', this.horizonWaveAttributes.position);
    geometry.addAttribute('color', this.horizonWaveAttributes.color);

    const material = new THREE.MeshBasicMaterial({
      side: THREE.DoubleSide,
      vertexColors: THREE.VertexColors
      // color: '#00ff00'
    });
    this.horizonWaveMesh = new THREE.Mesh(geometry, material);
    this.scene.add(this.horizonWaveMesh);

    // renderer는 그리기 객체이다.
    this.renderer = new THREE.WebGLRenderer({ antialias: true });

    // renderer의 크기를 설정한다. 화면 크기를 설정한다고 볼 수 있겠다.
    this.renderer.setSize(
      this.container.clientWidth,
      this.container.clientHeight
    );
    this.container.appendChild(this.renderer.domElement);

    // camera controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
  }
  private animate() {
    requestAnimationFrame(this.animate);

    // 가로축들이 sin(x + a) 기준으로 이동하여 물결 애니메이션을 만든다.
    for (let i = 0; i < this.verticalCount; i++) {
      const sinValue = Math.sin(this.tick / 10 + i / 5) * 2;
      for (let j = 0; j < this.horizonCount; j++) {
        // @ts-ignore 옛날 코드
        // ((this.mesh.geometry as THREE.BufferGeometry).attributes
        //   .position as THREE.BufferAttribute).array[
        //   (this.horizonCount * i + j) * 3 + 2
        // ] = sinValue;
        //
        // 같은 sin함수를 만든다.
        // index의 기준은 vertices의 index 순서로 보인다.
        // this.horizonWaveAttributes.position.setZ(
        //   this.horizonCount * i + j,
        //   sinValue
        // );

        // 색상을 마우스빛에따라 변화시킨다.
        const vertex: Point = {
          x: this.horizonWaveAttributes.position.getX(
            this.horizonCount * i + j
          ),
          y: this.horizonWaveAttributes.position.getY(
            this.horizonCount * i + j
          ),
          z: this.horizonWaveAttributes.position.getZ(this.horizonCount * i + j)
        };
        const lightVector = new THREE.Vector3(
          this.light.x - vertex.x,
          this.light.y - vertex.y,
          this.light.z - vertex.z
        ).normalize();
        // 같은 면을 이루는 이웃 vertex를 알아야 한다.
        if (i < this.verticalCount - 1 && j < this.horizonCount - 1) {
          const neighborVertex1: Point = {
            x: this.horizonWaveAttributes.position.getX(
              this.horizonCount * i + j + 1
            ),
            y: this.horizonWaveAttributes.position.getY(
              this.horizonCount * i + j + 1
            ),
            z: this.horizonWaveAttributes.position.getZ(
              this.horizonCount * i + j + 1
            )
          };
          const neighborVertex2: Point = {
            x: this.horizonWaveAttributes.position.getX(
              this.horizonCount * i + 1 + j
            ),
            y: this.horizonWaveAttributes.position.getY(
              this.horizonCount * i + 1 + j
            ),
            z: this.horizonWaveAttributes.position.getZ(
              this.horizonCount * i + 1 + j
            )
          };

          const neighborVector1 = new THREE.Vector3(
            vertex.x - neighborVertex1.x,
            vertex.y - neighborVertex1.y,
            vertex.z - neighborVertex1.z
          );
          const neighborVector2 = new THREE.Vector3(
            vertex.x - neighborVertex2.x,
            vertex.y - neighborVertex2.y,
            vertex.z - neighborVertex2.z
          );

          // 외적을 구할 수 있다.
          const normalVector = neighborVector1
            .cross(neighborVector2)
            .normalize();

          // 빛벡터와 법선벡터의 내적을 구한다.
          const weight: number = normalVector.dot(lightVector);

          //
          this.horizonWaveAttributes.color.setXYZ(
            this.horizonCount * i + j,
            Math.abs(weight),
            Math.abs(weight),
            Math.abs(weight)
          );
        } else {
          //
        }
      }
    }

    ((this.horizonWaveMesh.geometry as BufferGeometry).attributes
      .position as BufferAttribute).needsUpdate = true;

    this.tick++;
    // renderer가 scene과 camera를 가지고 그린다.
    this.renderer.render(this.scene, this.camera);
  }

  private mounted() {
    console.log('yap');
    this.init();
    this.animate();

    // mouse 움직일시 이벤트를 단다.
    this.container.onmousemove = event => {
      this.light.x = (event.clientX / this.container.clientWidth) * 2 - 1;
      this.light.y = -(event.clientY / window.innerHeight) * 2 + 1;
      console.log('mouse x', this.light.x, 'mouse y', this.light.y);
    };
  }
}
