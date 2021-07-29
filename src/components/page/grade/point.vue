<template>
    <div class="container grade">
        <van-nav-bar title="我的点位"
            left-text
            left-arrow
            class="navbar"
            @click-left="toBack">
        </van-nav-bar>
        <div class="grade_top">
            <img src="./../../../assets/img/home/point_top.png"
                alt="">
            <div class="grade_top_content">
                <div class="grade_top_content_img">
                    <img :src="$fnc.getImgUrl($store.state.user.avatar)"
                        alt="">
                </div>
                <p>{{$store.state.user.nickname || $store.state.user.username}}</p>
                <p>
                    <span>公排权值：{{info.platoon}}</span><span>点位数量：{{info.number}}个</span></p>
            </div>
            <div class="grade_body">
                <div class="grade_body_no_data"
                    v-if="info.platoon_ar.length == 0">
                    <img src="./../../../assets/img/empty.png"
                        alt="">
                    <p>暂无数据</p>
                </div>
                <div class="grade_box"
                    v-else
                    v-for="(item,k) in info.platoon_ar"
                    :key="k">
                    <div class="grade_box_item"
                        @click="$router.push({path:'/page/level' ,query:{id:item.id}})">
                        <div class="grade_box_item_bj">
                            <img src="./../../../assets/img/home/point_item.png"
                                alt="">
                        </div>
                        <div class="grade_box_item_content">
                            <p>{{$fnc.getTimeFormat(item.created_time)}}</p>
                            <div class="grade_box_item_content_p">
                                <!-- <p>点位：{{item.oid}}</p>
                                <p>层级：{{item.level}}层</p> -->
                                <p style="padding-top:20px;">已奖励：{{item.income}}</p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: "point",
    data () {
        return {
            info: {
                number: 0,
                platoon: "",
                platoon_ar: [

                ],
            }
        };
    },
    components: {
    },
    created () {
        this.get_point();
    },
    methods: {
        get_point () {
            this.$api.getPage.get_pointlist({}).then((res) => {
                if (res.code == 200) {
                    this.info = res.result;
                }
            })
        }
    },
}
</script>
<style  scoped>
.grade {
    width: 100%;
    height: 100%;
    background-color: #ffffff;
    position: relative;
}
.grade_top {
    width: 100%;
    position: relative;
}
.grade_top img {
    width: 100%;
}
.grade_top_content {
    width: 100%;
    display: flex;
    flex-flow: column;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 15px;
}
.grade_top_content_img {
    width: 16%;
}
.grade_top_content_img img {
    width: 100%;
    border: 2px solid #ffffff;
    border-radius: 50%;
    overflow: hidden;
}
.grade_top_content p:nth-of-type(1) {
    width: 100%;
    font-size: 16px;
    padding: 5px 0;
    font-weight: 400;
    color: #ffffff;
    text-align: center;
    letter-spacing: 1px;
}
.grade_top_content p:nth-of-type(2) {
    width: 60%;
    font-size: 12px;
    color: #979798;
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.grade_body {
    width: 98%;
    margin: 10px auto;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
}
.grade_box {
    width: 50%;
    padding: 0 5px;
    margin-bottom: 12px;
}
.grade_box_item {
    width: 100%;
    display: flex;
    flex-flow: column;
    justify-content: flex-start;
    align-items: center;
    position: relative;
}
.grade_box_item_bj {
    width: 100%;
}
.grade_box_item_bj img {
    width: 100%;
}
.grade_box_item_content {
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    padding: 10px 0 10px 20px;
}
.grade_box_item_content > p {
    font-size: 12px;
    color: #ffffff;
    height: 24px;
    line-height: 24px;
}
.grade_box_item_content_p {
    width: 100%;
    display: flex;
    flex-flow: column;
    justify-content: flex-start;
    align-items: flex-start;
    font-size: 10px;
    color: #a57634;
    /* padding-top: 5px; */
}
.grade_body_no_data {
    width: 100%;
    font-size: 14px;
    color: #979798;
    display: flex;
    flex-flow: column;
    justify-content: center;
    align-items: center;
}
.grade_body_no_data img {
    width: 50%;
}
</style>