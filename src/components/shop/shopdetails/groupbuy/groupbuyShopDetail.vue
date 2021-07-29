<template>
  <div class="detail_pingou">
    <div class="pg_liubai"></div>
    <img class="pg_img" src="../../../../assets/img/shop/pg_top.png" />
    <div class="pg_liubai"></div>
    <div class="detail_pingou_con">
      <p class="van-hairline--bottom">参团信息</p>
      <div class="fx detail_pingou_div1">
        <span>本团完成进度</span>
        <div>
          <van-progress :show-pivot="false" color="#FF0000" :percentage="pg_percent" />
          <span v-if="pg_percent" :style="{left:(pg_percent/50+0.25)+'rem'}">{{pg_percent}}%</span>
        </div>
      </div>
      <div class="fx detail_pingou_div2 van-hairline--bottom">
        <div class="fx detail_pingou_div_box">
          <div>
            <img
              v-for="(pic,i) in shopInfo.group_buy.people_ar"
              :key="i"
              :src="$fnc.getImgUrl(pic || require('@/assets/img/member/sex1.png'))"
            />
          </div>
          <div class="fx">
            <i></i>
            <i></i>
            <i></i>
          </div>
        </div>
        <p>已有{{shopInfo.group_buy.join_people || 0}}人参与</p>
      </div>
      <div class="fx detail_pingou_div3">
        <p>
          剩余
          <span>{{shopInfo.group_buy.number - shopInfo.group_buy.join_people}}</span>
          个名额成团
        </p>
        <p @click="addCard">一键参与</p>
      </div>
    </div>
  </div>
</template>
<script>
import { Progress } from "vant";
export default {
  name: "groupbuyShopDetail",
  data() {
    return {};
  },
  props: {
    shopInfo: {
      type: Object,
      default: {}
    }
  },
  components: {
    [Progress.name]: Progress
  },
  computed: {
    pg_percent() {
      let num = this.$fnc.toFixedZ(
        (this.shopInfo.group_buy.join_people / this.shopInfo.group_buy.number) *
          100,
        0
      );
      return num;
    }
  },
  methods: {
    addCard() {
      this.$emit("groupbuyAdd");
    }
  },
  watch: {}
};
</script>
<style lang="less" scoped>
.detail_pingou {
  width: 100%;
  background: #ffffff;
  .pg_img {
    width: 100%;
  }
  .pg_liubai {
    background: #f3f3f3;
    height: 0.26667rem;
  }
  .detail_pingou_con {
    width: 100%;
    padding: 6px 12px;
    > p {
      color: #333333;
      font-size: 14px;
      padding-bottom: 5px;
    }
    .detail_pingou_div1 {
      padding: 10px 10px 0;
      color: #333333;
      font-size: 13px;
      justify-content: space-between;
      > div {
        width: 240px;
        position: relative;
        .van-progress {
          height: 20px;
          border-radius: 10px;
        }
        > span {
          position: absolute;
          top: 0;
          font-size: 10px;
          height: 20px;
          color: #ffffff;
        }
      }
    }
    .detail_pingou_div2 {
      padding: 0 12px;
      height: 40px;
      .detail_pingou_div_box {
        height: 40px;
        justify-content: flex-start;
        > div {
          img {
            width: 25px;
            height: 25px;
            border-radius: 100%;
            margin-left: -6px;
          }
        }
        > div:nth-of-type(2) {
          i {
            display: inline-block;
            width: 5px;
            height: 5px;
            border-radius: 50%;
            background: #dbdbdb;
            margin-left: 5px;
          }
        }
      }
      > p {
        color: #bebebe;
        font-size: 14px;
      }
    }
    .detail_pingou_div3 {
      padding: 10px 12px;
      text-align: center;
      justify-content: center;
      flex-wrap: wrap;
      > p:nth-of-type(1) {
        width: 100%;
        font-size: 15px;
        padding-bottom: 8px;
        > span {
          color: #ff0000;
        }
      }
      > p:nth-of-type(2) {
        width: 80%;
        color: #ffffff;
        background: #ff0000;
        font-size: 16px;
      }
    }
  }
}
</style>