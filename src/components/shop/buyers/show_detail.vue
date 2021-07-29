<template>
    <div class="show_detail"
        @touchstart="touchstart($event)"
        @touchend="touchend($event)">
        <div class="show_detail_top">
            <div class="show_detail_top_ava">
                <img :src="$fnc.getImgUrl(detail.avatar)"
                    alt="">
            </div>
            <div class="show_detail_top_name">
                <p>{{detail.nickname && detail.nickname != '' ? detail.nickname : detail.username}}
                </p>
                <p>{{$fnc.getTimeFormat(detail.created_time)}}</p>
            </div>
            <van-icon name="cross"
                @click='close_pop'
                color="#fff"
                size="24px" />
        </div>
        <div class="show_detail_content">
            <van-swipe :autoplay="0"
                class="shop_swipe"
                @change="onChange">
                <van-swipe-item style="height:100%;background:#000"
                    v-if="detail.video && detail.video != ''"
                    class="shop_swipe-item">
                    <div>
                        <video v-show="!isVideoShow"
                            v-if="!$fnc.isYkAPP()"
                            class="video_box shop_swi_img"
                            :class="{play1:iconPlayShow}"
                            width="100%"
                            id="videoCloud"
                            ref="videoshow"
                            height="100%"
                            x5-playsinline
                            playsinline
                            webkit-playsinline
                            x-webkit-airplay="allow"
                            preload="auto"
                            :src="detail.video"
                            @click="pauseVideo"
                            @ended="onPlayerEnded($event)"
                            loop="loop"></video>
                        <!-- 播放暂停按钮 -->
                        <img v-show="iconPlayShow"
                            v-if="!$fnc.isYkAPP()"
                            class="icon_play"
                            @click="playvideo"
                            src="../../../assets/img/play.png"
                            style="width:48px;height:48px;z-index:1000" />
                        <!-- 封面 -->
                        <img v-show="isVideoShow"
                            @click="playvideo"
                            :src="detail.video_piclink"
                            v-if="!$fnc.isYkAPP()"
                            class="play play1" />
                        <video-default class="video_box"
                            direction="vertical"
                            :url="detail.video"
                            :video_pic="detail.video_piclink"
                            v-else />
                    </div>
                </van-swipe-item>
                <van-swipe-item v-for="(item, index) in detail.piclink"
                    :key="index"
                    style="position:relative"
                    class="shop_swipe-item">
                    <img v-lazy="item.piclink"
                        class="shop_swi_img" />
                    <van-icon name="search"
                        size="28px"
                        color="#999"
                        style="position:absolute;bottom:30px;right:5px;z-index:999"
                        @click="big_img(index)"></van-icon>
                </van-swipe-item>

                <div class="custom-indicator"
                    slot="indicator">
                    {{ current + 1 }}/{{detail.video && detail.video != '' ? detail.piclink.length+1:detail.piclink.length}}
                </div>
            </van-swipe>

        </div>
        <div class="show_detail_remark">
            <p>{{detail.content}}
            </p>
        </div>
        <div class="show_detail_bottom">
            <div class="show_detail_bottom_left"
                v-if="detail.product && detail.pid>0"
                @click="$router.push('/shop/shopdetails?id=' + detail.pid)">
                <div class="show_detail_bottom_left_shop">
                    <img :src="$fnc.getImgUrl(detail.product.img)" v-if="detail.types == 2" />
                    <img :src="$fnc.getImgUrl(detail.product.piclink)" v-else />
                </div>
                <div class="show_detail_bottom_center">
                    <p>{{detail.product.title || ''}}</p>
                    <p class="price_regular">
                        <small>￥</small>
                        <b>{{$fnc.get_int_dec(detail.product.price,'int')}}</b>
                        <i>{{$fnc.get_int_dec(detail.product.price,'dec')}}</i>
                    </p>
                </div>
                <van-icon name="cart-o" />
            </div>
            <div class="show_detail_bottom_right">
                <!-- <p>
                    <van-icon name="chat-o" />
                    <span>{{detail.awesome || 0}}</span>
                </p> -->
                <p>
                    <van-icon name="good-job-o" />
                    <span @click="job_click($event)">{{detail.awesome || 0}}</span>
                </p>
            </div>
        </div>
    </div>
</template>
<script>
import { Swipe, SwipeItem, Image, ImagePreview } from "vant";

import videoDefault from "@/components/currency/videoDefault.vue";
export default {
    name: "show_detail",
    data () {
        return {
            startx: "",
            starty: "",

            current: 0,
            isVideoShow: true,
            playOrPause: true,
            video: null,
            iconPlayShow: true,
            list: [
                {
                    "id": "3850",
                    "aid": "117",
                    "cate": "product",
                    "piclink": "/api/resource/image/default/201911/d029e27b583f39dd2fac2b85b6c4efd6.png",
                    "sort": "1"
                },
                {
                    aid: "109",
                    cate: "product",
                    id: "3831",
                    piclink: "/api/resource/image/default/201911/6e2622e29bd0bf1ea2b130db3d53fa9e.jpg",
                    sort: "1",
                }
            ],
            info: {
                video: "http://media.vi5.cn/video/49b41b30-1707606a55e-0006-cf1c-513-41d0f.mp4",
                video_pic: "http://media.vi5.cn/snapshot/4c64c868cf384587b96261c59102754e00001.jpg",
            },

        };
    },
    props: {
        detail: {
            type: Object,
            default: () => ({})
        }
    },
    components: {
        [Swipe.name]: Swipe,
        [SwipeItem.name]: SwipeItem,
        [Image.name]: Image,
        videoDefault
    },
    methods: {
        job_click (e) {
            this.$api.getShop.enjoy_remark({ id: this.detail.id }).then(res => {
                if (res.code == 200) {
                    this.$toast.success('点赞成功')
                    e.target.innerText = Number(e.target.innerText || 0) + 1;
                }
            })
        },
        close_pop () {
            this.$emit('close_pop')
        },
        playvideo (event) {
            let video = document.querySelector("video");
            this.isVideoShow = false;
            this.iconPlayShow = false;
            video.play();
            window.onresize = function () {
            };
        },
        pauseVideo () {
            //暂停\播放
            let video = this.$refs.videoshow
            if (this.playOrPause && video) {
                video.pause();
                this.iconPlayShow = true;
                this.playOrPause = !this.playOrPause;
            } else {
                video.play();
                this.iconPlayShow = false;
                this.playOrPause = !this.playOrPause;
            }

        },
        onPlayerEnded (player) {
            //视频结束
            this.isVideoShow = true;
            this.current += this.current;
        },
        onChange (index) {
            let video = this.$refs.videoshow
            if (this.playOrPause) {
                video.pause();
                this.iconPlayShow = true;
            }
            this.current = index;
        },
        big_img (i) {
            var arr = [];
            this.detail.piclink.forEach((item) => {
                arr.push(this.$fnc.getImgUrl(item.piclink))
            })

            ImagePreview({ images: arr, startPosition: Number(i) });
        },
        touchend (e) {
            var endx, endy;
            endx = e.changedTouches[0].pageX;
            endy = e.changedTouches[0].pageY;
            var direction = this.getDirection(this.startx, this.starty, endx, endy);
            switch (direction) {

                case 1:
                    // alert("向上！")

                    this.$emit('touch_change', '1')
                    break;
                case 2:
                    this.$emit('touch_change', '2')
                    // alert("向下！")
                    break;

                default:
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
        }
    },
}
</script>
<style lang="less" scoped>
.show_detail {
    width: 100%;
    height: 100%;
    padding: 20px 0;
    display: flex;
    flex-flow: column;
    justify-content: space-between;
    align-items: center;
}
.show_detail_top {
    width: 100%;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding: 0 12px;
    margin-bottom: 20px;
    .show_detail_top_ava {
        width: 35px;
        height: 35px;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-right: 10px;
        img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            overflow: hidden;
        }
    }
    .show_detail_top_name {
        display: flex;
        flex-flow: column;
        justify-content: center;
        align-items: flex-start;
        margin-right: auto;
        p:nth-of-type(1) {
            font-size: 14px;
            font-weight: bold;
            color: #ffffff;
            line-height: 22px;
        }
        p:nth-of-type(2) {
            font-size: 10px;
            line-height: 12px;
            color: #ffffff;
        }
    }
}
.show_detail_content {
    width: 100%;
}
.show_detail_remark {
    width: 100%;

    padding: 0 12px;
    > p {
        font-size: 12px;
        line-height: 18px;
        color: #fff;
        background-color: black;
        text-align: justify;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        //隐藏行数
        -webkit-line-clamp: 3;
        overflow: hidden;
    }
}
.show_detail_bottom {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    padding: 0 12px;
    .show_detail_bottom_left {
        background-color: #eeeeee;
        border-radius: 10px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        padding: 10px;
        .show_detail_bottom_left_shop {
            width: 50px;
            height: 50px;
            margin-right: 10px;
            display: flex;
            justify-content: center;
            align-items: center;
            img {
                width: 100%;
            }
        }
        .show_detail_bottom_center {
            width: 120px;
            height: 100%;
            display: flex;
            flex-flow: column;
            justify-content: center;
            align-items: flex-start;
            font-size: 12px;

            > p:nth-of-type(1) {
                text-align: left;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                //隐藏行数
                -webkit-line-clamp: 2;
                overflow: hidden;
                line-height: 14px;
            }
        }
        .van-icon {
            font-size: 18px;
            color: #f76778;
            border-radius: 50%;
            border: 1px solid #f76778;
            margin-left: 10px;
        }
    }
    .show_detail_bottom_right {
        display: flex;
        flex-wrap: nowrap;

        justify-content: center;
        align-items: center;
        p {
            display: flex;
            flex-flow: column;
            justify-content: center;
            align-items: center;
            color: #fff;
            font-size: 12px;
            margin-left: 15px;
            .van-icon {
                font-size: 20px;
            }
        }
    }
}
.custom-indicator {
    position: absolute;
    right: 5px;
    bottom: 5px;
    padding: 2px 5px;
    color: #fff;
    font-size: 12px;
    background: rgba(0, 0, 0, 0.1);
}
.shop_swipe {
    .shop_swipe-item {
        height: 375px !important;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: black;
    }
    .shop_swi_img {
        width: 100%;
    }
}
.icon_play {
    position: absolute;
    top: 40%;
    right: 0;
    left: 0;
    bottom: auto;
    margin: auto;
    z-index: 999;
    height: 60px;
    background: rgba(0, 0, 0, 0.5);
    border-radius: 50%;
    opacity: 1;
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
    height: auto;
    top: 50%;
    max-height: 100%;
    left: 50%;
    transform: translate3d(-50%, -50%, 0px);
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
.play1 {
    opacity: 0.9;
    max-height: 10rem;
}
.price_regular > small {
    font-size: 12px;
    font-weight: bold;
}
.price_regular > b {
    font-size: 14px;
}
.price_regular > i {
    font-size: 12px;
    font-weight: normal;
    font-style: normal;
}
</style>