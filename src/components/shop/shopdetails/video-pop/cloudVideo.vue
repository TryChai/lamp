<template>
    <div class="vedio_box">
        <video id="myVideo"
            :autoplay='autoPlay'
            meted
            x5-playsinline="true"
            playsinline="true"
            webkit-playsinline="true"
            controls="controls"
            x-webkit-airplay="true"
            width="375px"
            height="200px"
            :poster='videoSrc'
            class="video-js"
            x5-video-player-type="h5"
            loop>
            <source :src="src"
                type="video/mp4" />
        </video>
    </div>
</template>
<script>
export default {
    name: "top_video",
    props:{
        videoSrc:{
            type:String,
            default:""
        },
        autoPlay:{
            type:Boolean,
            default:true
        }
    },
    data () {
        return {
            temp: "",
            src: this.videoSrc || "http://media.vi5.cn/video/149dc3c3-16c6f0ea67e-0006-cf1c-513-41d0f.mp4",
            // src:require('../../../../assets/media/149dc3c3-16c6f0ea67e-0006-cf1c-513-41d0f.mp4')
        };
    },
    mounted () {
        var ua = navigator.userAgent;
        if (ua.indexOf("iPhone") > 0) {
            this.temp = "h5"
            document.addEventListener('WeixinJSBridgeReady', function () {
                document.getElementById("myVideo").play();
            }, false);
            // document.getElementById("myVideo").play();
        }
        else if (ua.indexOf("Android") > 0) {

            this.initVideo();
            var player = this.$video("myVideo");
            player.play();

            // var curtime = player.currentTime();
            // setTimeout(function () {
            //     let audioPlayer = document.getElementById("myVideo");
            //     audioPlayer.currentTime(curtime);
            //     audioPlayer && audioPlayer.play()
            // }, 500)

        }

    },
    methods: {
        initVideo () {
            //初始化视频方法
            let myPlayer = this.$video(myVideo, {
                //确定播放器是否具有用户可以与之交互的控件。没有控件，启动视频播放的唯一方法是使用autoplay属性或通过Player API。
                controls: true,
                //自动播放属性,muted:静音播放
                autoplay: true,
                //建议浏览器是否应在<video>加载元素后立即开始下载视频数据。
                preload: "auto",

                //设置视频播放器的显示宽度（以像素为单位）

                //设置视频播放器的显示高度（以像素为单位）

            });
        },

    },
};
</script>
<style scoped>
#myVideo{
    width: 100%;
}
.vedio_box{
    position: absolute;
    width: 100%;
    
}
</style>