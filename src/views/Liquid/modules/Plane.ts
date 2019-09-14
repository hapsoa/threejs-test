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

  public constructor() {
    const geometry = new THREE.PlaneGeometry(20, 20);

    const summerTexture = new THREE.TextureLoader().load('/img/summer.jpg');
    summerTexture.wrapS = THREE.RepeatWrapping;
    summerTexture.wrapT = THREE.RepeatWrapping;
    const autumnTexture = new THREE.TextureLoader().load('/img/autumn.jpg');
    autumnTexture.wrapS = THREE.RepeatWrapping;
    autumnTexture.wrapT = THREE.RepeatWrapping;
    const rippleTexture = new THREE.TextureLoader().load(
      '/img/water-normalmap.png'
    );
    rippleTexture.wrapS = THREE.RepeatWrapping;
    rippleTexture.wrapT = THREE.RepeatWrapping;

    const uniforms = {
      summerTexture: {
        type: 't',
        value: summerTexture
      },
      autumnTexture: {
        type: 't',
        value: autumnTexture
      },
      rippleTexture: {
        type: 't',
        value: rippleTexture
      },
      time: { value: 1.0 }
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

  public update(tick: number, light: Point) {
    (this.material as THREE.RawShaderMaterial).uniforms.time.value =
      tick * 0.001;
    // this.attributes.position.needsUpdate = true;
    // this.attributes.color.needsUpdate = true;
  }
}
