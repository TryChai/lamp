<template>
    <div class="details_shop_conn"
        @scroll="scroll"
        ref="content">
        <div class="step-jump">
            <div class="fx details_head"
                v-show="showNav">
                <div>
                    <img src="../../assets/img/shop/01.png"
                        class="op_img"
                        @click="toBack"
                        alt />
                </div>
                <div>
                    <img src="../../assets/img/shop/03.png"
                        class="op_img"
                        @click="addEwm"
                        alt />
                </div>
            </div>
            <div class="fx details_head"
                v-show="!showNav"
                :style="opacityStyle">
                <div>
                    <img src="../../assets/img/shop/02.png"
                        @click="toBack"
                        alt />
                </div>
                <div class="details_head_a fx">
                    <a @click.prevent="jump(i)"
                        :class="{active:i==activeStep}"
                        v-for="(item,i) in lis"
                        :key="i">{{item}}</a>
                </div>
                <div>
                    <img src="../../assets/img/shop/04.png"
                        @click="addEwm"
                        alt />
                </div>
            </div>
        </div>

        <shop-details-swiper v-show="shopInfo.img_json.length>0"
            :list="shopInfo.img_json"
            id="shophead"
            @setXq="setXq" />
        <shop-details-title :shopInfo="shopInfo" />
        <div class="details_liubai s1"
            v-if="shopInfo.shopInfo && shopInfo.coupon.length>0 || shopInfo.discount_number>0 || shopInfo.send_score>0">
        </div>
        <!-- <div class="details_liubai"></div> -->

        <shop-details-cell :shopInfo="shopInfo" />

        <div class="details_liubai step-jump"
            v-if="shopInfo.one_talk"></div>
        <shop-details-sevaluate class
            :oneTalk="shopInfo.one_talk"
            :talk_num="shopInfo.talk_num"
            v-if="shopInfo.one_talk" />
        <div class="details_liubai"
            v-if="shopInfo.sid>0 ||  shopInfo.recommend.length>0 || shopInfo.hot.length>0"></div>
        <shopDetailsShop :shopInfo="shopInfo" />
        <div class="details_liubai"></div>
        <shopDetailsInfo :content="shopInfo.content"
            v-if="shopInfo.content"
            id="shopinfo"
            class="step-jump" />

        <van-goods-action>
            <van-goods-action-icon icon="shop-o"
                text="店铺"
                v-if="shopInfo.sid>0"
                @click="toSupplierShop" />
            <van-goods-action-icon icon="home-o"
                @click="$router.push('/index')"
                text="首页"
                v-else />

            <van-goods-action-icon icon="chat-o"
                text="客服"
                v-if="shopInfo.kf_im"
                @click="toIm" />
            <van-goods-action-icon icon="chat-o"
                text="会员"
                v-else
                @click="$router.push('/member/member')" />
            <van-goods-action-icon icon="cart-o"
                :info="shopInfo.cart_number||''"
                @click="$router.push('/shop/shopcard')"
                text="购物车" />

            <van-goods-action-button type="warning"
                @click="addCard(0)"
                text="加入购物车"
                v-if="shopInfo.types==0||shopInfo.types==1" />
            <van-goods-action-button type="danger"
                @click="addCard(1)"
                text="立即购买"
                v-if="shopInfo.types==0||shopInfo.types==1" />

            <van-goods-action-button type="danger"
                @click="addCard(1)"
                text="支付定金"
                v-if="shopInfo.types==6" />
        </van-goods-action>

        <div style="height:50px"></div>

        <van-popup v-model="show"
            position="bottom"
            :overlay="true"
            style="border-radius: 5px 5px 0 0;">
            <shopDetailsSku :shopInfo="shopInfo"
                @closePop="getClosePop"
                :toAut="index" />
        </van-popup>
        <van-popup v-model="showShare"
            class="animated show-share-pop"
            position
            :class="[showShare?'bounceInDown':'bounceOutUp']">
            <div>
                <div class="upload_shaer_img">
                    <img :src="imgUrl"
                        class="imgUrl"
                        alt />
                    <van-icon name="clear"
                        size="28px"
                        color="red"
                        @click="showShare=false" />
                </div>
                <div class="upload_shaer_btn">
                    <div class="tc"
                        @click="uploadShare(isWx)">
                        <img src="../../assets/img/member/uplodeimg.png"
                            class="upload_img_ewm"
                            alt />
                        <span>{{isWx==0?'长按保存':"保存到系统相册"}}</span>
                    </div>
                </div>
            </div>
        </van-popup>
        <div class="shop-share"
            ref="imageDom">
            <div class="shop-share-con">
                <div class="shop-share-head">
                    <img :src="$fnc.getImgUrl(shopInfo.piclink)"
                        crossorigin="anonymous"
                        alt />
                </div>
                <p class="shop-share-title">
                    {{shopInfo.title}}
                    <span>
                        <small>￥</small>
                        {{shopInfo.price}}
                    </span>
                </p>
                <p class="shop-share-tj">推荐理由：{{shopInfo.sub_title}}</p>
            </div>
            <img src="../../assets/img/shop/dad.png"
                crossorigin="anonymous"
                alt />
            <div class="shop-share-footer fx">
                <div class="fx">
                    <img :src="$fnc.getImgUrl($store.state.user.avatar,'sex') || ($store.state.user.sex==2? require('../../assets/img/member/sex2.png'): require('../../assets/img/member/sex1.png'))"
                        crossorigin="anonymous"
                        alt />
                    <div>
                        <span>{{($store.state.user.nickname+'').length>=12?($store.state.user.nickname+'').slice(0,12) : $store.state.user.nickname || $store.state.user.username}}</span>
                        <p>为你推荐</p>
                    </div>
                </div>
                <div id="qrcode"></div>
            </div>
        </div>
    </div>
</template>

<script>
import shopDetailsSwiper from "./shopdetails/shopdetailsswiper";
import shopDetailsTitle from "./shopdetails/shopdetailstitle";
import shopDetailsCell from "./shopdetails/shopdetailscell";
import shopDetailsSevaluate from "./shopdetails/shopdetailsevaluate";
import shopDetailsShop from "./shopdetails/shopdetailsshop";
import shopDetailsInfo from "./shopdetails/shopdetailsinfo";
import shopDetailsSku from "./shopdetails/shopdetailssku";
import ShopShare from "./shopdetails/ShopShare";
import { GoodsAction, GoodsActionIcon, GoodsActionButton } from "vant";
import html2canvas from "html2canvas";
import QRCode from "qrcodejs2";
import Cookies from 'js-cookie';
import { clearInterval } from 'timers';
export default {
    name: "productdetails",
    components: {
        shopDetailsSwiper,
        shopDetailsTitle,
        shopDetailsTitle,
        shopDetailsCell,
        shopDetailsSevaluate,
        shopDetailsShop,
        shopDetailsInfo,
        [GoodsAction.name]: GoodsAction,
        [GoodsActionIcon.name]: GoodsActionIcon,
        [GoodsActionButton.name]: GoodsActionButton,
        shopDetailsSku,
        ShopShare
    },
    data () {

        return {
            shopInfo: {
                img_json: [],
                one_talk: {},
                recommend: [],
                hot: []
            },
            lis: [],
            activeStep: -1,
            index: 0,
            show: false,
            showNav: true,
            opacityStyle: {
                opacity: 0,
                background: ""
                //控制
            },
            scrollTop: 0,
            pageTop: 0,
            showShare: false,
            url: location.origin,
            imgUrl: "",
            isWx: "0",
            timer: null
        };
    },
    watch: {
        $route (to, from) {
            if (to.name != 'shopdetails') {
                sessionStorage.setItem('tid', this.$route.query.tid);
            }

        }
    },
    beforeDestroy () {
        if (this.timer) { //如果定时器还在运行 或者直接关闭，不用判断
            close(this.timer); //关闭
        }
        sessionStorage.setItem('tid', this.$route.query.tid);
    },
    beforeCreate () {


    },
    created () {
        this.getShopDetails(this.$route.query.id);
        if (this.appusers.uid != this.$route.query.tid) {
            // sessionStorage.setItem('tid',this.$route.query.tid);
            this.$router.push(
                this.$route.path + "?tid=" + this.appusers.uid + "&id=" + this.$route.query.id + '&tshare=' + this.$route.query.tid

            )
            // location.replace=location.hostname+location.pathname+"?tid=" + this.appusers.uid+"&id="+this.$route.query.id+'&tshare='+this.$route.query.tid

        }
        close(this.timer);


        this.$nextTick(() => {
            this.pageTop = this.scrollTop;

        });
        var ua = window.navigator.userAgent.toLowerCase();
        var user = Cookies.get("user") ? true : false;
        if (ua.match(/MicroMessenger/i) == 'micromessenger') {
            this.isWx = '0';                                    //第一个微信端

            if (user && this.$store.state.config.plugin.zyfh.is_open == 1) {
                this.starTimer()
            }

        } else if (ua.match(/ykapp/i) == 'ykapp') {
            if (user && this.$store.state.config.plugin.zyfh.is_open == 1) {
                this.starTimer()
            }
            this.isWx = '1';                        //第二个app
        } else {
            if (user && this.$store.state.config.plugin.zyfh.is_open == 1) {
                this.starTimer()
            }
            this.isWx = '2';       //剩下的网页
        }

    },
    mounted () {


    },
    methods: {
        starTimer () {
            var tidd = this.$route.query.tshare || this.appusers.uid;
            if (tidd == 0 || tidd == this.$route.query.tid || tidd == 'undefined') {
                return;
            }
            this.timer = setInterval(() => {
                this.endTp()
            }, 10000)
        },
        toIm () {
            var tid = this.$route.query.tshare || this.appusers.uid;
            this.getTp({ pid: this.$route.query.id, sid: this.shopInfo.sid, is_im: 1, tid: tid })
            this.$router.push(this.shopInfo.kf_im)
        },
        toSupplierShop () {
            var tid = this.$route.query.tshare || this.appusers.uid;
            this.getTp({ pid: this.$route.query.id, sid: this.shopInfo.sid, is_store: 1, tid: tid })
            this.$router.push('/supplier/supplierdetails?id=' + this.shopInfo.sid);

        },
        endTp (pid) {
            var user = Cookies.get("user") ? false : true;
            if (user && this.$store.state.config.plugin.zyfh.is_open == 0) return;

            pid = pid || this.$route.query.id || '';
            var tid = sessionStorage.getItem('tid') || '';

            if (pid == '' || tid == '') {
                return;
            }
            var sid = this.shopInfo.sid || '';
            this.$api.getZhanYe.endShopTp({ pid, sid })

        },
        getTp ({ pid, sid, tid, is_ask, is_msg, is_im, is_store }) {
            var user = Cookies.get("user") ? false : true;
            var tidd = sessionStorage.getItem('tid') || 0;
            if (tidd == 0 || tidd == this.$store.state.user.uid || tidd == 'undefined') {
                return;
            }
            if (user && this.$store.state.config.plugin.zyfh.is_open == 1) return;
            var params = {};
            params.pid = pid || this.$route.query.id || '';

            params.sid = sid || '0';
            params.tid = tidd;
            params.is_ask = is_ask || '0';
            params.is_msg = is_msg || '0';
            params.is_im = is_im || '0';
            params.is_store = is_store || '0';
            this.$api.getZhanYe.addShopTp(params)

        },

        addEwm () {
            var user = Cookies.get('user') ? false : true;
            if (!user) {

                this.showPop();
            } else {
                this.$toast.fail("请先登录！")
            }

        },
        addCard (i) {
            var user = Cookies.get("user") ? false : true;

            if (user) {
                this.$toast.fail("请先登录！");
                setTimeout(() => {
                    this.$store.dispatch("getUser");
                }, 1000);

                return false;
            }


            var reg_permission = this.$store.state.config.shop.reg_permission || 0;
            var users = this.$store.state.user;
            if (users.tel == '' && this.$store.state.config.shop.reg_tel == '1') {
                // this.$store.commit("setShowBingPhone", true);
                this.$router.push('/index');
            } else if (users.tid == 0 && this.$store.state.config.shop.reg_permission == '1') {
                this.$store.commit('setTsShare', true);
            } else {
                this.$store.commit("setShowBingPhone", false);
                this.$store.commit('setTsShare', false);
            }

            if (i == 0) {
                if (this.shopInfo.types > 0) {
                    this.index = 1;
                } else {
                    this.index = 0;
                }
            } else {
                this.index = 1;
            }

            this.show = true;
        },
        setXq () {
            this.jump(2);
        },
        jump (index) {
            let that = this;
            this.activeStep = index;
            // 用 class="step-jump" 添加锚点
            let jump = document.querySelectorAll(".step-jump");
            let total = jump[index].offsetTop + 45;

            //        this.$emit('viewScroll', total)
            let distance = this.pageTop;
            //         平滑滚动，时长500ms，每10ms一跳，共50跳
            let step = (total / 50) >> 0;
            if (total > distance) {
                smoothDown();
            } else {
                let newTotal = distance - total;
                step = (newTotal / 50) >> 0;
                smoothUp();
            }
            function smoothDown () {
                if (distance < total) {
                    distance += step;
                    that.onScroll1(distance);
                    setTimeout(smoothDown, 10);
                } else {
                    that.onScroll1(total);
                }
            }
            function smoothUp () {
                if (distance > total) {
                    distance -= step;
                    that.onScroll1(distance);

                    setTimeout(smoothUp, 10);
                } else {
                    that.onScroll1(total);
                }
            }
        },

        onScroll1 (top) {
            this.$refs.content.scrollTop = top - 45;
        },
        onScroll () {
            let _article = document.querySelectorAll(".step-jump");
            _article.forEach((item, index) => {
                if (this.scrollTop >= item.offsetTop) {
                    this.activeStep = index;
                }
            });
        },
        scroll (e) {
            var top = e.srcElement.scrollTop;
            if (top > 60) {
                //当下拉60像素后，顶部渐变出现导航栏
                let opacity = top / 140;
                opacity = opacity > 1 ? 1 : opacity;

                let background = opacity;

                this.opacityStyle.opacity = opacity;
                this.opacityStyle.background = "rgba(255,68,68," + opacity + ")";

                this.showNav = false;
            } else {
                this.showNav = true;
            }

            this.scrollTop = top;
            this.onScroll();
            this.pageTop = top;
        },
        getClosePop () {
            this.show = false;
        },

        getShopDetails (id) {
            var params = {};
            params.id = id || "";
            this.$api.getShop.getShopDetails(params).then(res => {
                if (res.code == 200) {
                    this.shopInfo = res.result;
                    this.qrcode();
                    var user = Cookies.get("user") ? true : false;
                    if (user && this.$store.state.config.plugin.zyfh.is_open == 1) {
                        this.getTp({ pid: this.shopInfo.id, sid: this.shopInfo.sid })
                    }

                    var arr = ["商品"];
                    if (res.result.one_talk) {
                        arr.push("评论");
                    }
                    if (res.result.content) {
                        arr.push("详情");
                    }
                    this.lis = arr;
                }
            });
        },
        qrcode () {
            let qrcode = new QRCode("qrcode", {
                width: 56,
                height: 56,
                text: this.url + this.$route.path + "?id=" + this.$route.query.id + '&tid=' + (this.$store.state.user.uid || '0'), // 二维码地址
                colorDark: "#000",
                colorLight: "#fff"
            });
        },
        showPop () {
            const toast = this.$toast.loading({
                duration: 0, // 持续展示 toast
                forbidClick: true, // 禁用背景点击
                loadingType: "spinner",
                message: "加载中..."
            });
            html2canvas(this.$refs.imageDom, { useCORS: true, logging: true }).then(
                canvas => {
                    // 转成图片，生成图片地址
                    this.imgUrl = canvas.toDataURL("image/png");
                    if (this.imgUrl) {
                        this.showShare = true;
                        toast.clear();
                    }
                }
            );
        },
        uploadShare (wx) {
            this.show = false;
            this.$fnc.ykAppUpImage(this.imgUrl)

        },
    }
};
</script>


<style lang="less" scoped>
.show-share-pop {
    width: 100%;
    background-color: transparent;
    border-radius: 0;
    left: 0;
    top: 0;
}
.active {
    color: #fff !important;
    opacity: 1 !important;
    border-bottom: 2px solid #fff;
}
.details_head_a {
    height: 100%;
}
.details_head_a a {
    display: inline-block;
    height: 100%;
    font-size: 18px;
    line-height: 45px;
    color: #fff;
    opacity: 0.4;
    margin: 0 10px;
}
.fade-enter {
    opacity: 0;
}
.fade-enter-active {
    transition: opacity 1s;
}
.details_head {
    padding: 0 10px;
    position: fixed;
    width: 100%;
    z-index: 10;
    height: 45px;
    background-size: 100%;
    img {
        width: 26px;
        height: 26px;
        vertical-align: baseline;
    }
    .op_img {
        opacity: 0.3;
    }
}
.details_liubai {
    background: #f3f3f3;
    height: 10px;
}
.details_shop_conn {
    height: 100%;
    overflow: auto;
}
.details_shop_conn > div:not(:first-child) {
    z-index: 3;
}
.upload_shaer_img {
    position: relative;
    margin: 0 auto;
    width: 80%;
    margin: 5% auto 0;
    i {
        position: absolute;
        top: 10px;
        right: 10px;
    }
}
.imgUrl {
    display: block;
    max-width: 100%;
    margin: 0 auto;
}
.upload_shaer_btn {
    padding-top: 10px;
    color: #fff;
    font-size: 14px;
    position: relative;
    text-align: center;
    .upload_img_ewm {
        display: block;
        width: 34px;
        margin: 0 auto;
    }
    span {
        display: inline-block;
        margin-top: 20px;
    }
}
.shop-share {
    position: fixed;
    top: -200%;
    width: 100%;
    display: flex;
    flex-direction: column;
}
.shop-share-con {
    width: 100%;
    font-size: 14px;
    line-height: 1;
    overflow: hidden;
    padding: 0 8px;
    > .shop-share-head {
        margin: 8px 0px 15px;
        box-shadow: 0px 0px 24px #d7d7d7;
        > img {
            width: 100%;
            border-radius: 5px;
        }
    }
    > p.shop-share-title {
        line-height: 1.4;
        font-size: 16px;
        color: #2f2f2f;
        position: relative;
        > span {
            position: absolute;
            right: 0;
            bottom: 0;
            color: #ff2d2c;
            min-width: 80px;
            font-size: 22px;
            text-align: right;
            line-height: 1;
            > small {
                font-size: 15px;
            }
        }
    }
    > p.shop-share-tj {
        color: #c1c1c1;
        font-size: 12px;
        padding: 13px 0;
    }
}
.shop-share-footer {
    padding: 0 8px;
    height: 87px;
    font-size: 14px;
    line-height: 1;
    > div:first-child {
        img {
            width: 52px;
            height: 52px;
            border-radius: 50%;
            margin-right: 17px;
        }
        > div {
            span {
                font-size: 17px;
                color: #000000;
                font-weight: 500;
            }
            p {
                font-size: 15px;
                margin-top: 7px;
                color: #aaaaaa;
            }
        }
    }
    > div.qrcode {
        img {
            width: 56px;
            height: 56px;
            border-radius: 5px;
        }
    }
}
</style>
