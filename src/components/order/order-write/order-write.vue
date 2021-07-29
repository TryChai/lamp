<template>
  <div class="order-write  life">
    <div class="order-write-head">
      <van-nav-bar title="订单核销" left-text left-arrow class="navbar" :border="false" @click-left="toBack" />
    </div>
    <div class="order-write-head-box">
      <van-cell-group>
        <van-field type="number" v-model="tel" :left-icon="require('../../../assets/img/order/phone.png')" placeholder="请输入您的手机号码"
            class="head-box-input" />
        <van-field class="head-box-input" v-model="write" :left-icon="require('../../../assets/img/order/write.png')" placeholder="请输入您的核销码" />
        <van-button type="primary" round size="large" color="linear-gradient(to right, #f08111, #ea760c, #de5f00)" @click="selectWrite">立即查询
        </van-button>
      </van-cell-group>
    </div>
    <div class="order-write-info-box">
      <van-divider :style="{ color: '#262626',  padding: '26px 0',margin:'0',fontSize:'15px' }">查询到的订单</van-divider>
      <!-- <div class="order-write-shop" >
        <p class="order-write-oid">订单编号：{{info.oid}}</p>
        <div class="order-write-shop-info fx">
          <div>
            <img v-lazy="info.pro[0].piclink" alt />
          </div>
          <div>
            <p class="shop-info-p1">{{info.pro[0].title}}</p>
            <p class="shop-info-p2">{{info.pro[0].sku_cn}}</p>
            <p class="shop-info-p3">
              剩余核销次数：
              <span>{{info.write_number}}</span>次
            </p>
          </div>
        </div>
        <div class="fx order-write-button">
          <van-button
            type="primary"
            size="large"
            color="linear-gradient(to right, #fc5431, #fc3025, #ef0f25)"
            @click="addWriteNumber(info.id)"
          >立即核销</van-button>
        </div>
      </div> -->
      <orderItem class="ssss" @openThis='getOpen' v-show="show" :item='info' />
    </div>
  </div>
</template>

<script>
import { Field, Divider } from "vant";
import orderItem from "./order-write-item";
export default {
  name: "orderwrite",
  data () {
    return {
      tel: "",
      write: "",
      info: {
        pro: [{}],
        product: []
      },
      show: false
    };
  },
  components: {
    [Field.name]: Field,
    [Divider.name]: Divider,
    orderItem
  },
  created () { },
  mounted () { },
  methods: {
    getOpen () {
      this.selectWrite();
    },
    addWriteNumber (id) {
      var that = this;
      that.$dialog
        .confirm({
          title: "核销订单",
          message: "是否确定核销订单？"
        })
        .then(() => {
          // on confirm
          that.$api.getShop.addWriteNumber({ id }).then(res => {
            if (res.code == 200) {
              that.$toast.success("核销成功");
              setTimeout(() => {
                that.selectWrite();
              }, 1500);
            }
          });
        })
        .catch(() => {
          // on cancel
        });
    },
    selectWrite () {
      var params = {};
      params.tel = this.tel;
      params.write = this.write;
      this.$api.getShop.selectWrite(params).then(res => {
        if (res.code == 200) {
          res.result.product = res.result.pro;
          this.info = res.result;
          this.show = true;
        } else {
          this.show = false;
        }
      });
    }
  }
};
</script>
<style lang='less' scoped>
.order-write {
  line-height: 1.4;
  font-size: 14px;
  .navbar {
    background-color: transparent;
    i,
    span,
    div {
      color: #fff;
    }
  }
  .order-write-head {
    flex-direction: column;
    background: linear-gradient(to right, #f08111, #ea760c, #de5f00);
    height: 125px;
  }
  .order-write-head-box {
    margin: -80px 15px 0;
    border-radius: 10px;
    background: #fff;
    overflow: hidden;
    padding: 18px 14px 21px;
    box-shadow: 0 0 5px #d9d9d9;
    .head-box-input {
      background-color: #f4f4f4;
      border-radius: 27px;
      height: 44px;
      padding: 0 0 0 15px;
      margin-bottom: 12px;
    }
    button {
      height: 44px;
      margin-top: 4px;
    }
  }
  .order-write-info-box {
    padding: 0 15px;
    .order-write-shop {
      margin-top: 2px;
      .order-write-oid {
        font-size: 13px;
        padding: 8px 0;
        border-bottom: 1px solid #f6f6f7;
      }
      .order-write-shop-info {
        justify-content: flex-start;
        padding: 13px 0;
        border-bottom: 1px dashed #e3e5e6;
        > div:first-child {
          width: 76px;
          height: 76px;
          img {
            max-width: 100%;
          }
        }
        > div:last-child {
          flex: 1;
          margin-left: 10px;
          min-height: 76px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          color: #383838;
          > .shop-info-p1 {
            word-break: break-all;
            display: -webkit-box;
            -webkit-line-clamp: 1;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
          > .shop-info-p2 {
            color: #9d9d9d;
          }
          > .shop-info-p3 {
            span {
              color: #ff1111;
            }
          }
        }
      }
      .order-write-button {
        margin-top: 16px;
        justify-content: center;
        button {
          width: 104px;
          border-radius: 5px;
          height: 30px;
          line-height: 30px;
          font-size: 17px;
        }
      }
    }
  }
}
</style>
