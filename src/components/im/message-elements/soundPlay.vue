<!--  -->
<template>
    <div class=''>
        <div class="audiobox"
            :style="{'flex-direction':flow === 'in'?'row-reverse':''}"
            @click="playmp3">
            <!-- <img src="./../../../assets/img/im/audiopause.png"
                v-show="isPlaying==false"
                alt="">
            <img src="./../../../assets/img/im/audioplay.gif"
                v-show="isPlaying==true"
                alt=""> -->
            <div class="cricleplay"
                status="stop"
                no="1">
                <div class="small"></div>
                <div class="middle "
                    :class="[isPlaying == false?'stopanimate':'']"></div>
                <div class="large "
                    :class="[isPlaying == false?'stopanimate':'']"></div>
            </div>
            <span v-show="duration != 0 && duration != NaN">{{$fnc.toFixedZ(duration,0)}}″</span>
        </div>
        <audio @canplay="getDuration"
            preload="auto"
            @updateTime="updateTime"
            :src="payload.fileUrl"
            ref="audio"
            hidden="true">
            <source src="mp3/Kalimba.mp3"
                type="audio/mpeg"></audio>
    </div>
</template>

<script>


export default {
    //import引入的组件需要注入到对象中才能使用
    components: {},
    data () {
        //这里存放数据
        return {
            timer: null,
            isPlaying: false,
            duration: 0
        };
    },
    props: {
        flow: {
            type: String,

        },
        payload: {
            type: Object,
            required: true
        },

    },
    computed: {

    },
    beforeDestroy () {
        clearTimeout(this.timer);
    },

    methods: {
        watchEnd () {
            let that = this;
            this.timer = setTimeout(() => {
                that.isPlaying = false;
            }, that.duration * 1000);
        },
        updateTime (e) {
        },
        getDuration () {
            //获取播放总时长

            this.duration = this.$refs.audio.duration || 0;
            if (Number(this.duration) <= 1) {
                this.duration = 1;
            }
        },
        playmp3 () {
            let audio = this.$refs.audio;
            if (audio !== null) {
                if (this.isPlaying == false) {
                    //未播放
                    audio.play()
                    this.isPlaying = true;
                    this.watchEnd();
                } else {
                    //已播放
                    audio.pause()
                    clearTimeout(this.timer);
                    this.isPlaying = false;
                    audio.currentTime = 0;
                }
            }
        },
    },
    created () {
        this.$nextTick(() => {
            let audio = this.$refs.audio;
            audio.load();
        })
    },
    mounted () {

    },

}
</script>
<style lang='less' scoped>
.audiobox {
    width: auto;
    min-width: 100px;
    // border: 1px solid #eeeeee;
    border-radius: 5px;
    // background-color: #fff3ea;
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
    color: #999;

    img {
        width: 16px;
        transform: rotateY(180deg);
    }
}
.small {
    width: 10px;
    height: 10px;
    border-style: solid;
    border-top-color: transparent;
    border-left-color: transparent;
    border-bottom-color: transparent;
    border-radius: 50%;
    box-sizing: border-box;
    vertical-align: middle;
    display: inline-block;
    color: #a2a2a2;
}

.middle {
    width: 20px;
    height: 20px;
    border-style: solid;
    border-top-color: transparent;
    border-left-color: transparent;
    border-bottom-color: transparent;
    border-radius: 50%;
    box-sizing: border-box;
    vertical-align: middle;
    display: inline-block;
    margin-left: -13px;
    animation: show2 3s ease-in-out infinite;
    opacity: 1;
    color: #a2a2a2;
}
@keyframes show2 {
    0% {
        opacity: 0;
    }
    30% {
        opacity: 1;
    }
    100% {
        opacity: 0;
    }
}
.cricleplay {
    // width: 100%;
}
.large {
    width: 28px;
    height: 28px;
    border-style: solid;
    border-top-color: transparent;
    border-left-color: transparent;
    border-bottom-color: transparent;
    border-radius: 50%;
    box-sizing: border-box;
    vertical-align: middle;
    display: inline-block;
    margin-left: -21px;
    animation: show3 3s ease-in-out infinite;
    opacity: 1;
    color: #a2a2a2;
}
@keyframes show3 {
    0% {
        opacity: 0;
    }
    60% {
        opacity: 1;
    }
    100% {
        opacity: 0;
    }
}
.stopanimate {
    -moz-animation-name: none;
    -webkit-animation-name: none;
    -ms-animation-name: none;
    animation-name: none;
}
</style>