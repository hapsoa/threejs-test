/**
 * 기본 Three.js + vue
 */
import _ from 'lodash';
import { Component, Vue } from 'vue-property-decorator';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { BufferGeometry, BufferAttribute, DoubleSide, Vector3 } from 'three';

interface HorizonWaveAttributes {
  position: THREE.BufferAttribute;
  color: THREE.BufferAttribute;
}

interface HorizonWaveProperties {
  position: Float32Array;
  color: Float32Array;
}

@Component({})
export default class Wave extends Vue {
  private camera!: THREE.PerspectiveCamera;
  private scene!: THREE.Scene;
  private renderer!: THREE.WebGLRenderer;
  // camera controls
  private controls!: OrbitControls;
  private container!: HTMLElement;

  private tick: number = 0;
  private horizonWaveMesh!: THREE.Mesh;
  private horizonWaveAttributes!: HorizonWaveAttributes;
  private horizonWaveProperties!: HorizonWaveProperties;

  private horizonCount: number = 20;
  private verticalCount: number = 20;
  private segmentWidth: number = 3;

  private init() {
    this.container = document.getElementById('container') as HTMLElement;

    // 카메라 생성 (fov: 작아질수록 가까이, aspect: 화면비율, near: 어느시점부터 보이기, far: 어디까지 보이기)
    this.camera = new THREE.PerspectiveCamera(
      70,
      this.container.clientWidth / this.container.clientHeight,
      0.01,
      100
    );
    this.camera.position.z = 50;
    this.camera.up = new THREE.Vector3(0, 0, 1);

    // 화면 (ex. 방)
    this.scene = new THREE.Scene();

    const geometry = new THREE.BufferGeometry();

    const indices: number[] = [];
    const vertices: number[] = [];
    const horizonCount: number = 20;
    const verticalCount: number = 20;
    const segmentWidth: number = 3;

    this.horizonWaveProperties = {
      position: new Float32Array(horizonCount * verticalCount * 3),
      color: new Float32Array(horizonCount * verticalCount * 4)
    };
    this.horizonWaveProperties.color.fill(1);

    this.horizonWaveAttributes = {
      position: new BufferAttribute(this.horizonWaveProperties.position, 3),
      color: new BufferAttribute(this.horizonWaveProperties.color, 4)
    };

    for (let i = 0; i < horizonCount; i++) {
      for (let j = 0; j < verticalCount; j++) {
        // 구버전
        vertices.push(i * segmentWidth, j * segmentWidth, 0);
        // 신버전
        this.horizonWaveProperties.position.set(
          [i * segmentWidth, j * segmentWidth, 0],
          (horizonCount * j + i) * 3
        );
        if (i < horizonCount - 1 && j < verticalCount - 1) {
          const standardIndex: number = horizonCount * j + i;
          // 구버전
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
          // 신버전
        }
      }
    }

    // 구버전
    geometry.setIndex(indices);
    // geometry.addAttribute(
    //   'position',
    //   new THREE.Float32BufferAttribute(vertices, 3)
    // );
    // 신버전
    geometry.addAttribute('position', this.horizonWaveAttributes.position);

    const material = new THREE.MeshBasicMaterial({
      side: DoubleSide
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
      const sinValue = Math.sin(this.tick / 10 + i / 5) * 3;
      for (let j = 0; j < this.horizonCount; j++) {
        // 같은 sin함수를 만든다.
        // @ts-ignore
        // ((this.mesh.geometry as THREE.BufferGeometry).attributes
        //   .position as THREE.BufferAttribute).array[
        //   (this.horizonCount * i + j) * 3 + 2
        // ] = sinValue;
        //
        // 아래 코드를 다시 켜야한다.
        // index의 기준은 vertices의 index 순서로 보인다.
        // ((this.horizonWaveMesh.geometry as THREE.BufferGeometry).getAttribute(
        //   'position'
        // ) as BufferAttribute).setZ(this.horizonCount * i + j, sinValue);
      }
    }

    ((this.horizonWaveMesh.geometry as BufferGeometry).attributes
      .position as BufferAttribute).needsUpdate = true;

    this.tick++;
    // renderer가 scene과 camera를 가지고 그린다.
    this.renderer.render(this.scene, this.camera);
  }

  private mounted() {
    this.init();
    this.animate();

    const vector = new THREE.Vector3();
    vector.x = ((vector.x + 1) * this.container.clientWidth) / 2;
    vector.y = (-(vector.y - 1) * this.container.clientHeight) / 2;
    vector.z = 0;
    vector.project(this.camera);
    //
    this.container.onmousemove = event => {
      // console.log('event', event);
      // const vec = new THREE.Vector3(); // create once and reuse
      // const pos = new THREE.Vector3(); // create once and reuse

      // vec.set(event.clientX, -event.clientY, 0);

      // vec.unproject(this.camera);

      // vec.sub(this.camera.position).normalize();

      // const distance = -this.camera.position.z / vec.z;

      // pos.copy(this.camera.position).add(vec.multiplyScalar(distance));
      // console.log('pos', pos);
      //

      console.log('vector', vector);
    };
  }
}
