<template>
  <div>
    <a @click.prevent="show = true">
      <div class="add_order_head fx" v-if="JSON.stringify(address) != '{}'">
        <p class="or_p1">
          <span class="or_p1_mo" v-if="address.is_show == 1">默认</span>
          <span>{{
            $fnc.deleteNumber(
              address.province + address.city + address.area + address.town
            )
          }}</span>
        </p>
        <div class="fx or_d1">
          <p>{{ address.address }}</p>
          <van-icon color="#000000" name="arrow" />
        </div>
        <p class="or_p2">
          <span>{{ address.name }}</span>
          <span>{{ address.tel }}</span>
        </p>
        <p class="or_p3">为了保证订单尽快送达，请确认收货信息</p>
      </div>
      <div class="add_order_head fx" v-else>
        <van-button
          class="add_order_head_btn"
          @click.prevent="show = true"
          size="large"
          >还未设置收货地址，点击添加...</van-button
        >
      </div>
    </a>

    <van-popup v-model="show" class="add_show_edit" position="right">
      <information
        @getAddressItem="getAddressItem"
        @close_information="get_closeinformation"
        :isShop="true"
        @back="getback"
        :isOrder="true"
        v-if="show && JSON.stringify(address) != '{}'"
      />

      <addAddres
        @getAddressItem="getAddressItem"
        @back="getback"
        :item="{}"
        :isOrder="true"
        v-else
      />
    </van-popup>
  </div>
</template>

<script>
import information from "@/components/setting/information.vue";

import addAddres from "@/components/setting/addAddres";
export default {
  props: {
    address_id: [String, Number],
    address: {
      type: Object,
      default: () => {},
    },
  },
  components: {
    information,
    addAddres,
  },
  data() {
    return {
      show: false,
    };
  },
  methods: {
    get_closeinformation() {
      this.show = false;
    },
    getback() {
      this.show = false;
    },
    getAddressItem(item) {
      this.$emit("getAddressItem", item);

      this.show = false;
    },
  },
};
</script>


.<style lang="less" scoped>
.add_order_head {
  height: 137px;
  background: url("../../../../assets/img/order/addHeadAddres.png") no-repeat
    bottom center;
  background-size: 100%;
  padding: 0 16px;
  line-height: 1;
  flex-direction: column;
  font-size: 14px;
  align-items: flex-start;
  justify-content: center;
  margin-bottom: 10px;
  > p,
  div {
    width: 100%;
  }
  > .or_p1 {
    color: #333333;
    > span.or_p1_mo {
      color: #fff;
      background: #f3280b;
      padding: 0px 5px;
      border-radius: 8px;
      margin-right: 6px;
      font-size: 12px;
      background: linear-gradient(105deg, #fc2e38 27%, #fd4c74 84%);
    }
  }
  > .or_d1 {
    color: #1a1a1a;
    font-weight: bold;
    margin: 13px 0;
    font-size: 16px;
  }
  > .or_p2 {
    color: #414141;
    font-size: 14px;
    > span:first-child {
      margin-right: 21px;
    }
  }
  .add_order_head_btn {
    background-color: #fff;
    border: 1px dashed #ddd;
    border-radius: 5px;
  }
}
.or_p3 {
  margin: 10px 0 0;
  padding: 0 10px;
  height: 27px;
  line-height: 27px;
  background: #fdfce9;
  border: 1px solid #d2ba82;
  font-size: 12px;
  color: #c29f59;
}
</style>
