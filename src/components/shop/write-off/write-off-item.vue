<template>
    <div class="write_item">
        <div class="write_item_left">
            <img :src="$fnc.getImgUrl(info.piclink)"
                alt="">
        </div>
        <div class="write_item_right">
            <p>{{info.title}}</p>
            <p><span>核销{{info.write_number}}数</span></p>
            <div class="write_item_right_price1">
                <p><span>￥{{info.price - (parseInt(info.bargain_end) * parseInt(info.bargain_number)) > 0 ? info.price - (parseInt(info.bargain_end) * parseInt(info.bargain_number)) : 0}}</span>
                </p>
                <p
                    @click="write_btn(info.id)">
                    购买</p>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: "write-off-item",
    data () {
        return {
        };
    },
    props: {
        info: {
            type: Object,

        }
    },
    components: {
    },
    methods: {
        write_btn(id){
            this.$router.push({path:'/shop/shopdetails',query:{id:id}})
        },
    },
}
</script>
<style  scoped>
.write_item {
    width: 92%;
    height: 140px;
    padding: 10px 10px 5px 10px;
    margin: 10px auto 0 auto;
    background-color: #ffffff;
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-between;
    align-items: center;
    border-radius: 5px;
}
.write_item_left {
    width: 35%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    /* padding-right: 10px; */
}
.write_item_left img {
    width: 100%;
    max-height: 100%;
}
.write_item_right {
    width: 62%;
    height: 100%;
    display: flex;
    flex-flow: column;
    justify-content: center;
    align-items: flex-start;
}
.write_item_right > p:nth-of-type(1) {
    font-size: 14px;
    height: 36px;
    line-height: 18px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
}
.write_item_right > p:nth-of-type(2) {
    width: 100%;
    /* height: 40px; */
    margin-top: 5px;
    display: flex;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-items: center;
}
.write_item_right > p:nth-of-type(2) span {
    font-size: 10px;
    color: #ff2043;
    /* background-color: #fdebeb; */
    border: 1px solid #ff2043;
    border-radius: 3px;
    padding: 0px 10px;
    margin-right: 10px;
}
.write_item_right_price1 {
    width: 100%;
    height: 35px;
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-between;
    align-items: flex-end;
}
.write_item_right_price1 > p:nth-of-type(1) {
    font-size: 12px;
    font-weight: bold;
    color: #000000;
    line-height: 14px;
}
.write_item_right_price1 > p:nth-of-type(1) span {
    font-size: 16px;
    font-weight: bold;
    color: #000000;
    color: #ff2043;
}
.write_item_right_price1 > p:nth-of-type(2) {
    font-size: 12px;
    font-weight: bold;
    color: #ffffff;
    background-color: #ff3a63;
    background: -webkit-linear-gradient(
        to left,
        #ff3a63,
        #ff7d5e
    ); /* Safari 5.1 - 6.0 */
    background: -o-linear-gradient(
        to left,
        #ff3a63,
        #ff7d5e
    ); /* Opera 11.1 - 12.0 */
    background: -moz-linear-gradient(
        to left,
        #ff3a63,
        #ff7d5e
    ); /* Firefox 3.6 - 15 */
    background: linear-gradient(to left, #ff3a63, #ff7d5e); /* 标准的语法 */
    border-radius: 10px;
    padding: 2px 15px;
    border-radius: 20px;
}
.write_item_right_price2 {
    width: 100%;
    height: 30px;
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-between;
    align-items: center;
}
.write_item_right_price2 > p:nth-of-type(1) {
    font-size: 12px;
    color: #999999;
}
.write_item_right_price2 > p:nth-of-type(2) {
    font-size: 12px;
    color: #333333;
    font-weight: bold;
}
</style>