<template>
  <div class="custom-element-wrapper">
    <!-- 筛子 -->
    <span class="iconfont dice" :class="`icon-dice${payload.description}`" v-if="payload.data=='dice'"></span>
    <!-- 红包 -->
    <div class="jstx_red" v-else-if="payload.data=='oneHb'" @click="redsend(payload.extension)"></div>
    <!-- 商品 -->
    <custom-shop-msg v-else-if="payload.data=='shops'" :shopInfo='JSON.parse(payload.description)' />
    <!-- 战队邀请 -->
    <team-yq v-else-if="payload.data=='teamYq'" :teamInfo='JSON.parse(payload.description)' />
    <!-- 新闻 -->
    <custom-news-msg v-else-if="payload.data=='share-news'" :newsInfo='JSON.parse(payload.description)' />
    <!-- 普通 -->
    <span v-else>{{text}}</span>
    
    <van-popup v-model="showHb" class="hbdetails" position="right" >
      <hbdetails @closeHb='getcloseHb' :list="user" :info="hbinfo" />
    </van-popup>
  </div>
</template>

<script>
import hbdetails from '../imhb/hbdetails';
import teamYq from './team-yq';
import customShopMsg from "./custom-shop-msg";
import customNewsMsg from "./custorm-news-msg";
export default {
  name: 'CustomElement',
  props: {
    payload: {
      type: Object,
      required: true
    }
  },
  data(){
    return{
      showHb:false,
      user:{},
      hbinfo:{}
    }
  },
  components: {
    hbdetails,
    teamYq,
    customShopMsg,
    customNewsMsg
  },
  computed: {
    text() {
      return this.translateCustomMessage(this.payload)
    },
    obj(){
      if(typeof JSON.parse(this.payload.description) =='object'){
        return JSON.parse(this.payload.description)
      }else{
          return {}
      }
      
    }

  },
  methods: {
    translateCustomMessage(payload) {
      if (payload.data === 'group_create') {
        return `${payload.extension}`
      }
      return '[自定义消息]'
    },
    redsend(oid){
      if(!oid){
        this.$toast.fail('领取失败');
        return;
      }
      this.$api.getIm.getHongBao({oid}).then(res=>{
        if(res.code==200){
          this.hbinfo=res.result;
          this.showHb=true;
        }
          
      })
    },
    getcloseHb(bool){
      this.showHb=bool;
    },
  }
}
</script>

<style scoped>
.hbdetails{
  width: 100%;
  background: none !important;
}
.dice {
  font-size: 60px;
  height: 60px;
  color: #fff;
  background: #000;
}
.jstx_red{
  background:url('../../../assets/img/im/red.png');
  background-size: 100% 100%;
  text-align: center;
  color: #fdaf6c;
  width: 140px;
  height: 167px;
  top: 0;
  border-radius: 10px;
  line-height: 25px;
  font-size: 14px;
  padding-top: 130px;
  margin: 15px 0;
}
</style>
