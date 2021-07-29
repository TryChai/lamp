<template>
    <div class="cate2_con">
        <ul>
            <li class="cate2_list"
                v-for="(item,i) in cate"
                v-show="item.show == 1"
                :key="i">
                <h3>{{item.title}}</h3>
                <div class="fx cate_con_item">
                    <router-link :to="'/shop/shopsearch?cate_id='+it.id"
                        v-for="(it,index) in item.z"
                        :key="index">{{it.title}}</router-link>
                    <div class="zu"
                        v-if="item.z==undefined || cate[i].z.length==0">暂无商品分类</div>
                </div>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    data () {
        return {};
    },
    props: {
        cate: {
            type: Array,
            default: () => {
                return [];
            }
        }
    }
};
</script>


<style lang="less" scoped>
.zu {
    font-size: 14px;
    color: #d9d9d9;
    padding: 14px 6px;
}
.cate_con_item {
    justify-content: flex-start;
    flex-wrap: wrap;
    padding-top: 10px;
}
.cate2_list {
    h3 {
        font-size: 18px;
        border-bottom: 1px dotted #d2d2d2;
        color: #2e2e2e;
        padding-top: 10px;
    }
    a {
        color: #404040;
        font-size: 14px;
        background: #f5f5f5;
        padding: 5px 9px;
        border-radius: 3px;
        min-width: 72px;
        text-align: center;
        display: block;
        display: block;
        margin: 0px 10px 7px 7px;
        border-radius: 5px;
    }
}
.cate2_con {
    padding: 0 7px;
}
</style>

