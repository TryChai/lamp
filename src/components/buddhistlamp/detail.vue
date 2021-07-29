<template>
    <div class="detail" >
        <div class="title">供灯祈福</div>
        <div class="relative">
            <div class="music" @click.stop="pause"><img src="../../assets/img/buddhistlamp/music.png" alt=""></div>
            <audio id="audio1" autoplay="autoplay">
                <source :src="link" type="audio/mp3" />
            </audio>
            <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white" style="max-height: 354px;">
                <van-swipe-item v-for="(item,index) in banner" :key="index">
                    <img v-lazy="item.piclink" />
                </van-swipe-item>
            </van-swipe>
        </div>
        <div class="text" v-html="content"></div>
        <!-- <div class="text">
           <img src="../../assets/img/buddhistlamp/buddhistal_48_01.png" alt="">
           <p>郭化正觉寺为东北古刹，郭化正觉寺为东北古刹郭化正觉寺为东北古刹郭化正觉寺为东北古刹郭化正觉寺为东北古刹郭化正觉寺为东北古刹郭化正觉寺为东北古刹</p>
           <img src="../../assets/img/buddhistlamp/buddhistal_48_05.png" alt="">
        </div>
        <img src="../../assets/img/buddhistlamp/buddhistal_43.png" alt="">
         <div class="text">
           <img src="../../assets/img/buddhistlamp/buddhistal_48_01.png" alt="">
           <p>郭化正觉寺为东北古刹，郭化正觉寺为东北古刹郭化正觉寺为东北古刹郭化正觉寺为东北古刹郭化正觉寺为东北古刹郭化正觉寺为东北古刹郭化正觉寺为东北古刹</p>
           <img src="../../assets/img/buddhistlamp/buddhistal_48_05.png" alt="">
        </div> -->
        <div class="gd" @click.stop="gd"><img src="../../assets/img/buddhistlamp/buddhistal_39.png" alt=""></div>
    </div>
</template>
<script>
import {copyData,log} from '../../utils/common.js'
export default {
    name:'lampdetail',
  data() {
    return {
     banner:[],
     content:'',
     link:''
    };
  },
  mounted(){
   this.getBanner()
   this.getArtical()
   document.addEventListener('touchstart', function() {
        document.getElementById('audio1') && document.getElementById('audio1').play()
      })
  },
  methods: {
   pause(){
    document.getElementById('audio1') && document.getElementById('audio1').pause()
   },
   async getArtical(){
        this.$toast.loading({
            mask: true,
            message: '加载中...'
        });
        log(this.$route.params)
        let temple_id = this.$route.params.temple_id
        let article_id = this.$route.params.article_id
        let res = await this.$api.lamp.getArtical({article_id:article_id,id:temple_id})
        if(res.code == 200){
            this.content = res.result.content
            this.link = res.result.link
            document.getElementById('audio1').play()
            var src = "./rank.mp3";
            // 初始化Aduio
            var audio = new Audio();
            var playPromise;
            audio.src = src;
            playPromise = audio.play();
            if (playPromise) {
                playPromise.then(() => {
                    // 音频加载成功
                    // 音频的播放需要耗时
                    setTimeout(() => {
                        // 后续操作
                        console.log("done.");
                    }, audio.duration * 1000); // audio.duration 为音频的时长单位为秒


                }).catch((e) => {
                    // 音频加载失败
                });

        }
        console.log(res)
    }
   },
   async getBanner(){
       let res = await  this.$api.lamp.getBanner({cate:'temple_lamp_arcticle'})
       if(res.code == 200 && res.result.length){
           this.banner = res.result
       }
    },
    gd(){
        this.$store.commit('setLamp',{lamppay:{},location:{}})
        this.$router.push({name:'lamppay'})
    }
  },
};
</script>
<style lang="less" scoped>
    img{width: 100%;}
    .relative{position: relative;}
    .music {
        position: absolute;
        top: 3px;
        right: 14px;
        width: 15%;
        z-index: 11;
    }
    .detail{    
        position: relative;
        width: 100%;
        height: 100%;
        background: #fbf7ee;
        overflow: auto;
    }
    .title{
        text-align: center;
        color: #bb5b4b;
        font-size: 18px;
        font-weight: bold;
        padding: 5px 0;
    }
    .text {
        margin:8px 0;
        padding: 0 17px;
        box-sizing: border-box;
        img{display: block;}
        p {
            font-size: 13px;
            padding: 0 36px;
            box-sizing: border-box;
            color: #3b3535;
            zoom: 1;
            background: #fbf7ee url(../../assets/img/buddhistlamp/buddhistal_48_03.png) repeat-y center/100%;
        }
        
    }
   .gd{
       position: fixed;
       top: 46%;
       right: 0%;
       width: 18%;
       z-index: 5;
   }
</style>