<template>
    <div class="shops-con"
        id="shops-con"
        v-show="load">
        <div class="shops-box">
            <shopsHead @showTabs="getShowTabs"
                :paramsCity="params"
                @searchTitle="getSearch_btn"
                :dia_show="dia_show"
                @emitAddress="getemitAddress" />
            <div>
                <van-tabs class="shops-box-tabs"
                    ref="Tabs"
                    v-model="active"
                    :sticky="true"
                    :border="false"
                    line-width="15px"
                    color="#ff7124"
                    :background="supplier_background"
                    title-inactive-color="#424242"
                    title-active-color="#1a1a1a"
                    @click="onClick"
                    @change="getTypeDate">
                    <shop-swiper v-if="info.slide.is_show=='1'"
                        :slide="info.slide.banner" />
                    <supplier-index-head
                        v-if="info.navigation.is_show=='1' && info.navigation.banner.length>0"
                        :menuList="info.navigation.banner" />

                    <van-tab v-show="params.province"
                        title="当前地区"
                        class="shops-box-tabs-index">
                        <!-- <van-divider class="divider-line" /> -->
                        <shops-model :partList="partList"
                            v-if="partList.length>0" />

                        <shops-horizontal-shop :product="info.product"
                            v-if="info.product.is_show==1 && !$route.query.cate" />

                        <supplier-index-shops v-if="info.merchant.is_show!='0'"
                            :pro="info.merchant.pro" />
                        <div v-else
                            class="empty_shop"
                            style>
                            <img src="./../../../assets/img/empty.png"
                                alt />
                            <p>暂未发现商家..</p>
                        </div>
                    </van-tab>

                    <van-tab title="推荐"
                        class="shops-box-tabs-index">
                        <!-- <van-divider class="divider-line" /> -->
                        <shops-model :partList="partList"
                            v-if="partList.length>0" />
                        <shops-horizontal-shop :product="info.product"
                            v-if="info.product.is_show==1 && !$route.query.cate" />
                        <!-- <van-divider
                class="divider-line"
                v-if="info.product.is_show==1&& !$route.query.cate"
            />-->
                        <supplier-index-shops
                            v-if="info.merchant.is_show!='0' && info.merchant.pro != undefined && info.merchant.pro.length>0"
                            :pro="info.merchant.pro" />
                        <div v-else
                            class="empty_shop"
                            style>
                            <img src="./../../../assets/img/empty.png"
                                alt />
                            <p>暂未发现商家..</p>
                        </div>
                    </van-tab>

                    <van-tab :name="item.id"
                        v-for="(item,index) in cateList"
                        :title="item.title"
                        :key="index">
                        <van-list v-model="loading"
                            :immediate-check="false"
                            :finished="finished"
                            :finished-text="finishedText"
                            @load="onLoad"
                            class="van-clearfix clearfix">
                            <indexshoplist :top_shoplist="productList"
                                v-if="productList.length > 0"
                                class="shop-search-con" />

                            <!-- <div v-if="productList.length == 0" class="empty_shop" style>
                <img src="./../../../assets/img/empty.png" alt />
                <p>暂无更多商品..</p>
              </div>-->
                        </van-list>
                    </van-tab>
                </van-tabs>
            </div>
            <div class="shops-box-bg"
                :style="{background: 'linear-gradient(to bottom, '+supplier_background+' 60%, #f4f4f4)'}">
            </div>
        </div>
    </div>
</template>

<script>
var setCoor = function (lai, lon) {
    window.vue.position.latitude = lai;
    window.vue.position.longitude = lon;
    window.vue.get_address(lai, lon);
};
window.setCoor = setCoor;
var configAuthSate = function (type, result) {
    /*
       备注：
      type 1 定位 2 相册 3 相机
      result 1 授权访问成功 0 失败
       */
    if (type == 1 && result == 1) {
        window.vue.get_address(
            window.vue.position.latitude,
            window.vue.position.longitude
        );
    } else if (type == 1 && result == 0) {
        window.vue.supplier_two();
    }
    if (type == 1 && result == "0") {
        window.vue.supplier_two(); //获取定位失败
    }
};
window.configAuthSate = configAuthSate;
import shopsHead from "./shops-head/shops-head";
import shopSwiper from "./shops-swiper/shops-swiper";
import SupplierIndexHead from "@/components/currency/supplier/supplierIndex/SupplierIndexHead";
import { Divider, List } from "vant";
import wx from "weixin-js-sdk";
import shopsHorizontalShop from "./shops-horizontal-shop/shops-horizontal-shop";
import SupplierIndexShops from "@/components/currency/supplier/supplierIndex/SupplierIndexShops";
import indexshoplist from "@/components/shop/shopindex/indexshoplist.vue";
import shopsModel from "./shops-model/shops-model";
export default {
    name: "shops-con",
    data () {
        return {
            cate: "",
            finishedText: "",
            loading: false,
            finished: false,
            page: 0,
            partList: [],
            load: false,
            mescroll: null, // mescroll实例对象
            mescrollDown: {
                use: false
            }, //下拉刷新的配置. (如果下拉刷新和上拉加载处理的逻辑是一样的,则mescrollDown可不用写了)
            mescrollUp: {
                // 上拉加载的配置.
                // use:false,
                auto: false,

                callback: this.upCallback, // 上拉回调,此处简写; 相当于 callback: function(page, mescroll) { }
                //以下是一些常用的配置,当然不写也可以的.
                page: {
                    num: 0, //当前页 默认0,回调之前会加1; 即callback(page)会从1开始
                    size: 10 //每页数据条数,默认10
                },
                loadFull: {
                    use: false,
                    delay: 1500
                },
                htmlNodata: "",
                noMoreSize: 5, //如果列表已无数据,可设置列表的总数量要大于5才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看这就是为什么无更多数据有时候不显示的原因
                toTop: {
                    //回到顶部按钮
                    warpId: "shops-con",
                    src: require("@/assets/img/top.png"), //图片路径,默认null,支持网络图
                    offset: 1000 //列表滚动1000px才显示回到顶部按钮
                }
                // empty: {
                //   //列表第一页无任何数据时,显示的空提示布局; 需配置warpId才显示
                //   warpId: "shops-con-box", //父布局的id (1.3.5版本支持传入dom元素)
                //   icon: require("@/assets/img/empty.png"), //图标,默认null,支持网络图
                //   tip: "暂无更多商品~" //提示
                // }
            },
            active: "",
            show: false,
            dia_show: false,
            slide: [],
            info: {
                slide: {
                    banner: [],
                    is_show: "1"
                },
                navigation: {
                    banner: [],
                    is_show: "0"
                },
                merchant: {
                    pro: [],
                    is_show: "1"
                },
                product: {
                    is_show: "0",
                    pro: [],
                    title: "",
                    title_en: ""
                }
            },
            productList: [],
            cateList: [],
            params: {
                province: "",
                city: "",
                area: "",
                town: ""
            },
            position: {
                latitude: "",
                longitude: ""
            },
            supplier_background: "#fec200"
        };
    },
    components: {
        shopsHead,
        shopSwiper,
        SupplierIndexHead,
        [Divider.name]: Divider,
        shopsHorizontalShop,
        SupplierIndexShops,
        indexshoplist,
        shopsModel,
        [List.name]: List
    },
    created () {
        this.getCateList();
        this.getSupplierPage();
        // localStorage.removeItem("latitude");
        var address = localStorage.getItem("supplier-address");
        if (address) {
            this.params = JSON.parse(address);
        }
        // var position = localStorage.getItem("latitude");
        // if (position) {
        //   this.position = JSON.parse(position);
        // }
    },
    mounted () {
        window.vue = this;
    },
    methods: {
        toUpdateCity (citys) {
            this.$bus.$emit("updateCity", citys);
        },
        getTypeDate () {
            this.page = 1;
            this.productList = [];
            this.finished = false;
            this.finishedText = "";
            this.onLoad();
        },
        onLoad () {
            var params = {};
            params.cate_id = this.active || "";
            if (this.cate == params.cate_id && this.page == 1) {
                this.cate = "";
                return;
            }
            this.cate = this.active;
            params.supplier = 1;
            params.page = this.page;
            params.page_size = 10;

            this.$api.getShop.getShopSearch(params).then(res => {
                if (res.code == 200) {
                    let list = res.result.data || [];
                    this.loading = false;
                    if (this.page > 1) {
                        this.productList = [...this.productList, ...list];
                    } else {
                        this.productList = list;
                    }
                    if (res.result.data.length < 10) {
                        this.finished = true;
                        this.finishedText = "- 没有更多了-";
                    }
                    // 如果总页数大于当前页码，页码+1
                    if (res.result.data.length == 10) {
                        this.page++;
                    }
                }
            });
        },
        onClick (name, title) {
            if (title == "推荐") {
                this.getPageShop();
            }
            if (name == 0 && this.params.province) {
                this.under_address();
            }
        },
        getSupplierSlides (params) {
            this.$api.getSupplier.getSupplierSlides(params).then(res => {
                if (res.code == 200) {
                    if (res.result.length > 0) {
                        this.info.slide.banner = res.result;
                    } else {
                        this.info.slide.banner = this.slide;
                    }
                }
            });
        },
        mescrollInit (mescroll) {
            this.mescroll = mescroll; // 如果this.mescroll对象没有使用到,则mescrollInit可以不用配置
        },
        upCallback (page, mescroll) {
            var params = {};
            params.cate_id = this.active || "";
            params.supplier = 1;
            params.page = page.num;
            this.$api.getShop.getShopSearch(params).then(res => {
                if (res.code == 200) {
                    let arr = res.result.data;
                    // 如果是第一页需手动置空列表
                    if (page.num == 1) this.productList = [];
                    // 把请求到的数据添加到列表
                    this.productList = this.productList.concat(arr);
                    // 数据渲染成功后,隐藏下拉刷新的状态
                    this.$nextTick(() => {
                        setTimeout(() => {
                            mescroll.endSuccess(arr.length);
                        }, 1500);
                    });
                } else {
                    mescroll.endErr();
                }
            });
        },
        getSearch_btn (title) {
            this.search_btn(title);
        },
        getemitAddress (params) {
            localStorage.setItem("supplier-address", JSON.stringify(params));
            this.params = params;
            this.under_address();
        },
        getShowTabs (val) {
            this.show = val;
        },
        search_btn (title) {
            this.info.merchant = {};
            var params = {};
            params.title = title;
            this.$api.getSupplier.search_supplier_title(params).then(res => {
                if (res.code == 200) {
                    this.info.merchant = res.result.info.merchant;
                    this.info.merchant.is_show = 1;
                }
            });
        },

        get_cate () {
            this.$api.getSupplier
                .get_supplier_cate({ cate: this.$route.query.cate })
                .then(res => {
                    if (res.code == 200) {
                        this.info.merchant.pro = res.result.info.merchant.pro;
                    }
                });
        },

        get_address (lat, lng) {
            //根据经纬度获取商户 获取到城市地址
            var latitude = {};
            latitude.latitude = lat;
            latitude.longitude = lng;
            var that = this;
            localStorage.setItem("latitude", JSON.stringify(latitude)); //11

            //获取具体位置
            const KEY = "QUEBZ-7FO3W-EBQRR-RRCFM-6DUC3-ZYBHX";
            let url =
                "https://apis.map.qq.com/ws/geocoder/v1?&poi_options=address_format=short&get_poi=0";
            let locationdata = `${lat},${lng}`; //纬度，经度
            this.$jsonp(url, {
                key: KEY,
                callbackName: "QQmap",
                output: "jsonp",
                location: locationdata
            })
                .then(json => {
                    let address = json.result;
                    that.$set(
                        that.params,
                        "province",
                        address.address_component.province
                    );
                    that.params.city = address.address_component.city;
                    that.params.area = address.address_component.district;
                    that.params.town = address.address_component.street || "";

                    try {
                        var dwCity = {
                            province: address.address_component.province,
                            city: address.address_component.city,
                            dw: true
                        };
                        that.active = "";
                        localStorage.setItem("dw-city", JSON.stringify(dwCity));
                        that.toUpdateCity(dwCity);
                    } catch (error) {
                        new Error(error);
                    }

                    localStorage.setItem("supplier-address", JSON.stringify(that.params));
                    that.under_address();
                })
                .catch(() => { });
        },
        supplier_two () {
            var address = localStorage.getItem("supplier-address");
            //判断缓存如果有选择过地区，左上角显示缓存的地区，请求缓存地区的接口，如果没有缓存那么左上角显示选择地区，请求的是推荐店铺的接口
            if (address && address != "") {
                this.params = JSON.parse(address);
                this.under_address(); //  根据缓存的地区获得缓存的信息
            } else {
                this.getPageShop(); //推荐店铺
                this.dia_show = true; //弹出选择地区
            }
        },
        async supplier_three () {
            //  是微信端或者app端  获取定位，如果是手机浏览器端或者获取不到经纬度 判断缓存如果有选择过地区，
            //  左上角显示缓存的地区，请求缓存地区的接口，如果没有缓存那么左上角显示选择地区，请求的是推荐店铺的接口
            //  根据定位获取商户
            switch (true) {
                case this.$fnc.isWx():
                    // if (localStorage.getItem("latitude") != null) {
                    //     this.position = JSON.parse(localStorage.getItem("latitude"));
                    //     this.get_address(this.position.latitude, this.position.longitude);
                    // } else {
                    this.$toast("获取位置信息中", 2000);
                    var that = this;
                    await wx.ready(() => {
                        wx.getLocation({
                            type: "wgs84", // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
                            success: function (res) {
                                var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
                                var longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
                                that.position.latitude = latitude;
                                that.position.longitude = longitude;
                                // alert(latitude, longitude)

                                that.get_address(latitude, longitude);
                            },
                            cancel: function (rej) {
                                that.$toast.fail("获取位置信息失败", rej);
                                that.supplier_two(); //获取定位失败
                            }
                        });
                    });
                    // }
                    break;
                case this.$fnc.isapp() || this.$fnc.isYkAPP():
                    var newapp;
                    try {
                        newapp = this.$store.state.config.shop.newapp;
                    } catch (error) {
                        newapp = "0";
                    }
                    if (newapp == "0") {
                        try {
                            // eslint-disable-next-line no-undef
                            ykAPP.getCoor();
                        } catch (error) {
                            // eslint-disable-next-line no-undef
                            this.position.latitude = ykAPP.getLatitude(); // 纬度，浮点数，范围为90 ~ -90
                            // eslint-disable-next-line no-undef
                            this.position.longitude = ykAPP.getlongitude(); // 经度，浮点数，范围为180 ~ -180。
                        }
                    } else {
                        var data = { type: "getCoor" };
                        this.$fnc.postData(data);
                    }

                    if (this.position.latitude != "" && this.position.longitude != "") {
                        this.get_address(this.position.latitude, this.position.longitude);
                    }
                    // }
                    break;
                default:
                    this.supplier_two();
                    break;
            }
        },
        under_address () {
            //根据地区获取商户
            //判断缓存如果有选择过地区，左上角显示缓存的地区，请求缓存地区的接口，如果没有缓存那么左上角显示选择地区，请求的是推荐店铺的接口
            let params = {};
            params.province = this.params.province;
            this.$set(this.params, "province", this.params.province);
            params.city = this.params.city;
            params.area = this.params.area || "";
            params.town = this.params.town || "";
            this.getSupplierSlides(params);
            if (this.position.latitude) {
                params.latitude = this.position.latitude || "";
                params.longitude = this.position.longitude || "";
            }
            this.$api.getSupplier.get_pageaddress(params).then(res => {
                if (res.code == 200) {
                    //merchant.is_show

                    this.$set(this.info, "merchant", res.result.info.merchant);
                }
            });
        },
        getPageShop () {
            //推荐店铺接口
            let params = {};
            if (this.position.latitude) {
                params.latitude = this.position.latitude || "";
                params.longitude = this.position.longitude || "";
            }
            this.$api.getSupplier.getPageShop(params).then(res => {
                if (res.code == 200) {
                    res.result.info.merchant.is_show = 1;

                    this.info.merchant = res.result.info.merchant;
                }
            });
        },
        getSupplierPage (datas) {
            var params = datas || {};
            this.$api.getSupplier.supplierPage(params).then(res => {
                if (res.code == 200) {
                    if (this.$route.query.cate) {
                        this.get_cate();
                    } else {
                        //判断定位获取店铺
                        this.supplier_three();

                        // this.get_address(26.08135, 119.32842)
                    }

                    this.load = true;

                    if (res.result.module) {
                        this.partList = res.result.module;
                    }

                    this.slide = res.result.info.slide.banner;
                    this.info.slide = res.result.info.slide;

                    this.info.navigation = res.result.info.navigation;

                    this.$refs.Tabs.resize();

                    this.info.product = res.result.info.product;

                    this.info.merchant = res.result.info.merchant;

                    if (res.result.supplier_background) {
                        this.supplier_background = res.result.supplier_background;
                    }
                }
            });
        },
        getCateList () {
            this.$api.getShop.getShopCate({}).then(res => {
                if (res.code == 200) {
                    this.cateList = res.result.cate;
                }
            });
        }
    },
    beforeRouteEnter (to, from, next) {
        // 如果没有配置回到顶部按钮或isBounce,则beforeRouteEnter不用写
        next(vm => {
            // 找到当前mescroll的ref,调用子组件mescroll-vue的beforeRouteEnter方法
            vm.$refs.mescroll && vm.$refs.mescroll.beforeRouteEnter(); // 进入路由时,滚动到原来的列表位置,恢复回到顶部按钮和isBounce的配置
        });
    },
    beforeRouteLeave (to, from, next) {
        // 如果没有配置回到顶部按钮或isBounce,则beforeRouteLeave不用写
        // 找到当前mescroll的ref,调用子组件mescroll-vue的beforeRouteLeave方法
        this.$refs.mescroll && this.$refs.mescroll.beforeRouteLeave(); // 退出路由时,记录列表滚动的位置,隐藏回到顶部按钮和isBounce的配置
        next();
    }
};
</script>
<style lang='less' scoped>
.divider-line {
    padding: 0 16px;
    margin: 0;
}
.shops-con {
    line-height: 1.2;
    height: 100%;
    font-size: 14px;
    display: flex;
    flex-direction: column;
    background: #f4f4f4;
}
#shops-con-box {
    padding-bottom: 50px;
}
.shops-box {
    overflow: auto;
    flex: 3;
    position: relative;
    padding-bottom: 50px;
    > div {
        position: relative;
        // overflow: hidden;
    }
    .shops-box-bg {
        position: absolute;
        top: 0;
        width: 100%;
        height: 310px;
        background: linear-gradient(to bottom, #ffca00 60%, #f4f4f4);
    }
}
.empty_shop {
    width: 100%;
    display: flex;
    flex-flow: column;
    justify-content: center;
    align-items: center;
    margin-bottom: 10px;
}
.empty_shop p {
    font-size: 12px;
    color: #999999;
}
.van-clearfix {
    min-height: 200px;
}
</style>