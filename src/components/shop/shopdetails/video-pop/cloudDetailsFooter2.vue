<template>
  <div class="cloud-details-footer" >
    <ul >
      <!-- <li v-for="i in info.skuStr" :key="i">{{i}}</li> -->
      <li >{{info.title}}</li>
      <li class="foote-info-price"><small>￥</small>{{info.price}}</li>
    </ul>
    <div class="cloud-details-footer-nav fx">
      <div class="fx fx_3">
          <div @click="toPopNav('首页')">
            <van-icon name="wap-home-o" />
            <p>首页</p>
          </div>
          <div @click="toPopNav('客服')">
            <van-icon name="chat-o" />
            <p>客服</p>
          </div>
          <div @click="changesc">
          <van-icon :name="info.collect?'star':'star-o'" />
            <p>{{info.collect?'已收藏':'收藏'}}</p>
          </div>
          <div @click="toPopNav('购物车')">
          <van-icon name="cart-o" />
            <p>购物车</p>
          </div>
      </div>
      <div>
        <div @click="toPopNav('购买')">立即购买</div>
      </div>
    </div>

  </div>
</template>


<script>
export default {
  data() {
    return {
      pic: "",
      showImg: false,
      show: false,

    };
  },
  components: {

    },
  props: {
    info: {
      type: Object,
      default: () => {}
    },

  },

  created() {

  },
  methods: {
    changesc () {
            if (this.info.collect == true) {
                this.info.collect = false;
            } else {
                this.info.collect = true;
            }
            var params = {};
            params.id = this.$route.query.id || '';
            this.$api.getShop.getGz(params).then(res => {
                if (res.code == 200) {
                    this.$toast.success(res.result);
                }
            })
        },
    toPopNav(str){
      this.$bus.$emit('toPopNav',str)
    }
  }
};
</script>



<style lang="less" scoped>
.cloud-details-footer-nav{
  color: #fff;
  border-top: 1px solid #4d4d4d;
  padding: 8px 0;
  >div:first-child{
    padding: 0 14px;
    text-align: center;
    >div{
      flex: 1;
    }
    i{
      font-size: 22px;
    }
    p{
      font-size: 12px;
    }
  }
  >div:last-child{
    width: 117px;
    display: flex;
    justify-content: center;
    align-items: center;
    >div{
      width: 94px;
      border: 1px solid #fff;
      border-radius: 4px;
      padding: 6px 0;
      text-align: center;
       font-size: 16px;
    }
  }
}

.cloud-details-footer {
  width: 100%;
  z-index: 4;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  position: relative;
  ul {
    padding:  20px 12px;
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    position: relative;
    color: #fff;
    position: absolute;
    bottom: 48px;
    z-index: 1;
    background: url('../../../../assets/img/footbg.png') no-repeat;
    background-size: 100% 100%;
    >li:first-child{
        margin-bottom: 2px;
        font-size: 16px;
        font-weight: bold;
    }
    > li {
      width: 100%;
      color: #fff;
      line-height: 1.6;
      font-weight: 500;
      font-size: 12px;
      display: flex;
    }
    .foote-info-price{
      color: #ff0138;
      display: flex;
      align-items: flex-end;
      line-height: 1;
      small{
        font-size: 12px;
        font-weight: normal;
      }
      font-size: 18px;
      font-weight: bold;
    }
  }

}
.foo_menu::before {
  content: "";
  position: absolute;
  width: 24px;
  height: 24px;
  // background: url("../../../../assets/img/cloud/down.png") no-repeat;
  background-size: 100% 100%;
  top: -15px;
  right: 24px;
  z-index: 10;
}




</style>
