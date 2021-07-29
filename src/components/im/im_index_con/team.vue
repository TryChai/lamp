<template>
  <div class="im-team">
    <p class="im-team-p" @click="onClickRight">创建战队</p>
    <div class="con_teamlist">
      <van-swipe-cell v-for="item in list" :key="item.id">
        <template #right>
          <van-button
            square
            type="danger"
            :text="$h('退出战队')"
            style="margin: auto 0"
            @click="outTeam(item.id)"
          />
        </template>
        <div
          class="fx con_team"
          @click="sub(item.types, item.id, item.im, item.title)"
        >
          <img :src="$fnc.getImgUrl(item.avatar)" class="man" alt />
          <div class="team_info fx_3">
            <p class="p1">{{ $h(item.title) }}</p>
            <div class="p2">
              <span class="s1">{{
                item.cate == 0 ? $h("初级战队") : $h("高级战队")
              }}</span>
              <span class="s2">{{ item.team_num }}{{ $h("人") }}</span>
              <span class="s3">{{ $h(item.is_open_cn) }}</span>
            </div>
            <p class="p3">{{ $h(item.slogan) }}</p>
          </div>

          <div class="fx_1 team_btn team_btn_ym" v-if="item.is_join == 1">
            {{ $h("已满") }}
          </div>
          <div
            class="fx_1 team_btn"
            v-else
            @click="sub(item.types, item.id, item.im, item.is_join)"
          >
            <span v-if="item.types == 0">{{ $h("申请中") }}</span>
            <span v-else-if="item.types == 1">{{ $h("已加入") }}</span>
            <span v-else-if="item.types == 2">{{ $h("拒绝") }}</span>
            <span v-else-if="nowtypes == 3">{{ $h("申请加入") }}</span>
          </div>
        </div>
      </van-swipe-cell>
    </div>

    <div class="fx im-team-empty" v-if="list && list.length == 0 && !loading">
      <van-empty description="这里空空的~快去创建战队吧~" />
    </div>

    <van-popup
      v-model="show"
      class="hbdetails"
      :overlay="true"
      get-container="body"
      position="right"
    >
      <create-team @close="getclose" v-if="show" />
    </van-popup>
  </div>
</template>

<script>
import createTeam from "@/components/im/team/createTeam.vue";
import { SwipeCell, Empty } from "vant";
export default {
  name: "team",
  components: {
    createTeam,
    [SwipeCell.name]: SwipeCell,
    [Empty.name]: Empty,
  },
  data() {
    return {
      info: {},
      list: [],
      show: false,
      nowtypes: null,
    };
  },
  methods: {
    sub(type, id, im, index) {
      console.log(type);
      if (type == 2 && index == 0) {
        this.joinTeam(id);
      } else if (type == 1) {
        var str = `/im/mes?id=GROUP${im}${index ? "&remark=" + index : ""}`;
        this.$router.push(str);
      } else if (type == 0) {
        this.delJoin(id);
      } else if (this.nowtypes == 3) {
        this.joinTeam(id);
      }
    },
    delJoin(id) {
      var that = this;
      that.$dialog
        .confirm({
          title: this.$h("提示"),
          message: this.$h("确认取消申请吗"),
        })
        .then(() => {
          that.$api.getIm.delJoin({ id }).then((res) => {
            if (res.code == 200) {
              that.$toast.success(res.result);
              setTimeout(() => {
                this.getList();
              }, 3000);
            }
          });
        });
    },
    getclose() {
      this.show = false;
      this.getList();
    },
    onClickRight() {
      this.show = true;
    },
    joinTeam(id) {
      var that = this;
      that.$dialog
        .confirm({
          title: this.$h("加入战队"),
          message: this.$h("确认提交吗"),
        })
        .then(() => {
          that.$api.getIm.joinTeam({ id }).then((res) => {
            if (res.code == 200) {
              that.$toast.success(res.result);
              setTimeout(() => {
                this.getList();
              }, 3000);
            }
          });
        });
    },
    outTeam(id) {
      var that = this;
      that.$dialog
        .confirm({
          title: this.$h("操作"),
          message: this.$h("确认退出战队吗"),
        })
        .then(() => {
          var params = {};
          params.id = id;
          that.$api.getIm.exit_team(params).then((res) => {
            if (res.code == 200) {
              that.$toast.success(res.result);
              if (this.mescroll) {
                this.getList();
              }
            }
          });
        });
    },
    joinTeam(id) {
      var that = this;
      that.$dialog
        .confirm({
          title: this.$h("加入战队"),
          message: this.$h("确认提交吗"),
        })
        .then(() => {
          that.$api.getIm.joinTeam({ id }).then((res) => {
            if (res.code == 200) {
              that.$toast.success(res.result);
              setTimeout(() => {
                this.getList();
              }, 3000);
            }
          });
        });
    },
    delJoin(id) {
      var that = this;
      that.$dialog
        .confirm({
          title: this.$h("提示"),
          message: this.$h("确认取消申请吗"),
        })
        .then(() => {
          that.$api.getIm.delJoin({ id }).then((res) => {
            if (res.code == 200) {
              that.$toast.success(res.result);
              setTimeout(() => {
                this.getList();
              }, 3000);
            }
          });
        });
    },
    getclose() {
      this.show = false;
      this.mescroll.resetUpScroll();
    },
    onClickRight() {
      this.show = true;
    },
    getList() {
      this.$api.getIm
        .getTeatList({ title: this.$route.query.title || "" })
        .then((res) => {
          if (res.code == 200) {
            this.list = res.result.lists.data;
            this.nowtypes = res.result.types;
          }
        });
    },
  },
  created() {
    this.getList();
  },
};
</script>

<style lang="less" scoped>
.im-team {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  box-sizing: border-box;

  .im-team-p {
    width: 100%;
    text-align: right;
    font-size: 12px;
    color: #1989fa;
    padding: 0 10px 5px;
  }

  .im-team-empty {
    border-radius: 10px;
    background: #fff;
    padding: 0 10px;
    height: 100%;
    justify-content: center;
  }

  .con_teamlist {
    padding: 0 10px;
    font-size: 14px;
    background: #fff;
    border-radius: 10px;
    div.con_team {
      justify-content: flex-start;
      padding: 16px 0;
      .man {
        width: 56px;
        height: 56px;
        border-radius: 4px;
      }
      .team_info {
        padding-left: 16px;
        line-height: 1;
        overflow: hidden;

        > .p1 {
          color: #4c4c4c;
          padding-bottom: 6px;
          font-weight: bold;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          line-height: 1.2;
        }
        > .p2 {
          color: #fff;
          margin-bottom: 6px;

          > span {
            padding: 3px 7px;
            border-radius: 27px;
            font-size: 12px;
            display: inline-block;
          }
          .s1 {
            background: #fd77b9;
          }
          .s2 {
            background: #ffb500;
            margin-left: 6px;
          }
          .s3 {
            background: #9867ff;
            margin-left: 6px;
          }
        }
        .p3 {
          color: #999;
          font-size: 11px;
          line-height: 1.4;
          padding-right: 5px;
        }
      }
      .team_btn {
        width: 80px;
        height: 32px;
        line-height: 2.8;
        text-align: center;
        color: #fff;
        border-radius: 5px;
        background: #46bdf9;
        font-size: 12px;
      }
      .team_btn_ym {
        background: #ccc !important;
      }
    }
    > div:not(:first-child) {
      border-top: 1px solid #f4f4f4;
    }
  }
}
.hbdetails {
  width: 100%;
  background: #fff !important;
  height: 100%;
  border-radius: 0 !important;
}
</style>
