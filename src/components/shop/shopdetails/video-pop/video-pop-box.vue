<template>
    <div style="height:100%;"
        :style="{backgroundColor:'rgba(0,0,0,.6)'}"
        :class="{wxBg}"
        @touchstart="touchstart($event)"
        @touchend="touchend($event)">
        <div class="cloud-con"
            :class="{avtiveDetails:load}">
            <cloud-details-head :info="info"
                @showPop="getShowPop"
                class="video-pop-head" />
            <div class="cloud-item-sweiper">
                <div class="cloud-shop-img-con">
                    <div class="video_container">
                        <video v-show="androidPop"
                            v-if="!$fnc.isYkAPP()"
                            class="video_box"
                            width="100%"
                            id="videoCloud"
                            height="100%"
                            x5-playsinline
                            playsinline
                            webkit-playsinline
                            x-webkit-airplay="allow"
                            preload="auto"
                            :src="info.video"
                            :playOrPause="playOrPause"
                            @click="pauseVideo"
                            @ended="onPlayerEnded($event)"
                            loop="loop"></video>
                        <!-- 封面 -->
                        <img v-show="isVideoShow"
                            v-if="!$fnc.isYkAPP()"
                            class="play"
                            @click="playvideo"
                            :src="info.video_pic"
                            style="    top: 50%;
                max-height: 100%;
    left: 50%;
    transform: translate3d(-50%, -50%, 0);" />
                        <!-- 播放暂停按钮 -->
                        <img v-if="!$fnc.isYkAPP()"
                            v-show="iconPlayShow"
                            class="icon_play"
                            @click="playvideo"
                            src="../../../../assets/img/play.png"
                            style="width:48px;height:48px" />
                        <video-default class="video_box"
                            direction="vertical"
                            :url="info.video"
                            :video_pic="info.video_pic"
                            v-else />
                    </div>
                </div>
            </div>
            <cloud-details-footer style="background: #000;"
                @showPop="getShowPop"
                :info="info" />
        </div>
    </div>
</template>

<script>
import cloudDetailsHead from "./cloudDetailsHead2";

// import cloudDetailsRight from '@/components/currency/cloudPlatform/cloudDetails/cloudDetailsRight'
import cloudDetailsFooter from "./cloudDetailsFooter2";
import Cookies from "js-cookie";

import { setTimeout } from "timers";

import { Overlay } from "vant";

import videoDefault from "@/components/currency/videoDefault.vue";

export default {
    name: "cloudDetails",
    components: {
        cloudDetailsHead,
        // cloudDetailsRight,
        cloudDetailsFooter,
        [Overlay.name]: Overlay,
        videoDefault
    },
    props: {
        info: {
            type: Object,
            default: () => { }
        }
    },
    data () {
        let u = navigator.userAgent;
        return {
            startx: "",
            starty: "",
            load: false,
            video_pic: "",
            wxBg: false,
            mescroll: null, // mescroll实例对象
            mescrollDown: {
                use: false,
                auto: false,
                mustToTop: true
            }, //下拉刷新的配置. (如果下拉刷新和上拉加载处理的逻辑是一样的,则mescrollDown可不用写了)

            mescrollUp: {
                use: false,
                auto: false,
                offset: 200,

                // 上拉加载的配置.
                callback: this.upCallback, // 上拉回调,此处简写; 相当于 callback: function(page, mescroll) { }
                //以下是一些常用的配置,当然不写也可以的.
                page: {
                    num: 0, //当前页 默认0,回调之前会加1; 即callback(page)会从1开始
                    size: 10 //每页数据条数,默认10
                },
                htmlNodata: '<p class="upwarp-nodata">-- END --</p>',
                noMoreSize: 5, //如果列表已无数据,可设置列表的总数量要大于5才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看这就是为什么无更多数据有时候不显示的原因
                toTop: {
                    //回到顶部按钮
                    warpId: "my-shops",
                    src: require("@/assets/img/top.png"), //图片路径,默认null,支持网络图
                    offset: 1000 //列表滚动1000px才显示回到顶部按钮
                },
                empty: {
                    //列表第一页无任何数据时,显示的空提示布局; 需配置warpId才显示
                    warpId: "my-shops", //父布局的id (1.3.5版本支持传入dom元素)
                    icon: "@/assets/empty.png", //图标,默认null,支持网络图
                    tip: "暂无相关数据~" //提示
                }
            },
            isOneImg: false,
            i: 0,
            showChat: false,
            supplierEwm: "",
            current: 0,
            list: [],
            shopList: false,
            isVideoShow: true,
            playOrPause: true,
            video: null,
            iconPlayShow: true,
            isAndroid: u.indexOf("Android") > -1 || u.indexOf("Adr") > -1, // android终端
            isiOS: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), // ios终端
            tabIndex: 0,
            showShareBox: false,
            current: 0,
            androidPop: true,
            swiperList: []
        };
    },

    created () { },

    mounted () { },
    methods: {

        getShowPop (bool) {
            if (this.isAndroid) {
                this.androidPop = bool;
                this.isVideoShow = !bool;
            }
        },
        playvideo (event) {
            let video = document.querySelector("video");
            this.isVideoShow = false;
            this.iconPlayShow = false;
            video.play();
            window.onresize = function () {
                // video.style.width = window.innerWidth + "px";
                // video.style.height = window.innerHeight + "px";
            };
        },
        pauseVideo () {
            //暂停\播放
            let video = document.querySelectorAll("video")[this.current];
            if (this.playOrPause) {
                video.pause();
                this.iconPlayShow = true;
            } else {
                video.play();
                this.iconPlayShow = false;
            }
            this.playOrPause = !this.playOrPause;
        },
        onPlayerEnded (player) {
            //视频结束
            this.isVideoShow = true;
            this.current += this.current;
        },
        getClose () {
            this.showChat = false;
        },
        touchend (e) {
            var endx, endy;
            endx = e.changedTouches[0].pageX;
            endy = e.changedTouches[0].pageY;
            var direction = this.getDirection(this.startx, this.starty, endx, endy);
            if (direction == 1 && this.info.video_next_id && this.info.video_next_id != '' && this.info.video_next_id != 0) {
                this.$router.replace('/shop/shopdetails?id=' + this.info.video_next_id + '&showVideo=1')
            }

        },
        touchstart (e) {
            this.startx = e.touches[0].pageX;
            this.starty = e.touches[0].pageY;
        },
        getAngle (angx, angy) {
            return Math.atan2(angy, angx) * 180 / Math.PI;
        },
        getDirection (startx, starty, endx, endy) {
            var angx = endx - startx;
            var angy = endy - starty;
            var result = 0;
            //如果滑动距离太短
            if (Math.abs(angx) < 2 && Math.abs(angy) < 2) {
                return result;
            }
            var angle = this.getAngle(angx, angy);
            if (angle >= -135 && angle <= -45) {
                result = 1;
            } else if (angle > 45 && angle < 135) {
                result = 2;
            } else if ((angle >= 135 && angle <= 180) || (angle >= -180 && angle < -135)) {
                result = 3;
            } else if (angle >= -45 && angle <= 45) {
                result = 4;
            }
            return result;
        },
    },
    watch: {}
};
</script>



<style lang="less" scoped>
.wxBg {
    .colud-details-head {
        background: #fff !important;
    }
    .cloud-item-sweiper {
        background: #000;
        height: 100%;
    }
    .clode-new {
        h3 {
            // color: #333;
        }
        h3 + p {
            // color: #333;
        }
    }
}
.avtiveDetails {
    opacity: 1 !important;
}
.clode-new {
    // background: #fff;
    font-size: 13px;
    line-height: 2.2;
    padding: 10px 10px;
    overflow: auto;
    > h3 {
        font-size: 20px;
        line-height: 1.8;
    }
    > p {
        font-size: 14px;
        padding-bottom: 10px;
    }
}
.supplier-shop {
    // position: fixed;
    // top: 60px;
    width: 100%;
    overflow: auto;
    height: 100%;
}
.cloud-shop-img-con {
    overflow: auto;
    height: 100%;
}
.custom-indicator {
    position: absolute;
    right: 15px;
    top: 15px;
    color: #fff;
}
.cloud-con {
    line-height: 1.2;
    font-size: 14px;
    color: #333;
    height: 100%;
    position: relative;
    display: flex;
    flex-direction: column;
    z-index: 2;
    letter-spacing: 1px;
    overflow: auto;
    transition: all 0.3s linear;
    // background: linear-gradient(#6d5e57,#6f645e,#796d6d,#837777,#857b7a,#867c7b,#847b7a,#4a413a,#443a39,#332727,#453c3d,#342828,#271b1b,#271b1b,#261d16);
    > div {
        z-index: 3;
    }
}
.cloud-item-sweiper {
    flex: 3;
    z-index: 1;
    position: relative;
    background: #000;
}
// .cloud-con:after{
//     content: "";
//     width:100%;
//     height:120%;
//     position: absolute;
//     left:0;
//         top: -150px;
//     background: inherit;
//     filter: blur(12px);
//     z-index: 1;
// }
.cloud-shop-img-con {
    display: flex;
    justify-content: center;
    align-items: center;
    img {
        height: auto;
        // opacity: 0.8;
    }
}
.shop_list_con {
    height: 100%;
    background: transparent;
}

.clear {
    clear: both;
}
.video-player {
    height: 100vh;
    width: 100vw;
}

.container_box {
    width: 100vw;
    height: 100vh;
}

.video_box {
    z-index: 999;
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    overflow: hidden;
}
.video_container {
    // display: flex;
    // justify-content: center;
    // align-items: center;
    position: relative;
    width: 100%;
    height: 100%;
}
video {
    // object-position: 0 0;
}

.icon_play {
    position: absolute;
    top: 44%;
    right: 0;
    left: 0;
    bottom: auto;
    margin: auto;
    z-index: 999;
    height: 60px;
    background: rgba(0, 0, 0, 0.5);
    border-radius: 50%;
}

.play,
.platStart {
    position: absolute;
    margin: auto;
    top: 0;
    left: 0;
    z-index: 999;
    width: 100%;
    height: 100%;
}
.play {
    // height: 100% !important;
}
/* 点赞，转发 */
.tools_right {
    z-index: 1001;
    position: absolute;
    right: 16px;
    bottom: 238px;
}

.tools_r_li {
    margin-bottom: 20px;
    color: #fff;
    font-size: 14px;
}

.tools_r_li:last-child {
    margin-bottom: 0px;
}

.icon_right {
    margin-bottom: 5px;
    font-size: 42px;
    display: block;
    text-shadow: 0px 0px 10px #9d9d9d;
    /*transition: .5s;*/
}

.production_box {
    z-index: 1001;
    position: absolute;
    /* right: 16px; */
    bottom: 60px;
    text-align: left;
    padding: 0 15px 15px 15px;
    color: #fff;
    width: 100%;
    left: 0;
    box-sizing: border-box;
    background: -webkit-linear-gradient(
        top,
        rgba(0, 0, 0, 0.2),
        rgba(0, 0, 0, 0)
    ); /* Safari 5.1 - 6.0 */
    background: -o-linear-gradient(
        top,
        rgba(0, 0, 0, 0.2),
        rgba(0, 0, 0, 0)
    ); /* Opera 11.1 - 12.0 */
    background: -moz-linear-gradient(
        top,
        rgba(0, 0, 0, 0.2),
        rgba(0, 0, 0, 0)
    ); /* Firefox 3.6 - 15 */
    background: linear-gradient(
        to top,
        rgba(0, 0, 0, 0.2),
        rgba(0, 0, 0, 0)
    ); /* 标准的语法 */
}
.production_name {
    font-weight: 700;
    font-size: 18px;
    margin-bottom: 10px;
}

.production_des {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    min-height: 62px;
}
.container_bottom {
    position: fixed;
    bottom: 0;
    width: 100%;
    background: rgba(0, 0, 0, 0.2);
    height: 60px;
    border-top: 1px solid rgba(255, 255, 255, 0.7);
}

.production_top {
    display: inline-block;
    padding: 6px;
    margin-bottom: 5px;
    background: rgba(0, 0, 0, 0.3);
    border-radius: 6px;
    margin-top: 5px;
}
.product_go {
    color: #fbdd21;
}
.production_title {
    margin-left: 4px;
}
.bottom_tab {
    width: 50%;
    text-align: center;
    float: left;
    color: #c9c9c9;
    padding: 10px 0;
}
.bottom_tab_span {
    line-height: 38px;
    border-bottom: 2px solid transparent;
    font-weight: 600;
    font-size: 16px;
    display: inline-block;
    padding: 0 4px;
    transition: 0.5s all;
}
.tab_active .bottom_tab_span {
    border-bottom: 2px solid #fff;
    color: #fff;
}
.icon-shoucang {
    transition: 0.5s all;
}
.follow_active {
    color: #f44;
    animation: showHeart 0.5s ease-in-out 0s;
}
/*animation-name：用来调用@keyframes定义好的动画，与@keyframes定义的动画名称一致*/
/*animation-duration ：指定元素播放动画所持续的时间*/
/*animatino-timing-function ： 和transition中的transition-timing-function 中的值一样。根据上面@keframes中分析的animation中可能存在多个小动画，因此这里的值设置是针对每一个小动画所在时间范围内的属性变换速率。*/
/*animation-delay：定义在浏览器开始执行动画之前等待的时间，这里是指整个animation执行之前的等待时间，而不是上面说的多个小动画*/
/*animation-iteration-count：定义动画的播放次数，其通常为整数，默认是1,；取值为infinite，动画将无限次的播放。*/
/*animation-direction：主要用来设置动画播放方向*/
@keyframes showHeart {
    0% {
        color: #f44;
        transform: scale(1);
    }
    25% {
        color: #fff;
        transform: scale(0);
    }
    80% {
        color: #f44;
        transform: scale(1.2);
    }
    100% {
        color: #f44;
        transform: scale(1);
    }
}
/*分享样式*/
.share_hover {
    position: fixed;
    display: none;
}

.share_box {
    position: fixed;
    bottom: -300px;
    width: 100%;
    z-index: 1002;
    background: #fff;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    transition: 0.5s;
}
.share_tips {
    text-align: center;
    line-height: 38px;
    color: #333;
}
.share_ul {
    box-sizing: border-box;
    padding: 0 25px 25px;
    border-bottom: 1px solid #e8e8e8;
}
.share_li {
    float: left;
    width: 33%;
    text-align: center;
}
.share_li i {
    font-size: 44px;
}
.share_cancel {
    text-align: center;
    line-height: 48px;
    color: #777;
    text-align: center;
}
.pengyouquan {
    color: #47d000;
}
.pengyouquan_li {
    animation: rotating 8s linear infinite;
}
@keyframes rotating {
    from {
        transform: rotate(0);
    }
    to {
        transform: rotate(360deg);
    }
}
.weixin {
    color: #20ca2e;
}
.lianjie {
    color: #cdcdcd;
}
.share_active {
    bottom: 0px;
}
.andclass {
    // position: fixed;
    // width: 100%;
    // max-height: 550px;
    // margin-top: 66px;
    // margin-bottom: 50px;
}
.cloud-iframe {
    width: 100%;
    height: 100%;
    > iframe {
        width: 100%;
        height: 100%;
    }
}
.video-pop-head {
    position: absolute;
    width: 100%;
    top: 0;
    z-index: 4 !important;
}
</style>
