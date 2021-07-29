<template>
  <div class="jstx_conta_sj">{{$h(text)}}</div>
</template>

<script>
export default {
  name: 'GroupTipElement',
  props: {
    payload: {
      type: Object,
      required: true
    }
  },
  computed: {
    text () {
      return this.getGroupTipContent(this.payload)
    }
  },
  methods: {
    getGroupTipContent (payload) {
      console.log(payload)
      switch (payload.operationType) {
        case this.TIM.TYPES.GRP_TIP_MBR_JOIN:
          console.log(payload)
          return `${this.$h('群成员')}：${payload.userIDList.join(',')}，${this.$h('加入群组，当前成员数')}：${payload.memberNum}`
        case this.TIM.TYPES.GRP_TIP_MBR_QUIT:
          return `${this.$h('群成员')}：${payload.userIDList.join(',')}，${this.$h('退出群组')}`
        case this.TIM.TYPES.GRP_TIP_MBR_KICKED_OUT:
          return `${this.$h('群成员')}：${payload.userIDList.join(',')}，${this.$h('被')}${
            payload.operatorID
            }${this.$h('踢出群组')}`

        case this.TIM.TYPES.GRP_TIP_MBR_SET_ADMIN:
          return `${this.$h('群成员')}：${payload.userIDList.join(',')}，${this.$h('成为管理员')}`
        case this.TIM.TYPES.GRP_TIP_MBR_CANCELED_ADMIN:
          return `${this.$h('群成员')}：${payload.userIDList.join(',')}，${this.$h('被撤销管理员')}`
        default:
          return '[群提示消息]'
      }
    }
  }
}
</script>

<style scoped>
.group-tip-element-wrapper {
  background: #ababab;
  padding: 3px 6px;
  border-radius: 3px;
  color: #fff;
}
.jstx_conta_sj {
  color: #b3b3b3;
  font-size: 12px;
  height: 12px;
  line-height: 12px;
  margin: 25px 0;
  text-align: center;
  width: 100%;
}
</style>
