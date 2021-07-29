<template>
    <div class="cate_header_top">
        <div class="cate_header_top_img">
            <van-icon name="arrow-left"
                @click="toBack" />
            <img :src="$fnc.getImgUrl(info.shop_bj)"
                v-if="info.shop_bj && info.shop_bj != ''"
                alt="">
            <img src="./../../../assets/img/supplier/suppliercatetop.jpg"
                v-else
                alt="">
            <div class="cate_header_top_logo">
                <img :src="$fnc.getImgUrl(info.shop_logo)"
                    alt="">
            </div>
        </div>
        <div class="cate_header_top_content">
            <p>{{info.shop_title}}</p>
            <p>
                粉丝数：{{info.collect_number}}<span></span>
                商品数量：{{info.product_number}}<span></span>
                蜂鸟专送约30分钟
            </p>
            <div v-if="bag && bag.length >0">
                <div class="cate_header_top_content_coupon"
                    v-for="(item,i) in bag"
                    :key="i">
                    <p>{{item.title}}</p>
                    <p @click="getcoupon(item.id)">领取<span></span> <span></span></p>
                </div>
            </div>
            <p class="cate_header_top_content_gg">
                {{$fnc.deleteNumber(info.shop_province+info.shop_city+info.shop_area+info.shop_town)+info.shop_address}}
                <span>
                    <i name
                        @click="toDh"
                        class="fa fa-send"
                        style="color:#999999;font-size:18px" />
                </span>
            </p>
        </div>
    </div>
</template>
<script>
export default {
    name: "component_name",
    data () {
        return {
            bag: [],
            info: {},
        };
    },
    components: {
    },
    created () {
        if (this.$route.query.id) {
            this.getinfo();
            this.getredbag();
        }
    },
    methods: {
        getcoupon (id) {
            this.$api.getShop.getCoupon({ id: id }).then(res => {
                if (res.code == 200) {
                    this.$toast.success("领取成功");
                    this.getredbag();
                }
            })
        },
        getredbag () {
            this.$api.getSupplier.get_redbag({ id: this.$route.query.id }).then(res => {
                if (res.code == 200) {
                    this.bag = res.result || [];
                }
            })
        },
        toDh () {
            var ua = window.navigator.userAgent.toLowerCase();
            if (ua.match(/ykapp/i) == "ykapp") {
                this.isApp = true; //第二个app
            }
            var that = this;
            if (that.isApp) {
                try {
                    this.$fnc.appNav(that.info.shop_latitude, that.info.shop_longitude);
                } catch (error) {
                    that.$toast.fail("App地图跳转失败");
                }
            } else if (that.$fnc.isWx()) {
                var obj = {};
                obj.latitude = parseFloat(that.info.shop_latitude);
                obj.longitude = parseFloat(that.info.shop_longitude);
                obj.name = that.info.shop_title;
                obj.address =
                    that.info.shop_province +
                    that.info.shop_city +
                    that.info.shop_area +
                    that.info.shop_town +
                    that.info.shop_address;
                obj.scale = 14;
                obj.infoUrl =
                    location.origin + "/supplier/supplierdetails?id=" + that.info.id;
                this.wxApi.ToLocation(obj);
            }
        },
        getinfo () {
            this.$api.getSupplier.getSupplierDetails({ id: this.$route.query.id }).then(res => {
                if (res.code == 200) {
                    console.log(res.result)
                    this.info = res.result;
                }
            })
        },
    },
}
</script>
<style lang="less" scoped>
.cate_header_top {
    width: 100%;
    // height: 250px;
    display: flex;
    flex-flow: column;
    justify-content: flex-start;
    align-items: center;
    .cate_header_top_img {
        width: 100%;
        height: 115px;
        position: relative;
        .van-icon {
            font-size: 24px;
            position: absolute;
            top: 10px;
            left: 12px;
            color: #ffffff;
        }
        img {
            width: 100%;
            height: 100%;
        }
        .cate_header_top_logo {
            width: 75px;
            height: 75px;
            position: absolute;
            left: 0;
            right: 0;
            top: 55px;
            margin: auto;
            img {
                width: 100%;
                height: 100%;
            }
        }
    }
    .cate_header_top_content {
        width: 100%;
        flex: 1;
        display: flex;
        flex-flow: column;
        justify-content: flex-start;
        align-items: center;
        padding: 30px 35px 0 35px;

        > p:nth-of-type(1) {
            width: 75%;
            text-align: center;
            font-size: 18px;
            font-weight: bold;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        > p:nth-of-type(2) {
            font-size: 12px;
            color: #666666;
            display: flex;
            flex-wrap: nowrap;
            justify-content: center;
            align-items: center;
            line-height: 30px;
            span {
                width: 1px;
                height: 10px;
                background-color: #929292;
                margin: 0 5px;
            }
        }
        > div {
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            .cate_header_top_content_coupon {
                width: auto;
                height: 22px;
                background-color: #f7730b;
                // background-color: #ffe577;
                font-size: 12px;
                color: #ffffff;
                // color: #824a11;
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 10px;
                margin-right: 5px;
                > p:nth-of-type(1) {
                    padding: 0 24px;
                }
                > p:nth-of-type(2) {
                    padding: 0 12px 0 3px;
                    position: relative;
                    > span {
                        position: absolute;
                        width: 3px;
                        height: 3px;
                        border-radius: 50%;
                        overflow: hidden;
                        background-color: #ffffff;
                    }
                    > span:nth-of-type(1) {
                        top: -5px;
                        left: -5px;
                    }
                    > span:nth-of-type(2) {
                        bottom: -5px;
                        left: -5px;
                    }
                }
            }
        }

        .cate_header_top_content_gg {
            width: 100%;
            font-size: 12px;
            color: #a2a2a2;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            text-align: center;
        }
    }
}
</style>