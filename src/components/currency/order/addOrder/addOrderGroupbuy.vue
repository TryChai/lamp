<template>
  <div class="addOrderGroupbuy">
    <p class="groupbuy-title">参团信息</p>
    <van-radio-group v-model="gb_types" class="fx add-order-groupbuy">
      <van-cell-group :border="false">
        <van-cell title="自动参团" :border="false" @click="gb_types = '1'">
          <template #icon>
            <van-radio checked-color="#FD5501" name="1" />
          </template>
          <template #right-icon>
            <input
              class="cell-title"
              type="text"
              v-model="gb_num"
              placeholder="请输入要增加的参团次数"
            />
          </template>
        </van-cell>
        <van-cell title="拼中为止" :border="false" @click="gb_types = '2'">
          <template #icon>
            <van-radio checked-color="#FD5501" name="2" />
          </template>
        </van-cell>
      </van-cell-group>
    </van-radio-group>
  </div>
</template>

<script>
import { Field } from "vant";
export default {
  name: "add-order-groupbuy",
  props: ["orderInfo"],
  data() {
    return {
      gb_types: "0",
      gb_num: "",
    };
  },
  components: {
    [Field.name]: Field,
  },
  created() {},
  mounted() {},
  methods: {},
  watch: {
    gb_types(val) {
      if (val == 2) {
        this.gb_num = "";
      }
      this.$emit("setGbTypes", val);
    },
    gb_num(val) {
      this.$emit("setGbNum", val);
    },
  },
};
</script>
<style lang='less' scoped>
.addOrderGroupbuy {
  width: 100%;
  background: #ffffff;
}
.groupbuy-title {
  font-size: 16px;
  padding: 8px 16px 0;
  font-weight: bold;
}
.add-order-groupbuy {
  padding: 0 16px;
  font-size: 14px;
  align-items: center;
  flex-direction: column;
  margin-bottom: 10px;
  border-radius: 10px;
  background: #ffffff;
  > div {
    width: 100%;
  }
  .van-cell {
    padding: 10px 0;
  }
  .van-cell__title {
    padding-left: 5px;
  }
  .cell-title {
    text-align: center;
    padding: 2px 0;
    border: 1px solid #d3d3d3;
  }
}
</style>
