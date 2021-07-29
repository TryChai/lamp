<template>
    <div class="s-d-con">
         <mescroll-vue
      ref="mescroll"
      :down="mescrollDown"
      :up="mescrollUp"
      @init="mescrollInit"
      class=""
    >  
        <div class="s-d-head">
            <div class="s-d-head-nav fx">
                <van-icon name="arrow-left" size="18px" @click="toBack" />
                <!-- <div>
                    <van-icon name="search" />
                    <van-icon name="filter-o" @click="$router.push('/supplier/suppliercomplaint')" />
                </div> -->
            </div>
        </div>
        <supplier-details-shops-info class="s-d-shop" :info='info' />
        <div >
            <van-tabs v-model="active" animated class="s-d-shop-tab" title-active-color='#000000' color='#2295ff'>
                <van-tab  title="商品" >
                    <div class="s-d-shop-tab-item">
                        <indexshoplist :top_shoplist='list' class="shop-search-con" />
                    </div>
                    
                </van-tab>
                <van-tab  title="商家名片" >
                    <SupplierDetailsShop :item='info' />
                </van-tab>
            </van-tabs>
        </div>
</mescroll-vue>
    </div>
</template>

<script>
import SupplierDetailsShopsInfo from '@/components/currency/supplier/supplierDetails/SupplierDetailsShopsInfo.vue';
import SupplierDetailsMyShops from '@/components/currency/supplier/supplierDetails/SupplierDetailsMyShops.vue';
import SupplierDetailsShop from '@/components/currency/supplier/supplierDetails/SupplierDetailsShop.vue';
import MescrollVue from "mescroll.js/mescroll.vue";
import indexshoplist from "@/components/shop/shopindex/indexshoplist.vue";
export default {
  name:"supplierdetails",
    components:{
        SupplierDetailsShopsInfo,
        SupplierDetailsMyShops,
        SupplierDetailsShop,
        MescrollVue,
        indexshoplist
    },
    data(){
        return{
            active:0,
             mescroll: null, // mescroll实例对象
        mescrollDown: {
          mustToTop: true
        }, //下拉刷新的配置. (如果下拉刷新和上拉加载处理的逻辑是一样的,则mescrollDown可不用写了)

        mescrollUp: {
            offset:200,
            
          // 上拉加载的配置.
          callback: this.upCallback, // 上拉回调,此处简写; 相当于 callback: function(page, mescroll) { }
          //以下是一些常用的配置,当然不写也可以的.
          page: {
            num: 0, //当前页 默认0,回调之前会加1; 即callback(page)会从1开始
            size: 10 //每页数据条数,默认10
          },
          htmlNodata: '<p class="upwarp-nodata">-- END --</p>',
          noMoreSize: 5, //如果列表已无数据,可设置列表的总数量要大于5才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看这就是为什么无更多数据有时候不显示的原因
          toTop: {
            //回到顶部按钮
            warpId: "my-shops",
            src: require("../../../assets/img/top.png"), //图片路径,默认null,支持网络图
            offset: 1000 //列表滚动1000px才显示回到顶部按钮
          },
          empty: {
            //列表第一页无任何数据时,显示的空提示布局; 需配置warpId才显示
          warpId: "", //父布局的id (1.3.5版本支持传入dom元素)
          icon: "./static/mescroll/mescroll-empty.png", //图标,默认null,支持网络图
          tip: "暂无相关数据~" //提示
        }
      },
      list: [],
      info:{}
        }
    },
    beforeRouteEnter(to, from, next) {
    // 如果没有配置回到顶部按钮或isBounce,则beforeRouteEnter不用写
    next(vm => {
      // 找到当前mescroll的ref,调用子组件mescroll-vue的beforeRouteEnter方法
      vm.$refs.mescroll && vm.$refs.mescroll.beforeRouteEnter(); // 进入路由时,滚动到原来的列表位置,恢复回到顶部按钮和isBounce的配置
    });
  },
  beforeRouteLeave(to, from, next) {
    // 如果没有配置回到顶部按钮或isBounce,则beforeRouteLeave不用写
    // 找到当前mescroll的ref,调用子组件mescroll-vue的beforeRouteLeave方法
    this.$refs.mescroll && this.$refs.mescroll.beforeRouteLeave(); // 退出路由时,记录列表滚动的位置,隐藏回到顶部按钮和isBounce的配置
    next();
  },
  created(){
    this.getSupplierDetails();
  },
  methods:{
       mescrollInit(mescroll) {
      this.mescroll = mescroll; // 如果this.mescroll对象没有使用到,则mescrollInit可以不用配置
    },
    upCallback(page, mescroll) {
      var params={};
            params.sid=this.$route.query.id || '';
            params.page=page.num
      this.$api.getShop.getShopSearch(params).then(res => {
        if (res.code == 200) {
          let arr = res.result.data;

          // 如果是第一页需手动置空列表
          if (page.num === 1) this.list = [];
          // 把请求到的数据添加到列表

          this.list = this.list.concat(arr);
          // 数据渲染成功后,隐藏下拉刷新的状态
          this.$nextTick(() => {
            setTimeout(()=>{
              mescroll.endSuccess(arr.length);
            },1500)
          });
        } else {
          mescroll.endErr();
        }
      });
    },
    getSupplierDetails(){
        var params={};
            params.id=this.$route.query.id || '';
            this.$api.getSupplier.getSupplierDetails(params).then(res=>{
            if(res.code==200){
              this.info=res.result;
            }
        })
    }
  }
}
</script>


<style lang="less" scoped>
.s-d-shop-tab-item{
    padding:12px 0;
}
.s-d-con{
    font-size: 14px;
    font-weight: 400;
    line-height: 1;
    background: #f3f3f3;
    overflow: auto;
    .s-d-head{
        background: url('../../../assets/img/supplier/s-head.png') no-repeat;
        background-size: 100% 100%;
        height: 58px;
        >.s-d-head-nav{
            height: 45px;
            padding: 0 17px;
            font-size: 17px;
            color: #fff;
            font-weight: bold;
            >div>i:last-child{
                margin-left: 15px;
            }
        }
    }
    .s-d-shop{
        margin-top: -13px;
    }
}
</style>
