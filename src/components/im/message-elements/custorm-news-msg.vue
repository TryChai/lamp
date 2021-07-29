<template>
  <div class='team-yq' @click="$fnc.toNews(newsInfo)">
      <div class="fx">
          <div v-if="newsInfo.piclink">    
              <van-image  width="60" height="60" :src="newsInfo.piclink" radius="3px"  />
          </div>
          <div class="fx im-cust-com">
              <div class="team-yq-text">
                    {{newsInfo.title}}
                </div>
                <div class="tr">
                    <van-button type="primary" color="linear-gradient(to right, #f19800, #ff5407)" round  size="mini">查看新闻</van-button>
                </div>
          </div>
      </div>
  </div>
</template>

<script>
import { Image } from 'vant';
export default {
  name: 'team-yq',
  props:{
      newsInfo:{
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
    min-width: 230px;
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
.im-cust-com{
    flex-direction: column;
    justify-content: space-between;
    min-height: 60px;
    .tr{
        width: 100%;
    }
    button{
        padding: 0px 8px;
    }
}
</style>
