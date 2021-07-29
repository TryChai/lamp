<template>
  <!-- 小说 -->
  <div class="moduleNovel">
    <moduleTitle :info="info"></moduleTitle>
    <div class="novel_list">
      <div class="cardList" v-for="(item,i) in info.banner" :key="i" @click="$router.push('/page/bookmsg?id='+item.id).catch(() => {})">
        <div class="novel_img">
          <img :src="$fnc.getImgUrl(item.piclink)" width="100%" height="100%" alt />
        </div>
        <div class="novel_info">
          <div class="info_title">{{item.title}}</div>
          <div class="info_cont">{{item.content.length > 30 ? item.content.slice(0,40)+"..." : item.content}}</div>
          <div class="info_label">
            <p v-if="item.label && i < 4" v-for="(lab,i) in item.label.split('@')" :key="i">{{lab}}</p>
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
    }
  }
</script>

<style lang="less" scoped>
  .novel_list{
    margin: 0 10px;
  }
  .cardList {
    font-size: 14px;
    display: flex;
    padding: 10px;
    margin: 15px 0;
    background: #fff;
    border-radius: 10px;
    .novel_img {
      width: 26%;
      height: 125px;
      background-color: skyblue;
    }
    .novel_info {
      width: 74%;
      height: 125px;
      padding-left: 10px;
      .info_title {
        font-size: 16px;
        font-weight: bold;
        color: #333;
      }
      .info_cont {
        padding: 0 0 10px 0;
        line-height: 20px;
      }
      .info_label {
        display: flex;
        > p {
          background-color: rgb(241, 239, 242);
          color: rgb(153, 150, 153);
          padding: 1px 8px 2px;
          border-radius: 10px;
          font-size: 12px;
          margin-right: 8px;
        }
      }
    }
  }
</style>
