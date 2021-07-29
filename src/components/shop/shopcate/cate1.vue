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
            ref='shop_cate1'>
            <ul v-if="cate[activeKey]!=undefined"
                class="fx item_ul">
                <li v-for="(item,i) in (cate[activeKey].z )"
                    :key="i"
                    class="item_li"
                    v-show="item.show == 1">
                    <router-link :to="'/shop/shopsearch?cate_id='+item.id">
                        <!-- <img :src="$fnc.getImgUrl(item.piclink)" alt=""> -->
                        <van-image width="72"
                            height="72"
                            :src="$fnc.getImgUrl(item.piclink)" />
                        <p>{{item.title}}</p>
                    </router-link>
                </li>
                <li v-if="cate[activeKey].z==undefined || cate[activeKey].z.length==0">
                    暂无商品分类
                </li>
            </ul>
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
            this.$refs.shop_cate1.scrollTop = 0
        }
    }
};
</script>

<style lang="less" scoped>
.item_cate::after {
    border-right-width: 0;
}

.hid_sco {
    width: 18px;
    // height: 100%;
    position: absolute;
    right: 0;
    z-index: 3;
}
.item_ul {
    justify-content: flex-start;
    flex-wrap: wrap;
    padding-top: 10px;
}
.item_li {
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
    margin: 15px 13px 15px 5px;
    // padding: 14px 0px 0 12px;
    background: #fff;
    // align-self: normal;
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
