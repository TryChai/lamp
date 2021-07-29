<template>
  <div>
    <div class="first_con">
      <van-row type="flex">
        <van-col span="12" class="tl">
          <van-icon name="cross" size="16" @click="close" color="#964c31"/>
        </van-col>
      </van-row>
      <van-row type="flex" class="con_info" >
        <van-col span="24" class="tc">
          <img
            :src="$fnc.getImgUrl(list.avter,'sex') ||   require('../../../assets/img/member/sex1.png') "
            class="man"
            alt
          >
        </van-col>
        <van-col span="24" class="tc name">{{list.name}}{{info.title || ''}}</van-col>
        <van-col span="24" class="tc name title">{{info.status_cn}}</van-col>
        <van-col span="24" class="tc name money">{{info.money}}</van-col>
        <van-col span="24" class="tc name content">{{info.content}}</van-col>
      </van-row>
    </div>
  </div>
</template>

<script>
export default {
    props:{
        info:{
            type:Object,
            default:""
        },
        list:{
            type:Object,
            default:{}
        }
    },
  data() {
    return {
    };
  },
  methods:{
      close(){
          this.$emit("closeHb",false)
      }
  }
};
</script>


<style lang="less" scoped>
.man {
  width: 50px;
  height: 50px;
  border-radius: 4px;
  border: 1px solid #b26249;
  margin: 7px 0 14px;
}
.con_info {
  flex-wrap: wrap;
  div.name {
    font-size: 18px;
    color: #d3e7ac;
  }
  div.title {
    font-size: 14px !important;
    margin-top: 9px;
  }
  div.money {
    font-size: 32px !important;
    margin-top: 35px;
  }
  div.content{
    font-size: 16px;
    margin-top: 130px;
  }
}
.first_con {
    background: url('../../../assets/img/im/red_bg.png') no-repeat;
    background-size: 100% 100%;
  padding: 14px 16px;
  position: relative;
  height: 435px;
  width: 325px;
  margin:  0 auto;
}
div {
  line-height: 1;
}
</style>
