<template>
    <div class="fx cate_conn">
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
            ref="shop_cate3"
            v-if="cate[activeKey]!=undefined">
            <div class="item_con_it"
                v-for="(item,i) in (cate[activeKey].z )"
                v-show="item.show == 1"
                :key="i">
                <h3>{{item.title}}</h3>
                <div class="item_con_it_con">
                    <ul class="fx"
                        v-if="item.z!=undefined ">
                        <li v-for="(it,i) in item.z"
                            :key="i">
                            <router-link :to="'/shop/shopsearch?cate_id='+it.id">
                                {{it.title}}
                            </router-link>
                        </li>
                    </ul>
                    <div v-else
                        class="zw">暂无商品分类</div>
                </div>

            </div>
            <div v-if="cate[activeKey].z==undefined"
                class="zw">暂无商品分类</div>
        </div>
    </div>
</template>

<script>
import { Sidebar, SidebarItem, Image } from "vant";
export default {
    components: {
        [Sidebar.name]: Sidebar,
        [SidebarItem.name]: SidebarItem,
        [Image.name]: Image,
    },
    props: {
        cate: {
            type: Array,
            default: () => { return [] }
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
            this.$refs.shop_cate3.scrollTop = 0
        }
    }
};
</script>

<style lang="less" scoped>
.item_cate::after {
    border-right-width: 0;
}

.zw {
    font-size: 14px;
}
.item_con_it {
    padding: 10px 5px 0 5px;
    h3 {
        font-size: 14px;
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
                width: 120px;
                height: 30px;
                line-height: 30px;
                background: #f5f6f8;
                padding-left: 7px;
                margin-bottom: 4px;
                a {
                    display: block;
                    height: 100%;
                    font-size: 12px;
                    color: #7a7c80;
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
    margin: 0px 13px 15px 10px;
    align-self: normal;
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
</style>
