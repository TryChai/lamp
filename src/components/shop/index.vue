<template>
<div class="shop_index_conm">
    <div class="shop_index">
        <indexhead :product_cate='list.product_cate' :top_head='list.top_head' />
        <indexswipe :top_banner='list.top_banner.data' v-if="list.top_banner.show==1 && list.top_banner.data.length>0" />
        <indexmenu :top_menu="list.top_menu.data" v-if="list.top_menu.show==1 && list.top_menu.data.length>0" />
        <indexbrand :top_brand='list.top_brand.data' v-if="list.top_brand.show==1 && list.top_brand.data.length>0" />
        
    </div>
    <div class="van-hairline--bottom"></div>
    <indexrushbuy :top_day='list.top_day.data' v-if="list.top_day.show==1 && list.top_day.data.length>0" />
    <div  class="shop_index">
        <indexfind :top_find='list.top_find.data' v-if="list.top_find.show==1 && list.top_find.data.length>0" />
        <indexrecommend :top_list='list.top_list.data' v-if="list.top_list.show==1 && list.top_list.data.length>0" />
       
    </div>
    <div class="shop_index shop_last_con">
         <indexother :top_adv='list.top_adv.data' v-if="list.top_adv.show==1 && list.top_adv.data.length>0" />
        <indexshoplist :top_shoplist='list.top_shoplist.data' v-if="list.top_shoplist.show==1 && list.top_shoplist.data.length>0" />
    </div>
    <shopfooter :index='0' />
</div>
    
</template>

<script>
import indexhead from "@/components/shop/shopindex/indexhead.vue"
import indexswipe from "@/components/shop/shopindex/indexswipe.vue";
import indexmenu from "@/components/shop/shopindex/indexmenu.vue";
import indexbrand from "@/components/shop/shopindex/indexbrand.vue";
import indexrushbuy from "@/components/shop/shopindex/indexrushbuy.vue";
import indexfind from "@/components/shop/shopindex/indexfind.vue";
import indexrecommend from "@/components/shop/shopindex/indexrecommend.vue";
import indexother from "@/components/shop/shopindex/indexother.vue";
import indexshoplist from "@/components/shop/shopindex/indexshoplist.vue";
import shopfooter from "@/components/currency/shopfooter.vue"
export default {
    name:"shopindex",
    components:{
        indexhead,
        indexswipe,
        indexmenu,
        indexbrand,
        indexrushbuy,
        indexfind,
        indexrecommend,
        indexother,
        indexshoplist,
        shopfooter
    },
    data(){
        return{
            list:{
                product_cate:[],
                top_banner:{
                    show:"1",
                    data:[]
                },
                top_menu:{
                    show:"1",
                    data:[]
                },
                top_brand:{
                    show:"1",
                    data:[]
                },
                top_day:{
                    show:"1",
                    data:[]
                },
                top_find:{
                    show:"1",
                    data:[]
                },
                top_list:{
                    show:"1",
                    data:[]
                },
                top_adv:{
                    show:"1",
                    data:[]
                },
                top_shoplist:{
                    show:"1",
                    data:[]
                }
            }
        }
    },
    created(){
        this.getShopIndex();
    },
    methods:{
        getShopIndex(){
            this.$api.getShop.getShopIndex({}).then(res=>{
                if(res.code==200){
                    this.list=res.result;
                }
            })
        }
    }
}
</script>

<style lang="less" scoped>
.shop_index{
    padding: 0 11px;
    
}
.shop_index_conm{
    overflow: auto;
}
.shop_last_con{
    background: linear-gradient(#fff 2%,#fefefe 10% ,#f2f2f2 12% ,#f5f5f6 30% ,#f3f3f3 10% ,#f2f2f2 );
}
</style>
