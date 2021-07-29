<template>
  <div>
    <div class="z-zhan-box-title">最近三日流量分析</div>
    <div class="z-zhan-box-con fx">
      <div>
        <router-link to="/zhanye/analysis?sn=last_time">
          <img src="../../../../assets/img/zhanye/z-a1.png" class="z-zhan-box-con-icon" alt />
          <p>最近访问</p>
        </router-link>
      </div>
      <div>
        <router-link to="/zhanye/analysis?sn=view_time">
          <img src="../../../../assets/img/zhanye/z-a2.png" class="z-zhan-box-con-icon" alt />
          <p>时长排行</p>
        </router-link>
      </div>
      <div>
        <router-link to="/zhanye/analysis?sn=hit">
          <!-- <img src="../../../../assets/img/zhanye/z-r3.png" class="z-zhan-box-con-icon" alt /> -->
          <van-icon :name="require('../../../../assets/img/zhanye/z-a3.png')" size="50px"   class="z-zhan-box-con-icon" />

        <p>次数排行</p>
         </router-link>
      </div>
      <div>
          <router-link to="/zhanye/analysis?sn=product">
            <img src="../../../../assets/img/zhanye/z-a4.png" class="z-zhan-box-con-icon" alt />
            <p>资源排行</p>
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
  props:{
    info:{
      type:Object,
      default:()=>{}
    }
  }
}
</script>


