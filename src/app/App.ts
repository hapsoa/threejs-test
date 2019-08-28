import Vue from 'vue';
import { Component, Watch, Prop } from 'vue-property-decorator';

@Component({
  components: {}
})
export default class Editor extends Vue {
  private isNavigationOpen: boolean = false;
  //
  private items = [
    { title: 'Dashboard', icon: 'mdi-view-dashboard' },
    { title: 'Photos', icon: 'mdi-image' },
    { title: 'About', icon: 'mdi-help-box' }
  ];
  private right = null;

  private mounted() {
    // console.log('mounted');
  }

  private clickNavigation() {
    //
    console.log('click!!');
    this.isNavigationOpen = !this.isNavigationOpen;
  }
}
