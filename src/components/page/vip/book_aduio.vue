<template>
  <!-- 音频 -->
  <div class="moduleAudio">
    <moduleTitle :info="info"></moduleTitle>
    <div class="audio_list">
      <div class="bookContainer" v-for="(item,i) in info.banner" :key="i">
        <div class="audio_img" @click="$router.push('/page/temp1?id='+item.id).catch(() => {})">
          <img :src="$fnc.getImgUrl(item.piclink)" width="90px" height="115px" alt />
          <div class="tag">听书</div>
        </div>
        <div class="audio_info">
          <div class="info_top" @click="$router.push('/page/temp1?id='+item.id).catch(() => {})">
            <p>
              {{title(item)}}
            </p>
            <p v-html="item.content.length > 38 ? item.content.slice(0,38) + '...' : item.content"></p>
          </div>
          <div class="info_button" @click="$router.push('/page/trylisten?id='+item.id).catch(() => {})">
            <span>{{item.times}}</span>
            <div class="button_btn">
              <van-icon name="play-circle-o" />播放
            </div>
          </div>
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
    methods: {
      title(item) {
        var title = "《" + item.title + "》";
        var nick = "| " + item.character + "解读";
        var titleNick = title+nick;
        return titleNick.length > 15 ? titleNick.slice(0,15)+"..." : titleNick;
      }
    }
  }
</script>

<style lang="less" scoped>
  .audio_list{
    margin: 0 10px;
  }
  .bookContainer{
    display: flex;
    padding: 10px;
    margin: 15px 0;
    background: #fff;
    border-radius: 10px;
      
    .audio_img {
      width: 22%;
      // width: 80px;
      height: 105px;
      background-color: skyblue;
      position: relative;
      border-radius: 5px;
      overflow: hidden;
      
      .tag {
        position: absolute;
        color: #fff;
        bottom: 3px;
        right: 3px;
        font-size: 12px;
        background-color: rgba(0, 0, 0, 0.5);
        padding: 0 3px;
      }
    }
      
    .audio_info {
      // width: 100%;
      width: 78%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      line-height: 20px;
      padding-left: 15px;
      
      .info_top {
        >p:nth-child(1) {
          font-size: 16px;
          font-weight: bold;
          margin-left: -7px;
      
          span {
            margin-right: 3px;
            margin-left: -4px;
          }
        }
      
        >p:nth-child(2) {
          color: rgb(60, 67, 58);
          padding-top: 5px;
          font-size: 13px;
        }
      }
      
      .info_button {
        >span {
          font-size: 12px;
          color: rgb(255, 107, 1);
        }
      
        display: flex;
        align-items: center;
        justify-content: space-between;
      
        .button_btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 70px;
          height: 30px;
          color: rgb(236, 118, 22);
          justify-content: center;
          background-color: rgb(245, 243, 243);
          border-radius: 15px;
          margin-right: 10px;
          font-size: 14px;
                
          i {
            margin-right: 5px;
            font-size: 18px;
          }
        }
      }
    }
  }
</style>
