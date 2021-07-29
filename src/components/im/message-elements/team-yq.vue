<template>
  <div class='team-yq' @click="$router.replace('/im/imindex?active=clan&title='+teamInfo.im)">
      <p>邀请你加入战队</p>
      <div class="fx">
          <div>
              
              <van-image  width="60" height="60" :src="teamInfo.avatar"  />
          </div>
          <div class="team-yq-text">
              我邀请你加入 {{teamInfo.title}} 战队，点击查看
          </div>
      </div>
  </div>
</template>

<script>
import { Image } from 'vant';
export default {
  name: 'team-yq',
  props:{
      teamInfo:{
          type:Object,
          default:()=>{}
      }
  },
  data(){
    return {}
  },
  components: {
      [Image.name]:Image
  },
  created(){},
  mounted(){},
  methods: {}
}
</script>
<style lang='less' scoped>
.team-yq{
    font-size: 14px;
    line-height: 1.2;
    >p{
        font-size: 16px;
        color: #333;
        text-align: left;
        margin-bottom: 6px;
    }
    >div{
        align-items: flex-start;
        text-align: left;
        color: #757272;
        .team-yq-text{
            margin-left: 10px;
        }
    }
}
</style>
