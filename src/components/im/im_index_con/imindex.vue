<template>
  <div class="imindex">
    <div class="tdgl_con_list" v-for="(item, index) in list" :key="index">
      <a class="fx" @click="toMsg('mes', item.im)">
        <div class="im-status">
          <img
            :src="
              $fnc.getImgUrl(item.avatar, 'sex') ||
              (item.sex == 2
                ? require('@/assets/img/member/sex2.png')
                : require('@/assets/img/member/sex1.png'))
            "
            class="tdgl_con_list_img1"
          />
          <span :class="{ isStatus: !item.im }"></span>
        </div>

        <div class="f_r tdgl_con_list_div1 fx_4">
          <div class="tdgl_con_list_div3">
            <span class="f_l">{{ item.nickname || item.username }}</span>
            <span class="f_r reg_time">{{
              $fnc.getTimeFormat(item.created_time)
            }}</span>
          </div>
          <div class="tdgl_con_list_div4">
            <span class="tdgl_con_list_span4 tdgl_con_list_div4_span">{{
              $h(item.rating_cn)
            }}</span>
            <span
              class="tdgl_con_list_span4 tdgl_con_list_div4_span"
              v-if="item.coin_rating_cn"
              >{{ item.coin_rating_cn }}</span
            >
            <span
              class="tdgl_con_list_span5 tdgl_con_list_div4_span"
              v-if="username != item.username"
              >团队:{{ item.coin_yvip || 0 }}</span
            >
          </div>
        </div>
      </a>
    </div>

    <div class="vippanel" v-if="list && list.length == 0">
      <div class="step">
        <div>
          <div class="img">
            <img src="@/assets/img/notice/3.png" alt="" />
          </div>
          <div class="word">邀请好友</div>
        </div>

        <div class="dot">
          <img src="@/assets/img/notice/dot.png" alt="" />
        </div>

        <div>
          <div class="img">
            <img src="@/assets/img/notice/2.png" alt="" />
          </div>
          <div class="word">好友注册下单</div>
        </div>

        <div class="dot">
          <img src="@/assets/img/notice/dot.png" alt="" />
        </div>

        <div>
          <div class="img">
            <img src="@/assets/img/notice/1.png" alt="" />
          </div>
          <div class="word">获得奖励</div>
        </div>
      </div>
      <div class="paragraph">这里空空的~好友下单你得奖励，快去邀请好友吧~</div>
      <div class="button">
        <van-button
          type="default"
          color="#ffd800"
          round
          @click="$router.push('/member/ewm')"
        >
          邀请好友
        </van-button>
      </div>
    </div>
  </div>
</template>


<script>
import { mapState } from "vuex";
import { List, Empty } from "vant";
export default {
  data() {
    return {
      list: [],
    };
  },
  components: {
    [List.name]: List,
    [Empty.name]: Empty,
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
  mounted() {
    this.onLoad();
  },
  methods: {
    toMsg(to, id) {
      var im = this.$store.state.config.plugin.imhyjsnt.is_open || "";
      if (id == "" || id == "null" || id == null) {
        this.$toast.fail("对方不在线");
        return false;
      }
      if (to == "mes" && im == 1) {
        this.$router.push("/im/mes?id=C2C" + id);
      } else {
        this.$toast.fail("敬请期待");
      }
    },
    onLoad() {
      this.$api.getUser.getZhiTui({ level: 1 }).then((res) => {
        if (res.code === 200) {
          this.list = res.result;
        }
      });
    },
  },
};
</script>


<style lang="less" scoped>
.imindex {
  width: 100%;
  height: 100%;
  box-sizing: border-box;

  .reg_time {
    font-size: 12px;
    color: #b1b1b1;
  }

  .tdgl_con_list {
    width: 100%;
    border-bottom: solid 1px #f9f9f9;
    padding: 16px 10px;
    background: #fff;
    border-radius: 10px;

    .tdgl_con_list_img1 {
      width: 50px;
      height: 50px;
      border-radius: 10px;
    }
    .tdgl_con_list_div1 {
      width: 250px;
      height: 56px;
      justify-content: center;
      display: flex;
      flex-direction: column;
      padding-left: 20px;
    }
    .tdgl_con_list_div2 {
      color: #999999;
      height: 11px;
      line-height: 11px;
      font-size: 11px;
    }
    .tdgl_con_list_div3 {
      color: #313131;
      line-height: 13px;
      font-size: 15px;
      padding-bottom: 4px;
    }
    .tdgl_con_list_span1 {
      color: #999999;
      font-size: 11px;
    }
    .tdgl_con_list_div4 {
      line-height: 16px;
      font-size: 12px;
      margin-top: 4px;
    }
    .tdgl_con_list_div4_span {
      display: inline-block;
      padding: 3px 10px;
      border-radius: 5px;
      text-align: center;
      margin-right: 5px;
      font-size: 12px;
      color: #fff;
    }
    .tdgl_con_list_span2 {
      background-color: #fd77b9;
    }
    .tdgl_con_list_span3 {
      background-color: #6ec4e9;
    }
    .tdgl_con_list_span4 {
      background-color: #ffb500;
    }
    .tdgl_con_list_span5 {
      background-color: #9867ff;
    }
    .tdgl_con_list_img2 {
      height: 13px;
      width: 13px;
      vertical-align: middle;
    }
  }
}

.vippanel {
  background-color: #fff;
  border-radius: 10px;
  padding: 50px 0;
  height: 100%;

  .step {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 24px;
    .dot {
      position: relative;
      top: -8px;
      width: 28px;
      height: 9px;
      > img {
        width: 100%;
      }
    }
    > div {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .img {
        position: relative;
        width: 65px;
        height: 65px;
        > img {
          width: 100%;
        }
      }
      > div:last-of-type {
        margin-top: 15px;
        font-size: 12px;
        line-height: 12px;
        color: #edb04b;
      }
    }
  }
  .paragraph {
    margin: 0 auto;
    margin-top: 28px;
    font-size: 13px;
    line-height: 15px;
    text-align: center;
    width: 210px;
    color: #77757b;
  }
  .button {
    margin-top: 36px;
    display: flex;
    justify-content: center;
    /deep/.van-button {
      height: 42px;
      width: 158px;

      .van-button__content {
        font-size: 16px;
        line-height: 16px;
        font-weight: 600;
        color: black;
      }
    }
  }
}
</style>