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
import Plane from '@/views/ChangingImage/modules/Plane';

@Component({})
export default class ChangingImage extends Vue {
  private container!: HTMLElement;
  private camera!: THREE.PerspectiveCamera;
  private scene!: THREE.Scene;
  private renderer!: THREE.WebGLRenderer;
  // camera controls
  private controls!: OrbitControls;
  private tick: number = 0;

  private plane!: Plane;
  private textureName: string = 'summer'; // summer or autumn

  private changingTime: number = 0;
  private totalChangingTime: number = 15000;
  private beforeTextureNumber: number = 2;
  private afterTextureNumber: number = 1;

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

    // this.plane.update(this.tick);

    this.changingTime -= 100;
    if (this.changingTime <= 0) {
      this.plane.basicUpdate(this.tick, this.afterTextureNumber);
    } else {
      this.plane.changeTexture(
        this.tick,
        this.totalChangingTime,
        this.changingTime,
        this.beforeTextureNumber,
        this.afterTextureNumber
      );
    }

    this.tick += 1;
    // renderer가 scene과 camera를 가지고 그린다.
    this.renderer.render(this.scene, this.camera);
  }

  private mounted() {
    this.init();
    this.animate();

    // mouse 움직일시 이벤트를 단다.
    this.container.addEventListener('click', event => {
      // 1)스크롤 시 물결이 일어난다(물결 normalmap texture 작동). + 2)이미지가 변한다 (sin파)
      // 3초간 걸쳐서 나타난다.
      if (this.beforeTextureNumber === 1) {
        this.changingTime = 15000;
        this.beforeTextureNumber = 2;
        this.afterTextureNumber = 1;
      } else {
        this.changingTime = 15000;
        this.beforeTextureNumber = 1;
        this.afterTextureNumber = 2;
      }
    });
  }

  private beforeDestroy() {
    this.scene.dispose();
    this.renderer.dispose();
  }
}
