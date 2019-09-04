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
import HorizonWave from '@/views/Wave/WaveClasses/HorizonWave';
import WaterDropWave from '@/views/Wave/WaveClasses/WaterDropWave';

@Component({})
export default class Wave extends Vue {
  private container!: HTMLElement;
  private camera!: THREE.PerspectiveCamera;
  private scene!: THREE.Scene;
  private renderer!: THREE.WebGLRenderer;
  // camera controls
  private controls!: OrbitControls;
  private tick: number = 0;

  // horizonWave 변수들
  private horizonWave!: HorizonWave;
  private waterDropWave!: WaterDropWave;

  // waterDropWave 변수들
  private waterDropWaveMesh!: THREE.Mesh;
  private waterDropWaveAttributes!: Attributes;
  private waterDropWaveProperties!: Properties;
  private horizonCount: number = 20;
  private verticalCount: number = 20;
  private segmentWidth: number = 3;

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

    // this.horizonWave = new HorizonWave();
    // this.scene.add(this.horizonWave.mesh);
    this.waterDropWave = new WaterDropWave();
    this.scene.add(this.waterDropWave.mesh);

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

    // this.horizonWave.update(this.tick, this.light);
    this.waterDropWave.update(this.tick, this.light);
    this.tick += 0.03;
    // renderer가 scene과 camera를 가지고 그린다.
    this.renderer.render(this.scene, this.camera);
  }

  private mounted() {
    this.init();
    this.animate();

    // mouse 움직일시 이벤트를 단다.
    this.container.onmousemove = event => {
      this.light.x = (event.clientX / this.container.clientWidth) * 2 - 1;
      this.light.y = -(event.clientY / this.container.clientHeight) * 2 + 1;
      this.light.x *= 100;
      this.light.y *= 100;
    };
  }
}
