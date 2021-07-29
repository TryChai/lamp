<template>
    <div class="saybtn">
        <span id="bt_recoding"
            @touchstart="gotouchstart"
            @touchmove="gotouchmove"
            @touchend="gotouchend">按住说话{{saying}}</span>
        <span>播放</span>

        <div class="saying"
            ref="saying"
            v-if="saying ==true">

            <div>
                <img src="./../../../assets/img/im/voice/ic_record@2x.png"
                    alt="">
                <img src="./../../../assets/img/im/voice/sound.gif"
                    alt="">
            </div>
            <p>手指上滑取消发送</p>

        </div>
        <!-- <div class="blackBoxSpeak">
            <p class="blackBoxSpeakConent">手指上划，取消发送</p>
        </div> -->

        <!--  
        <div class="blackBoxPause">
            <p class="blackBoxPauseContent"
                style="background: red">松开手指， 取消发送</p>
        </div> -->
    </div>
</template>
<script>
import wx from "weixin-js-sdk"
export default {
    name: "saybtn",
    data () {
        return {
            saying: false,
            toast: null,
            timer: null,//用于清除计时器
            index: [9, 8, 7, 6, 5, 4, 3, 2, 1, 2, 3, 4, 5, 6, 7, 8, 9],
            bt_recoding: null,
            blackBoxSpeak: null,
            blackBoxPause: null,
            // num: this.index.length,
        };
    },
    created () {
        // this.$nextTick(() => {
        //     this.bt_recoding = document.getElementById("bt_recoding");

        //     //中间黑色边框和里面的内容（录音状态）
        //     this.blackBoxSpeak = document.querySelector(".blackBoxSpeak");
        //     this.blackBoxSpeak.style.background = "url('./../../../assets/img/im/voice/ic_record@2x.png')no-repeat 28 16px/65px 104px, url('./../../../assets/img/im/voice/ic_record_ripple@2x-9.png')no-repeat 111.2px 32px/28.8px 88px";
        //     console.log(this.blackBoxSpeak.style.background)

        //     //中间黑色边框和里面的内容（暂停状态）
        //     this.blackBoxPause = document.querySelector(".blackBoxPause");
        //     this.blackBoxPause.style.background = "rgba(0,0,0,.7) url('./../../../assets/img/im/voice/ic_release_to_cancel@2x.png')no-repeat center 8px/67.2px 104px";


        //     //手指移动相关
        //     var posStart = 0;//初始化起点坐标
        //     var posEnd = 0;//初始化终点坐标
        //     var posMove = 0;//初始化滑动坐标
        //     //轮播相关

        //     //直接开启轮播模式
        //     // this.setTimer();


        //     // this.bt_recoding.addEventListener("touchstart", function (event) {
        //     //     event.preventDefault();//阻止浏览器默认行为
        //     //     posStart = 0;
        //     //     posStart = event.touches[0].pageY;//获取起点坐标

        //     //     //显示录音 隐藏暂停
        //     //     this.showBlackBoxSpeak();
        //     // });
        //     // this.bt_recoding.addEventListener("touchmove", function (event) {
        //     //     event.preventDefault();//阻止浏览器默认行为

        //     //     posMove = event.targetTouches[0].pageY;//获取滑动实时坐标
        //     //     if (posStart - posMove < 200) {
        //     //         //隐藏录音 显示暂停
        //     //         this.showBlackBoxSpeak();
        //     //     } else {
        //     //         //显示录音 隐藏暂停
        //     //         this.showBlackBoxPause();
        //     //     }
        //     // });
        //     // this.bt_recoding.addEventListener("touchend", function (event) {
        //     //     event.preventDefault(); //阻止浏览器默认行为
        //     //     posEnd = 0;
        //     //     posEnd = event.changedTouches[0].pageY;//获取终点坐标

        //     //     //初始化状态
        //     //     this.initStatus();

        //     //     if (posStart - posEnd < 200) {
        //     //         alert("发送成功");
        //     //         showBlackBoxNone();
        //     //     } else {
        //     //         alert("取消发送");
        //     //         showBlackBoxNone();
        //     //     }
        //     // });
        // })
    },
    components: {
    },
    methods: {
        gotouchstart () {

            let that = this;

            clearTimeout(that.timer);//清除定时器
            that.timer = 0;
            that.timer = setTimeout(() => {
                this.saying = true;
                wx.startRecord({
                    success: function (res) {
                        //console.log();
                    },
                    fail: function (res) {
                        //alert();
                    }
                });
                setTimeout(function () {
                    //结束录音  
                    wx.stopRecord({
                        success: function (res) {
                            var localId = res.localId;
                        }
                    });
                }, 10000)
            }, 600);//这里设置定时
        },
        //手释放，如果在500毫秒内就释放，则取消长按事件，此时可以执行onclick应该执行的事件
        gotouchend (e) {


            if (this.timer != 0) {
                alert(1)
                // 获取弹窗位置
                var say_position = this.$refs.saying.getBoundingClientRect()
                console.log(say_position)

                console.log(e.changedTouches[0].pageX)
                console.log(e.changedTouches[0].pageY)
                clearTimeout(this.timer);

                this.saying = false;
                wx.stopRecord({
                    success: function (res) {
                        var localId = res.localId;
                        alert(res.localId)
                    }
                });
                //这里写要执行的内容（尤如onclick事件）
            }
        },
        //如果手指有移动，则取消所有事件，此时说明用户只是要移动而不是长按 
        gotouchmove () {
            // clearTimeout(this.timer);//清除定时器
            // this.timer = 0;
            // this.saying = false;
            // wx.stopRecord({
            //     success: function (res) {
            //         var localId = res.localId;
            //     }
            // });
        },




        setTimer () {
            this.timer = setInterval(function () {
                setTimeout(function () {
                    this.num++;
                    this.blackBoxSpeak.style.background = "url('./ic_record@2x.png')no-repeat 28px 16px/64px 104px, url('./ic_record_ripple@2x-" + this.index[this.num] + ".png')no-repeat 111.2px 32px/28.8px 88px";

                }, 70);
                if (this.num >= this.index.length - 1) {
                    this.num = 0;
                }
            }, 70);
        },

        //初始化状态
        initStatus () {
            this.bt_recoding.value = '按住 说话';
            //全部隐藏
            this.showBlackBoxNone();
        },
        //显示录音 隐藏暂停
        showBlackBoxSpeak () {
            this.bt_recoding.value = '松开 结束';
            this.blackBoxSpeak.style.display = "block";
            this.blackBoxPause.style.display = "none";
        },
        //隐藏录音 显示暂停
        showBlackBoxPause () {
            this.bt_recoding.value = '松开手指，取消发送';
            this.blackBoxSpeak.style.display = "none";
            this.blackBoxPause.style.display = "block";
        },
        //隐藏录音
        showBlackBoxNone () {
            this.blackBoxSpeak.style.display = "none";
            this.blackBoxPause.style.display = "none";
        },
    },
}
</script>
<style lang="less" scoped>
.saybtn {
    font-size: 14px;
    color: #333333;
    min-height: 40px;
    line-height: 40px;
    position: relative;
}
.blackBoxSpeak {
    width: 176px;
    height: 176px;
    position: absolute;
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    background: url("./../../../assets/img/im/voice/ic_record@2x.png") no-repeat
            28px 16px/65px 104px,
        url("./../../../assets/img/im/voice/ic_record_ripple@2x-9.png")
            no-repeat 111.2px 32px/28.8px 88px;

    background: rgba(0, 0, 0, 0.7);
    // display: none;
    border-radius: 12px;
}

.blackBoxSpeakConent {
    font: 14.4px "微软雅黑 Light";
    position: absolute;
    left: 0;
    right: 0;
    bottom: 12px;
    display: block;
    text-align: center;
    width: 90%;
    padding: 8px 0;
    margin: auto;
    color: #ffffff;
    font-weight: 200;
    border-radius: 4px;
}

.blackBoxPause {
    width: 176px;
    height: 176px;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    background: url("./../../../assets/img/im/voice/ic_record@2x.png") no-repeat
            28px 16px/65px 104px,
        url("./../../../assets/img/im/voice/ic_record_ripple@2x-9.png")
            no-repeat 111.2px 32px/28.8px 88px;

    background: rgba(0, 0, 0, 0.7);
    display: none;
    border-radius: 12px;
}

.blackBoxPauseContent {
    font: 14.4px "微软雅黑 Light";
    position: absolute;
    left: 0;
    right: 0;
    bottom: 12px;
    display: block;
    text-align: center;
    width: 90%;
    padding: 8px 0;
    margin: auto;
    color: #ffffff;
    font-weight: 200;
    border-radius: 4px;
}

.saying {
    width: 150px;
    height: 150px;
    background-color: rgba(0, 0, 0, 0.7);
    position: fixed;
    border-radius: 10px;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    display: flex;
    flex-flow: column;
    justify-content: center;
    align-items: center;
    // padding: 10px 0;
    color: #ffffff;
    line-height: 20px;
    div {
        width: 100%;
        height: 100px;
        display: flex;
        flex-wrap: nowrap;
        justify-content: space-evenly;
        align-items: center;
        img {
            height: 100%;
        }
    }
    > p {
        padding-top: 10px;
    }
}
</style>