<template>
    <div class="extract-supplier">
        <div to>
            <div class="fx">
                <van-image class="extract-supplier-img"
                    width="68px"
                    height="68px"
                    round
                    lazy-load
                    :src="item.piclink">
                    <template v-slot:loading>
                        <van-loading type="spinner"
                            size="20" />
                    </template>
                </van-image>
                <div class="fx_3 extract-supplier-info">
                    <p class="extract-supplier-info-title">
                        {{item.title}}
                        <span>已认证</span>
                    </p>
                    <div class="fx">
                        <div>
                            <p class="extract-supplier-info-title-cn">
                                地址：{{item.province+item.city+item.area+item.add}}</p>
                            <p class="extract-supplier-info-title-cn"
                                style="margin-bottom:0">电话：{{item.tel}}</p>
                            <p class="extract-supplier-info-title-cn"
                                style="margin-bottom:0"
                                v-show="item.distance>0">
                                距您
                                <span>{{toDistance}}</span>
                            </p>
                        </div>
                        <div class="extract-supplier-dw tr"
                            @click="toDh">
                            <img src="../../../../assets/img/supplier/dw.png"
                                alt />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { Image, Loading } from "vant";
import wx from 'weixin-js-sdk';
export default {
    name: "extract-supplier",
    props: {
        item: {
            type: Object,
            default: () => { }
        }
    },
    data () {
        return {};
    },
    computed:{
        toDistance(){
            if(this.item.distance>=1000){
                return this.item.distance/1000+' 公里'
            }else{
                return this.item.distance+' 米'
            }
        }
    },
    components: {
        [Image.name]: Image,
        [Loading.name]: Loading
    },
    created () { },
    mounted () { },
    methods: {
        toPhone () {
            this.$fnc.tel(this.item.tel)
        },
        toSupplier () {
            this.$router.push('/supplier/supplierdetails?id=' + this.item.sid)
        },
        toDh () {
            var ua = window.navigator.userAgent.toLowerCase();
            if (ua.match(/ykapp/i) == "ykapp") {
                this.isApp = true; //第二个app
            }
            var that = this;
            if (that.isApp) {
                try {
                    ykAPP.getLatitudeLongitude(that.item.latitude, that.item.longitude);
                } catch (error) {
                    that.$toast.fail("App地图跳转失败");
                }
            } else if (that.$fnc.isWx()) {
                var obj = {};
                obj.latitude = parseFloat(that.item.latitude);
                obj.longitude = parseFloat(that.item.longitude);
                obj.name = that.item.shop_title;
                obj.address =
                    that.item.province + that.item.city + that.item.area + that.item.add;
                obj.scale = 14;
                obj.infoUrl =
                    location.origin + "/supplier/supplierdetails?id=" + that.item.id;


                // this.wxApi.ToLocation(obj);
                wx.openLocation(obj);

            } else {
                that.$toast.fail("地图跳转失败");
            }
        }
    }
};
</script>
<style lang='less' scoped>
.extract-supplier {
    > div {
        display: block;
        background: #fff;
        margin: 16px 10px 0;
        padding: 16px 0;
        border-radius: 5px;
        .extract-supplier-img {
            box-shadow: 0 0 10px #cecece;
            margin-left: 8px;
        }
        .extract-supplier-info {
            margin-left: 10px;
            .extract-supplier-info-title {
                font-size: 15px;
                font-weight: bold;
                color: #000000;
                display: flex;
                align-items: center;
                margin-bottom: 8px;
                > span {
                    font-size: 11px;
                    background: #ffb81f;
                    padding: 2px 2px;
                    margin-left: 4px;
                    border-radius: 3px;
                }
            }
            .extract-supplier-info-title-cn {
                font-size: 12px;
                color: #999999;
                line-height: 1.4;
                margin-bottom: 6px;
                > span {
                    font-size: 18px;
                    font-weight: bold;
                    color: #1a1a1a;
                    margin: 0 6px;
                }
            }
        }
        .extract-supplier-dw {
            padding-right: 26px;
            align-self: flex-start;
            margin-top: 14px;
            width: 118px;
            img {
                width: 29px;
            }
        }
    }
}
</style>

