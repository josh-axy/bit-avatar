<template>
  <div class="avatar-factory">
    <p>
      {{ message }}
      {{ random }}
      {{ random }}
    </p>
    <HelloWorld message="我为祖国母亲庆生" @say-hi="sayHi"/>
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  import { mapState, mapMutations } from 'vuex';
  import HelloWorld from '@/components/HelloWorld.vue';

  @Component({
    components: {
      HelloWorld,
    },
    // Vuex's component binding helper can use here
    computed: mapState([
      'count',
    ]),
    methods: mapMutations([
      'increment',
    ]),
  })
  export default class AvatarFactory extends Vue {

    // initial data
    private message?: string = 'hello';

    // computed
    get random() {
      return Math.random();
    }

    // lifecycle hook
    private mounted() {
      console.log('mount avatar', this.message, this.random);
    }

    // method
    private sayHi(randomNum: number) {
      console.log('say hi', randomNum);
    }
  }
</script>

<style scoped>

</style>
