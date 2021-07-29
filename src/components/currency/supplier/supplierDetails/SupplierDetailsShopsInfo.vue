<template>
    <div class="s-d-shops fx">
        <div>
            <img :src="info.shop_logo"
                v-lazy='info.shop_logo'
                alt="">
        </div>
        <div>
            <p>
                <van-icon name="manager"
                    size="17px"
                    color="#ff125a" />
                <span>{{info.shop_title}}的店铺</span>
            </p>
            <p>
                <van-icon name="hotel-o"
                    size="15px"
                    color="#ff125a" />
                <span>{{$fnc.deleteNumber(info.shop_province+info.shop_city+info.shop_area+info.shop_town)+info.shop_address}}</span>
            </p>
            <div>
                <van-button icon="phone-o"
                    size="mini"
                    type="danger"
                    @click="sendPhone"
                    v-if="info.shop_tel">电话</van-button>
                <van-button icon="wechat"
                    size="mini"
                    type="primary"
                    @click.prevent="showEwm"
                    v-if="info.shop_wechat!=''">微信</van-button>
                <van-button icon="star-o"
                    size="mini"
                    type="info"
                    @click="showInfo">关注</van-button>
                <van-button size="mini"
                    type="primary"
                    @click="$router.push({path:'/zhanye/receipt/transaction',query:{id:$route.query.id}})">
                    线下支付
                </van-button>
            </div>
        </div>
        <van-popup v-model="show"
            class="animated show-share-pop "
            position
            :class="[show?'bounceInDown':'bounceOutUp']"
            get-container="body">
            <div>
                <div class="upload_shaer_img">
                    <img :src="info.shop_wechat"
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
                        <img src="../../../../assets/img/member/uplodeimg.png"
                            class="upload_img_ewm"
                            alt />
                        <span>{{isWx==0?'长按保存':"保存到系统相册"}}</span>
                    </div>
                </div>
            </div>
        </van-popup>
    </div>
</template>

<script>
export default {
    props: {
        info: {
            type: Object,
            default: () => { }
        }
    },
    data () {
        return {
            show: false,
            isWx: ""
        }
    },
    created () {
        var ua = window.navigator.userAgent.toLowerCase();
        if (ua.match(/MicroMessenger/i) == 'micromessenger') {
            this.isWx = '0';                                      //第一个微信端
        } else if (ua.match(/ykapp/i) == 'ykapp') {
            this.isWx = '1';                        //第二个app
        } else {
            this.isWx = '2';       //剩下的网页
        }
    },
    methods: {
        showInfo () {
            this.$toast.fail("暂未开放")
        },
        sendPhone () {
            this.$fnc.tel(this.info.shop_tel);

        },
        showEwm () {
            this.show = true;
        },
        uploadShare () {
            var that = this;
            that.show = false;

            that.$fnc.ykAppUpImage(that.info.shop_wechat)
            // this.$fnc.getImageBase64(that.info.shop_wechat,(url)=>{
            //     that.$fnc.ykAppUpImage(url)
            // })

        }
    }
}
</script>


<style lang="less" scoped>
.show-share-pop {
    //   width:100%;
    background-color: transparent;
    border-radius: 0;
    width: 100%;
    left: 0%;
    top: 5%;
    > div {
        width: 100%;
        display: flex;
        flex-direction: column;
    }
}
.upload_shaer_img {
    position: relative;
    width: 60%;
    margin: 0 auto;

    i {
        position: absolute;
        top: 0;
        right: 0;
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
.s-d-shops {
    background: #fff;
    padding: 9px 17px;
    border-radius: 10px 10px 0 0;
    align-items: flex-end;
    justify-content: flex-start;
    > div:first-child {
        width: 85px;
        height: 85px;
        border-radius: 5px;
        overflow: hidden;
        > img {
            display: block;
            max-width: 100%;
            border: 1px solid #eee;
        }
    }
    > div:last-child {
        flex-direction: column;
        margin-left: 18px;
        i {
            vertical-align: bottom;
        }
        > p:first-child {
            span {
                color: #000000;
                font-size: 16px;
                margin-left: 8px;
            }
        }
        > p:nth-child(2) {
            margin-top: 6px;
            span {
                color: #979797;
                font-size: 13px;

                margin-left: 8px;
            }
        }
        > div {
            margin-top: 12px;
            button {
                height: 27px;
                width: 76px;
                font-size: 14px;
            }
        }
    }
}
</style>
