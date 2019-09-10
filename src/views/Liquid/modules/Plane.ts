import * as THREE from 'three';
import { Attributes, Properties, Point } from '@/interfaces/GeometryInterfaces';

// @ts-ignore
import vs from '!!raw-loader!./default.vert';
// @ts-ignore
import fs from '!!raw-loader!./default.frag';

export default class Plane {
  public mesh!: THREE.Mesh;
  public attributes!: Attributes;
  public properties!: Properties;

  private material!: THREE.Material;

  public constructor() {
    const geometry = new THREE.PlaneGeometry(20, 20);

    const uniforms = {
      texture1: {
        type: 't',
        value: new THREE.TextureLoader().load('/img/testing-image.jpg')
      },
      texture2: {
        type: 't',
        value: new THREE.TextureLoader().load('/img/testing-image.jpg')
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
    // this.attributes.position.needsUpdate = true;
    // this.attributes.color.needsUpdate = true;
  }
}
