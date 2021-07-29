<template>
  <div class="search-con-shop">
    <div class="fx searc_conn">
      <van-icon name="arrow-left" @click="toBack" />
      <form action="/" class="fx_2">
        <van-search
          v-model="form.title"
          shape="round"
          :placeholder="$h('请输入用户名/昵称/手机号码')"
          @search="onSearch"
          :autofocus="true"
          @focus="getJd"
        />
      </form>

      <div class="his_search" v-show="searchCon">
        <div class="fx" v-if="list && list.length > 0">
          <p class="fx_1">{{ $h("历史记录") }}：</p>
          <p>
            <van-icon name="delete" @click="del_all_search" />
          </p>
        </div>
        <div class="fx_3">
          <span
            v-for="(item, i) in list"
            :key="i"
            class="his_ls"
            @click="start(item)"
            >{{ item }}
            <van-icon name="cross" class="hide_delicon" />
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Dialog } from "vant";
export default {
  data() {
    return {
      form: {
        title: "",
      },
      searchCon: true,
      list: [],
    };
  },
  components: {
    [Dialog.name]: Dialog,
  },
  created() {
    if (localStorage.getItem("im-search")) {
      var arr = JSON.parse(localStorage.getItem("im-search"));
      var hash = [];
      for (var i = 0; i < arr.length; i++) {
        if (hash.indexOf(arr[i]) == -1) {
          hash.push(arr[i]);
        }
      }
      this.list = hash;
    }
  },

  methods: {
    start(name) {
      this.$emit("setSearch", { title: name });
      this.searchCon = false;
    },
    del_all_search() {
      Dialog.confirm({
        message: "确定删除全部搜索记录？",
      })
        .then(() => {
          localStorage.setItem("im-search", []);
          this.list = [];
        })
        .catch(() => {});
    },
    getJd() {
      this.searchCon = true;
    },
    onSearch(str) {
      if (str) {
        this.form.title = str;
        if (localStorage.getItem("im-search")) {
          var search = JSON.parse(localStorage.getItem("im-search"));
          search.unshift(str);
          if (search.length >= 20) {
            search.pop();
          }
          this.list = search;
          localStorage.setItem("im-search", JSON.stringify(search));
        } else {
          localStorage.setItem("im-search", JSON.stringify([str]));
        }

        this.$emit("setSearch", { title: str });
      } else {
        this.$emit("setSearch", this.form);
      }
      this.searchCon = false;
    },
  },
  watch: {},
};
</script>

<style lang="less" scoped>
.search-con-shop {
  position: relative;
  z-index: 999;
}
.his_ls {
  background: #c0c4cc;
  padding: 2px 15px;
  margin-right: 15px;
  margin-bottom: 5px;
  border-radius: 15px;
  color: #fff;
  font-size: 12px;
  display: inline-block;
  position: relative;
}
.his_ls .van-icon {
  position: absolute;
  top: -4px;
  right: -5px;
  font-size: 10px;
  color: #fff;
  background-color: #929292;
  border-radius: 50%;
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
  z-index: 999;
  position: relative;
  width: 100%;
  padding: 0 16px 0 10px;
  height: 100%;
  color: #737373;
  height: 44px;
  line-height: 44px;
  background: #fff;
  .his_search {
    position: fixed;
    width: 100%;
    top: 44px;
    height: 100%;
    background: #fff;
    z-index: 9;
    left: 0;
    font-size: 14px;

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
</style>


