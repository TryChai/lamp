<template>
    <div class="container grade">
        <van-nav-bar title="点位层级"
            left-text
            left-arrow
            class="navbar"
            @click-left="toBack">
        </van-nav-bar>
        <div class="grade_top">
            <img src="./../../../assets/img/home/black_top.png"
                alt="">
        </div>
        <div class="grade_body">
            <div class="grade_part"
                v-for="(item,k) in list"
                :key="k">
                <div class="grader_item_bj">
                    <img src="./../../../assets/img/home/grade_item.png"
                        alt="">
                    <p>{{k == 1 ? '销售经理' : `第${parseInt(k)-1}层`}} <van-icon name="friends-o"
                            color="#fff"
                            size="22px"></van-icon><span>{{item.length}}人</span>
                    </p>
                </div>
                <div class="grader_item"
                    v-for="(data,y) in item"
                    :key="y">
                    <div class="grader_item_box">
                        <div class="grader_item_box_content">
                            <div class="grader_item_box_content_left">
                                <img :src="$fnc.getImgUrl(data.avatar)"
                                    alt="">
                            </div>
                            <div class="grader_item_box_content_time">
                                <p>{{data.nickname || data.username}}</p>
                                <!-- <p>上级点位：P_{{data.tid}}</p> -->
                                <p>
                                    <van-icon name="clock-o"
                                        color="#a3a3a3"
                                        size="14px"></van-icon>
                                    {{$fnc.getTimeFormat(data.created_time)}}
                                </p>
                            </div>
                            <div class="grader_item_box_content_right">
                                <!-- <span>位置：{{data.level}}-{{data.oid}}</span> -->
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
        <transition name="go-top">
            <img v-if="btnFlag"
                class="go-top"
                src="./../../../assets/img/top.png"
                @click="backTop">
        </transition>

    </div>
</template>
<script>
export default {
    name: "component_name",
    data () {
        return {
            btnFlag: false,
            list: {

            }
        };
    },
    components: {
    },
    mounted () {
        window.addEventListener('scroll', this.scrollToTop)
    },
    destroyed () {
        window.removeEventListener('scroll', this.scrollToTop)
    },
    created () {

        this.get_level();
    },
    methods: {
        get_level () {
            this.$api.getPage.get_levellist({ id: this.$route.query.id }).then((res) => {
                if (res.code == 200) {
                    this.list = res.result;
                }
            })
        },
        scrollToTop () {
            const that = this
            let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
            that.scrollTop = scrollTop
            if (that.scrollTop > 200) {
                that.btnFlag = true
            } else {
                that.btnFlag = false
            }

        },
        backTop () {
            const that = this
            let timer = setInterval(() => {
                let ispeed = Math.floor(-that.scrollTop / 5)
                document.documentElement.scrollTop = document.body.scrollTop = that.scrollTop + ispeed
                if (that.scrollTop === 0) {
                    clearInterval(timer)
                }
            }, 16)
        },
    },
}
</script>
<style scoped>
.grade {
    width: 100%;
    height: 100%;
overflow: auto;
    background-color: #ffffff;
    position: relative;
}
.grade_top {
    width: 100%;
}
.grade_top img {
    width: 100%;
}
.grade_body {
    width: 90%;
    z-index: 999;
    margin: 0 auto;
    position: absolute;
    left: 0;
    right: 0;
    top: 80px;
    overflow: hidden;
}
.grade_part {
    width: 100%;
    display: flex;
    flex-flow: column;
    justify-content: flex-start;
    align-items: flex-start;
    margin-bottom: 20px;
}

.grader_item_bj {
    width: 100%;
    height: 30px;
    position: relative;
    display: flex;
    justify-content: flex-start;
    align-items: center;
}
.grader_item_bj img {
    width: 100%;
    height: 30px;
}

.grader_item_bj > p:nth-of-type(1) {
    font-size: 14px;
    color: #ffffff;
    line-height: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 0;
    left: 15px;
}
.grader_item_bj > p:nth-of-type(1) .van-icon {
    padding-left: 90px;
    padding-right: 5px;
}
.grader_item {
    width: 100%;
    border: 1px solid #eeeeee;
    border-radius: 5px;
    background-color: #ffffff;
    padding-left: 15px;
}
.grader_item_box {
    width: 100%;
    display: flex;
    flex-flow: column;
    justify-content: flex-start;
    align-items: flex-start;

    /* position: absolute;
    top: 0;
    left: 15px;
    right: 15px; */
}

.grader_item_box_content {
    width: 100%;
    height: 80px;
    display: flex;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-items: center;
}
.grader_item_box_content_left {
    width: 20%;
}
.grader_item_box_content_left img {
    width: 75%;
    border-radius: 50%;
    border: 2px solid #ffffff;
}

.grader_item_box_content_time {
    width: 50%;
}
.grader_item_box_content_time p:nth-of-type(1) {
    font-size: 14px;
    color: #000000;
}
.grader_item_box_content_time p:nth-of-type(2),
.grader_item_box_content_time p:nth-of-type(3) {
    font-size: 12px;
    color: #a3a3a3;
    display: flex;
    justify-content: flex-start;
    align-items: center;
}
.grader_item_box_content_time p:nth-of-type(2) .van-icon {
    padding-right: 5px;
}
.grader_item_box_content_right {
    width: 40%;
    height: 80px;
    display: flex;
    flex-flow: column;
    justify-content: space-evenly;
    align-items: center;
}
.grader_item_box_content_right > span {
    width: 100%;
    height: 24px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 12px;
    color: #ffffff;
    background-color: #2e2e30;
    padding: 5px 12px;
    border-radius: 10px;
    margin-left: 20px;
    margin-bottom: 30px;
}
.go-top {
    animation-duration: 0.5s;
    z-index: 9990;
    position: fixed;
    right: 10px;
    bottom: 60px;
    width: 26px;
    border-radius: 50%;
    /* opacity: 0; */
}
.go-top-enter,
.go-top-leave-to {
    opacity: 0;
}
.go-top-enter-to,
.go-top-leave {
    opacity: 1;
}
.go-top-enter-active,
.go-top-leave-active {
    transition: 2s;
}
</style>