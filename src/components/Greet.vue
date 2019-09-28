<template>
  <div class="hello">
    <h1>{{ message }}</h1>
    <img v-show="!headImgUrl.length" src="../assets/logo.png">
    <p v-if="false">
      <button @click="sayHi">
        Say Hi
      </button>
    </p>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Emit, Vue } from 'vue-property-decorator';

@Component
export default class Greet extends Vue {
  @Prop(String) private message!: string;
  @Prop(String) private headImgUrl!: string;
  get hRandom() {
    return Math.random();
  }
  // initial data

  @Emit()
  private sayHi() {
    return {randomNum: this.hRandom};
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
