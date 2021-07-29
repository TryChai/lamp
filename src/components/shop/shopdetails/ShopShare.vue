<template>
    <div>
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
                        <small>￥</small>30
                    </span>
                </p>
                <p class="shop-share-tj">推荐理由：{{shopInfo.sub_title}}</p>
            </div>
            <div class="shop-share-footer fx">
                <div class="fx">
                    <img :src="$fnc.getImgUrl($store.state.user.avatar,'sex')"
                        crossorigin="anonymous"
                        alt />
                    <div>
                        <span>{{($store.state.user.nickname+'').length>=12?($store.state.user.nickname+'').slice(0,12) : $store.state.user.nickname || $store.state.user.username}}</span>
                        <p>为你推荐</p>
                    </div>
                </div>
                <!-- <div>
          <img :src="'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data='+url+$route.path+'?id='+shopInfo.id+'&26tgid=q1'" alt />
        </div> -->
                <div id="qrcode"></div>
            </div>
        </div>
        <div class="upload_shaer_img">
            <img :src="imgUrl"
                class="imgUrl"
                alt />
            <van-icon name="clear"
                size="28px"
                color="red"
                @click="show=false" />
        </div>
        <div class="upload_shaer_btn">
            <div class="tc"
                @click="uploadShare(isWx)">
                <img src="../../../assets/img/member/uplodeimg.png"
                    class="upload_img_ewm"
                    alt />
                <span>{{isWx==0?'长按保存':"保存到系统相册"}}</span>
            </div>
        </div>
    </div>
</template>

<script>
import html2canvas from "html2canvas";
import QRCode from 'qrcodejs2'
export default {
    name: "ShopShare",
    props: {
        shopInfo: {
            type: Object,
            default: () => { }
        },
        showShare: {
            type: Boolean,
            default: false
        }
    },
    data () {
        return {
            url: location.origin,
            imgUrl: "",
            isWx: "0"
        };
    },
    watch: {
        showShare (val) {
            if (val) {
                // this.qrcode()  

            }
        }
    },
    mounted () {
        this.qrcode()
        this.showPop();
    },
    methods: {
        qrcode () {
            let qrcode = new QRCode('qrcode', {
                width: 132,
                height: 132,
                text: this.url + this.$route.path + '?id=' + this.shopInfo.id, // 二维码地址
                colorDark: "#000",
                colorLight: "#fff",
            })
            this.showPop();
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
                        this.show = true;
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
.upload_shaer_img {
    position: relative;
    margin: 0 auto;
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
    // position: fixed;
    top: -200%;
    width: 100%;
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
            width: 80px;
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
    border-top: 1px dashed #c1c1cc;
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
#qrcode {
    display: inline-block;
    img {
        width: 56px;
        height: 56px;
        background-color: #fff; //设置白色背景色
        padding: 2px; // 利用padding的特性，挤出白边
    }
}
</style>
