<template>
  <div>
    <van-popup v-model="reserve_ewm_show" class="reservebox" :close-on-click-overlay="false" style="    background-color: transparent; display: flex;flex-flow: column;
    justify-content: center;align-items: center;">
      <div ref="reserve_ewm">
      </div>
      <van-icon name="cross" size="36px" color="#fff" style="margin-top:15px" @click="reserve_ewm_show = false;" />
    </van-popup>
  </div>
</template>
<script>
import QRCode from 'qrcodejs2'
export default {
  name: "orderDetailsReserveEwm",
  data () {
    return {
      reserve_ewm_show: false
    };
  },
  props: {
    orderid: {
      type: [Number, String]
    }
  },
  components: {
  },
  created () {

  },
  methods: {
    qrcode () {
      this.reserve_ewm_show = true;
      this.$nextTick(() => {
        var src = `/order/orderdetails?id=${this.orderid}&type=14`

        this.$refs.reserve_ewm.innerHTML = '';
        let qrcode = new QRCode(this.$refs.reserve_ewm, {
          width: 250,
          height: 250,
          text: src, // 二维码地址
          colorDark: "#000",
          colorLight: "#fff",
        })
      })
    },
  },
}
</script>
<style lang="less" scoped>
</style>