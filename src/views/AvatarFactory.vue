<template>
  <div class="avatar-factory" v-loading.fullscreen.lock="isLoading">
    <div class="flex-col">
      <div class="center-flow">
        <el-button circle type="warning" icon="el-icon-arrow-left" @click="switchCover(-1)"></el-button>
        <div class="avatar-wrap">
          <canvas v-show="canvasVisible" id="avatarGraph" width="384" height="384" @click="chooseImg">
            您的浏览器不支持 HTML5 canvas 标签。
          </canvas>
          <el-avatar v-show="!canvasVisible" shape="square" :size="128" :src="headImgUrl" />
        </div>
        <el-button circle type="warning" icon="el-icon-arrow-right" @click="switchCover(1)"></el-button>
      </div>

      <el-button plain type="warning" class="submit-button" @click="genAvatarImg">
        生成纪念头像
      </el-button>

      <span class="info">点击头像，可以更换自己喜欢的图片~</span>

      <el-dialog
        title="你的头像出炉啦！"
        :visible.sync="dialogVisible"
        width="300px"
        class="canvas-dialog"
      >
        <div class="flex-row--center">
          <el-avatar shape="square" :size="128" :src="canvasUrlData" />
        </div>
        <span class="info">长按图片保存，别忘了 <strong class="danger">在看</strong> 哦~</span>

        <span slot="footer" class="dialog-footer"></span>
      </el-dialog>

      <div class="credential" v-if="false" contenteditable="true">
        {{ cookie }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import {mapMutations, mapState} from 'vuex';
import {Avatar, Button, Dialog, Select, Loading} from 'element-ui';
import VueCookies from 'vue-cookies';
import {getNonceStr, getURLBase64} from '@/utils';

const WechatJSSDK = require('wechat-jssdk/dist/client.umd');
const SITE = 'https://www.laotiehui.cc/';
const SITE_UNSPLASH = 'https://www.laotiehui.cc';
// ES6 import
// import WechatJSSDK from 'wechat-jssdk/dist/client.umd';

Vue.use(Button);
Vue.use(Select);
Vue.use(Avatar);
Vue.use(Dialog);
Vue.use(VueCookies);
Vue.use(Loading.directive);

Vue.prototype.$loading = Loading.service;

@Component({
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
  private dialogVisible: boolean = false;
  private canvasVisible: boolean = false;
  private currentCover: number = 0;
  private coverList: string[] = [
    require('@/assets/cover2.png'),
    require('@/assets/cover1.png'),
    require('@/assets/cover3.png'),
    require('@/assets/cover4.png'),
  ];
  private canvasUrlData: string = '';
  private config = {
    // 前4个是微信验证签名必须的参数，第2-4个参数为类似上面 '/get-signature' 从node端获取的结果
    appId: 'wx3a294bba257922c0',
    nonceStr: getNonceStr(),
    signature: '',
    timestamp: Math.round(new Date().getTime() / 1000),
    // 下面为可选参数
    debug: false, // 开启 debug 模式
    // 设置所有想要使用的微信jsapi列表, 默认值为 ['onMenuShareTimeline', 'onMenuShareAppMessage']，分享到朋友圈及聊天记录
    jsApiList: ['updateAppMessageShareData', 'updateTimelineShareData', 'chooseImage', 'uploadImage'],
    customUrl: '', // 自定义微信js链接
  };
  private wx: any;
  private isLoading: boolean = false;

  // computed
  get random() {
    return Math.random();
  }

  // lifecycle hook
  private async mounted() {
    // console.log('mount avatar', this.random, this.$route.query);
    if (this.$route.query.state !== 'bitsuNationalDayAvatar') {
      location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx3a294bba257922c0&redirect_uri=https%3a%2f%2fwww.laotiehui.cc%2fbit%2favatar&response_type=code&scope=snsapi_userinfo&state=bitsuNationalDayAvatar';
      return ;
    }
    this.isLoading = true;
    const { data: res } = await this.axios.get('/api/get_user_info.php', {params: this.$route.query});
    if (res && res.Msg) {
      const data = res.data;
      this.headImgUrl = data.headimgurl && data.headimgurl.replace(/\/132$/, '/0').replace('http://', 'https://');
      this.nickName = data.nickname;
      // this.cookie = this.$cookies.get('PHPSESSID');
      this.drawAvatar();
    }
    const { data: sign } = await this.axios.get('/api/get_sign.php', {
      params: {
        timestamp: this.config.timestamp,
        noncestr: this.config.nonceStr,
      },
    });
    // console.log(sign);
    if (sign && sign.Msg) {
      // this.cookie = JSON.stringify(sign.data);
      this.config.signature = sign.data.signature;
      const wechatObj = new WechatJSSDK(this.config);
      const wRef = await wechatObj.initialize();
      const wx = wechatObj.getOriginalWx();
      this.wx = wx;
      // console.log(wRef);
      // 自定义分享到聊天窗口
      wx.checkJsApi({
        // 需要检测的JS接口列表，所有JS接口列表见附录2,
        jsApiList: ['updateAppMessageShareData', 'updateTimelineShareData', 'chooseImage', 'uploadImage'],
        success(checkRes: any) {
          // alert(JSON.stringify(res));
          // 以键值对的形式返回，可用的api值true，不可用为false
          // 如：{"checkResult":{"chooseImage":true},"errMsg":"checkJsApi:ok"}
        },
      });
      // 内部调用 `wechatObj.callWechatApi('onMenuShareAppMessage', {...})`语法糖
      wx.updateAppMessageShareData({
        type: 'link',
        title: '庆祝华诞七十年，北理工人换新颜！',
        desc: '@全体北理工人',
        link: SITE + 'bit/avatar',
        imgUrl: SITE_UNSPLASH + require('@/assets/share_cover.jpg'),
        // success: (e: any) => {console.log(e)},
        // cancel: function (){}
      });
      // 自定义分享到朋友圈
      // 语法糖
      wx.updateTimelineShareData({
        type: 'link',
        title: '庆祝华诞七十年，北理工人换新颜！@全体北理工人',
        link: SITE + 'bit/avatar',
        imgUrl: SITE_UNSPLASH + require('@/assets/share_cover.jpg'),
        // success: (e: any) => {console.log(e)},
      });
    }
  }

  private chooseImg() {
    this.wx.chooseImage({
      count: 1,
      sizeType: 'compressed',
      success: (res: any) => {
        // console.log('local ids', res.localIds);
        this.wx.uploadImage({
          localId: res.localIds[0], // 需要上传的图片的本地ID，由chooseImage接口获得
          isShowProgressTips: 1, // 默认为1，显示进度提示
          success: async (serverRes: any) => {
            const serverId = serverRes.serverId; // 返回图片的服务器端ID
            // alert(serverId);
            // this.cookie = serverId;
            this.isLoading = true;
            const { data: content } = await this.axios.get('/api/get_media.php', {
              params: {
                media_id: serverId,
              },
            });
            if (this.$route.query.debug) {
              alert(JSON.stringify(content));
            }
            this.headImgUrl = SITE + content.data;
            this.drawAvatar();
          }
        });
        // this.wx.getLocalImgData({
        //   localId: res.localIds[0], // 图片的localID
        //   success: (dataRes: any) => {
        //      // localData是图片的base64数据，可以用img标签显示
        //     this.headImgUrl = dataRes.localData;
        //     this.drawAvatar();
        //     // console.log('local data', localData);
        //   },
        // });
      }
    });
  }

  // method
  private switchCover(direction: number) {
    const { currentCover } = this;
    const { coverList: { length } } = this;
    const [left, right] = [-1, 1];
    switch (direction) {
      case right:
        this.currentCover = (currentCover + 1) % length;
        break;
      case left:
        this.currentCover = (currentCover + length - 1) % length;
        break;
    }
    this.drawAvatar();
  }

  private sayHi({randomNum = this.random}) {
    console.log('say hi', randomNum);
    alert(`hi,${this.nickName} ${randomNum}`);
  }

  private genAvatarImg() {
    this.dialogVisible = true;
    this.$nextTick(() => {
      // this.drawAvatar();
    });
  }

  private drawAvatar() {
    const canvas = document.getElementById('avatarGraph') as HTMLCanvasElement;
    // 创建img元素
    const img = new Image();
    const cover = new Image();
    const getCover = new Promise((resolve, reject) => {
      cover.onload = () => {
        resolve(cover);
      };
    });
    const getImg = new Promise((resolve, reject) => {
      img.onload = () => {
        resolve(img);
      };
    });
    Promise.all([getCover, getImg]).then((pics) => {
      // console.log(pics);
      if (this.isLoading) {
        this.isLoading = false;
      }
      // 执行drawImage语句
      if (canvas.getContext) {
        const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
        const resolution = 384;
        let { height, width } = img;
        const ratio = Math.min(height, width) / resolution;
        width = Math.round(width / ratio);
        height = Math.round(height / ratio);
        const x = width > resolution ? (resolution - width) / 2 : 0;
        const y = height > resolution ? (resolution - height) / 2 : 0;
        ctx.drawImage(img, x, y, width, height);
        ctx.drawImage(cover, 0, 0, resolution, resolution);
        this.canvasVisible = true;
        setTimeout(() => {
          this.canvasUrlData = canvas.toDataURL('image/jpeg');
          // console.log(this.canvasUrlData);
        }, 100);
      }
    });
    // 加载img
    getURLBase64(this.headImgUrl).then((value: any) => {
      img.src = value;
    });
    cover.src = this.coverList[this.currentCover];
  }
}
</script>

<style scoped lang="less">
  .avatar-factory{
    .flex-row--center{
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .center-flow{
      display: flex;
      align-items: center;
      justify-content: space-around;
      width: 90vw;
      max-width: 675px;
    }
    .flex-col{
      display: flex;
      flex-direction: column;
      align-items: center;
      .submit-button {
        margin: 1.5rem 0;
      }
      .info{
        font-size: 12px;
      }
    }
    #avatarGraph{
      width: 128px;
      height: 128px;
    }
    .avatar-wrap{
      padding: 10px 10px 8px;
      border: 2px solid #e6a23c;
    }
    .canvas-dialog{
      .info{
        display: block;
        margin-top: 2rem;
      }
    }
    .credential{
      margin-top: 2rem;
      color: black;
    }
  }
</style>
