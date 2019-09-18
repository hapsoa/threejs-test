import * as THREE from 'three';
import { Attributes, Properties, Point } from '@/interfaces/GeometryInterfaces';

// @ts-ignore
import vs from '!!raw-loader!./liquidVertex.vert';
// @ts-ignore
import fs from '!!raw-loader!./liquidFragment.frag';

export default class Plane {
  public mesh!: THREE.Mesh;
  public attributes!: Attributes;
  public properties!: Properties;

  private material!: THREE.Material;

  private remainingChangingTime: number = 0;

  public constructor() {
    const geometry = new THREE.PlaneGeometry(20, 20);

    const summerTexture = new THREE.TextureLoader().load('/img/summer.jpg');
    summerTexture.wrapS = THREE.RepeatWrapping;
    summerTexture.wrapT = THREE.RepeatWrapping;
    const autumnTexture = new THREE.TextureLoader().load('/img/autumn.jpg');
    autumnTexture.wrapS = THREE.RepeatWrapping;
    autumnTexture.wrapT = THREE.RepeatWrapping;
    const rippleNormalMapTexture = new THREE.TextureLoader().load(
      '/img/water-normalmap.png'
    );
    rippleNormalMapTexture.wrapS = THREE.RepeatWrapping;
    rippleNormalMapTexture.wrapT = THREE.RepeatWrapping;

    const uniforms = {
      summerTexture: {
        type: 't',
        value: summerTexture
      },
      autumnTexture: {
        type: 't',
        value: autumnTexture
      },
      rippleNormalMapTexture: {
        type: 't',
        value: rippleNormalMapTexture
      },
      time: { value: 1.0 },
      totalChangingTime: {
        value: 3000.0
      },
      changingTime: {
        value: 0.0
      },
      beforeTextureNumber: {
        value: 1
      },
      afterTextureNumber: {
        value: 1
      }
    };
    this.material = new THREE.RawShaderMaterial({
      uniforms,
      vertexShader: vs,
      fragmentShader: fs,
      side: THREE.DoubleSide,
      transparent: true
    });

    this.mesh = new THREE.Mesh(geometry, this.material);
  }

  /**
   * animate()함수 매번 호출시 호출하는 함수
   * @param tick
   * @param light
   */
  // public update(tick: number) {
  //   (this.material as THREE.RawShaderMaterial).uniforms.time.value =
  //     tick * 0.001;

  //   if (this.remainingChangingTime > 0) {
  //     this.remainingChangingTime -= 0.1;
  //   } else {
  //     (this
  //       .material as THREE.RawShaderMaterial).uniforms.changingTime.value = 0;
  //   }

  //   // this.attributes.position.needsUpdate = true;
  //   // this.attributes.color.needsUpdate = true;
  // }

  public basicUpdate(tick: number, afterTextureNumber: number) {
    (this.material as THREE.RawShaderMaterial).uniforms.time.value =
      tick * 0.001;
    (this
      .material as THREE.RawShaderMaterial).uniforms.beforeTextureNumber.value = afterTextureNumber;
    (this
      .material as THREE.RawShaderMaterial).uniforms.afterTextureNumber.value = afterTextureNumber;
  }

  /**
   * 일정 시간동안 이미지를 바꿔주는 함수이다.
   */
  public changeTexture(
    tick: number,
    totalChangingTime: number,
    changingTime: number,
    beforeTextureNumber: number,
    afterTextureNumber: number
  ) {
    (this.material as THREE.RawShaderMaterial).uniforms.time.value =
      tick * 0.001;
    (this
      .material as THREE.RawShaderMaterial).uniforms.totalChangingTime.value = totalChangingTime;
    (this
      .material as THREE.RawShaderMaterial).uniforms.changingTime.value = changingTime;
    (this
      .material as THREE.RawShaderMaterial).uniforms.beforeTextureNumber.value = beforeTextureNumber;
    (this
      .material as THREE.RawShaderMaterial).uniforms.afterTextureNumber.value = afterTextureNumber;
  }
}
