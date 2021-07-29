<template>
  <div class="im-team">
    <div class="con_teamlist">
      <div class="fx con_team" v-for="item in list" :key="item.id" @click="sub(info.types,item.id,item.im,item.title)">
        <img :src="$fnc.getImgUrl(item.avatar)" class="man" alt />
        <div class="team_info fx_3">
          <p class="p1">{{item.title}}</p>
          <div class="p2">
            <span class="s1">{{item.cate==0?$h('初级战队'):$h("高级战队")}}</span>
            <span class="s2">{{item.team_num}}{{$h('人')}}</span>
            <span class="s3">{{$h(item.is_open_cn)}}</span>
          </div>
          <p class="p3">{{item.slogan}}</p>
        </div>
        <div class="fx_1 team_btn team_btn_ym" v-if="item.is_join==1">{{$h('已满')}}</div>
        <div class="fx_1 team_btn" v-else @click="sub(info.types,item.id,item.im,item.is_join)">
          {{info.types==1 ?$h('取消申请'):(info.types==2?$h('已加入'):$h('申请加入'))}}</div>
      </div>
    </div>

    <van-popup v-model="show" class="hbdetails" :overlay="true" get-container="body" position="right">
      <create-team @close="getclose" v-if="show" />
    </van-popup>

    <van-icon name="plus" @click="onClickRight" class="fx createTeam" />
  </div>
</template>

<script>
import createTeam from "@/components/im/team/createTeam.vue";
export default {
  name: "team",
  components: {
    top,
    createTeam,
  },
  data () {
    return {
      info: {},
      list: [],
      show: false,
    };
  },
  methods: {
    sub (type, id, im, index) {
      if (type == 3 && index == 0) {
        this.joinTeam(id);
      } else if (type == 2) {
        console.log(index);
        var str = `/im/mes?id=GROUP${im}${index ? "&remark=" + index : ""}`;
      } else if (type == 1) {
        this.delJoin(id);
      }
    },
    joinTeam (id) {
      var that = this;
      that.$dialog
        .confirm({
          title: this.$h('加入战队'),
          message: this.$h('确认提交吗'),
        })
        .then(() => {
          that.$api.getIm.joinTeam({ id }).then((res) => {
            if (res.code == 200) {
              that.$toast.success(res.result);
              setTimeout(() => {
                this.mescroll.resetUpScroll();
              }, 3000);
            }
          });
        });
    },
    delJoin (id) {
      var that = this;
      that.$dialog
        .confirm({
          title: this.$h('提示'),
          message: this.$h('确认取消申请吗'),
        })
        .then(() => {
          that.$api.getIm.delJoin({ id }).then((res) => {
            if (res.code == 200) {
              that.$toast.success(res.result);
              setTimeout(() => {
                this.mescroll.resetUpScroll();
              }, 3000);
            }
          });
        });
    },
    getclose () {
      this.show = false;
      this.mescroll.resetUpScroll();
    },
    onClickRight () {
      this.show = true;
    },
    getList () {
      this.$api.getIm.getTeatList({}).then((res) => {
        if (res.code == 200) {
          this.list = res.result.lists.data;
          this.info = res.result;
        }
      });
    },
  },
  created () {
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
  background: #fff;
  overflow: auto;
  position: relative;
}
.createTeam {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: #ea1e43;
  position: fixed;
  right: 10px;
  bottom: 100px;
  color: #ffffff;
  font-size: 16px;
  justify-content: center;
}
.hbdetails {
  width: 100%;
  background: #fff !important;
  height: 100%;
  border-radius: 0 !important;
}
.con_teamlist {
  padding: 0 18px;
  font-size: 14px;
  > div.con_team {
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
      > .p1 {
        color: #4c4c4c;
        padding-bottom: 6px;
        font-weight: bold;
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
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
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
    border-top: 1px solid #ebebeb;
  }
}
</style>
