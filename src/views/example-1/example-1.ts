import Vue from 'vue';
import { Component, Watch, Prop } from 'vue-property-decorator';
import * as THREE from 'three';

@Component({
  components: {}
})
export default class Example1 extends Vue {
  public $refs!: {
    renderer: HTMLElement;
  };

  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private cube!: THREE.Mesh;
  private cube2!: THREE.Mesh;
  private mesh!: THREE.Mesh;

  private mounted() {
    const width = this.$refs.renderer.clientWidth;
    const height = this.$refs.renderer.clientHeight;
    // variable initiation
    // Scene 은 장면 -> 그룹 물체를 등록
    // 현실의 방
    this.scene = new THREE.Scene();

    // Camera
    // Perspective : 원근
    // Orthographic : 직교
    this.camera = new THREE.PerspectiveCamera(
      75, // 화각. 보이는 각도. fov를 줄이면 확대가 된다. (위도우). field of view.
      // window.innerWidth / window.innerHeight, // 종횡비
      this.$refs.renderer.clientWidth / this.$refs.renderer.clientHeight,
      0.1, // 가까운 평면
      1000 // 먼 평면
    );
    this.camera.position.z = 10;
    // this.camera = new THREE.OrthographicCamera(
    // tslint:disable-next-line: max-line-length
    //   -this.$refs.renderer.clientWidth / 2, this.$refs.renderer.clientWidth / 2, -this.$refs.renderer.clientHeight / 2, this.$refs.renderer.clientHeight / 2, .1, 1000
    // );

    // 화면에 보이는 버퍼
    this.renderer = new THREE.WebGLRenderer();
    // 버퍼에 사이즈를 준다.
    this.renderer.setSize(width, height);

    // 더블버퍼링
    // 포인터를 바꾸는 형식(C언어)

    (document.getElementById('renderer') as HTMLElement).appendChild(
      this.renderer.domElement
    );

    const geometry1 = new THREE.BoxGeometry(1, 1, 1);
    const material1 = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    this.cube = new THREE.Mesh(geometry1, material1);

    const geometry2 = new THREE.BoxGeometry(1, 1, 1);
    const material2 = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    this.cube2 = new THREE.Mesh(geometry2, material2);

    // this.scene.add(this.cube);
    // this.scene.add(this.cube2);
    // this.cube2.position.x = 3;
    // this.camera.position.z = 5;

    const geometry = new THREE.BufferGeometry();
    // create a simple square shape. We duplicate the top left and bottom right
    // vertices because each vertex needs to appear once per triangle.
    const vertices = new Float32Array([
      -1.0,
      -1.0,
      1.0,
      1.0,
      -1.0,
      1.0,
      1.0,
      1.0,
      1.0,

      1.0,
      1.0,
      1.0,
      -1.0,
      1.0,
      1.0,
      -1.0,
      -1.0,
      1.0
    ]);

    // itemSize = 3 because there are 3 values (components) per vertex
    geometry.addAttribute('position', new THREE.BufferAttribute(vertices, 3));
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    this.mesh = new THREE.Mesh(geometry, material);
    this.scene.add(this.mesh);

    this.update();
  }

  private update() {
    requestAnimationFrame(this.update);

    // this.cube.rotation.x += 0.01;
    // this.cube.rotation.y += 0.01;
    // this.camera.position.z += 0.1;
    // this.mesh.rotation.x += 0.01;

    this.renderer.render(this.scene, this.camera);
  }
}
