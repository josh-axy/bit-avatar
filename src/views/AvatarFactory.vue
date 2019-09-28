<template>
  <div class="avatar-factory">
    <Greet message="我为祖国母亲庆生 | BITSU" :headImgUrl="headImgUrl" @say-hi="sayHi"/>
    <div class="flex-col">
      <img v-if="headImgUrl.length && false" :src="headImgUrl" class="avatar-img" />
      <el-avatar v-if="headImgUrl.length" :size="128" shape="square" :src="headImgUrl" />
      <el-button type="warning" plain @click="sayHi">生成纪念头像</el-button>
      <div v-if="false" contenteditable="true">
        {{ cookie }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  import { mapState, mapMutations } from 'vuex';
  import Greet from '@/components/Greet.vue';
  import { Button, Select, Avatar } from 'element-ui';
  import VueCookies from 'vue-cookies';

  Vue.use(Button);
  Vue.use(Select);
  Vue.use(Avatar);
  Vue.use(VueCookies);

  @Component({
    components: {
      Greet,
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
    private headImgUrl: string = '';
    private nickName: string = '';
    private cookie: string = '';

    // computed
    get random() {
      return Math.random();
    }

    // lifecycle hook
    private mounted() {
      console.log('mount avatar', this.random, this.$route.query);
      this.axios.get('/bit/get_user_info.php', {
        params: this.$route.query,
      }).then((res) => {
        console.log(res);
        if (res.data && res.data.Msg) {
          const data = res.data.data;
          this.headImgUrl = data.headimgurl.replace(/\/132$/, '/0');
          this.nickName = data.nickname;
          this.cookie = this.$cookies.get('PHPSESSID');
        }
      });
    }

    // method
    private sayHi({randomNum = this.random}) {
      console.log('say hi', randomNum);
      alert(`hi,${this.nickName} ${randomNum}`);
    }
  }
</script>

<style scoped lang="less">
.flex-col{
  display: flex;
  flex-direction: column;
  align-items: center;
  .el-button {
    margin-top: 10px;
  }
}
</style>
