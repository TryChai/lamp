<template>
    <div style="display:flex;flex-flow:column;height: 100%;">
        <div class="container member_bj"
            style="max-height:100%">
            <div class="member_shop_top">
                <div class="member_shop_top_bj">
                    <img :src="$fnc.getImgUrl(vip.background)"
                        alt />
                </div>
                <div class="member_shop_top_person"
                    v-if="link || name || ava">
                    <div class="member_shop_top_person_body">
                        <div class="member_shop_top_person_left">
                            <div class="member_shop_top_person_left_ava">
                                <img :src="$fnc.getImgUrl(ava)"
                                    alt />
                            </div>
                        </div>
                        <div class="member_shop_top_person_right">
                            <p>{{name}}</p>
                            <p v-if="link">
                                我的邀请码：
                                <span class="code">{{link}}</span>
                                <span class="copy_btn"
                                    :data-clipboard-text="link"
                                    data-clipboard-action="copy"
                                    @click="copy_link(link)">一键复制</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="member_shop_body"
                :style="{'background-color':vip.color}">
                <div v-if="ycxtiSOpen=='0'">
                    <div class="member_shop_item"
                        v-for="(item,k) in product"
                        @click="$router.push({path:'/shop/shopdetails',query:{id:item.id}})"
                        :key="k">
                        <div class="member_shop_item_left">
                            <img :src="$fnc.getImgUrl(item.piclink)"
                                alt />
                        </div>
                        <div class="member_shop_item_right">
                            <p>{{item.title}}</p>
                            <div v-if="item.sub_title != '' && item.sub_title != null && item.sub_title != undefined "
                                class="member_shop_item_right_recommend">
                                <p>{{item.sub_title}}</p>
                            </div>
                            <div class="member_shop_item_right_bottom">
                                <p>
                                    <span>￥</span>
                                    {{item.price}}
                                </p>

                                <div class="member_shop_item_right_bottom_btn">
                                    <p
                                        @click="$router.push({path:'/shop/shopdetails',query:{id:item.id}})">
                                        立即抢购</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="member_shop_body-yc"
                    v-else>
                </div>
            </div>
        </div>

    </div>
</template>
<script>
import Clipboard from "clipboard";

import { mapState } from "vuex";
export default {
    name: "member_shop",
    data () {
        return {
            link: "",
            ava: "",
            name: "",
            vip: {
                color: "",
                background: ""
            },
            product: [],
            obj: {},
            shopList: []
        };
    },
    components: {
    },
    computed: {
        ...mapState({
            config: state => state.config
        }),
        ycxtiSOpen () {
            if (this.config.plugin == undefined) {
                return "0";
            } else if (this.config.plugin.ycxt == undefined) {
                return "0";
            } else {
                return this.config.plugin.ycxt.is_open;
            }
        }
    },
    created () {
        this.get_member();
    },
    methods: {
        getYcLists () {
            this.$store.commit("checkType", "my-yc");
            this.$api.getYc.getYcLists({ types: 1 }).then(res => {
                if (res.code == 200) {
                    this.shopList = res.result || [];
                }
            });
            this.$store.dispatch("getYcCardModuleList");
        },
        get_member () {
            this.$api.getPage.get_memberlist({}).then(res => {
                if (res.code == 200) {
                    this.product = res.result.info.product.pro;
                    this.vip.background = res.result.vip_page_background;
                    this.vip.color = res.result.vip_page_background_color;
                    this.ava = res.result.avatar;
                    this.name = res.result.nickname;
                    this.link = res.result.username;
                    if (this.ycxtiSOpen == "1") {
                        this.getYcLists();
                    }
                }
            });
        },
        copy_link (link) {
            var clipboard = new Clipboard(".copy_btn");
            clipboard.on("success", () => {
                this.$toast.success("复制成功");
                // 释放内存
                clipboard.destroy();
            });
            clipboard.on("error", () => {
                // 不支持复制
                this.$fnc.ykAPPCopy(link);
            });
        }
    }
};
</script>
<style  scoped>
.member_shop_body-yc {
    padding: 0 10px 37px 10px;
}
.member_shop_body-yc > div {
    margin-bottom: 13px;
}
.member_bj {
    background-color: #f3f3f3;
    flex: 3;
    overflow: auto;
    padding-bottom: 50px;
}
.member_shop_top {
    width: 100%;
    position: relative;
}
.member_shop_top_bj {
    width: 100%;
}
.member_shop_top_bj img {
    width: 100%;
}
.member_shop_top_person {
    width: 90%;
    height: 65px;
    margin: 0 auto;
    background-color: rgba(38, 38, 38, 0.6);
    border-radius: 40px;
    position: absolute;
    top: 20px;
    left: 0;
    right: 0;
    margin: auto;
}
.member_shop_top_person_body {
    width: 95%;
    margin: 0 auto;
    height: 100%;
    display: flex;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-items: center;
}
.member_shop_top_person_left {
    width: 20%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}
.member_shop_top_person_left_ava {
    width: 42px;
    height: 42px;
    border-radius: 50%;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
}
.member_shop_top_person_left_ava img {
    width: 42px;
    height: 42px;
    border-radius: 50%;
}
.member_shop_top_person_right {
    /* width: 80%; */
    height: 42px;
    display: flex;
    flex-flow: column;
    justify-content: space-between;
    align-items: flex-start;
}
.member_shop_top_person_right p:nth-of-type(1) {
    font-size: 12px;
    color: #ffffff;
}
.member_shop_top_person_right p:nth-of-type(1) span {
    padding-left: 10px;
}
.member_shop_top_person_right p:nth-of-type(2) {
    font-size: 12px;
    color: #939393;
    line-height: 20px;
}
.member_shop_top_person_right p:nth-of-type(2) span:nth-of-type(1) {
    font-size: 12px;
    color: #939393;
    line-height: 20px;
}
.member_shop_top_person_right p:nth-of-type(2) span:nth-of-type(2) {
    font-size: 10px;
    color: #ffffff;
    background-color: #e88800;
    padding: 4px 8px;
    border-radius: 5px;
    margin-left: 10px;
}
.member_shop_body {
    width: 100%;
    background-color: #f3f3f3;
    padding: 10px 0;
}
.member_shop_item {
    width: 95%;
    height: 145px;
    margin: 0 auto 10px auto;
    background-color: #ffffff;
    padding: 8px 10px;
    display: flex;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-items: center;
    border-radius: 10px;
}
.member_shop_item_left {
    width: 38%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    border-radius: 10px;
    overflow: hidden;
}
.member_shop_item_left img {
    height: 100%;
}
.member_shop_item_right {
    width: 62%;
    height: 100%;
    display: flex;
    flex-flow: column;
    justify-content: space-between;
    align-items: flex-start;
    padding-left: 5px;
}
.member_shop_item_right > p {
    font-size: 14px;
    color: #000000;
    font-weight: bold;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    line-height: 18px;
    text-align: justify;
}
.member_shop_item_right_recommend {
    width: 100%;
    background-color: #f7f7f7;
    border-radius: 10px;
    padding: 5px 0;
    letter-spacing: 1px;
}
.member_shop_item_right_recommend > p {
    font-size: 12px;
    color: #8a8a8a;
    display: -webkit-box;
    text-align: justify;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    padding: 0 5px;
    overflow: hidden;
    line-height: 20px;
}
.member_shop_item_right_bottom {
    width: 100%;
    height: 30px;
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-between;
    align-items: flex-end;
}
.member_shop_item_right_bottom p {
    font-size: 16px;
    color: #ff083f;
    font-weight: 500;
    line-height: 22px;
}
.member_shop_item_right_bottom p span {
    font-size: 14px;
    color: #ff083f;
    font-weight: bold;
}
.member_shop_item_right_bottom_btn {
    background-color: #d65146;
    padding: 2px;
}
.member_shop_item_right_bottom_btn p {
    font-size: 12px;
    color: #fbefb3;
    padding: 4px 8px;
    border: 1px solid #fbefb3;
    line-height: 14px;
}
</style>