import Vue from 'vue';
import { Component, Watch, Prop } from 'vue-property-decorator';

@Component({
  components: {}
})
export default class Editor extends Vue {
  private isNavigationOpen: boolean = false;
  //
  private navigationItems = [
    { title: 'example-1', icon: 'mdi-view-dashboard' },
    { title: 'buffer-geometry-test', icon: 'mdi-image' },
    { title: 'template', icon: 'mdi-help-box' }
  ];

  private mounted() {
    // console.log('mounted');
  }

  /**
   * 네비게이션을 열고 닫는 함수이다.
   */
  private openNavigation() {
    this.isNavigationOpen = !this.isNavigationOpen;
  }
}
