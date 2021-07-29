<template>
  <div class="imlately">
    <p class="imlately_p" @click="show_check = true">
      审核申请
      <span class="unread" v-if="buddy_num > 0"></span>
    </p>

    <van-list v-model="loading" :finished="finished" @load="onLoad">
      <van-swipe-cell
        class="imlately_con_list"
        v-for="(item, index) in list"
        :key="index"
      >
        <div
          class="fx imlately_con_list_a"
          @click="toMsg('mes', item.im, item.id, item.remark)"
        >
          <div class="im-status">
            <img
              :src="
                $fnc.getImgUrl(item.avatar, 'sex') ||
                (item.sex == 2
                  ? require('@/assets/img/member/sex2.png')
                  : require('@/assets/img/member/sex1.png'))
              "
              class="imlately_con_list_img1"
            />
            <span :class="{ isStatus: !item.im }"></span>
          </div>

          <div class="f_r imlately_con_list_div1 fx_4">
            <div class="imlately_con_list_div3">
              <span class="f_l">{{
                item.remark || item.nickname || item.username
              }}</span>
              <span class="f_r reg_time">{{
                $fnc.getTimeFormat(item.created_time)
              }}</span>
            </div>
            <div class="imlately_con_list_div4">
              <span
                class="imlately_con_list_span4 imlately_con_list_div4_span"
                >{{ $h(item.rating_cn) }}</span
              >
              <span
                class="imlately_con_list_span4 imlately_con_list_div4_span"
                v-if="item.coin_rating_cn"
                >{{ item.coin_rating_cn }}</span
              >
              <span
                class="imlately_con_list_span5 imlately_con_list_div4_span"
                v-if="username != item.username"
                >{{ $h("团队") }}:{{ item.coin_yvip || 0 }}</span
              >
            </div>
          </div>
        </div>
        <template #right>
          <van-button
            square
            type="danger"
            :text="$h('删除')"
            style="height: 100%"
            @click="delFriend(item)"
          />
        </template>
      </van-swipe-cell>
    </van-list>

    <div class="fx imlately_empty" v-if="list && list.length == 0 && !loading">
      <van-empty description="这里空空的~快去搜索添加好友吧~" />
    </div>

    <van-popup
      v-model="show_check"
      position="bottom"
      get-container="body"
      :style="{ height: '80%' }"
    >
      <imcheck v-if="show_check" @colse="show_check = false" />
    </van-popup>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { List, Empty, SwipeCell } from "vant";
import imcheck from "@/components/im//im_index_con/check";
export default {
  data() {
    return {
      list: [],
      page: 1,
      page_size: 20,
      loading: false,
      finished: false,
      show_check: false,
    };
  },
  props: {
    buddy_num: {
      type: [String, Number],
      default: "",
    },
  },
  components: {
    [SwipeCell.name]: SwipeCell,
    [Empty.name]: Empty,
    [List.name]: List,
    imcheck,
  },
  computed: {
    ...mapState({
      user: (state) => state.user,
    }),
    username() {
      if (this.user.tid == "0") {
        return "";
      } else {
        return this.user.tid_cn && this.user.tid_cn.username != ""
          ? this.user.tid_cn.username
          : "";
      }
    },
  },
  watch: {
    show_check(val) {
      if (!val) {
        this.$emit("reset");
      }
    },
  },
  mounted() {
    this.onLoad();
  },
  methods: {
    toMsg(to, im_id, imid, remark) {
      var im = this.$store.state.config.plugin.imhyjsnt.is_open || ""; //聊天功能
      if (im_id == "" || im_id == "null" || im_id == null) {
        this.$toast.fail(this.$h("对方不在线"));
        return false;
      }
      if (to == "mes" && im == 1) {
        var str = `/im/mes?id=C2C${im_id}&imid=${imid}${
          remark ? "&remark=" + remark : ""
        }`;
        this.$router.push(str);
      } else {
        this.$toast.fail(this.$h("敬请期待"));
      }
    },
    delFriend(val) {
      var that = this;
      that.$dialog
        .confirm({ message: "是否确认删除该好友" })
        .then(() => {
          that.$api.getIm.imBuddyDel({ id: val.id }).then((res) => {
            if (res.code == 200) {
              that.$toast.success(this.$h("删除成功"));
              setTimeout(() => {
                that.reset();
              }, 1500);
            }
          });
        })
        .catch(() => {});
    },
    reset() {
      this.page = 1;
      this.loading = false;
      this.finished = false;
      this.onLoad();
    },
    onLoad() {
      var params = {};
      this.loading = true;
      params.page = this.page;
      params.page_size = this.page_size;

      this.$api.getIm.imBuddyLists(params).then((res) => {
        if (res.code == 200) {
          if (this.page === 1) this.list = [];
          let arr = res.result;
          this.list = this.list.concat(arr);
          if (res.result && res.result.length == this.page_size) {
            this.page++;
          } else {
            this.finished = true;
          }
          this.loading = false;
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.imlately {
  width: 100%;
  height: 100%;
  box-sizing: border-box;

  .reg_time {
    font-size: 12px;
    color: #b1b1b1;
  }

  .imlately_p {
    width: 100%;
    text-align: right;
    font-size: 12px;
    color: #1989fa;
    padding: 0 10px 5px;
    position: relative;

    .unread {
      width: 6px;
      height: 6px;
      border-radius: 100%;
      background: #ee0a24;
      position: absolute;
      right: 6px;
      top: 0px;
      display: inline-block;
    }
  }

  .imlately_empty {
    border-radius: 10px;
    background: #fff;
    padding: 0 10px;
    height: 100%;
    justify-content: center;
  }

  .van-list {
    border-radius: 10px;
    background: #fff;
    padding: 0 10px;
  }

  .imlately_con_list {
    width: 100%;
    border-bottom: solid 1px #f9f9f9;

    .imlately_con_list_a {
      padding: 16px 0;
    }
    .imlately_con_list_img1 {
      width: 50px;
      height: 50px;
      border-radius: 10px;
    }
    .imlately_con_list_div1 {
      width: 250px;
      height: 56px;
      justify-content: center;
      display: flex;
      flex-direction: column;
      padding-left: 20px;
    }
    .imlately_con_list_div2 {
      color: #999999;
      height: 11px;
      line-height: 11px;
      font-size: 11px;
    }
    .imlately_con_list_div3 {
      color: #313131;
      line-height: 13px;
      font-size: 15px;
      padding-bottom: 4px;
    }
    .imlately_con_list_span1 {
      color: #999999;
      font-size: 11px;
    }
    .imlately_con_list_div4 {
      line-height: 16px;
      font-size: 12px;
      margin-top: 4px;
    }
    .imlately_con_list_div4_span {
      display: inline-block;
      padding: 3px 10px;
      border-radius: 5px;
      text-align: center;
      margin-right: 5px;
      font-size: 12px;
      color: #fff;
    }
    .imlately_con_list_span2 {
      background-color: #fd77b9;
    }
    .imlately_con_list_span3 {
      background-color: #6ec4e9;
    }
    .imlately_con_list_span4 {
      background-color: #ffb500;
    }
    .imlately_con_list_span5 {
      background-color: #9867ff;
    }
    .imlately_con_list_img2 {
      height: 13px;
      width: 13px;
      vertical-align: middle;
    }
  }
}
</style>