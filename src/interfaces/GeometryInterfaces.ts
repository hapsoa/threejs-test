import * as THREE from 'three';

export interface Attributes {
  position: THREE.BufferAttribute;
  color: THREE.BufferAttribute;
  [attribute: string]: THREE.BufferAttribute;
}

export interface Properties {
  position: Float32Array;
  color: Float32Array;
  [properties: string]: Float32Array;
}

export interface Point {
  x: number;
  y: number;
  z: number;
}
