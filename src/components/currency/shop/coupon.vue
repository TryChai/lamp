<template>
  <div class="con_pou">

    <div class="coupon_conn" v-if="defaultCoupon">
      <oneCoupon :item='item' @closePop="closePop" v-for="(item,i) in coupon" :key="i" />

    </div>
    <div v-else class="coupon_conn coupon_conn1">
      <van-tabs v-model="active" animated>
        <van-tab :title="'可使用优惠券('+coupon1.length+')'">
          <div class="coupon_conn">
            <oneCoupon :item='item' @closePop="closePop" @setHb='setHb' v-for="(item,i) in coupon1" :defaultCoupon="false" :key="i" />
          </div>
        </van-tab>
        <van-tab :title="'不可使用优惠券('+coupon2.length+')'">
          <div class="coupon_conn">
            <oneCoupon :item='item' v-for="(item,i) in coupon2" :defaultCoupon="false" :key="i" />
          </div>
        </van-tab>
      </van-tabs>
    </div>

    <div class="sub_coupon_div fx">
      <van-button class="sub_coupon" @click="closePop" size="large">关闭</van-button>
    </div>

  </div>
</template>
<script>
import { CouponList } from 'vant';
import oneCoupon from '@/components/currency/onecoupon.vue'
export default {
  components: {
    [CouponList.name]: CouponList,
    oneCoupon
  },
  props: {
    coupon: {
      type: Array,
      default: () => { return [] }
    },
    defaultCoupon: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      active: "",
      coupon1: [],
      coupon2: []
    }
  },
  created () {
    if (this.coupon) {
      for (var i in this.coupon) {
        if (this.coupon[i].is_cat == 1) {
          this.coupon1.push(this.coupon[i]);
        } else {
          this.coupon2.push(this.coupon[i]);
        }
      }
    }
    // this.getCouponList();
  },
  methods: {
    setHb (item) {
      this.$emit('setHb', item);
    },
    closePop () {
      this.$emit('closePop', 0)
    },
  }
}
</script>


<style lang="less">
.sub_coupon_div {
  padding: 0 16px 16px;
  width: 100%;
  height: 10%;
  background: #f8f8f8;
  // position: relative;
  // align-items: flex-end;
  position: fixed;
  bottom: 0;
  z-index: 1;
}
.con_pou {
  position: relative;
  height: 100%;
  background-color: #f8f8f8;
}
.coupon_con {
  position: relative;
}
.sub_coupon {
  position: relative;
  bottom: 0px;
  left: 0;
}
.coupon_conn {
  padding: 16px;
  border-radius: 5px;
  position: relative;
  background: #f8f8f8;
  height: 90%;
  margin-bottom: 60px;
  // overflow: auto;
  > div:not(:last-child) {
    margin-bottom: 16px;
  }
}
.coupon_conn1 {
  padding: 0;
}
</style>
