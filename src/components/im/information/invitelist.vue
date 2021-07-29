<template>
  <div class="invitelist">
    <div class="invitetop">
      <span @click="$emit('close')">{{$h('取消')}}</span>
      <span>{{$h('选择好友')}}</span>
      <span :class="[checklist && checklist.length > 0?'active_btn':'']" @click="confirmadd">{{$h('完成')}}</span>
    </div>
    <div class="invitebox">
      <div class="box_top" v-show="checklist && checklist.length > 0">
        <img :src="$fnc.getImgUrl(item.avatar)" alt="" v-for="(item,i) in checklist" :key="i" @click="deluser(i)">
      </div>
      <div class="box_add">
        <van-checkbox-group v-model="checklist">
          <van-cell-group>
            <van-cell v-for="(item, i) in friendlist" clickable :key="i" @click="toggle(item,i)">
              <template #icon>
                <van-checkbox :name="item" ref="checkboxes" :disabled="item.is_team == true ?true:false" />
              </template>
              <template #title>
                <div class="userinfo">
                  <img :src="$fnc.getImgUrl(item.avatar)" alt="">
                  <span>{{item.nickname || item.username}}</span>
                </div>
              </template>
            </van-cell>

          </van-cell-group>
        </van-checkbox-group>
      </div>
    </div>
  </div>
</template>
<script>
import { Checkbox, CheckboxGroup } from 'vant';
export default {
  name: "invitelist",
  data () {
    return {
      friendlist: [],
      checklist: [],
    };
  },
  props: {
    //群id
    teamid: {
      type: [Number, String],
      default: null
    },
    //false 单人发起群聊   true 群里拉人
    isgroup: {
      type: Boolean,
      default: false
    }
  },
  components: {
    [Checkbox.name]: Checkbox,
    [CheckboxGroup.name]: CheckboxGroup,
  },
  created () {
    this.getfriend();
  },
  methods: {
    confirmadd () {
      if (this.checklist && this.checklist.length > 0) {

        if (this.isgroup == false) {
          var params = {};
          params.buddy = "";
          this.checklist.forEach((item, i) => {
            params.buddy = params.buddy + item.id + "@"
          });
          params.buddy = params.buddy.slice(0, -1);
          params.title = `${this.$store.state.user.nickname || this.$store.state.user.username || ''}创建的群聊`
          this.$api.getIm.create_team(params).then(res => {
            if (res.code == 200) {
              this.friendlist = res.result;
              this.$toast.success('创建成功')
              setTimeout(() => {
                this.$router.push('/im/imindex?active=clan')
              }, 1500);
            }
          })
        } else {
          var params = {};
          params.id = this.teamid;
          params.id_str = "";
          this.checklist.forEach((item, i) => {
            params.id_str = params.id_str + item.im_id + "@"
          });
          params.id_str = params.id_str.slice(0, -1);
          this.$api.getIm.pick_friend_inteam(params).then(res => {
            if (res.code == 200) {
              this.$toast.success('邀请成功');
              setTimeout(() => {
                this.$router.go(0);
              }, 1000);
            }
          })
        }
      }

    },

    deluser (index) {
      this.checklist.splice(index, 1)
    },

    getfriend () {
      var params = {};
      if (this.teamid) {
        params.id = this.teamid;
      }
      this.$api.getIm.imBuddyLists(params).then(res => {
        if (res.code == 200) {
          this.friendlist = res.result;
        }
      })
    },
    toggle (item, index) {
      if (!item.is_team == true) {
        this.$refs.checkboxes[index].toggle();
      }

    },
  },
}
</script>
<style lang="less" scoped>
.invitelist {
  width: 100%;
  height: 100%;
  background-color: #ffffff;
  display: flex;
  flex-flow: column;
  justify-content: flex-start;
  align-items: center;
  .invitetop {
    width: 100%;
    height: 50px;
    background-color: #ededed;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    > span:nth-of-type(1) {
      font-size: 16px;
      color: #101010;
      position: absolute;
      left: 13px;
    }
    > span:nth-of-type(2) {
      text-align: center;
      font-size: 16px;
      font-weight: bold;
      color: #121212;
    }
    > span:nth-of-type(3) {
      font-size: 14px;
      color: #b1b1b1;
      background-color: #e2e2e2;
      border-radius: 5px;
      padding: 2px 10px;
      position: absolute;
      right: 13px;
    }
    .active_btn {
      color: #ffffff !important;
      background-color: #07c160 !important;
    }
  }
  .invitebox {
    width: 100%;
    flex: 1;
    padding: 0 10px;
    overflow: auto;
    .box_top {
      width: 100%;
      display: flex;
      flex-wrap: nowrap;
      justify-content: flex-start;
      padding: 10px 0;
      align-items: center;
      border-bottom: 1px solid #eeeeee;
      overflow: auto;
      > img {
        width: 40px;
        border-radius: 10px;
        margin-right: 10px;
      }
    }
    .box_add {
      .van-cell {
        padding-left: 0;
        padding-right: 0;
      }
      .userinfo {
        width: 100%;
        display: flex;
        flex-wrap: nowrap;
        justify-content: flex-start;
        align-items: center;
        > img {
          width: 40px;
          height: 40px;
          margin: 0 10px;
          border-radius: 10px;
        }
      }
    }
  }
}
</style>