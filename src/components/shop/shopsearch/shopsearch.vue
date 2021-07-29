<template>
  <div>
    <div class="fx searc_conn">
      <van-icon name="arrow-left" @click="toBack" />
      <form action="/" class="fx_2">
        <van-search v-model="form.title" shape="round" placeholder="粘贴宝贝标题，先领劵在购物" @search="onSearch" @cancel="onCancel" @focus="getJd"
            @blur="closeJd" />
      </form>
      <van-icon name="cart-o" size="22px" @click="$router.push('/shop/shopcard')" />
      <div class="his_search" v-show="historyShow">
        <div class="fx">
          <p class="fx_1">历史记录：</p>
          <p>
            <van-icon name="delete" @click="del_all_search" />
          </p>
        </div>
        <div class="fx_3">
          <span v-for="(item,i) in list" :key="i" class="his_ls search_span" :ref="`shop_search-${i}`" @touchstart="start(item,`shop_search-${i}`)"
              @touchmove="move(item)" @touchend="end(item,`shop_search-${i}`)">{{item}}
            <van-icon name="cross" class="hide_delicon" />
          </span>
        </div>

        <div class="hotsearch" v-if="searchArr && searchArr.length > 0">
          <div class="hottop">
            <img src="./../../../assets/img/member/reward.png" alt="">
            热搜榜
          </div>
          <div class="hotbox">
            <div v-for="(item,i) in searchArr" :key="i" v-if="i <= 9" @click="gosearch(item)">
              <img src="./../../../assets/img/king1.png" alt="" v-if="i == 0">
              <img src="./../../../assets/img/king2.png" alt="" v-else-if="i == 1">
              <img src="./../../../assets/img/king3.png" alt="" v-else-if="i == 2">
              <i v-else>{{i+1}}</i>
              <span>{{item}}</span>
            </div>

          </div>
        </div>
      </div>

    </div>
    <!-- <van-tabs v-model="cate_id" class="search_tab">
        <van-tab title="全部" >
        </van-tab>
        <van-tab v-for="index in cate" :title="index.title"  :key="index.id">
        </van-tab>
    </van-tabs> -->

    <div class="fx menu_sear">
      <!-- <van-dropdown-menu class="menu_sear">
          <van-dropdown-item v-model="value1" :options="option1" />
          <div class="menu_text">销量</div>
           <van-dropdown-item v-model="form.sid_cn" :options="option2" />
      </van-dropdown-menu> -->
      <div class="menu_text" :class="{zh_srarch:form.order_sn==''}" @click="getPrice('综合')">综合</div>
      <div class="menu_text" :class="{xl_srarch:form.order_sn=='invent_sale_desc'}" @click="getPrice('销量')">销量</div>
      <div class="menu_text" :class="[form.order_sn=='price_asc' || form.order_sn=='price_desc'?'xl_srarch ':'']" @click="getPrice">价格
        <span>
          <i class=" ascending" :class="[form.order_sn=='price_asc'?'ac_order_up ':'']"></i>
          <i class=" descending" :class="[form.order_sn=='price_desc'?'ac_order_down ':'']"></i>
        </span>

      </div>
    </div>

  </div>
</template>

<script>
import { Dialog } from 'vant';
export default {
  props:{
    historyShow:Boolean
  },
  data () {
    return {
      searchArr: [],
      longClick: null,
      timeOutEvent: null,
      form: {
        title: "",
        sid_cn: "",
        order_sn: "",
        cate_id: ""
      },
      cate_id: 0,
      cate: [],
      value1: 0,
      value2: '',
      option1: [
        { text: '综合', value: 0 },
        { text: '新款商品', value: 1 },
        { text: '活动商品', value: 2 }
      ],
      option2: [
        { text: '价格', value: '' },
        { text: '价格正序', value: 'price_asc' },
        { text: '价格倒叙', value: 'price_desc' },
      ],
      searchCon: true,
      list: []
    };
  },

  components: {
    [Dialog.name]: Dialog
  },
  created () {
    // this.getCate();
    if (this.$store.state.isLogin) {
      if (sessionStorage.getItem("search")) {
        this.list = JSON.parse(sessionStorage.getItem("search"));
      }
    } else {
      this.$api.getShop.getShopSraechHistory({}).then(res => {
        if (res.code == 200) {
          this.list = res.result;
          sessionStorage.setItem("search", JSON.stringify(this.list))
        }
      });
    }
    this.$api.getConfig.get_iden({ iden: 'popular_searches' }).then(res => {
      if (res.code == 200) {
        this.searchlist = res.result;
        var str = res.result;
        if (str) {
          var arr = str.split('@');
          this.searchArr = arr || [];
        } else {
          this.searchArr = []
        }

      }
    })
    if (this.$route.query.cate_id) {
      this.getCateSearch();
    }
  },

  methods: {
    gosearch (item) {
      this.form.title = item;
      this.$emit("setSearch", { title: item });
      setTimeout(() => {
        this.searchCon = false;
      }, 300);
    },
    start (item, name) {
      var that = this;
      this.longClick = 0;
      this.timeOutEvent = setTimeout(function () {
        that.longClick = 1;
        that.$refs[name][0].firstElementChild.classList.remove("hide_delicon")
      }, 500);
    },
    move (e) {
      clearTimeout(this.timeOutEvent);
      this.timeOutEvent = 0;
      e.preventDefault();
    },
    end (str, name) {
      clearTimeout(this.timeOutEvent);
      if (this.timeOutEvent != 0 && this.longClick == 0) {
        //点击
        //此处为点击事件----在此处添加跳转详情页
        var classlist = this.$refs[name][0].firstElementChild.classList
        var arr = [];
        classlist.forEach(item => {
          arr.push(item)
        });
        if (arr.includes('hide_delicon') == true) {
          if (str) {
            this.form.title = str;
            if (sessionStorage.getItem("search")) {
              var search = JSON.parse(sessionStorage.getItem("search"))
              if (search.includes(str) == false) {
                search.unshift(str);
                if (search.length >= 20) {
                  search.pop();
                }
                this.list = search;
                sessionStorage.setItem("search", JSON.stringify(this.list))
              }
            } else {
              sessionStorage.setItem("search", JSON.stringify([str]))
            }
            this.$emit("setSearch", { title: str });
            setTimeout(() => {
              this.searchCon = false;
            }, 300);
          } else {
            this.$emit("setSearch", this.form);
            setTimeout(() => {
              this.searchCon = false;
            }, 300);
          }

        } else {
          this.$api.getShop.del_search_word({ id: str }).then(res => {
            if (res.code == 200) {
              this.$refs[name][0].firstElementChild.classList.add("hide_delicon")
              this.$api.getShop.getShopSraechHistory({}).then(res => {
                if (res.code == 200) {
                  this.list = res.result;
                  sessionStorage.setItem("search", JSON.stringify(this.list))
                }
              });

            }
          })
        }

      }
      return false;
    },
    del_all_search () {
      Dialog.confirm({
        message: '确定删除全部搜索记录？'
      }).then(() => {
        sessionStorage.setItem('search', [])
        this.$api.getShop.del_search_word({}).then(res => {
          if (res.code == 200) {
            this.list = [];
          }
        })
        // on confirm
      }).catch(() => {
        // on cancel
      });
    },
    getPrice (str) {
      if (str == '综合') {
        this.form.order_sn = ''
      } else if (str == '销量') {
        this.form.order_sn = 'invent_sale_desc'
      } else if (this.form.order_sn == 'price_asc') {
        this.form.order_sn = 'price_desc'
      } else {
        this.form.order_sn = 'price_asc'
      }
      this.$emit("setSearch", this.form);
    },
    closeJd () {
      // this.searchCon=false;
    },
    getJd () {
      this.searchCon = true;

    },
    onSearch (str) {
      if (str) {
        this.form.title = str;
        if (sessionStorage.getItem("search")) {
          var search = JSON.parse(sessionStorage.getItem("search")) || []
          if (search.includes(str) == false) {
            search.unshift(str);
            if (search.length >= 20) {
              search.pop();
            }
            this.list = search;
            sessionStorage.setItem("search", JSON.stringify(search))
          }

        } else {
          sessionStorage.setItem("search", JSON.stringify([str]))
        }

        this.$emit("setSearch", { title: str });
      } else {
        this.$emit("setSearch", this.form);
      }
      this.searchCon = false;

    },
    onCancel () {
      // this.searchCon=false;
    },
    getCate () {
      this.$api.getShopCate.getShopCate({}).then(res => {
        if (res.code == 200) {
          this.cate = res.result.cate;
        }
      })
    },
    getCateSearch (cate_id) {
      var params = {};
      params.cate_id = cate_id;

      this.$emit("setSearch", params);
      this.searchCon = false;
    }
  },
  watch: {
    // cate_id(val){
    //   this.form.cate_id=this.cate[val-1]? this.cate[val-1].id : '';
    //   this.$emit("setSearch",this.form);
    // }
  }
};
</script>

<style lang="less" scoped>
.his_ls {
  background: #c0c4cc;
  padding: 2px 15px;
  margin-right: 5px;
  border-radius: 15px;
  color: #fff;
  font-size: 12px;
  display: inline-block;
  position: relative;
  max-width: 80px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.his_ls .van-icon {
  position: absolute;
  top: -4px;
  right: -5px;
  font-size: 10px;
  color: #fff;
  background-color: #929292;
  border-radius: 50%;
  // padding: 1px;
}
.hide_delicon {
  display: none;
}
.zh_srarch,
.xl_srarch {
  color: #333;
  font-weight: bold;
}

.ac_order_up {
  border-bottom-color: #409eff !important;
}
.ac_order_down {
  border-top-color: #409eff !important;
}
.ac_order_up .menu_text,
.ac_order_down .menu_text {
  color: #333;
  font-weight: bold;
}
.menu_sear {
  line-height: 1;
  align-items: center;
  height: 34px;
  line-height: 34px;
  font-size: 14px;
  color: #8c8c8c;
  background: #fff;
  > div {
    flex: 1;
    text-align: center;
  }
  .menu_text {
    font-size: 0.4rem;
    position: relative;
    word-wrap: normal;
    text-overflow: ellipsis;
    vertical-align: middle;
    width: 100%;
    display: inline-block;
    span {
      display: inline-flex;
      flex-direction: column;
      align-items: center;
      height: 34px;
      width: 24px;
      vertical-align: middle;

      overflow: initial;
      position: relative;
      i {
        width: 0;
        height: 0;
        border: 5px solid transparent;
        position: absolute;
        left: 7px;
      }
      .descending {
        border-top-color: #c0c4cc;
        bottom: 7px;
      }
      .ascending {
        border-bottom-color: #c0c4cc;
        top: 5px;
      }
    }
  }
}
.search_tab {
  margin-top: 44px;
}
.searc_conn i {
  font-size: 20px;
}
.searc_conn {
  // position: fixed;
  z-index: 999;
  // top: 0;
  position: relative;
  width: 100%;
  padding: 0 16px 0 10px;
  height: 100%;
  color: #737373;
  height: 44px;
  line-height: 44px;
  background: #fff;
  // position: relative;
  .his_search {
    position: fixed;
    width: 100%;
    top: 44px;
    height: 100%;
    background: #fff;
    z-index: 9999;
    left: 0;
    font-size: 14px;
    overflow: auto;
    > div {
      padding: 10px 15px 0;
      justify-content: flex-start;
      align-items: flex-start;
      line-height: 1.6;
    }
  }
  form {
    height: 30px;
    padding: 0 11px;
  }
  .van-search__content--round {
    height: 100%;
    font-size: 14px;
  }
  .van-search {
    height: 100%;
    padding: 0;
  }
}
.van-search .van-cell {
  align-items: center;
}
.hotsearch {
  width: 100%;
  display: flex;
  flex-flow: column;
  justify-content: flex-start;
  align-items: center;
  background-color: #fff;
  overflow: hidden;
  border-radius: 15px;
  margin-bottom: 30px;
  .hottop {
    width: 100%;
    height: 40px;
    font-size: 16px;
    color: #ad774d;
    display: flex;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-items: center;
    background-image: linear-gradient(#f6dedb, #fdf9f8);
    padding: 0 15px;
    overflow: hidden;
    border-top-left-radius: 15px;
    border-top-right-radius: 15px;
    img {
      width: 25px;
      margin-left: -5px;
      margin-right: 5px;
    }
    font-weight: bold;
  }
  .hotbox {
    width: 100%;
    display: flex;
    flex-flow: column;
    justify-content: flex-start;
    align-items: flex-start;
    border-left: 1px solid #f2f2f2;
    border-right: 1px solid #f2f2f2;
    > div {
      width: 100%;
      height: 40px;
      border-bottom: 1px solid #f2f2f2;
      display: flex;
      flex-wrap: nowrap;
      justify-content: flex-start;
      align-items: center;
      padding: 0 10px;
      img {
        width: 25px;
        margin-right: 8px;
      }
      i {
        width: 25px;
        font-size: 16px;
        font-weight: bold;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #f3ad30;
        margin-right: 8px;
      }
      span {
        font-size: 14px;
        color: #333;
        line-height: 1;
      }
    }
  }
}
</style>


