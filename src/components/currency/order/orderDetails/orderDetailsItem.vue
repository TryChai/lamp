<template>
  <div>
    <div class="bgwrite order_item">
      <div class="fx order_item_head">
        <div>
          <h4>{{info.sid_cn }}</h4>
        </div>
      </div>

      <div class="order_item_shop">

        <div class="fx foot_order_item_list" v-for="(item) in info.product" :key="item.id">
          <div class="fx_3 fx">
            <img :src="item.piclink" v-lazy="item.piclink" alt @click="goto_shopdetail(item.pid)" />
            <div>
              <p @click="goto_shopdetail(item.pid)">
                {{item.title.length>=22?item.title.slice(0,22)+'...':item.title}}
              </p>

              <p @click="goto_shopdetail(item.pid)">{{item.sku_cn}}</p>
              <!-- <van-button plain :to="'/shop/shopreview?id='+item.id" v-if="info.status == '已完成' &&  (item.status=='0' || item.status== 0  || item.status == '4' || item.status== 4  ) && item.types != 25  && item.types != 26"
                size="mini">{{item.is_review==1?'已评价':"待评价"}}</van-button> -->

              <div class="card_num" v-if="item.card != '' && item.card != undefined && item.card != null">
                <div class="write-bb">
                  <p>卡密：{{item.card}}</p>
                  <span id="copy_btn" class="copy" :data-clipboard-text="item.card" data-clipboard-action="copy" @click="copy_key(item.card)">复制</span>
                </div>

              </div>
              <div class="card_num" v-if="(info.types ==10 || info.types ==11) && info.status=='已完成' && info.write_code ">
                <div class="write-bb">
                  <p>核销码：{{info.write_code}}</p>
                  <span id="copy_btn" class="copy" :data-clipboard-text="info.write_code" data-clipboard-action="copy"
                    @click="copy_key(info.write_code)">复制</span>
                </div>
                <div>
                  <p>核销次数：{{info.write_complete_number}}</p>
                </div>
                <div>
                  <p>总核销次数：{{info.write_number}}</p>
                </div>
              </div>
            </div>
          </div>
          <div class="fx_1 fx tr">
            <p v-if="item.types == 6">{{$fnc.toFixedZ(info.sum_price)}}</p>

            <p v-else>S${{$fnc.toFixedZ(item.price)}}</p>
            <!-- <p>优惠后$129.00</p> -->
            <p class="ppp1">×{{item.number}}</p>
            <p class="ppp2" v-if="item.order_return && !isSupplier && (info.types == 10 || info.types == 11) 
              && $route.query.type != 'team' && info.write_complete_number == 0">
              <van-button type="danger" size="small" @click="toOrderRetuen(false,item.id,item.types)">
                {{item.order_return}}
              </van-button>
            </p>
            <!-- <p class="ppp2" v-if="item.order_return && !isSupplier && info.types !=13 && info.types !=11 && info.types !=10 && info.types !=25 && $route.query.type != 'team'">
              <van-button type="danger" size="small" @click="toOrderRetuen(false,item.id,item.types)">
                {{item.order_return}}
              </van-button>
            </p> -->
            <p class="ppp2" v-else-if="item.status>0">
              <van-button type="danger" size="small" @click="toOrderRetuen(true,item.id,item.types)" v-if="item.status==1">申请退货中</van-button>
              <van-button type="danger" style="padding:0 2px" size="small" @click="toOrderRetuen(true,item.id)" v-if="item.status==2">等待买家寄件</van-button>
              <van-button type="danger" size="small" @click="toOrderRetuen(true,item.id,item.types)" v-if="item.status==3">待确认</van-button>
              <van-button type="danger" size="small" @click="toOrderRetuen(true,item.id,item.types)" v-if="item.status==4">退货成功</van-button>
            </p>
          </div>

        </div>
        <div class="tr foot_order_item"></div>
        <van-cell-group class="order_details_item_group">
          <div v-if="info.rider_code">
            <van-cell class="order_c1" title="配送费" :value="sum_mail>0?'S$'+$fnc.toFixedZ(sum_mail):'免配送费'" />
          </div>
          <div v-else-if="info.is_virtual != 1 && info.types != 9 && $route.query.type != 'team'">
            <van-cell class="order_c1" title="运费" :value="sum_mail>0?'S$'+$fnc.toFixedZ(sum_mail):'免邮'" />
          </div>
          <div class="order_box" :class="{active_order_box:show}">
            <van-cell :value="`S$ ${info.types == 6 ? $fnc.toFixedZ(info.sum_price) : $fnc.toFixedZ(info.money)} `"
              class="order_c2" @click="show=!show">
              <template slot="title">
                <span type="danger">订单金额</span>
                <van-icon name="arrow" class="order_money" />
              </template>
            </van-cell>
            <van-cell class="order_c1" :title="`${$store.state.config.shop.integral_cn ||'积分'}抵用`" :value="'-S$'+$fnc.toFixedZ(info.integral_dk_money)" />
            <van-cell class="order_c1" title="优惠券折扣" :value="'-S$'+$fnc.toFixedZ(info.red_money)" />
          </div>
        </van-cell-group>
      </div>
    </div>
  </div>
</template>


<script>
  import {
    Collapse,
    CollapseItem
  } from "vant";
  import Clipboard from "clipboard";
  export default {
    props: {
      info: {
        type: Object,
        default: () => {}
      },
      sum_mail: [String, Number]
    },
    components: {
      [Collapse.name]: Collapse,
      [CollapseItem.name]: CollapseItem
    },
    data() {
      return {
        activeNames: ["2"],
        show: false,
        isSupplier: false
      };
    },
    created() {
      if (this.$route.query.sup) {
        this.isSupplier = true;
      } else {
        this.isSupplier = false;
      }
    },
    methods: {
      copy_key(link) {
        let clipboard = new this.clipboard(".copy");
        clipboard.on("success", () => {
          this.$toast.success("复制成功");
          // 释放内存
          clipboard.destroy();
        });
        clipboard.on("error", () => {
          // 不支持复制
          this.$fnc.ykAPPCopy(link);
        });
      },
      goto_shopdetail(pid) {
        if (pid != 0) {
          this.$router.push({
            path: "/shop/shopdetails",
            query: {
              tid: this.appusers.uid,
              id: pid
            }
          });
        }
      },
      toOrderRetuen(bool, id, types) {
        this.$store.commit("setIsSupplier", bool);
        this.$router.push("/order/orderrefund?id=" + id + "&types=" + types);
      }
    }
  };
</script>


<style lang="less" scoped>
  .order_box {
    max-height: 44px;
    overflow: hidden;
    transition: all 0.3s linear;

    .order_money {
      transition: all 0.3s linear;
      transform: rotateZ(0);
    }
  }

  .active_order_box {
    max-height: 200px;

    .order_money {
      transform: rotateZ(90deg);
    }
  }

  .order_item {
    padding: 0 16px;
    line-height: 1;
    font-size: 14px;
    margin-bottom: 14px;

    .order_item_head {
      overflow: hidden;
      border-bottom: 1px solid #f5f3f3;

      h4 {
        padding: 12px 0 6px;
        font-size: 14px;
      }

      span {
        color: #999999;
      }

      .order_item_head_s1 {
        font-size: 11px;
        display: block;
        padding-bottom: 10px;
      }

      .order_item_head_s2 {
        font-size: 16px;
        // font-weight: bold;
      }
    }

    .order_item_shop {
      .foot_order_item_list {
        // padding: 14px 0;
        align-items: flex-start;
        padding: 14px 0 0px 0;

        margin-bottom: 10px;
        position: relative;

        >div:first-child {
          justify-content: flex-start;
          align-items: flex-start;

          img {
            width: 76px;
            height: 76px;
            max-width: 100%;
          }

          >div {
            padding-left: 10px;

            p:first-child {
              color: #333333;
              // font-weight: bold;
              line-height: 1.4;
            }

            p:first-child~p {
              font-size: 12px;
              color: #999999;
              line-height: 1.4;
              // font-weight: bold;
              padding: 7px 0 7px;
            }
          }
        }

        >.fx_1 {
          position: relative;
          flex-direction: column;

          p {
            width: 100%;
            // font-weight: bold;
            color: #999999;
          }

          >p:first-child {
            line-height: 1.4;
            font-size: 14px;
            color: #333333;
          }

          >p.ppp1 {
            font-size: 12px;
            line-height: 1.8;
          }

          >p.ppp2 {
            padding-top: 10px;
          }
        }
      }

      .foot_order_item {
        color: #999999;

        border-bottom: 1px dashed #e8e9eb;
      }

      .foot_order_btn {
        padding: 15px 0;

        >button {
          border-radius: 5px;
          color: #d91276;
          border: 1px solid #d91276;
          // font-weight: bold;
        }
      }
    }
  }

  .order_details_item_group {
    .van-cell__title {
      font-size: 14px;
      // font-weight: bold;
    }

    .order_money {
      vertical-align: middle;
      margin-left: 10px;
    }

    .order_c1 {
      .van-cell__value {
        font-family: "PingFangSC-Regular";
        font-size: 14px;
        color: #333333;
      }
    }

    .order_c1:not(:last-child)::after,
    .order_c2:not(:last-child)::after {
      left: 0;
    }

    .order_c2 {
      .van-cell__value {
        font-size: 14px;
        color: #333333;
        // font-weight: bold;
      }
    }

    .order_c1,
    .order_c2 {
      padding: 0.26667rem 0rem;
    }
  }

  .write-bb {
    display: flex;
    justify-content: flex-start !important;

    >p {
      width: auto !important;
      margin-right: 5px;
    }
  }

  .card_num {
    width: 100%;
    font-size: 12px;
    color: #999999;
    // position: absolute;
    left: 85px;
    left: 140px;
    top: 55px;
    right: 0px;
    padding-top: 7px;

    div {
      display: flex;
      justify-content: space-between;
      align-items: center;

      >p {
        font-size: 12px;
        width: 80%;
        line-height: 16px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      >span {
        color: #f5f3f3;
        background-color: #f44;
        border-radius: 5px;
        padding: 2px 10px;
        font-size: 10px;
      }
    }
  }
</style>
