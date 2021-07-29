<template>
  <!-- 人物 -->
  <div class="module_character">
    <moduleTitle :info="info"></moduleTitle>
    <div class="character">
      <div class="character_info" v-for="(item,i) in info.banner" :key="i" 
          @click="$router.push('/page/user_index?id='+item.id).catch(() => {})">
        <div class="chara_img">
          <img :src="$fnc.getImgUrl(item.avatar)" alt="">
          <p>导师</p>
        </div>
        <div class="chara_cont">
          <p>{{item.title.length > 10 ? item.title.slice(0,10) : item.title}}</p>
          <p>{{item.pv}}人学习</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import moduleTitle from "@/components/page/vip/moduleTitle";
  export default{
    data(){
      return{}
    },
    props:{
      info: {
        type: Object,
        default: () => {
          return {
            banner: [],
          };
        },
      },
      background: {
        type: String,
        default: "transparent",
      },
    },
    components:{
      moduleTitle
    },
  }
</script>

<style lang="less" scoped>
  .module_character{
    // margin: 10px;
    background: #fff;
    
    .character{
      display: flex;
      overflow-x: auto;
      margin: 10px;
      // background: #fff;
      // padding: 10px;
    }
    
    .character_info{
      width: 27%;
      flex-shrink: 0;
      margin-right: 20px;
      // background: #fff;
      
      .chara_img{
        line-height: 1;
        position: relative;
        display: flex;
        img{
          width: 100%;
          height: 130px;
          border-radius: 10px;
        }
        
        >p{
          position: absolute;
          right: 5px;
          bottom: 5px;
          background: #7b7a78;
          color: #fff;
          font-size: 14px;
          padding: 2px 5px;
          border-radius: 5px;
        }
      }
      
      .chara_cont{
        font-size: 13px;
        font-weight: 700;
        line-height: 22px;
        margin-top: 10px;
        
        >p:nth-of-type(2){
          font-size: 12px;
          color: #918f8f;
          font-weight: 400;
        }
      }
    }
  }
</style>
