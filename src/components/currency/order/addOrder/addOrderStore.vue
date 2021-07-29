<template>
  <div>
    <div class="add_order_store fx" v-if="JSON.stringify(store)!='{}'">
      <p class="or_p1">
        <span class="or_p1_mo">门店</span>
        <span>{{store.title}}</span>
      </p>
      <div class="fx or_d1">
        <p>{{$fnc.deleteNumber(store.province+store.city+store.area+store.town)}}{{store.add}}</p>
      </div>
      <p class="or_p2">
        <span>{{store.name}}</span>
        <span>{{store.tel}}</span>
      </p>
      <p class="or_p2">
        <span>预约时间：{{$fnc.getTimeFormat(store.reserve_time)}}</span>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    store: {
      type: Object,
      default: () => {}
    }
  },
  components: {},
  data() {
    return {
      show: false
    };
  },
  methods: {
    get_closeinformation() {
      this.show = false;
    },
    getback() {
      this.show = false;
    }
  }
};
</script>


.<style lang="less" scoped>
.add_order_store {
  background: url("../../../../assets/img/order/addHeadAddres.png") no-repeat
    bottom center;
  background-size: 100%;
  padding: 16px 16px 10px;
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
      border-radius: 3px;
      margin-right: 6px;
      font-size: 12px;
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
    margin-bottom: 10px;
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
</style>
