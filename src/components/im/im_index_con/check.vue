<template>
  <div class="imcheck">
    <van-nav-bar
      title="审核列表"
      left-text
      left-arrow
      class="navbar"
      @click-left="$emit('colse')"
    />
    <van-list v-model="loading" :finished="finished" @load="onLoad">
      <div class="imcheck_con_list" v-if="list && JSON.stringify(list) != '[]'">
        <div class="fx" v-for="(item, index) in list" :key="index">
          <div class="im-status">
            <img
              :src="
                $fnc.getImgUrl(item.avatar, 'sex') ||
                (item.sex == 2
                  ? require('@/assets/img/member/sex2.png')
                  : require('@/assets/img/member/sex1.png'))
              "
              class="imcheck_con_list_img1"
            />
            <span :class="{ isStatus: !item.im }"></span>
          </div>

          <div class="f_r imcheck_con_list_div1 fx_4">
            <div class="imcheck_con_list_div3">
              <span class="f_l">{{ item.nickname || item.username }}</span>
            </div>
            <div class="imcheck_con_list_div4">
              <span class="imcheck_con_list_span4 imcheck_con_list_div4_span">{{
                $h(item.rating_cn)
              }}</span>
              <span
                class="imcheck_con_list_span4 imcheck_con_list_div4_span"
                v-if="item.coin_rating_cn"
                >{{ item.coin_rating_cn }}</span
              >
            </div>
          </div>

          <div class="imcheck_con_list_div5" v-if="item.types == 1">
            {{ $h("已验证") }}
          </div>
          <div
            class="imcheck_con_list_div5"
            v-else-if="item.types == 0 && item.uid == user.id"
          >
            {{ $h("等待验证") }}
          </div>
          <div class="imcheck_con_list_div2" v-else @click="addHaoYou(item.id)">
            {{ $h("通过验证") }}
          </div>
        </div>
      </div>
    </van-list>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { List, Empty } from "vant";
export default {
  data() {
    return {
      page_size: 10,
      page: 1,
      loading: false,
      finished: false,
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
  },
  methods: {
    addHaoYou(id) {
      var params = {};
      params.id = id;
      this.$api.getIm.imBuddyBy(params).then((res) => {
        if (res.code == 200) {
          this.$toast.success("验证通过");
          setTimeout(() => {
            this.reset();
          }, 1500);
        }
      });
    },
    reset() {
      this.page = 1;
      this.loading = false;
      this.finished = false;
      this.onLoad();
    },
    onLoad() {
      var params = {};
      params.page = this.page;
      params.page_size = this.page_size;

      this.$api.getIm.imBuddyAudits(params).then((res) => {
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

<style scoped lang='less'>
.imcheck {
  width: 100%;
  height: 100%;
  overflow: auto;
  font-size: 14px;
  position: relative;

  .imcheck_con_list {
    width: 100%;
    border-bottom: solid 1px #f9f9f9;
    padding: 0 10px;
    background: #ffffff;
    > div {
      padding: 16px 0;
    }
  }
  .imcheck_con_list_img1 {
    width: 50px;
    height: 50px;
    border-radius: 10px;
  }
  .imcheck_con_list_div1 {
    width: 250px;
    height: 56px;
    justify-content: center;
    display: flex;
    flex-direction: column;
    padding-left: 20px;
  }
  .imcheck_con_list_div2 {
    color: #ffffff;
    font-size: 14px;
    padding: 2px 12px;
    background: #46bcf9;
    border-radius: 5px;
  }
  .imcheck_con_list_div5 {
    color: #a09c9c;
    font-size: 14px;
    padding: 2px 16px;
  }
  .imcheck_con_list_div3 {
    color: #313131;
    line-height: 13px;
    font-size: 15px;
    padding-bottom: 4px;
  }
  .imcheck_con_list_span1 {
    color: #999999;
    font-size: 11px;
  }
  .imcheck_con_list_div4 {
    line-height: 16px;
    font-size: 12px;
    // color: #fff;
    margin-top: 4px;
  }
  .imcheck_con_list_div4_span {
    display: inline-block;
    padding: 3px 10px;
    border-radius: 5px;
    text-align: center;
    margin-right: 5px;
    font-size: 12px;
  }
  .imcheck_con_list_span2 {
    background-color: #fd77b9;
  }
  .imcheck_con_list_span3 {
    background-color: #6ec4e9;
  }
  .imcheck_con_list_span4 {
    background-color: #ffb500;
  }
  .imcheck_con_list_img2 {
    height: 13px;
    width: 13px;
    vertical-align: middle;
  }
}
</style>