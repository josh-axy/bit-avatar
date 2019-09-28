<template>
  <div class="home">
    <Greet message="我为祖国母亲庆生 | BITSU"/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Greet from '@/components/Greet.vue'; // @ is an alias to /src

@Component({
  components: {
    Greet,
  },
})
export default class Home extends Vue {}
</script>
