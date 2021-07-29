<template>
    <div class="fx cate_conn ">
        <van-sidebar :active-key="activeKey"
            @change="onChange"
            class="left_item">
            <div class="hid_sco"></div>
            <van-sidebar-item class="item_cate"
                :title="item.title"
                v-for="(item,i) in cate"
                :key="i" />
        </van-sidebar>
        <div class="item_con fx_3"
            ref='shop_cate5'
            v-if="cate[activeKey]!=undefined">
            <div class="item_con_it"
                v-for="(item,i) in (cate[activeKey].z )"
                v-show="item.show == 1"
                :key="i">
                <p><span></span><span>{{item.title}}</span><span></span></p>
                <div class="cate_shop"
                    v-if="item.z!=undefined">
                    <div class="cate_shop_box"
                        v-for="(it,i) in item.z"
                        :key="i">
                        <div class="cate_shop_item"
                            @click="$router.push('/shop/shopsearch?cate_id=' + it.id)">
                            <img :src="$fnc.getImgUrl(it.piclink)"
                                alt="">
                            <p>{{it.title}}</p>
                        </div>
                    </div>

                </div>
                <div v-else
                    class=" cate_no_shop">暂无商品分类</div>
            </div>
            <div v-if="cate[activeKey].z==undefined"
                class="zw">暂无商品分类</div>
            <!--  -->

        </div>

    </div>
</template>

<script>
import { Sidebar, SidebarItem, Image } from "vant";
export default {
    components: {
        [Sidebar.name]: Sidebar,
        [SidebarItem.name]: SidebarItem,
        [Image.name]: Image
    },
    props: {
        cate: {
            type: Array,
            default: () => {
                return [];
            }
        }
    },
    data () {
        return {
            activeKey: 0
        };
    },
    methods: {
        onChange (key) {
            this.activeKey = key;
            this.$refs.shop_cate5.scrollTop = 0
        }
    }
};
</script>

<style lang="less" scoped>
.item_cate::after {
    border-right-width: 0;
}

.zw {
    font-size: 16px;
}
.item_con {
    background-color: #fff;
}
.item_con_it {
    // padding: 16px 0px 0 0px;
    p {
        width: 100%;
        text-align: center;
        font-size: 12px;
        line-height: 1.4;
        color: #202123;
        font-weight: normal;
        padding-bottom: 10px;
    }
    .item_con_it_con {
        background: #fff;
        padding: 15px 10px;
        border-radius: 5px;
        > ul {
            flex-wrap: wrap;
            > li {
                margin-right: 7px;
                a {
                    display: block;
                    line-height: 1;
                }
                div {
                    border-radius: 5px;
                    overflow: hidden;
                }
                p {
                    font-size: 13px;
                    text-align: center;
                    color: #696969;
                    padding: 3px 0 10px;
                }
            }
        }
    }
}
.hid_sco {
    width: 4px;
    // height: 100%;
    position: absolute;
    right: 0;
    z-index: 3;
}

.cate_conn {
    align-items: flex-start;
    height: 564px;
    overflow: auto;
    .left_item {
        height: 100%;
        background: #fff;
        overflow-y: auto;
        z-index: 1;
    }
}
.item_con {
    margin: 0px 13px 15px 13px;
    padding-top: 10px;
}
.item_cate {
    padding: 16px 12px 15px 9px;
    background: #fff;
    font-size: 15px;
    color: #222222;
}
.van-sidebar-item--select {
    background: #f4f8fb !important;
    color: #f93134;
}
.item_con_it {
    width: 100%;
    text-align: center;
    padding-bottom: 20px;
    > p {
        font-size: 14px;
        color: #222222;
        font-weight: bold;
        display: flex;
        justify-content: center;
        align-items: center;
        > span:nth-of-type(1),
        span:nth-of-type(3) {
            width: 40px;
            height: 2px;
            background-color: #efefef;
            border: transparent;
            display: block;
        }
        > span:nth-of-type(2) {
            padding: 0 10px;
        }
    }
    > .cate_shop {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-start;
        align-items: flex-start;
        padding: 0 5px;
        > .cate_shop_box {
            width: 33%;
            height: 100px;
            display: flex;
            justify-content: center;
            align-items: center;
            > .cate_shop_item {
                width: 90%;
                display: flex;
                flex-flow: column;
                justify-content: center;
                align-items: center;
                img {
                    width: 100%;
                    // height: 80px;
                    max-height: 80px;
                }
                p {
                    width: 100%;
                    overflow: hidden;
                    //隐藏部分显示为省略号
                    text-overflow: ellipsis;
                    //禁止文本自动换行
                    white-space: nowrap;
                    font-size: 12px;
                    line-height: 26px;
                }
            }
        }
    }
    > .cate_no_shop {
        font-size: 12px;
        color: #333333;
        line-height: 35px;
    }
}
</style>
