<template>
    <div class="extract-con">
        <shopsHead class="extract-box-city"
            placeholder="请选择或者输入县级以上城市名进行搜索"
            @showTabs="getShowTabs"
            :paramsCity="params"
            @searchTitle="getSearch_btn"
            :dia_show="dia_show"
            @emitAddress="getemitAddress" />
        <div class="extract-box">
            <mescroll-vue ref="mescroll"
                :down="mescrollDown"
                :up="mescrollUp"
                @init="mescrollInit"
                id="shops-con-box"
                class="fx_3">
                <div>
                    <extract-supplier :item="item"
                        v-for="(item,i) in list"
                        :key="i" />
                </div>
            </mescroll-vue>
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
};
window.configAuthSate = configAuthSate;
import MescrollVue from "mescroll.js/mescroll.vue";
import shopsHead from "../shops/shops-head/shops-head";
import extractSupplier from "./extract-supplier/extract-supplier";
import wx from "weixin-js-sdk";
export default {
    name: "extract-con",
    data () {
        return {
            show: false,
            dia_show: false,
            list: [],
            params: {
                province: "",
                city: "",
                area: "",
                town: ""
            },
            mescroll: null, // mescroll实例对象
            mescrollDown: {
                use: false
            }, //下拉刷新的配置. (如果下拉刷新和上拉加载处理的逻辑是一样的,则mescrollDown可不用写了)
            mescrollUp: {
                // 上拉加载的配置.
                // use:false,
                use: false,
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
                noMoreSize: 3, //如果列表已无数据,可设置列表的总数量要大于5才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看这就是为什么无更多数据有时候不显示的原因
                toTop: {
                    //回到顶部按钮
                    warpId: "extract-con",
                    src: require("@/assets/img/top.png"), //图片路径,默认null,支持网络图
                    offset: 1000 //列表滚动1000px才显示回到顶部按钮
                },
                empty: {
                    //列表第一页无任何数据时,显示的空提示布局; 需配置warpId才显示
                    warpId: "shops-con-box", //父布局的id (1.3.5版本支持传入dom元素)
                    icon: require("@/assets/img/empty.png"), //图标,默认null,支持网络图
                    tip: "暂无更多店铺~" //提示
                }
            },
            position: {
                latitude: "",
                longitude: ""
            }
        };
    },
    components: {
        MescrollVue,
        shopsHead,
        extractSupplier
    },
    created () {
        var address = localStorage.getItem("extract-address");
        if (address) {
            this.params = JSON.parse(address);
            this.getExtractList(this.params);
        } else {
            this.supplier_three();
        }
        var position = localStorage.getItem("latitude");
        if (position) {
            this.position = JSON.parse(position);
        }
    },
    mounted () {
        // this.get_address(39.89288, 116.477051);
    },
    methods: {
        get_address (lat, lng) {
            //根据经纬度获取商户
            var latitude = {};
            latitude.latitude = lat;
            latitude.longitude = lng;
            this.position = latitude;
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
                    // this.params.town = address;

                    var dz = localStorage.getItem("extract-address");
                    if (!dz) {
                        that.params.province = address.address_component.province;
                        that.params.city = address.address_component.city;
                    }
                    var dwCity = {
                        province: address.address_component.province,
                        city: address.address_component.city,
                        dw: true
                    };
                    localStorage.setItem("dw-city", JSON.stringify(dwCity));
                    // that.params.area = address.address_component.district;
                    that.under_address();

                    this.getExtractList(this.params);
                })
                .catch(() => { });
        },
        async supplier_three () {
            //  是微信端或者app端  获取定位，如果是手机浏览器端或者获取不到经纬度 判断缓存如果有选择过地区，
            //  左上角显示缓存的地区，请求缓存地区的接口，如果没有缓存那么左上角显示选择地区，请求的是推荐店铺的接口
            //  根据定位获取商户
            switch (true) {
                case this.$fnc.isWx():
                    if (localStorage.getItem("latitude") != null) {
                        this.position = JSON.parse(localStorage.getItem("latitude"));
                        this.get_address(this.position.latitude, this.position.longitude);
                    } else {
                        this.$toast("获取位置信息中", 1000);
                        var that = this;
                        await wx.ready(() => {
                            wx.getLocation({
                                type: "wgs84", // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
                                success: function (res) {
                                    var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
                                    var longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
                                    that.position.latitude = latitude;
                                    that.position.longitude = longitude;

                                    that.get_address(latitude, longitude);
                                },
                                cancel: function (rej) {
                                    that.$toast.fail("获取位置信息失败", rej);
                                    that.supplier_two();
                                }
                            });
                        });
                    }
                    break;
                case this.$fnc.isapp() || this.$fnc.isYkAPP():
                    if (localStorage.getItem("latitude") != null) {
                        this.position = JSON.parse(localStorage.getItem("latitude"));
                        this.get_address(this.position.latitude, this.position.longitude);
                    } else {
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
                        } else {
                            this.supplier_two();
                        }
                    }
                    break;
                default:
                    this.supplier_two();
                    break;
            }
        },
        supplier_two () {
            var address = localStorage.getItem("extract-address");
            if (address) {
                this.params = JSON.parse(address);
                this.getExtractList(this.params);
            } else {
                this.dia_show = true; //弹出选择地区
            }
        },
        mescrollInit (mescroll) {
            this.mescroll = mescroll; // 如果this.mescroll对象没有使用到,则mescrollInit可以不用配置
        },
        upCallback (page, mescroll) {
            mescroll.endErr();
        },
        getemitAddress (params) {
            // 手动选择地区
            localStorage.setItem("extract-address", JSON.stringify(params));
            this.params = params;
            this.getExtractList(params);
        },
        getShowTabs (val) {
            this.show = val;
        },
        getSearch_btn (title) {
            this.search_btn(title);
        },
        getExtractList (params) {
            params = params || {};
            if (localStorage.getItem("latitude") != null) {
                this.position = JSON.parse(localStorage.getItem("latitude"));
            }
            if (this.position.latitude) {
                params.latitude = this.position.latitude || "";
                params.longitude = this.position.longitude || "";
            }
            this.$api.getSupplier.getExtractList(params).then(res => {
                if (res.code == 200) {
                    this.list = res.result;
                }
            });
        },
        search_btn (title) {
            var params = {};
            params = this.params;
            params.title = title;
            if (localStorage.getItem("latitude") != null) {
                this.position = JSON.parse(localStorage.getItem("latitude"));
            }
            if (this.position.latitude) {
                params.latitude = this.position.latitude || "";
                params.longitude = this.position.longitude || "";
            }
            this.$api.getSupplier.getExtractTitle(params).then(res => {
                if (res.code == 200) {
                    this.list = res.result;
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
.extract-con {
    line-height: 1.2;
    height: 100%;
    font-size: 14px;
    display: flex;
    flex-direction: column;
    background: #f2f2f2;
    .extract-box {
        height: 100%;
        overflow: auto;
    }
}
</style>
