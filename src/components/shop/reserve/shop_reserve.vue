<template>
    <div class="reserve">
        <van-nav-bar left-text
            left-arrow
            class="navbar"
            title="到店时间"
            @click-left="toBack">
        </van-nav-bar>
        <van-tabs v-model="active">
            <van-tab title="标签 1">
                <div class="reserve_box">
                    <div class="reserve_item">
                        <p>上午时段</p>
                        <div class="reserve_item_box">
                            <div v-for="(item,i) in data.list.one"
                                :key="i">
                                <span @click="data_btn(item,i,$event)"
                                    ref="one_btn"
                                    :class="{stop_reserve:item.num == item.now ? true:false}">{{item.time}}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </van-tab>
            <van-tab title="标签 2">内容 2</van-tab>
            <van-tab title="标签 3">内容 3</van-tab>
            <van-tab title="标签 4">内容 4</van-tab>
        </van-tabs>
    </div>
</template>
<script>
import { Tab, Tabs } from 'vant';
export default {
    name: "shop_reserve",
    data () {
        return {
            active: 0,
            data: {
                day: '星期一1月3日',
                list: {
                    one: [
                        { time: '10:00', num: 10, now: 5 },
                        { time: '10:30', num: 10, now: 9 },
                        { time: '11:00', num: 10, now: 10 },
                        { time: '11:30', num: 10, now: 0 },
                        { time: '12:00', num: 10, now: 10 },
                    ],
                    two: [
                        { time: '12:30', num: 10 },
                        { time: '13:00', num: 10 },
                        { time: '13:30', num: 10 },
                        { time: '14:00', num: 10 },
                        { time: '14:30', num: 10 },
                        { time: '15:00', num: 10 },
                        { time: '15:30', num: 10 },
                        { time: '16:00', num: 10 },
                        { time: '16:30', num: 10 },
                        { time: '17:00', num: 10 },
                        { time: '17:30', num: 10 },
                    ],
                    three: [
                        { time: '18:00', num: 10 },
                        { time: '18:30', num: 10 },
                        { time: '19:00', num: 10 },
                        { time: '19:30', num: 10 },
                        { time: '20:00', num: 10 },
                        { time: '20:30', num: 10 },
                        { time: '20:30', num: 10 },

                    ],
                }
            },
        };
    },
    components: {
        [Tab.name]: Tab,
        [Tabs.name]: Tabs
    },
    methods: {
        data_btn (info, k, event) {
            var arr = this.$refs['one_btn']
            arr.forEach((item, i) => {
                console.log(item.target)
            })
            console.log(arr[k])
        },
    },
}
</script>
<style  lang="less" scoped>
.reserve {
    width: 100%;
    min-height: 100%;
    background-color: #f1f1f1;
}
.reserve_box {
    width: 100%;
    padding: 20px 13px;
    overflow: hidden;
}
.reserve_item {
    width: 100%;
    p {
        font-size: 14px;
        font-weight: 400;
        line-height: 36px;
    }
    .reserve_item_box {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-start;
        background-color: #ffffff;
        padding: 10px 0;
        border-radius: 10px;
        div {
            width: 25%;

            text-align: center;
            font-weight: bold;
            font-size: 14px;
            color: #16161a;
            display: flex;
            justify-content: center;
            align-items: center;
            margin: 5px 0;
            span {
                padding: 2px 10px;
                border-radius: 8px;
            }
            .stop_reserve {
                color: #dddddd;
            }
            .active_reserve {
                // background-color: #ca3342;
                background-image: linear-gradient(to right, #ba2c31, #cf3547);
                box-shadow: 1px 2px 8px #a77676;
                color: #ffffff;
            }
        }
    }
}
</style>