<template>
  <div class="templeIntroduction">
    <div class="header_img_com">
      <img src="./../../assets/img/project/cat.png" alt="" />
    </div>

    <div class="temple_name_info">
      <div class="temple_name_title">
        <img src="./../../assets/img/project/temple1.png" alt="" />
        <p>韶关市南华寺</p>
        <p>5.6km</p>
      </div>
      <div class="temple_intro">
        南华寺坐落于广东省韶关市，曲江县马坝东南7公里的曹溪之畔, 是
        中国佛教名寺之一
      </div>
      <div class="button">
        <img src="./../../assets/img/project/temple2.png" alt="" />
        <p>查看更多寺庙</p>
      </div>
    </div>

    <div class="temple_address">
      <div class="temple_address_part1">
        <img src="./../../assets/img/project/address.png" alt="" />
        <p>广东省韶关市曲江区南华禅寺</p>
        <img src="./../../assets/img/project/right.png" alt="" />
      </div>
      <van-divider />
      <div class="temple_address_part2">
        <img src="./../../assets/img/project/foot.png" alt="" />
        <p>已有1314520人到访过</p>
      </div>
    </div>

    <div class="evaluate">
      <div class="title">
        <div><img src="./../../assets/img/project/cat.png" alt="" /></div>
        <p>小施主</p>
      </div>
      <p class="paragraph">
        我们在这里隆重举行广福寺修复落成暨全堂佛像开光庆典法会，在
        这吉庆的日子里，首先请允许我代表县委统战部、县民族宗教局对
        各位领导、诸山长老、大德居士及各位嘉宾的莅临表示热烈的欢迎
        和衷心的感谢！
      </p>
    </div>

    <div class="temple_detail">
      <div class="detail_title">
        <img src="./../../assets/img/project/left_img.png" alt="" />
        <p>寺庙详情</p>
        <img src="./../../assets/img/project/right_img.png" alt="" />
      </div>

      <div class="detail_con">
        <img class="detail_img" src="./../../assets/img/project/cat.png" alt="" />
        <p class="detail_paragraph">
          南华寺坐落于广东省韶关市，曲江县马坝东南7公里的曹溪之畔, 是
          中国佛教名寺之一，是禅宗六祖惠能宏扬“南宗禅法”的发源地。
          迈过高大雄伟的牌坊，就看见了古木护持下山门上的“曹溪”二字, 这
          就到了“三门”。
        </p>
        <img class="detail_img" src="./../../assets/img/project/cat.png" alt="" />
        <p class="detail_paragraph">
          南华寺坐落于广东省韶关市，曲江县马坝东南7公里的曹溪之畔, 是
          中国佛教名寺之一，是禅宗六祖惠能宏扬“南宗禅法”的发源地。
          迈过高大雄伟的牌坊，就看见了古木护持下山门上的“曹溪”二字, 这
          就到了“三门”。
        </p>
      </div>
    </div>

    <div class="footer_button2" @click="showPopup">
      <img src="./../../assets/img/project/button2.png" alt="" />
    </div>

    <van-popup v-model="show" class="footer_pop" position="bottom">
      <img class="popimg" src="./../../assets/img/project/popimg.png" alt="" />
      <div class="user_img">
        <img src="./../../assets/img/project/cat.png" alt="" />
      </div>
      <div class="dingwei">
        <p class="name">放八角很深刻</p>
        <p class="price">{{ value || 0.0 }}<span>新元</span></p>
        <!-- <div class="input_con">
          <input type="text" />
          <p>新元</p>
        </div> -->
        <van-field v-model="value" type="digit" placeholder="请输入金额" center>
          <template #extra>
            <p>新元</p>
          </template>
        </van-field>
      </div>
      <div class="buttonlist">
        <van-button type="default">换个金额</van-button>
        <van-button type="default">下一步</van-button>
      </div>
    </van-popup>
  </div>
</template>
<script>
export default {
    name:'dz_index',
    data() {
        return {
            show: false,
            value: null,
        };
    },
    components: {},
    created(){
        this.getSupplierDetails();
    },
    mounted() {},
    methods: {
        showPopup() {
            this.show = true;
        },
         getSupplierDetails(){
            var params={};
            params.id=this.$route.query.id || '';
            this.$api.getSupplier.getSupplierDetails(params).then(res=>{
                if(res.code==200){
                    this.info=res.result;
                }
            })
        }
    },
};
</script>
<style lang="less" scoped>
.templeIntroduction {
  height: 100%;
  overflow: auto;
  background-color: #f4f4f4;
  padding-bottom: 20px;
  .header_img_com {
    width: 375px;
    height: 249px;
    > img {
      width: 100%;
      height: 100%;
      object-fit: fill;
    }
  }

  .temple_name_info {
    padding: 13px 10px 10px 4px;
    background-color: #fff;
    .temple_name_title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      > img {
        width: 19px;
        height: 19px;
      }
      > p:first-of-type {
        font-size: 15px;
        line-height: 15px;
        font-family: PingFang SC, PingFang SC-Bold;
        font-weight: 700;
        color: #333333;
        margin-left: 5px;
        margin-right: auto;
      }
      > p:last-of-type {
        font-size: 13px;
        line-height: 13px;
        font-family: PingFang SC, PingFang SC-Regular;
        font-weight: 400;
        color: #666666;
      }
    }
    .temple_intro {
      margin-top: 6px;
      font-size: 12px;
      line-height: 14px;
      font-family: PingFang SC, PingFang SC-Regular;
      font-weight: 400;
      color: #787878;
      line-height: 20px;
    }
    .button {
      margin-top: 2px;
      position: relative;
      text-align: center;
      // border: 1px solid red;
      display: flex;
      justify-content: center;
      align-items: center;
      > img {
        width: 109px;
        height: 27px;
        object-fit: fill;
      }
      > p {
        position: absolute;
        top: 0;
        font-size: 12px;
        line-height: 27px;
        font-family: PingFang SC, PingFang SC-Bold;
        font-weight: 700;
        text-align: center;
        color: #000000;
      }
    }
  }

  .temple_address {
    margin-top: 10px;
    background-color: #fff;
    padding: 10px;
    .temple_address_part1 {
      display: flex;
      align-items: center;
      > img {
        width: 13px;
        height: 13px;
      }
      > img:last-of-type {
        width: 12px;
        height: 12px;
      }
      > p {
        margin: 0 5px;
        font-size: 13px;
        line-height: 14px;
        font-family: PingFang SC, PingFang SC-Regular;
        font-weight: 400;
        color: #333333;
      }
    }
    /deep/.van-divider {
      margin: 8px 0;
    }
    .temple_address_part2 {
      display: flex;
      align-items: center;
      > img {
        width: 9px;
        height: 13px;
      }
      > p {
        margin-left: 5px;
        font-size: 12px;
        font-family: PingFang SC, PingFang SC-Regular;
        font-weight: 400;
        color: #999999;
        line-height: 12px;
      }
    }
  }

  .evaluate {
    margin-top: 10px;
    padding: 10px;
    background-color: #fff;
    .title {
      display: flex;
      align-items: center;
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
    .paragraph {
      margin-top: 5px;
      font-size: 12px;
      font-family: PingFang SC, PingFang SC-Regular;
      font-weight: 400;
      color: #787878;
      line-height: 20px;
    }
  }

  .temple_detail {
    margin-top: 10px;
    padding: 0 10px;
    padding-top: 17px;
    background-color: white;
    padding-bottom: 20px;
    .detail_title {
      margin-bottom: 5px;
      display: flex;
      justify-content: center;
      align-items: center;
      > p {
        margin: 0 21px;
        font-size: 17px;
        font-family: PingFang SC, PingFang SC-Regular;
        font-weight: 400;
        color: #ffa136;
        line-height: 20px;
      }
      > img {
        width: 39px;
        height: 17px;
        opacity: 1;
      }
    }
    .detail_con {
      .detail_img {
        margin-top: 10px;
        width: 355px;
        height: 237px;
        object-fit: fill;
      }
      .detail_paragraph {
        margin-top: 10px;
        font-size: 12px;
        font-family: PingFang SC, PingFang SC-Regular;
        font-weight: 400;
        color: #787878;
        line-height: 20px;
      }
    }
  }

  .footer_button2 {
    margin-top: 10px;
    padding: 0 10px;
    > img {
      width: 100%;
    }
  }

  .footer_pop {
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
    height: auto;
    // position: relative;
    .popimg {
      width: 100%;
    }
    .user_img {
      position: absolute;
      top: 69px;
      left: 120px;
      // transform: translate(-50%);
      width: 140px;
      height: 140px;
      opacity: 1;
      background: rgba(0, 0, 0, 0);
      border: 0px solid #f99525;
      > img {
        border-radius: 50%;
        width: 100%;
        height: 100%;
        object-fit: fill;
      }
    }
    .dingwei {
      position: absolute;
      top: 250px;
      left: 50%;
      transform: translateX(-50%);
      text-align: center;
      // border: 1px solid green;
      .name {
        font-size: 17px;
        font-family: PingFang SC, PingFang SC-Bold;
        font-weight: 700;
        color: #ffffff;
        line-height: 18px;
      }
      .price {
        margin-top: 15px;
        font-size: 39px;
        font-family: PingFang SC, PingFang SC-Bold;
        font-weight: 700;
        color: #fced69;
        line-height: 40px;
        > span {
          font-size: 17px;
          font-family: PingFang SC, PingFang SC-Regular;
          font-weight: 400;
          color: #fced69;
          line-height: 18px;
        }
      }
    }
    /deep/.van-cell {
      margin-top: 25px;
      width: 241px;
      height: 39px;
      opacity: 0.7;
      background: #bc0200;
      border-radius: 20px;
      > p {
        font-size: 17px;
        font-family: PingFang SC, PingFang SC-Regular;
        font-weight: 400;
        color: #ffffff;
        // line-height: 18px;
      }
    }
    .input_con {
      margin-top: 25px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 241px;
      height: 39px;
      opacity: 0.7;
      background: #bc0200;
      border-radius: 20px;
      padding: 0 22px;
      > input {
        flex: 1;
        background-color: transparent;
        border: 0;
      }
    }
    .buttonlist {
      display: flex;
      justify-content: center;
      align-items: center;
      position: absolute;
      width: 100%;
      bottom: 35px;
      .van-button:first-of-type {
        margin-right: 17px;
        width: 141px;
        height: 44px;
        opacity: 1;
        border: 2px solid #ead622;
        border-radius: 24px;
        background-color: transparent;
        .van-button__content {
          .van-button__text {
            font-size: 17px;
            font-family: PingFang SC, PingFang SC-Bold;
            font-weight: 700;
            color: #fced69;
            line-height: 18px;
          }
        }
      }
      .van-button:last-of-type {
        width: 178px;
        height: 44px;
        opacity: 1;
        background: #fced69;
        border-radius: 22px;
        .van-button__content {
          .van-button__text {
            font-size: 17px;
            font-family: PingFang SC, PingFang SC-Bold;
            font-weight: 700;
            color: #f64245;
            line-height: 18px;
          }
        }
      }
    }
  }
}
</style>