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
      currentTextureNumber: {
        value: 2.0
      },
      changingTime: {
        value: 0
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
  public update(tick: number) {
    (this.material as THREE.RawShaderMaterial).uniforms.time.value =
      tick * 0.001;

    if (this.remainingChangingTime > 0) {
      this.remainingChangingTime -= 0.1;
    } else {
      (this
        .material as THREE.RawShaderMaterial).uniforms.changingTime.value = 0;
    }

    // this.attributes.position.needsUpdate = true;
    // this.attributes.color.needsUpdate = true;
  }

  /**
   * 일정 시간동안 이미지를 바꿔주는 함수이다.
   */
  public changeTexture(newTextureName: string, time: number) {
    // 물결이 일어난다.
    // 여기서 uniform을 전달해 줄 수 밖에 없는듯 하다.
    // true냐 false냐에 따라 변하는 식이 되지 않을까 한다.
    // vert와 frag에 넘겨줄 수 있는 것은 uniform이다.
    // 시간과 조건 변수
    // uniform에 대한 시간을 조정하는게 좋아보인다.

    // 시간을 넣어주고
    // tick마다 조금씩 감소시켜준다.
    (this.material as THREE.RawShaderMaterial).uniforms.changingTime.value = 1;
    this.remainingChangingTime = 3;

    // 그동안 물결이 일어난다.
    // 그동안 이미지가 변경돼야 한다.
    // texture가 1번에서 2번으로 바뀌는지, 2번에서 1번으로 바뀌는지 알아야 한다.
    if (newTextureName === 'summer') {
      (this
        .material as THREE.RawShaderMaterial).uniforms.currentTextureNumber.value = 1.0;
    } else {
      (this
        .material as THREE.RawShaderMaterial).uniforms.currentTextureNumber.value = 2.0;
    }
  }
}
