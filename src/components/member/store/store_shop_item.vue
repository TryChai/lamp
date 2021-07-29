<template>
  <div class="cut_item">
    <div class="cut_item_left">
      <img :src="$fnc.getImgUrl(info.piclink)" @click="toDetails(true)" alt />
      <div class="shop-video-icon" v-if="info.video" @click="toDetails(true)">
        <div>
          <img src="../../../assets/img/play.png" alt />
        </div>
      </div>
    </div>
    <div class="cut_item_right">
      <p class="cut_item_right_p1" @click="toDetails(false)">{{info.title}}</p>

      <div class="cut_item_right_price1" @click="toDetails(false)">
        <div class="price_regular" style="color:#ff2043">
          <small>销售价:￥</small>
          <b>{{$fnc.get_int_dec(info.price,'int')}}</b>
          <i>{{$fnc.get_int_dec(info.price,'dec')}}</i>
        </div>

      </div>
      <p v-if="info.label" class="cut_item_right_p2" v-html="info.label" @click="toDetails(false)"></p>
      <p style="color: #999;font-size:12px"><span>{{info.sale}}人付款</span></p>
      <div class="cut_item_right_price2 ">

        <p class="right_red_btn" @click="star_click(info,$event)" v-if="is_myshop == true">{{info.is_top == 0? '设为置顶':'已置顶'}}
        </p>
        <!-- v-if="isShowSales==1" -->

        <!-- <van-icon name="star"
                    :class="{'star_active':info.is_top == 0 ? false:true}"
                    v-if="is_myshop == true"
                    @click="star_click(info,$event)"
                    size="20px" /> -->
        <p class="right_red_btn" @click.prevent="add_shop(info.id,$event) " v-if="is_manger == true && info.is_microshop==0">添加商品</p>
        <p class="right_red_btn" @click.prevent="add_shop(info.id,$event) " v-if="is_manger == true && (info.is_microshop==1 )">
          删除商品
        </p>
        <p class="right_red_btn" @click="toDetails(info.id) " v-if="is_manger == false">立即购买</p>
        <p class="right_red_btn" @click.prevent="del_shop(info.id,$event)" v-if="is_myshop == true"> 删除商品</p>
      </div>
    </div>

  </div>
</template>
<script>
import { mapState } from "vuex";

export default {
  name: "cut_shop_item",
  data () {
    return {};
  },
  props: {
    info: {
      type: Object
    },
    is_manger: {
      type: Boolean,
      default: false,
    },
    is_myshop: {
      type: Boolean,
      default: false,
    }
  },
  components: {

  },
  computed: {
    ...mapState({
      isVideoShop: state => state.config.shop.is_video_shop,
      isShowSales: state => state.config.shop.is_show_sales,
    })
  },
  methods: {
    star_click (info, e) {
      var str = e.target.innerText;
      if (str == '设为置顶') {
        this.$api.getShop.add_store_hot_shop({ id: info.id }).then(res => {
          if (res.code == 200) {
            this.$toast.success('置顶成功')
            e.target.innerText = '已置顶'
          }
        })
      } else if (str == '已置顶') {
        this.$api.getShop.down_store_hot_shop({ id: info.id }).then(res => {
          if (res.code == 200) {
            this.$toast.success('取消成功')
            e.target.innerText = '设为置顶'
          }
        })
      }

    },
    del_shop (id, e) {
      this.$api.getShop.del_store_manger_shop({ id: id }).then(res => {
        if (res.code == 200) {
          if (this.is_myshop == true) {
            this.$emit('del_success')
          } else {
            this.$toast.success('删除成功')
            e.target.innerText = '添加商品'
          }
        } else {
          this.$toast.fail(res.result)
        }
      })
    },
    add_shop (id, e) {

      var str = e.target.innerText;
      if (str == '添加商品') {
        this.$api.getShop.add_store_manger_shop({ id: id }).then(res => {
          if (res.code == 200) {
            this.$toast.success('添加成功')
            e.target.innerText = '删除商品'
          } else {
            this.$toast.fail(res.result)
          }
        })
      } else if (str == '删除商品') {
        this.$api.getShop.del_store_manger_shop({ id: id }).then(res => {
          if (res.code == 200) {
            if (this.is_myshop == true) {
              this.$emit('del_success')
            } else {
              this.$toast.success('删除成功')
              e.target.innerText = '添加商品'
            }


          } else {
            this.$toast.fail(res.result)
          }
        })
      }

    },
    toDetails (bool) {
      bool = bool || false;
      if (this.info.video && this.isVideoShop == 1 && bool) {
        this.$router.push(
          "/shop/shopdetails?tid=" +
          this.appusers.uid +
          "&id=" +
          this.info.id +
          "&showVideo=1" + "&mid=" + this.$route.query.mid
        );
      } else {
        this.$router.push(
          "/shop/shopdetails?tid=" +
          this.appusers.uid +
          "&id=" +
          this.info.id +
          "&showVideo=0" + "&mid=" + this.$route.query.mid
        );
      }
    }
  }
};
</script>
<style  scoped lang='less'>
.cut_item {
  width: 94%;
  height: 150px;
  padding: 10px;
  margin: 10px auto 0 auto;
  background-color: #ffffff;
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-items: center;
  border-radius: 5px;
}
.cut_item_left {
  width: 130px;
  display: flex;
  margin-right: 10px;
  justify-content: center;
  align-items: center;
  position: relative;
  /* padding-right: 10px; */
}
.cut_item_left img {
  width: 100%;
  height: 100%;
}
.cut_item_right {
  width: 62%;
  height: 100%;
  display: flex;
  flex-flow: column;
  justify-content: space-between;
  align-items: flex-start;
}
.cut_item_right > .cut_item_right_p1 {
  font-size: 14px;
  // height: 36px;
  line-height: 18px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}
.cut_item_right > .cut_item_right_p2 {
  width: 100%;
  /* height: 40px; */
  //   margin-top: 5px;
  display: flex;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-items: center;
}
.cut_item_right > .cut_item_right_p2 span {
  font-size: 10px;
  color: #ff2043;
  /* background-color: #fdebeb; */
  border: 1px solid #ff2043;
  border-radius: 3px;
  padding: 0px 10px;
  margin-right: 10px;
}
.cut_item_right_price1 {
  width: 100%;
  //   margin-top: 5px;
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-items: flex-end;
}
.cut_item_right_price1 > p:nth-of-type(1) {
  font-size: 12px;
  font-weight: bold;
  color: #000000;
  line-height: 14px;
}
.cut_item_right_price1 > p:nth-of-type(1) span {
  font-size: 16px;
  font-weight: bold;
  color: #000000;
  color: #ff2043;
}
.cut_item_right_price2 > .right_red_btn {
  font-size: 12px;
  font-weight: bold;
  color: #ffffff;
  background-color: #ff3a63;
  background: -webkit-linear-gradient(
    to left,
    #ff3a63,
    #ff7d5e
  ); /* Safari 5.1 - 6.0 */
  background: -o-linear-gradient(
    to left,
    #ff3a63,
    #ff7d5e
  ); /* Opera 11.1 - 12.0 */
  background: -moz-linear-gradient(
    to left,
    #ff3a63,
    #ff7d5e
  ); /* Firefox 3.6 - 15 */
  background: linear-gradient(to left, #ff3a63, #ff7d5e); /* 标准的语法 */
  border-radius: 10px;
  padding: 2px 15px;
  border-radius: 20px;
}
.cut_item_right_price2 {
  width: 100%;
  // height: 30px;
  display: flex;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-items: center;
}
.cut_item_right_price2 > p:nth-of-type(1) {
  font-size: 12px;
  // color: #999;
  font-weight: bold;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-right: auto;
}
// .cut_item_right_price2 .van-icon {
//     margin-right: 5px;
//     color: #eeeeee;
// }
// .cut_item_right_price2 .star_active {
//     color: #ffd91a;
// }
.shop-video-icon {
  position: absolute;
  left: 0px;
  bottom: 0px;
  height: auto;
  display: flex;
  padding: 10px;
  z-index: 4;
  > div {
    display: flex;
    background-color: rgba(0, 0, 0, 0.5);
    border-radius: 50%;
  }
  img {
    width: 30px !important;
    height: 30px;
  }
}
.cut_item_right_price22 {
  justify-content: flex-end;
}
.price_regular > small {
  font-size: 12px;
  font-weight: bold;
}
.price_regular > b {
  font-size: 16px;
}
.price_regular > i {
  font-size: 12px;
  font-weight: normal;
  font-style: normal;
}
</style>