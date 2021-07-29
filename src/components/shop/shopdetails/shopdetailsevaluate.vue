<template>
    <!-- 商品评价入口 -->
    <div class="shop_seva">
        <div class="fx shop_seva_head">
            <span>商品评价({{talk_num}})</span>
            <router-link :to="'/shop/shopcomment?id='+$route.query.id">查看全部</router-link>
        </div>
        <div class="fx shop_seva_info">
            <div class="shop_seva_info_avater fx">
                <img :src="$fnc.getImgUrl(oneTalk.avatar,'sex') || require('@/assets/img/member/sex1.png')" class="save_man" alt="">
                <img src="../../../assets/img/shop/hg.png" class="hg" alt="">
            </div>
            <div class="shop_seva_info_name">
                <span>{{oneTalk.nickname?oneTalk.nickname[0] : ''}}<small>**</small> </span>
                |
                <span class="shop_vip">{{oneTalk.rating_cn}}</span>
            </div>
        </div>
        <p class="save_text van-ellipsis">{{oneTalk.content}}</p>

        <div class="fx div2" v-if="oneTalk.piclink && oneTalk.piclink.length>0">
            <img
                :src="$fnc.getImgUrl(item.piclink)"
                :imgurl="$fnc.getImgUrl(item.piclink)"
                v-for="(it,i) in oneTalk.piclink"
                :key="i"
                alt
            >
        </div>
        <div class="save_footer">
            <!-- <span>{{$fnc.getTimeFormat(oneTalk.created_time)}}</span> -->
            <!-- <span>颜色分类：货到付款定金</span> -->
        </div>
    </div>
</template>


<script>
export default {
    props:{
        oneTalk:{
            type:Object,
            default:{}
        },
        talk_num:null
    }
}
</script>


<style lang="less" scoped>
div.div2 {
  flex-wrap: wrap;
  > img {
    margin: 4px 0px 0px 0;
    border-radius: 5px;
    border-radius: 1px solid #f9f9f9;
    width: 100px;
    height: 100px;
    border: 1px solid #e0e0e0;
  }
}
.shop_seva{
    padding: 0 16px;
    >div.shop_seva_head{
        line-height: 1;
        padding: 17px 0;
        span{
            font-size: 14px;
            color: #333333;
            font-weight: bold;
        }
        a{
            font-size: 12px;
            color: #d32a2a;
        }
    }
    >div.shop_seva_info{
        height: 55px;
        justify-content: flex-start;
        >div.shop_seva_info_avater{
            position: relative;
            width: 42px;
            z-index: 1;
            img.save_man{
                width: 32px;
                height: 32px;
                border-radius: 50%; 
            }
            img.hg{
                position: absolute;
                top: -10px;
                right: 0px;
                width: 24px;
                height: 22px;
                z-index: 2;
            }
        }
        >div.shop_seva_info_name{
            font-size: 12px;
            color: #b8b8b8;
            >.shop_vip{
                background: #3d2e1e;
                color: #f3d0a7;
                padding:1.5px 3px;
                margin-left: 4px;
                border-radius: 4px;
            }
        }

    }
    .save_text{
        line-height: 1.4;
        font-size: 15px;
        color: #333333;
        font-weight: bold;
    }
    div.save_footer{
        font-size: 11px;
        color: #adadad;
        padding: 11px 0;
        >span:first-child{
            margin-right: 15px;
        }
    }
}
</style>
