<template>
  <!--  子组件 -->
  <div class="float_button">
    <div @click="onBtnClicked" ref="floatButton" class="float_info"
        :style="{'width': itemWidth + 'px','margin':'5px 10px', 'height': itemHeight + 'px', 'left': left + 'px', 'top': top + 'px'}">
      <span class="text">
        <small>菜单</small>
        
      </span>
      <div class="unread" v-if="allUnreadCount && allUnreadCount>0">
        {{allUnreadCount}}
      </div>
    </div>
  </div>
</template>
<script>
import Cookies from "js-cookie";
const ispad = function (params) {
  return false
}
import { mapState } from "vuex";
export default {

  data () {
    return {
      clientWidth: 0,
      clientHeight: 0,
      timer: null,
      currentTop: 0,
      left: 0,
      top: 0,
      text: "客服在线 9:30−18:30",
      itemWidth: 55,  //按钮宽度
      isShort: true,
      itemHeight: 55, // 悬浮按钮高度
      gapWidth: 0,    // 距离左右两边距离     
      coefficientHeight: 0.7,  // 从上到下距离比例


    }
  },
  props: {

  },
  computed: {
    ...mapState({
      conversationList: state => state.conversation.conversationList,
    }),
    allUnreadCount () {
      var index = 0;
      for (var i in this.conversationList) {
        index += this.conversationList[i].unreadCount;
      }
      return index; //得到总IM未读消息
    },
  },
  created () {
    // console.log('屏幕宽度', document.documentElement.clientWidth)
    // console.log('屏幕高度度', document.documentElement.clientHeight)
    let type = navigator.userAgent;
    this.clientWidth = document.documentElement.clientWidth
    this.clientHeight = document.documentElement.clientHeight
    this.left = 0;
    this.top = this.clientHeight * this.coefficientHeight
  },
  watch: {
    left (n, o) {
      //   console.log('新->', n, ';旧->', o)

    }
  },
  methods: {
    onBtnClicked () {   
        // var user = Cookies.get("user") ? true : false; // 得到登陆状态 false是已登录;
        // if(user){
          this.$emit('is_show');  
        // }else{
        //   this.$router.replace({ path: "/login" });
        // }
    },
    handleScrollStart () {
      console.log('这是啥时候触发呀？ScrollStart')
      this.timer && clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.handleScrollEnd()
      }, 300)
      this.currentTop = document.documentElement.scrollTop || document.body.scrollTop
      if (this.left > this.clientWidth / 2) {
        this.left = this.clientWidth - this.itemWidth / 2
      } else {
        this.left = -this.itemWidth / 2
      }
    },
    handleScrollEnd () {
      let scrollTop = document.documentElement.scrollTop || document.body.scrollTop
      if (scrollTop === this.currentTop) {
        if (this.left > this.clientWidth / 2) {
          this.left = this.clientWidth - this.itemWidth - this.gapWidth
        } else {
          this.left = this.gapWidth
        }
        clearTimeout(this.timer)
      }
    }
  },
  mounted () {
    this.$nextTick(() => {
      const floatButton = this.$refs.floatButton
      floatButton.addEventListener("touchstart", () => {
        floatButton.style.transition = 'none'
      })

      // 在拖拽的过程中，组件应该跟随手指的移动而移动。
      floatButton.addEventListener("touchmove", (e) => {
        // console.log('移动中', e)
        if (e.targetTouches.length === 1) {         // 一根手指
          let touch = e.targetTouches[0]
          this.left = touch.clientX - 20
          this.top = touch.clientY - 25
        }

      })

      // 拖拽结束以后，重新调整组件的位置并重新设置过度动画。
      floatButton.addEventListener("touchend", () => {
        floatButton.style.transition = 'all 0.3s'
        console.log('拖拽结束后left', this.left)
        if (this.left > document.documentElement.clientWidth / 2) {
          this.left = document.documentElement.clientWidth - this.itemWidth - 20;

        } else {
          this.left = 0
        }
      })
    })
  },
  beforeDestroy () {
    // 添加监听页面滚动
    window.removeEventListener('scroll', this.handleScrollStart)
  },
  destroyed () { }
}
</script>
<style lang="less">
.float_button {
  .unread {
    padding: 2px 5px;
    line-height: 1;
    border-radius: 5px;
    font-size: 10px;
    color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #dc0000;
    position: absolute;
    right: -7px;
    top: -8px;
  }
  .float_info {
    // box-shadow: #E0B97E;
    transition: all 0.3s;
    position: fixed;
    z-index: 9999;
    bottom: 436px;
    right: 0;
    margin: 5px 10px;
    display: flex;
    flex-flow: row;
    justify-content: center;
    align-items: center;
    z-index: 999;
    // background: #E0B97E;
    // background-color: #E0B97E;
    border-radius: 50%;
    cursor: pointer;
    background-image: url('../../assets/img/project/menu_btn.png');
    background-size: 100% 100%;
    .text {
      font-size: 12px;
      color: #EFC43E;
      display: flex;
      flex-flow: column;
      justify-content: center;
      align-items: center;
      line-height: 1.4;
      small {
        font-size: 11px;
      }
    }
  }
}
</style>