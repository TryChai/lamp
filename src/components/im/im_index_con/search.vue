<template>
  <div class="imsearch">
    <searchead @setSearch="getSearch" />

    <div class="imsearch_con_list" v-if="item && item.id">
      <div class="fx">
        <div class="im-status">
          <img
            :src="
              $fnc.getImgUrl(item.avatar, 'sex') ||
              (item.sex == 2
                ? require('@/assets/img/member/sex2.png')
                : require('@/assets/img/member/sex1.png'))
            "
            class="imsearch_con_list_img1"
          />
          <span :class="{ isStatus: !item.im }"></span>
        </div>

        <div class="f_r imsearch_con_list_div1 fx_4">
          <div class="imsearch_con_list_div3">
            <span class="f_l">{{ item.nickname || item.username }}</span>
          </div>
          <div class="imsearch_con_list_div4">
            <span class="imsearch_con_list_span4 imsearch_con_list_div4_span">{{
              item.rating_cn
            }}</span>
            <span
              class="imsearch_con_list_span4 imsearch_con_list_div4_span"
              v-if="item.coin_rating_cn"
              >{{ item.coin_rating_cn }}</span
            >
          </div>
        </div>

        <div class="imsearch_con_list_div2" @click="addHaoYou">+好友</div>
      </div>
    </div>
  </div>
</template>


<script>
import searchead from "./search-head.vue";
import { mapState } from "vuex";
export default {
  components: {
    searchead,
  },
  data() {
    return {
      item: {},
      title: "",
    };
  },
  computed: {
    ...mapState({
      user: (state) => state.user,
    }),
  },
  methods: {
    addHaoYou() {
      var params = {};
      params.id = this.item.id;
      this.$api.getIm.imBuddyApplications(params).then((res) => {
        if (res.code == 200) {
          this.$toast.success(res.result);
          setTimeout(() => {
            this.getSearchList();
          }, 1500);
        }
      });
    },
    getSearch(obj) {
      this.title = obj.title;
      this.getSearchList();
    },
    getSearchList() {
      var params = {};
      params.title = this.title;
      this.$api.getIm.imBuddySearch(params).then((res) => {
        if (res.code == 200) {
          if (res.result && res.result.id) {
            if (this.user.id == res.result.id) {
              this.item = {};
              this.$toast.fail("不能搜索自己");
            } else {
              this.item = res.result;
            }
          } else {
            this.item = {};
            this.$toast.fail("暂无该用户");
          }
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.imsearch {
  height: 100%;
  height: 100%;
  background: #f4f4f4;
  overflow: auto;

  .imsearch_con_list {
    width: 100%;
    border-bottom: solid 1px #f9f9f9;
    padding: 16px 10px;
    background: #ffffff;
    margin: 10px auto;
  }
  .imsearch_con_list_img1 {
    width: 50px;
    height: 50px;
    border-radius: 10px;
  }
  .imsearch_con_list_div1 {
    width: 250px;
    height: 56px;
    justify-content: center;
    display: flex;
    flex-direction: column;
    padding-left: 20px;
  }
  .imsearch_con_list_div2 {
    color: #ffffff;
    font-size: 14px;
    padding: 2px 16px;
    background: #46bcf9;
    border-radius: 5px;
  }
  .imsearch_con_list_div3 {
    color: #313131;
    line-height: 13px;
    font-size: 15px;
    padding-bottom: 4px;
  }
  .imsearch_con_list_span1 {
    color: #999999;
    font-size: 11px;
  }
  .imsearch_con_list_div4 {
    line-height: 16px;
    font-size: 12px;
    margin-top: 4px;
  }
  .imsearch_con_list_div4_span {
    display: inline-block;
    padding: 3px 10px;
    border-radius: 5px;
    text-align: center;
    margin-right: 5px;
    font-size: 12px;
  }
  .imsearch_con_list_span2 {
    background-color: #fd77b9;
  }
  .imsearch_con_list_span3 {
    background-color: #6ec4e9;
  }
  .imsearch_con_list_span4 {
    background-color: #ffb500;
  }
  .imsearch_con_list_img2 {
    height: 13px;
    width: 13px;
    vertical-align: middle;
  }
}
</style>
