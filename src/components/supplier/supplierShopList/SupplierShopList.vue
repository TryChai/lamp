<template>
  <div class="container collect_bj" id="collect">
    <div class="header">
      <div class="header_left">
        <van-icon name="arrow-left" @click="toBack" />
      </div>
      <div class="header_body">
        <p
          class="header_body_item"
          :class="{item_active : active == 0 }"
          @click="change_tabs(0)"
        >出售中</p>
        <p
          class="header_body_item"
          :class="{item_active : active == 3 }"
          @click="change_tabs(3)"
        >仓库中</p>
        <p
          class="header_body_item"
          :class="{item_active : active == 1 }"
          @click="change_tabs(1)"
        >审核中</p>
        <p
          class="header_body_item"
          :class="{item_active : active == 2 }"
          @click="change_tabs(2)"
        >驳回的</p>
      </div>
      <div class="header_right">
        <van-icon name="plus" size="24px" color="#ddd" @click="$router.push('/zhanye/addshop')" />
      </div>
    </div>
    <mescroll-vue ref="mescroll" :down="mescrollDown" class="fx_3" :up="mescrollUp" @init="mescrollInit">
      <div class="collect">
        <div class="collect_item" v-for="(item,i) in product_list" :key="i">
          <div class="collect_item_img">
            <img :src="$fnc.getImgUrl(item.piclink)" alt />
          </div>
          <div class="collect_item_right">
            <div>
              <p>{{item.title}}</p>
              <div class="collect_item_right_price">
                <p>
                  售价：
                  <span>￥</span>
                  <span>{{item.price}}</span>
                </p>
              </div>
              <p style="font-size:14px">{{active == 2 ? '驳回理由：' : '备注：'}}{{item.reback_msg}}</p>
            </div>
            <div
              class="tr"
              style="    margin-top: 5px;height: 30px;display: flex;flex-wrap: nowrap;justify-content: flex-end;align-items: center;"
            >
              <button
                @click="showProduct(item,i)"
                class="edit-supplier-button1"
              >{{item.show==1?'下架':'上架'}}</button>

              <button
                @click="$router.push({path:'/zhanye/addshop',query:{id:item.id}})"
                class="edit-supplier-button"
              >编辑</button>
              <button @click="delShop(item.id)">删除</button>
            </div>
          </div>
        </div>
      </div>
    </mescroll-vue>
  </div>
</template>

<script>
import MescrollVue from "mescroll.js/mescroll.vue";
import { setTimeout } from "timers";
export default {
  name: "SupplierShopList",
  components: {
    MescrollVue
  },
  data() {
    return {
      active: 0, // 0为商品 1为店铺
      rate: 5,
      news_list: [], //收藏新闻
      product_list: [], //收藏商品
      shop_list: [], //收藏店铺
      mescroll: null, // mescroll实例对象
      mescrollDown: {}, //下拉刷新的配置. (如果下拉刷新和上拉加载处理的逻辑是一样的,则mescrollDown可不用写了)
      mescrollUp: {
        // 上拉加载的配置.
        callback: this.upCallback, // 上拉回调,此处简写; 相当于 callback: function(page, mescroll) { }
        //以下是一些常用的配置,当然不写也可以的.
        page: {
          num: 0, //当前页 默认0,回调之前会加1; 即callback(page)会从1开始
          size: 5 //每页数据条数,默认10
        },
        htmlNodata: '<p class="upwarp-nodata">-- END --</p>',
        noMoreSize: 5, //如果列表已无数据,可设置列表的总数量要大于5才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看这就是为什么无更多数据有时候不显示的原因
        toTop: {
          //回到顶部按钮
          warpId: "collect",
          src: require("../../../assets/img/top.png"), //图片路径,默认null,支持网络图
          offset: 1000 //列表滚动1000px才显示回到顶部按钮
        },
        empty: {
          //列表第一页无任何数据时,显示的空提示布局; 需配置warpId才显示
          warpId: "collect", //父布局的id (1.3.5版本支持传入dom元素)
          icon: "", //图标,默认null,支持网络图
          tip: "暂无相关数据~" //提示
        }
      }
    };
  },
  created() {},

  methods: {
    showProduct(item,i){
        var that = this;
        that.$dialog
        .confirm({
          message: "是否"+(item.show=='1'?'下架':'上架')+"此商品？"
        })
        .then(() => {
            if(item.show=='1'){
                that.$api.getShop.downProducr({id:item.id}).then(res=>{
                    if(res.code==200){
                        that.$toast('下架成功')
                        // that.mescroll.resetUpScroll();
                        that.product_list.splice(i, 1);
                    }
                })
            }else{
                that.$api.getShop.upProducr({id:item.id}).then(res=>{
                    if(res.code==200){
                        that.$toast('上架成功')
                        // that.mescroll.resetUpScroll();
                        that.product_list.splice(i, 1);
                    }
                })
            }

        }).catch(()=>{})
        
    },
    delShop(id) {
      var that = this;
      that.$dialog
        .confirm({
          message: "是否删除此商品？"
        })
        .then(() => {
          that.$api.getSupplier.delSupplierShop({ id }).then(res => {
            if (res.code == 200) {
              that.$toast.success("删除成功");
              setTimeout(() => {
                that.mescroll.resetUpScroll();
              }, 1500);
            }
          });
        });
    },
    change_tabs(i) {
      //选项卡改变
      this.active = i;
      // this.content = []// 在这里手动置空列表,可显示加载中的请求进度
      this.mescroll.resetUpScroll(); // 刷新列表数据
    },
    mescrollInit(mescroll) {
      this.mescroll = mescroll; // 如果this.mescroll对象没有使用到,则mescrollInit可以不用配置
    },
    upCallback(page, mescroll) {
      if (this.active == 0) {
        //商品收藏
        this.$api.getSupplier
          .getSupplierList({ page: page.num, page_size: page.size })
          .then(res => {
            if (res.code == 200) {
              let arr = res.result;
              // 如果是第一页需手动置空列表
              if (page.num === 1) this.product_list = [];
              // 把请求到的数据添加到列表
              this.product_list = this.product_list.concat(arr);
              // 数据渲染成功后,隐藏下拉刷新的状态
              this.$nextTick(() => {
                mescroll.endSuccess(arr.length);
              });
            } else {
              mescroll.endErr();
            }
          });
      } else if (this.active == 1) {
        this.$api.getSupplier
          .getSupplierList({
            page: page.num,
            page_size: page.size,
            is_check: 2
          })
          .then(res => {
            if (res.code == 200) {
              let arr = res.result;
              // 如果是第一页需手动置空列表
              if (page.num === 1) this.product_list = [];
              // 把请求到的数据添加到列表
              this.product_list = this.product_list.concat(arr);
              // 数据渲染成功后,隐藏下拉刷新的状态
              this.$nextTick(() => {
                mescroll.endSuccess(arr.length);
              });
            } else {
              mescroll.endErr();
            }
          });
      } else if (this.active == 2) {
        this.$api.getSupplier
          .getSupplierList({
            page: page.num,
            page_size: page.size,
            is_check: 3
          })
          .then(res => {
            if (res.code == 200) {
              let arr = res.result;
              // 如果是第一页需手动置空列表
              if (page.num === 1) this.product_list = [];
              // 把请求到的数据添加到列表
              this.product_list = this.product_list.concat(arr);
              // 数据渲染成功后,隐藏下拉刷新的状态
              this.$nextTick(() => {
                mescroll.endSuccess(arr.length);
              });
            } else {
              mescroll.endErr();
            }
          });
      }else if (this.active == 3){
          this.$api.getSupplier
          .getSupplierList({
            page: page.num,
            page_size: page.size,
            status:'仓库中'
          })
          .then(res => {
            if (res.code == 200) {
              let arr = res.result;
              // 如果是第一页需手动置空列表
              if (page.num === 1) this.product_list = [];
              // 把请求到的数据添加到列表
              this.product_list = this.product_list.concat(arr);
              // 数据渲染成功后,隐藏下拉刷新的状态
              this.$nextTick(() => {
                mescroll.endSuccess(arr.length);
              });
            } else {
              mescroll.endErr();
            }
          });
      }
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
  watch: {
    $route(to, form) {
      if (form.name == "addshop") {
        this.mescroll.resetUpScroll();
      }
    }
  }
};
</script>

<style scoped lang='less'>
#collect{
    display: flex;
    flex-direction: column;
    .header{
        position: fixed;
        top: 0;
        z-index: 2;
    }
    >.fx_3{
        position: fixed;
        top: 0px;
        padding-top: 45px;
        z-index: 1;
    }
}
.header_right {
  position: absolute;
  top: 0;
  right: 0;
  width: 20%;
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
}
#collect {
  height: 100%;
}
.collect_bj {
  min-height: 100%;
  height: 100%;
  background-color: #f3f3f3;
}
.header {
  width: 100%;
  height: 45px;
  background-color: #ffffff;
  position: relative;
  /*background-color: #0a9fad;*/
}
.header_left {
  position: absolute;
  top: 0;
  left: 0;
//   width: 20%;
  height: 45px;
  display: flex;
  align-items: center;
}
.header_left .van-icon {
  font-size: 24px;
  padding-left: 10px;
}
.header_body {
  width: 60%;
  height: 45px;
  /*background-color: #999999;*/
  margin: 0 auto;
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-items: center;
}
.header_body_item {
  width: 50%;
  height: 45px;
  color: #000;
  font-weight: 500;
  font-size: 16px;
  line-height: 45px;
  text-align: center;
}
.item_active {
  border-bottom: 1px solid #fb2929;
}
.collect {
  width: 100%;
}
.collect_item {
  width: 95%;
  height: 140px;
  border-radius: 10px;
  margin: 15px auto 0 auto;
  background-color: #ffffff;
  padding: 5px 10px;
  display: flex;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-items: center;
  position: relative;
}
.collect_item_img {
  width: 30%;
  height: 140px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.collect_item_img img {
  width: 90%;
}
.collect_item_right {
  width: 70%;
  height: 100px;
  padding: 0px 3px;
  display: flex;
  flex-flow: column;
  justify-content: space-between;
  align-items: flex-start;
}
.collect_item_right > div > p {
  width: 100%;
  line-height: 1.4;
  font-size: 14px;
  color: #000;
  word-break: break-all;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.collect_item_right > div > p:nth-of-type(2) {
  width: 100%;
  /* padding-top: 2px; */
  padding-bottom: 2px;
  font-size: 12px;
  color: #333;
  word-break: break-all;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.collect_item_right_price {
  width: 100%;
  display: flex;
  line-height: 1.2;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-items: center;
}
.collect_item_right_price p {
  font-size: 14px;
  word-break: break-all;
  margin: 3px 0;
}
.collect_item_right_price p span:nth-of-type(1) {
  font-size: 12px;
  font-weight: bold;
  color: #ff2043;
}
.collect_item_right_price p span:nth-of-type(2) {
  font-size: 18px;
  color: #ff2043;
}
.collect_item_right > div {
  width: 100%;
}
.collect_item_right > div > div:last-child {
  width: 100%;
  text-align: right;
}
.collect_item_right button {
  font-size: 12px;
  color: #ffffff;
  height: auto;
  border-radius: 15px;
  padding: 1px 15px;
  margin: 0 5px;
  background: -webkit-linear-gradient(
    left,
    #ff3763,
    #ff7c5e
  ); /* Safari 5.1 - 6.0 */
  background: -o-linear-gradient(
    right,
    #ff3763,
    #ff7c5e
  ); /* Opera 11.1 - 12.0 */
  background: -moz-linear-gradient(
    right,
    #ff3763,
    #ff7c5e
  ); /* Firefox 3.6 - 15 */
  background: linear-gradient(
    to right,
    #ff3763,
    #ff7c5e
  ); /* 标准的语法（必须放在最后） */
  outline: none;
  border: none;
}
.collect_item_right .edit-supplier-button {
  background: linear-gradient(to right, #077ef7, #6eb6ff);
}
.collect_item_right .edit-supplier-button1 {
  background: linear-gradient(to right, #77d6a4, #07c160);
}
.product {
  width: 100%;
}

.product_content {
  width: 100%;
  background-color: #ffffff;
  margin-top: 15px;
}
.product_item {
  width: 95%;
  /*height: 70px;*/
  margin: 0 auto;
  padding: 10px 0;
  display: flex;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-items: flex-start;
}
.product_item_left {
  width: 15%;
  border-radius: 50%;
  border: 1px solid #eeeeee;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  overflow: hidden;
}
.product_item_left img {
  width: 100%;
}
.product_item_middle {
  width: 65%;
  height: 70px;
  display: flex;
  flex-flow: column;
  justify-content: flex-start;
  align-items: flex-start;
  padding: 0 10px;
}
.product_item_middle > p:nth-of-type(1) {
  width: 100%;
  font-size: 14px;
  /*font-weight: bold;*/
  line-height: 26px;
  overflow: hidden;
  text-overflow: ellipsis;
  -o-text-overflow: ellipsis;
  -webkit-text-overflow: ellipsis;
  -moz-text-overflow: ellipsis;
  white-space: nowrap;
}
.product_item_detail {
  width: 100%;
  height: 25px;
  display: flex;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-items: center;
}
.product_item_rate {
  height: 25px;
  font-size: 18px;
  line-height: 25px;
}
.product_item_detail span {
  padding-left: 10px;
  font-size: 10px;
  color: #6a6a6a;
}
.product_item_middle > p:nth-of-type(2) {
  width: 100%;
  height: 20px;

  display: flex;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-items: flex-start;
}
.product_item_middle > p:nth-of-type(2) span {
  font-size: 10px;
  padding: 0px 10px;
  border-radius: 10px;
  /*font-weight: bold;*/
  margin-right: 10px;
}
.product_item_middle > p:nth-of-type(2) span:nth-of-type(1) {
  color: #3dd9a5;
  background-color: #e6f9f3;
}
.product_item_middle > p:nth-of-type(2) span:nth-of-type(2) {
  color: #f8a044;
  background-color: #fffaf6;
}
.product_item_middle > p:nth-of-type(2) span:nth-of-type(3) {
  color: #f9402f;
  background-color: #fff5f4;
}
.product_item_middle > p:nth-of-type(2) span:nth-of-type(4) {
  color: #3dd9a5;
  background-color: #e6f9f3;
}
.product_item_right {
  width: 20%;
  height: 70px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}
.product_item_btn1 {
  width: 70px;
  font-size: 12px;
  color: #999999;
  border-radius: 5px;
  border: 1px solid #999999;
  padding: 2px 0px;
  text-align: center;
}
.product_item_btn2 {
  width: 70px;
  font-size: 12px;
  color: #ffffff;
  border-radius: 5px;
  border: 1px solid #f34642;
  background-color: #f34642;
  padding: 2px 0px;
  text-align: center;
}
.product_item_cancel_product {
  font-size: 18px;
  color: #d9d9d9;
  position: absolute;
  right: 0;
  top: -5px;
}
.new {
  width: 100%;
}
.news_list {
  width: 100%;
  margin-top: 15px;
  background-color: white;
}

.news_list_item {
  width: 95%;
  height: 120px;
  margin: 0 auto;
  display: flex;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-items: center;
  border-bottom: 1px solid #f5f5f5;
}
.news_list_item_left {
  width: 35%;
  height: 80px;
  border-radius: 6px;
  overflow: hidden;
}
.news_list_item_left img {
  width: 100%;
  height: 100%;
}

.news_list_item_right {
  width: 65%;
  height: 80px;
  display: flex;
  flex-flow: column;
  justify-content: space-between;
  padding-left: 10px;
}
.news_list_item_title p {
  font-size: 15px;
  font-weight: 700;
  line-height: 20px;
  color: #000000;
  text-align: justify;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}
.news_list_item_other {
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-items: center;
}
.news_list_item_other span:nth-of-type(1) {
  font-size: 12px;
  color: #a8a8a8;
  display: flex;
  height: 20px;
  align-items: center;
}
.news_list_item_other span:nth-of-type(2) {
  font-size: 10px;
  color: #a8a8a8;
  border: 1px solid #a8a8a8;
  border-radius: 10px;
  padding: 0px 5px;
}
</style>