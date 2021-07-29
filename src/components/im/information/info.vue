<template>
  <div class="im_mesinfo">
    <van-nav-bar left-text left-arrow class="navbar" :title="$h('聊天详情')" @click-left="$emit('close')">
    </van-nav-bar>
    <div class="im_mesinfo_body">
      <div class="mesinfo_top">
        <div class="mesinfo_topitem">
          <img :src="$fnc.getImgUrl(info.avatar)" alt="">
          <span>{{info.nickname || info.username || toAccount}}</span>
        </div>
        <div class="mesinfo_topitem" @click="inviteshow = true" v-if="$store.state.config.shop.bteam_group ==1">
          <van-icon name="plus" />
        </div>
      </div>
      <div class="mesinfo_content">
        <div class="mesinfo_part">
          <div>
            <div class="mesinfo_part_form" @click="openremark">
              <span><b></b>{{$h('设置备注')}}</span>
              <van-field :value="info.remark" input-align="right" disabled="" :placeholder="$h('请输入备注')" />
            </div>
            <van-dialog v-model="diashow" :title="$h('设置备注')" show-cancel-button @confirm="remark_blur">
              <van-field v-model="new_remark" input-align="left" :label="$h('备注')" :placeholder="$h('请输入备注')" />
            </van-dialog>
          </div>
        </div>
      </div>
    </div>
    <van-popup v-model="inviteshow" position="right" :style="{width:'100%', height: '100%' }">
      <invitelist @close="inviteshow =false"></invitelist>
    </van-popup>

  </div>
</template>
<script>
import { mapGetters, mapState } from "vuex";
import { Field, Popup, Dialog, } from 'vant';
import invitelist from '@/components/im/information/invitelist'
export default {
  name: "im_mesinfo",
  data () {
    return {
      diashow: false,
      info: {},
      inviteshow: false,
      new_remark: '',
      remark: '',
    };
  },
  components: {
    [Field.name]: Field,
    [Popup.name]: Popup,
    [Dialog.name]: Dialog,
    invitelist,
  },
  props: {
    info: {
      type: Object,
      default: () => ({})
    },
    name: {
      type: String,
      default: '',
    }
  },

  created () {
    // this.getinfo()
  },
  computed: {
    ...mapGetters(["toAccount", "currentConversationType"]),
    ...mapState({
      currentConversation: state => state.conversation.currentConversation,
    }),
    // info () {
    //   if (this.currentConversation.userProfile) {
    //     return this.currentConversation.userProfile;
    //   } else {
    //     return {
    //       nick: this.toAccount,
    //       avatar: ''
    //     }
    //   }
    // },
  },
  methods: {
    openremark () {
      this.new_remark = ""
      this.diashow = true;
    },
    getinfo () {
      var id = this.$route.query.id;
      id = id.replace('C2C', '')
      this.$api.getIm.get_frinedinfo({ id: id }).then(res => {
        if (res.code == 200) {
          this.info = res.result;
          this.remark = res.result.remark || ''
        } else {
          this.$toast.fail(res.result)
        }
      })
    },
    //修改备注
    remark_blur () {
      var id = this.$route.query.id;
      id = id.replace('C2C', '')
      var params = {
        id: id,
        remark: this.new_remark
      };
      this.$api.getIm.edit_remark(params).then(res => {
        if (res.code == 200) {
          this.$toast.success('编辑备注成功')
          this.remark = this.new_remark;
          setTimeout(() => {
            this.$router.push('/im/imindex?active=news')
          }, 1000);
          // if (!this.$route.query.remark) {
          //   var str = this.$route.fullPath + "&remark=" + this.remark
          //   this.$router.push(str)
          // } else {
          //   var query = this.$route.query;
          //   query.remark = this.remark;
          //   this.$router.push({ path: this.$route.path, query: query })
          // }
        }
      })
    },
  },
}
</script>
<style lang="less" scoped>
.im_mesinfo {
  width: 100%;
  height: 100%;
  background-color: #ededed;
  display: flex;
  flex-flow: column;
  justify-content: flex-start;
  align-items: center;
  > div {
    width: 100%;
  }
  .im_mesinfo_body {
    width: 100%;
    flex: 1;
    overflow: auto;

    .mesinfo_top {
      width: 100%;
      padding: 15px 10px 5px 10px;
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-start;
      background-color: #ffffff;
      .mesinfo_topitem {
        padding: 0 10px;
        width: 20%;
        font-size: 10px;
        display: flex;
        flex-flow: column;
        justify-content: flex-start;
        align-items: center;
        overflow: hidden;
        margin-bottom: 10px;

        > img {
          width: 100%;
          border-radius: 5px;
        }
        > .van-icon {
          width: 100%;
          // height: calc(width);
          font-size: 24px;
          color: #b6b6b6;
          border: 2px dashed #eeeeee;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 10px;
          border-radius: 5px;
        }
        > span {
          width: 100%;
          color: #828282;
          font-size: 12px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          text-align: center;
        }
      }
    }
    .mesinfo_content {
      width: 100%;
      display: flex;
      flex-flow: column;
      justify-content: flex-start;
      align-items: center;
      .mesinfo_part {
        width: 100%;
        background-color: #ffffff;
        margin-top: 10px;
        display: flex;
        flex-flow: column;
        justify-content: flex-start;
        align-items: center;
        > div {
          width: 100%;
          .mesinfo_part_form {
            width: 100%;
            height: 50px;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            border-bottom: 1px solid #eeeeee;
            > span {
              font-size: 15px;
              font-weight: bold;
              color: #181818;
              padding-left: 20px;
            }
            .van-cell {
              flex: 1;
            }
          }
        }
      }
    }
  }
}
</style>