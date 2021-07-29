<template>
  <div class="templeIntroduction">
    <van-nav-bar title="住持详情" @click-left="toBack" left-arrow />
    <div class="wrappar">
        <div class="title">
        <div><img :src="$fnc.getImgUrl(list.abbot_avatar)" alt="" /></div>
        <p>{{ list.abbot_name }}</p>
      </div>
    <div class="fwb"  v-html="list.abbot_detail"></div>
    </div>
    
  </div>
</template>
<script>
export default {
  name: "dz_abbot_detail",
  data() {
    return {
        list:{}
    };
  },
  components: {
  },
  created() {
    this.get_suppiler_details();
  },
  methods: {
    get_suppiler_details() {
      var params = {};
      params.id = this.$route.query.id || "";
      this.$api.getSupplier.getSupplierDetails(params).then((res) => {
        if (res.code == 200) {
          this.list= res.result;
        }
      });
    },
  },
};
</script>
<style lang="less" scoped>
.templeIntroduction {
  height: 100%;
  overflow: hidden;
  background-color: #f4f4f4;
  .wrappar{
      width: 100%;
      height: 100%;
      overflow: auto;
      position: relative;
      padding: 0px 10px;
  }

}
/deep/.van-nav-bar .van-icon {
  color: #333;
}
.title {
    display: flex;
    align-items: center;
    margin-top: 10px;
    > div {
        width: 40px;
        height: 40px;
        opacity: 1;
        background: rgba(0, 0, 0, 0);
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 100%;
        overflow: hidden;
        > img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 50%;
        }
    }
    > p {
        margin-left: 10px;
        font-size: 15px;
        font-family: PingFang SC, PingFang SC-Bold;
        font-weight: 700;
        color: #333333;
        line-height: 16px;
    }
}
/deep/.fwb{
    width: 100%;
    padding: 5px 5px 5px 0px;
    height: 100%;
    P {
        margin-top: 10px;
        font-size: 12px;
        font-family: PingFang SC, PingFang SC-Regular;
        font-weight: 400;
        color: #787878;
        line-height: 20px;
         img {
            margin-top: 10px;
            max-width: 355px;
            max-height: 237px;
            object-fit: fill;
          }
      }
    

}
</style>