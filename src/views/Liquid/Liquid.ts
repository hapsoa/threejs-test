/**
 * 기본 Three.js + vue
 */
import _ from 'lodash';
import { Component, Vue } from 'vue-property-decorator';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import {
  Attributes,
  Properties,
  Point
} from '@/views/Wave/WaveClasses/WaveInterface';
import Plane from '@/views/Liquid/modules/Plane';

@Component({})
export default class Liquid extends Vue {
  private container!: HTMLElement;
  private camera!: THREE.PerspectiveCamera;
  private scene!: THREE.Scene;
  private renderer!: THREE.WebGLRenderer;
  // camera controls
  private controls!: OrbitControls;
  private tick: number = 0;

  // horizonWave 변수들
  private plane!: Plane;

  private light: Point = {
    x: 0,
    y: 0,
    z: 40
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

    this.plane = new Plane();
    this.scene.add(this.plane.mesh);

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

    this.plane.update(this.tick, this.light);
    this.tick += 1;
    // renderer가 scene과 camera를 가지고 그린다.
    this.renderer.render(this.scene, this.camera);
  }

  private mounted() {
    this.init();
    this.animate();
  }

  private beforeDestroy() {
    this.scene.dispose();
    this.renderer.dispose();
  }
}
