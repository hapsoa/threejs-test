import Vue from 'vue';
import { Component, Watch, Prop } from 'vue-property-decorator';

@Component({
  components: {}
})
export default class Main extends Vue {
  //
  private mounted() {
    console.log('main');
  }
}
