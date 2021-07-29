<template>
  <div class="add-order-lifting">
    <div class="add-order-lifting-box" v-show="is_liftings == 1">
      <div class="addOrderMention">
        <div class="mention_top">
          <p>
            <span>自提点</span
            >{{ item.province + item.city + item.area + item.add }}
          </p>
        </div>
        <p>{{ item.title || "" }}</p>
        <div class="mention_bottom">
          <span @click="$fnc.tel(item.tel)">
            <van-icon name="phone-o" color="#4b4b4b" />联系门店</span
          >
          <span @click="toDh(item.latitude, item.longitude)">
            <van-icon name="location" color="#a354ff" />使用导航
          </span>
          <span @click="show = true">
            <van-icon name="shopping-cart" color="#a354ff" />选择门店
          </span>
        </div>
      </div>
    </div>
    <van-popup
      v-model="show"
      closeable
      position="bottom"
      :style="{ height: '70%' }"
    >
      <div class="pop-lifiting-box">
        <div class="tc pop-lifiting-title">请选择需要自提的地址</div>

        <div class="lifiting-draw-line-box">
          <liftingTtem
            class="lifiting-draw-line"
            :item="item"
            @toLifiting="toLifiting"
            :active="lifting_id == item.id"
            v-for="(item, i) in orderInfo.lifting"
            :key="i"
          />
        </div>
        <div class="lifiting-draw-line-btn">
          <van-button
            block
            color="linear-gradient(to right, #f27931, #ec201f)"
            @click="comfinFiting"
            type="primary"
            size="small"
            >确定选择</van-button
          >
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { SwitchCell } from "vant";
import liftingTtem from "./lifting-item/lifting-item";
import wx from "weixin-js-sdk";
export default {
  name: "add-order-lifting",
  props: {
    orderInfo: {
      type: Object,
      default: () => {},
    },
    is_lifting: [String, Number],
  },
  data() {
    return {
      is_liftings: 0,
      item: {},
      show: false,
      lifting_id: "",
      isxcx: false,
    };
  },
  components: {
    [SwitchCell.name]: SwitchCell,
    liftingTtem,
  },
  created() {
    var usedAdd = JSON.parse(sessionStorage.getItem("usedAddress"));
    if (usedAdd && usedAdd != undefined) {
      this.item = usedAdd;
      this.lifting_id = usedAdd.id;
      this.is_liftings = Number(this.is_lifting);
    } else {
      if (JSON.stringify(this.orderInfo) != "{}" && this.orderInfo) {
        this.is_liftings = Number(this.is_lifting);
        if (this.orderInfo.lifting.length > 0) {
          this.item = this.orderInfo.lifting[0];
          this.lifting_id = this.orderInfo.lifting[0].id;
        }
      }
    }
  },
  mounted() {
    this.isxcx = sessionStorage.getItem("is_XcX");
  },
  methods: {
    toDh(latitude, longitude) {
      var ua = window.navigator.userAgent.toLowerCase();
      if (ua.match(/ykapp/i) == "ykapp") {
        this.isApp = true; //第二个app
      }
      var that = this;
      if (that.isApp) {
        try {
          that.$fnc.appNav(latitude, longitude);
        } catch (error) {
          that.$toast.fail("App地图跳转失败");
        }
      } else if (that.$fnc.isWx()) {
        var obj = {};
        obj.latitude = parseFloat(latitude);
        obj.longitude = parseFloat(longitude);
        obj.name = that.item.sid_cn;
        obj.address =
          that.item.province +
          that.item.city +
          that.item.area +
          that.item.town +
          that.item.add;
        obj.scale = 14;
        obj.infoUrl = window.location.href;

        if (that.isxcx == true || that.isxcx == "true") {
          wx.miniProgram.navigateTo({
            url: `/pages/map/map?latitude=${obj.latitude}&longitude=${obj.longitude}&name=${obj.name}&address=${obj.address}`,
          });
        } else {
          this.wxApi.ToLocation(obj);
        }
      } else {
        this.$toast("请在微信或者app打开");
      }
    },
    comfinFiting() {
      this.show = false;
    },
    toLifiting(item) {
      this.lifting_id = item.id;
      this.item = item;
      sessionStorage.setItem("usedAddress", JSON.stringify(item));
      this.$emit("toLifiting", item.id);
    },
  },
  watch: {
    is_lifting(val) {
      this.is_liftings = val;
      //   this.$emit("toggleLliftings", val);
    },
  },
};
</script>
<style lang='less' scoped>
.pop-lifiting-box {
  display: flex;
  flex-direction: column;
  height: 100%;
  .lifiting-draw-line-box {
    flex: 3;
    overflow: auto;
    background: #f3f4f6;
    padding-bottom: 10px;
    > div:last-child > div {
      border-bottom: 1px solid transparent;
    }
  }
  .lifiting-draw-line-btn {
    height: 66px;
    display: flex;
    padding: 0 16px;
    align-items: center;
    > button {
      height: 44px;
      line-height: 44px;
    }
  }
}
.pop-lifiting-title {
  font-size: 17.5px;
  color: #333333;
  font-weight: bold;
  padding: 10px 0;
  border-bottom: 1px solid #ebebeb;
}

.add-order-lifting {
  .add-order-lifting-swiper {
    border-radius: 10px;
    overflow: hidden;
    margin-bottom: 10px;
  }
  .add-order-lifting-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    > div {
      text-align: center;
      border-radius: 3px;
      width: 138px;
      height: 23px;
      line-height: 23px;
      font-size: 14px;
      color: #fff;
      background: linear-gradient(to right, #f27931, #ec1f1f);
    }
  }
  .add-order-lifting-box {
    border-radius: 10px;
    margin-bottom: 10px;
    overflow: hidden;
    padding-bottom: 12px;
    background: #fff;
  }
}
.addOrderMention {
  width: 100%;
  padding: 20px 16px;

  background: url("../../../../assets/img/order/addHeadAddres.png") no-repeat
    bottom center;
  background-color: #ffffff;
  background-size: 100%;
  .mention_top {
    width: 100%;
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    font-size: 12px;
    > p {
      flex: 1;
      font-size: 13px;
      color: #9f9f9f;
      > span {
        font-size: 12px;

        color: #6f5ede;
        background-color: #e5e5ff;
        border-radius: 25px;
        padding: 2px 7px;
        border: 1px solid #d4d2ea;
        margin-right: 5px;
      }
    }
  }
  > p {
    font-size: 16px;
    font-weight: bold;
    color: #43484e;
    // line-height: 40px;
    padding-top: 5px;
    padding-bottom: 5px;
  }
  .mention_bottom {
    font-size: 14px;
    display: flex;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-items: center;
    line-height: 1;
    > span {
      font-size: 12px;
      padding: 5px 10px;
      color: #4d4e53;
      border: 1px solid #4d4e53;
      border-radius: 25px;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-right: 10px;
      .van-icon {
        font-size: 14px;
        padding-right: 2px;
      }
    }
  }
}
</style>
