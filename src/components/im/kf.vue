<template>
  <div class="bgwrite">
    <div class="im-com">
      <van-nav-bar title="客服" left-arrow class="navbar" @click-left="toBack" />
    </div>
    <div class="tdgl_con im_com">
      <div class="tdgl_con_list" v-for="(item, index) in kf_list" :key="index">
        <router-link :to="'/im/mes?id=C2C' + item.im" class="fx">
          <div class="avter fx_1">
            <img src="../../assets/img/im/laoshi.png" class="tdgl_con_list_img1" />
            <span class="unread" v-if="item.unread > 0">{{ item.unread }}</span>
          </div>
          <div class="tdgl_con_list_div1 fx_4">
            <div class="tdgl_con_list_div3">
              <span class="f_l">{{ item.nick_name || item.username }}</span>
              <span class="f_r tdgl_con_list_span1">{{
                item.MsgTimeStamp
              }}</span>
            </div>
            <div class="tdgl_con_list_div4"></div>
            <div class="tdgl_con_list_div2 hid_text">{{ item.MsgShow }}</div>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  data () {
    return {
      kfList: [],
      loadModal: false,
      im: "",
      im_sig: "",
    };
  },
  components: {},
  computed: {
    ...mapState({
      conversationList: (state) => state.conversation.conversationList,
    }),
    kf_list () {
      let arr = this.kfList || [];
      if (this.conversationList && this.conversationList.length > 0) {
        for (let j in this.conversationList) {
          for (let i in arr) {
            if ("C2C" + arr[i].im == this.conversationList[j].conversationID) {
              arr[i].unread = this.conversationList[j].unreadCount;
            }
          }
        }
      }
      return arr;
    },
  },
  methods: {
    getUser () {
      this.$api.getUser.getKfList({}).then((res) => {
        if (res.status === 1) {
          this.kfList = res.result.service;
        }
      });
    },
  },
  created () {
    this.getUser();
    this.im = this.$store.state.user.im;
    this.im_sig = this.$store.state.user.im_sig;
  },
};
</script>
<style scoped>
.tab_h {
  color: #000;
  font-size: 16px;
  font-weight: bold;
}
.level_ac {
  color: #0018ab;
}
.reg_time {
  font-size: 12px;
  color: #b1b1b1;
}
.tdgl_con {
  margin-top: 5px;
  width: 100%;
  padding: 0 17px 2px;
  background-color: #fff;
}
.tdgl_con_top {
  border-bottom: solid 1px #ebebeb;
  height: 75px;
  padding: 36px 0;
}
.tdgl_con_top_div1 {
  color: #4c4c4c;
  font-size: 16px;
  height: 16px;
  line-height: 16px;
}
.tdgl_con_top_div2 {
  color: #999999;
  font-size: 12px;
  height: 12px;
  line-height: 12px;
  margin-top: 12px;
}
.tdgl_con_top_img1 {
  height: 14px;
  margin-top: 13px;
  width: 8px;
}
.tdgl_con_top_img2 {
  width: 34px;
  height: 34px;
  border: solid 2px #fff;
  border-radius: 50%;
}
.tdgl_con_top_div3 {
  border: solid 1px #c9cdd9;
  width: 36px;
  height: 37px;
  border-radius: 50%;
  position: relative;
  margin-right: -6px;
  background-color: #fff;
}
.tdgl_con_tx {
  margin-right: 13px;
}
.tdgl_con_list {
  width: 100%;
  border-bottom: solid 1px #f9f9f9;
  padding: 16px 0;
}
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
  color: #fff;
  margin-top: 4px;
}
.tdgl_con_list_div4_span {
  display: inline-block;
  padding: 3px 10px;
  border-radius: 5px;
  text-align: center;
  margin-right: 5px;
  font-size: 12px;
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
.im-com {
  /* position: fixed; */
  width: 100%;
  /* height: 140px; */
}
.bgwrite {
  height: 100%;
}
.unread {
  font-size: 10px;
  width: 15px;
  height: 15px;
  padding: 2px;
  border-radius: 50%;
  background-color: #ee0a24;
  color: #ffffff;
  position: absolute;
  left: 40px;
  top: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>