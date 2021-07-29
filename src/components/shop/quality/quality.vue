<template>
  <div class='quality-con'>
      <van-nav-bar title="品控体验" left-arrow class="navbar" :border="false" @click-left="toBack" />
      <div class="quality-user">
          <div class="quality-user-avatar">
              <van-image :src="quality.uid_cn.avatar" round lazy-load width="60" height="60" >
                <template v-slot:loading>
                <van-loading type="spinner" size="20" />
                </template>
            </van-image>
          </div>
          <div class="quality-user-title">{{quality.uid_cn.nickname}}</div>
          <div class="quality-user-number">官方品控师<span></span>{{quality.uid_cn.number}}次品控</div>
          <div class="quality-user-divider">
              <van-divider>品质评分</van-divider>
              <van-rate :value="Number(quality.score)" void-icon="star" color="#e67107" void-color="#e7e7e7" readonly />
              <p>{{quality.score}}.0</p>
          </div>
      </div>
      <div class="quality-content">
          <div class="quality-content-rate">
              <div>安全
              <van-rate :value="Number(quality.score1)" void-icon="star" void-color="#e7e7e7" color="#e7d67c" readonly />
                </div>
                <div>质量
                    <van-rate :value="Number(quality.score2)" void-icon="star" void-color="#e7e7e7" color="#e7d67c" readonly />
                </div>
                <div>性价比
                    <van-rate :value="Number(quality.score3)" void-icon="star" void-color="#e7e7e7" color="#e7d67c" readonly />
                </div>
          </div>
          <div class="quality-content-content"  v-lazy-container="{ selector: 'img' }" v-html="letslazyload(quality.content)"> </div>
      </div>
  </div>
</template>

<script>
import { Image,Loading,Divider,Rate } from 'vant';
export default {
  name: 'quality-con',

  data(){
    return {
        quality:{
            uid_cn:{
               avatar:'' 
            }
        }
    }
  },
  components: {   
    [Image.name]:Image,
    [Loading.name]:Loading,
    [Divider.name]:Divider,
    [Rate.name]:Rate,
  },
  created(){
      this.getQualityDetails();
  },
  mounted(){},
  methods: {
      letslazyload(contentp) {
                let regexp1 = new RegExp(/(\<img )([^>]*)(src=")([^"]*")([^>]*)(\>)/, 'g');
                contentp = contentp.replace(regexp1, function(match, p1, p2, p3, p4, p5, p6) {
                    return p1 + p2 + 'data-src="' + p4 + p5 + p6;
                });
                return contentp;
        },
      getQualityDetails(){
          var id=this.$route.query.id;
            this.$api.getShop.getQualityDetails({id}).then(res=>{
                if(res.code==200){
                    this.bool=true;
                    this.quality=res.result;
                }
            })
    }
  }
}
</script>
<style lang='less' scoped>
.quality-con{
    line-height: 1;
    font-size: 14px;
    background: #f3f3f3;
    height: 100%;
    overflow: auto;
    .quality-user{
        background: #fff;
        border-radius: 2px;
        margin: 10px 16px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        .quality-user-avatar{
            position: relative;
            margin: 10px 0;
        }
        .quality-user-title{
            color: #343434;
            font-size: 16px;
            margin-top: 4px;
        }
        .quality-user-number{
            color: #9c9c9c;
            font-size: 13px;
            margin-top: 10px;
            display: flex;
            align-items: center;
            line-height: 1.4;
            span{
                display: inline-block;
                width: 1px;
                height: 10px;
                background: #989898;
                margin: 0 10px;
            }
        }
        .quality-user-divider{
            width: 100%;
            padding: 0 10px;
            text-align: center;
            >p{
                margin: 16px 0 8px;
                font-size: 15px;
                color: #ff3940;
                font-weight: bold;
            }
        }
    }
    .quality-content{
        background: #fff;
        padding:16px;
        .quality-content-rate{
            >div{
                display: flex;
                justify-content: flex-start;
                align-items: center;
                color: #353535;
                font-size: 14px;
                margin-bottom: 8px;
                >div{
                    margin-left: 10px;
                }
            }
        }
        .quality-content-content{
            margin-top: 8px;
        }
    }
}
.navbar {
  background: linear-gradient(to right, #f18113, #de5f00);
  i,
  span,
  div {
    color: #fff;
  }
}
</style>
