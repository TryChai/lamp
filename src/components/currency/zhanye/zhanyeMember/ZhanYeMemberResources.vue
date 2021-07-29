<template>
  <div>
    <div class="z-zhan-box-title">管资源</div>
    <div class="z-zhan-box-con fx">
      <div>
        <router-link to="/zhanye/addshop">
          <img src="../../../../assets/img/zhanye/z-r1.png" class="z-zhan-box-con-icon" alt />
          <p>发布产品</p>
        </router-link>
      </div>
      <div>
        <router-link to="/supplier/suppliershoplist">
          <img src="../../../../assets/img/zhanye/z-r2.png" class="z-zhan-box-con-icon" alt />
          <p>管理产品</p>
        </router-link>
      </div>
      <div>
        <router-link to="/supplier/supplierorder">
          <!-- <img src="../../../../assets/img/zhanye/z-r3.png" class="z-zhan-box-con-icon" alt /> -->
          <van-icon :name="require('../../../../assets/img/zhanye/z-r3.png')" size="50px" v-if="info.delivered<=0" class="z-zhan-box-con-icon" />
          <van-icon :name="require('../../../../assets/img/zhanye/z-r3.png')" size="50px" :info="info.delivered" v-else class="z-zhan-box-con-icon" />
          <p>我的订单</p>
        </router-link>
      </div>
      <div>
        <router-link :to="'/supplier/supplierdetails?id='+$store.state.user.id">
          <img src="../../../../assets/img/zhanye/z-r4.png" class="z-zhan-box-con-icon" alt />
          <p>我的店铺</p>
        </router-link>
      </div>
      <div>
        <router-link :to="'/supplier/orderreturn'">
          <img src="../../../../assets/img/zhanye/z-k3.png" class="z-zhan-box-con-icon" alt="">
          <p>审核退货</p>
        </router-link>
      </div>
      <!-- <div>
                <img src="../../../../assets/img/zhanye/z-r5.png" class="z-zhan-box-con-icon" alt="">
                <p>收藏产品</p>
            </div>
            <div>
                <img src="../../../../assets/img/zhanye/z-r6.png" class="z-zhan-box-con-icon" alt="">
                <p>收藏软文</p>
            </div>
            <div>
                <img src="../../../../assets/img/zhanye/z-r7.png" class="z-zhan-box-con-icon" alt="">
                <p>产品公海</p>
            </div>
            <div>
                <img src="../../../../assets/img/zhanye/z-r8.png" class="z-zhan-box-con-icon" alt="">
                <p>软文公海</p>
      </div>-->
    </div>
  </div>
</template>

<script>
export default {
  props: {
    info: {
      type: Object,
      default: () => { }
    }
  }
}
</script>


