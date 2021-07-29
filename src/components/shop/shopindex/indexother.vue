<template>
    <div class="other_shop">
        <ul>
            <li v-for="(item,i ) in top_adv" :key="i">
                <router-link :to="item.links">
                    <img :src="$fnc.getImgUrl(item.piclink)" alt="">
                </router-link>
            </li>    
        </ul>
    </div>
</template>

<script>
export default {
    props:{
        top_adv:{
            type:Array,
            default:[]
        }
    }
}
</script>


<style lang="less" scoped>
.other_shop{
    padding: 11px 0;
    ul{
        li:not(:first-child){
            margin-top: 10px;
        }
        img{
            width: 100%;
        }
    }
}
</style>
