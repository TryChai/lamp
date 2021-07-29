<template>
    <div class="shop_brand">
        <ul class="fx shop_brand_list">
            <li v-for="(item,i) in top_brand" :key="i">
                <router-link :to="item.links">
                    <img :src="$fnc.getImgUrl(item.piclink)" alt="">
                </router-link>
            </li>
        </ul>
    </div>
</template>

<script>
import { Image } from 'vant';
export default {
    name:"indexbrand",
    components:{
       [Image.name]:Image 
    },
    props:{
        top_brand:{
            type:Array,
            default:[]
        }
    }
}
</script>


<style lang="less" scoped>
.shop_brand{
    margin-bottom: 22px;
    ul{
        flex-wrap: wrap;
        li:first-child{
            width: 100%;
                overflow: hidden;
            position: relative;
            img{
                width: 100%;
            }
        }
        li:not(:first-child){
            a{
                display: block;
            }
            margin-top: 4px;
            width: 32%;
            img{
                width: 100%;
            }
        }
    }
}
</style>
