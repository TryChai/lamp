<template>
  <div class="card_shop_item">
    <div class="fx card_shop_item_top">
      <van-checkbox
        class="card_group_check"
        v-model="checked"
        @click="changeQx(checked)"
        checked-color="#FF1C33"
      ></van-checkbox>
      <van-icon name="shop-o" v-if="item.info.sid > 0" size="16" />
      <small v-else>自营</small>
      <span>{{ item.info.shop_title || "" }}</span>
      <van-icon
        size="10"
        color="#999999"
        name="arrow"
        @click="goToStore(item.info.sid)"
      />
    </div>

    <div class="fx card_shop_item_con">
      <van-checkbox-group
        v-model="result"
        @change="changeGroup"
        :label-disabled="false"
      >
        <div class="fx" v-for="(item, index) in item.data" :key="index">
          <van-checkbox
            :label-disabled="false"
            :name="item"
            checked-color="#FF1C33"
          ></van-checkbox>
          <div class="shop_item_card fx">
            <img
              :src="item.pro.piclink"
              @click="
                $router.push(
                  '/shop/shopdetails?tid=' + appusers.uid + '&id=' + item.pro.id
                )
              "
            />
            <div>
              <p
                @click="
                  $router.push(
                    '/shop/shopdetails?tid=' +
                      appusers.uid +
                      '&id=' +
                      item.pro.id
                  )
                "
                class="van-multi-ellipsis--l2"
              >
                {{ item.pro.title }}
              </p>

              <p @click="edit_sku(item, index)" v-if="item.sku_cn">
                <span>{{ item.sku_cn }}</span>
              </p>
              <p
                v-else
                @click="
                  $router.push(
                    '/shop/shopdetails?tid=' +
                      appusers.uid +
                      '&id=' +
                      item.pro.id
                  )
                "
              ></p>
              <p class="fx">
                <span class="price_regular">
                  <small>￥</small>
                  <b>{{ $fnc.get_int_dec(item.pro.price, "int") }}</b>
                  <i>{{ $fnc.get_int_dec(item.pro.price, "dec") }}</i>
                </span>

                <van-stepper
                  id="shop_card_stepper"
                  v-model="item.number"
                  min="0"
                  @plus="plusNumber(Number(item.number) + 1, item)"
                  @minus="plusNumber(Number(item.number) - 1, item)"
                  @change="changeNumber(item)"
                />
              </p>
            </div>
          </div>
        </div>
      </van-checkbox-group>
    </div>
  </div>
</template>

<script>
import { Checkbox, CheckboxGroup, Stepper } from "vant";
export default {
  components: {
    [Checkbox.name]: Checkbox,
    [CheckboxGroup.name]: CheckboxGroup,
    [Stepper.name]: Stepper,
  },
  props: {
    item: {
      type: Object,
      default: { info: {}, data: [] },
    },
    index: {
      type: Number,
      default: 0,
    },
    checkedAll: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      checked: false,
      result: [],
      total: 0,
      list: [],
    };
  },
  methods: {
    goToStore(id) {
      if (id > 0) {
        this.$router.push({
          path: "/supplier/supplierdetails",
          query: { id: id },
        });
      } else {
        this.$router.push({ path: "/" });
      }
    },
    changeNumber(item) {
      var params = {};
      params.id = item.id;
      params.number = item.number;
      console.log(params);
      this.$api.getShop.updateCardNumber(params).then((res) => {
        if (res.code == 200) {
          item.pro.sum_price = item.pro.price * item.number;
          this.$emit("setTotal", this.result, this.index, this.checked);
          this.$store.dispatch("getCardNum");
        } else {
          item.number = item.number - 1;
        }
      });
    },
    edit_sku(item, k) {
      this.$emit("shop_click", item);
      this.result = [];
    },
    plusNumber(e, i) {
      var params = {};

      if (e == 0) {
        params.id_str = i.id;
        this.$dialog
          .confirm({
            title: "删除商品",
            message: "确定删除这件商品吗？",
          })
          .then(() => {
            this.$api.getShop.delCard(params).then((res) => {
              if (res.code == 200) {
                this.$toast.success("删除成功");
                this.$store.dispatch("getCardNum");
                setTimeout(() => {
                  this.$emit("delShop");
                }, 1000);
              }
            });
          })
          .catch(() => {
            // on cancel
            i.number = i.number + 1;
          });
      } else {
        params.id = i.id;
        params.number = e;
        this.$api.getShop.updateCardNumber(params).then((res) => {
          if (res.code == 200) {
            // i.pro.price=Number(i.pro.price);
            i.pro.sum_price = i.pro.price * e;
            this.$emit("setTotal", this.result, this.index, this.checked);
            this.$store.dispatch("getCardNum");
          } else {
            i.number = i.number - 1;
          }
        });
      }
    },
    changeQx(val) {
      if (val == false) {
        this.result = [];
      } else {
        this.result = this.list;
      }
    },
    changeGroup(value) {
      let checkedCount = value.length;
      this.checked = checkedCount === this.list.length;
      this.$emit("setTotal", this.result, this.index, this.checked);
    },
    unique5(arr) {
      var x = new Set(arr);
      return [...x];
    },
  },
  created() {
    var val = this.item.data;
    if (val) {
      for (var i in val) {
        this.list.push(val[i]);
      }
    }
  },
  watch: {
    checkedAll(val) {
      this.result = val ? this.list : [];
    },
  },
};
</script>


<style lang="less" scoped>
.card_shop_item {
  width: 100%;
  font-size: 14px;
  border-radius: 8px;
  margin-bottom: 10px;
  display: flex;
  flex-direction: column;
  line-height: 1;
  background: #ffffff;

  .card_shop_item_top {
    width: 100%;
    padding: 12px 15px;
    border-radius: 8px 8px 0px 0px;
    justify-content: flex-start;
    background: #fafafa;
    .van-checkbox {
      width: 10%;
    }
    > span {
      margin: 3.5px 6px 0 8px;
      font-size: 14px;
      font-weight: 700;
      color: #333333;
    }
    > small {
      text-align: center;
      font-size: 12px;
      color: #ffffff;
      width: 42px;
      height: 15px;
      line-height: 15px;
      background: linear-gradient(105deg, #fc2e38 27%, #fd4c74 84%);
      border-radius: 8px;
    }
  }

  .card_shop_item_con {
    width: 100%;
    padding: 0 15px;
    img {
      width: 100px;
      height: 100px;
      border-radius: 5px;
      vertical-align: middle;
    }

    .van-checkbox-group {
      width: 100%;
      > div {
        width: 100%;
        border-bottom: 1px solid #e2e2e2;
        padding: 14px 0;
        &:last-child {
          border-bottom: none;
        }
        .van-checkbox {
          width: 10%;
        }
        .shop_item_card {
          width: 90%;
          align-items: flex-start;
          > div {
            width: 182px;
            margin-left: 8px;
            > p {
              width: 100%;
            }
            > p:nth-of-type(1) {
              height: 36px;
              line-height: 1.4;
              font-size: 13px;
              color: #333333;
            }

            > p:nth-of-type(2) {
              margin: 6px 0;
              min-height: 23px;
              > span {
                display: inline-block;
                padding: 0 10px;
                height: 23px;
                line-height: 23px;
                background: #f7f5f5;
                border-radius: 3px;
                font-size: 12px;
                color: #999999;
              }
            }
            > p:nth-of-type(3) {
              align-items: flex-end;
            }

            .van-stepper__minus {
              background-color: #ffffff;
            }

            .price_regular > small {
              font-size: 14px;
              font-weight: bold;
            }
            .price_regular > b {
              font-size: 18px;
            }
            .price_regular > i {
              font-size: 14px;
              font-weight: bold;
              font-style: normal;
            }
          }
        }
      }
    }
  }
}
</style>
