<template>
  <div class="fx addOrderProduct">
    <div class="fx">
      <img
        :src="item.pro.piclink"
        v-for="(item, i) in list"
        :key="i"
        v-show="i < 4"
      />
    </div>
    <div @click="showPop">
      <p :style="money.toString().length > 7 ? { fontSize: '13px' } : {}">
        S${{ $fnc.toFixedZ(money) }}
      </p>
      <p>共{{ number || 0 }}件</p>
    </div>
    <van-icon name="arrow" size="13" color="#888888" @click="showPop" />
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  props: {
    cart: {
      type: Array,
      default: () => {
        [];
      },
    },
    money: {
      type: [Number, String],
      default: "",
    },
    number: {
      type: [Number, String],
      default: "",
    },
  },
  computed: {
    list() {
      let arr = [];
      if (this.cart) {
        for (let i of this.cart) {
          for (let j of i.data) {
            arr.push(j);
          }
        }
      }
      return arr;
    },
  },
  methods: {
    showPop() {
      this.$emit("showProductList");
    },
  },
};
</script>



<style lang="less" scoped>
.addOrderProduct {
  width: 100%;
  margin: 10px 0;
  padding: 12px 16px;
  background: #ffffff;
  font-size: 14px;
  justify-content: flex-start;

  > div:nth-of-type(1) {
    width: 78%;
    justify-content: flex-start;
    > img {
      width: 63px;
      height: 63px;
      margin-right: 3px;
    }
  }
  > div:nth-of-type(2) {
    width: 22%;
    text-align: center;
    line-height: 1.3;
    > p {
      font-family: "gilroy" !important;
      &:nth-of-type(1) {
        font-size: 15px;
        font-weight: bold;
      }
      &:nth-of-type(2) {
        font-size: 12px;
        color: #888888;
      }
    }
  }
}
</style>

