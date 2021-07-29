<template>
  <div>
    <!-- 撤销功能 -->
    <img src="@/assets/img/im/revoke.png" width="20px" style="margin-right:10px" v-if="is_apply === true" @click="revoke" />
  </div>
</template>
<script>
import { Dialog } from 'vant'
export default {
  name: "revokebtn",
  data () {
    return {
      timer: null,//定义一个定时器的变量
      currentTime: '', // 获取当前时间
    };
  },

  computed: {
    is_apply () {
      if (Number(this.currentTime) - this.message.time * 1000 >= 60000) {
        if (this.timer) {
          clearInterval(this.timer); // 在Vue实例销毁前，清除我们的定时器
        }
        return false
      } else {
        return true
      }
    },
  },
  props: {
    message: {
      type: Object,
      default: () => {

      }

    }
  },
  components: {
    [Dialog.name]: Dialog
  },
  created () {
    var _this = this; //声明一个变量指向Vue实例this，保证作用域一致
    this.timer = setInterval(() => {
      _this.currentTime = new Date().getTime()
    })
  },
  beforeDestroy () {
    if (this.timer) {
      clearInterval(this.timer); // 在Vue实例销毁前，清除我们的定时器
    }
  },
  methods: {
    revoke (val) {
      Dialog.confirm({
        title: '是否确认撤回该条消息',
        message: '',
      })
        .then(() => {
          var to = this.$route.query.id;
          to = to.replace('C2C', '')
          let promise = this.tim.revokeMessage(this.message);
          promise.then((imResponse) => {
            this.$toast.success(imResponse)
            // 消息撤回成功
          }).catch((imError) => {
            // 消息撤回失败
            this.$toast.fail(imError)
            // console.warn('revokeMessage error:', imError);
          });
        })
        .catch(() => {
          // on cancel
        });

    },
  },
}
</script>
<style lang="less" scoped>
</style>