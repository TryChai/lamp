<template>
    <div class="con_shar">
        <div class="sc_head">
            <van-icon name="arrow-left"
                style="vertical-align: middle;"
                @click="toBack"
                class="left_back" />
            <img class="head_img"
                src="../../assets/img/star/my_info.png"
                mode>
            <div class="sc_head_title1">release of Creation Planets</div>
            <div class="sc_head_title2">release of Creation Planets</div>
        </div>
        <div class="sc_con">
            <img src="../../assets/img/star/star_lan.png"
                class="star"
                mode>
        </div>
        <div class="sc_con1">
            <div class="fx sc_con1_box1">请牢记您的推广码，将您的推广码复制发送给您的朋友完成推广注册</div>
            <div class="sc_con1_box2 fx">
                <div>
                    <div class="sc_con1_box2_text1"
                        id="data">{{userInfo.share}}</div>
                    <div class="sc_con1_box2_text2">点击右键一键复制</div>
                </div>
                <span style="cursor: pointer"
                    onclick=''
                    class="sc_con1_box2_btn"
                    :data-clipboard-text="userInfo.share"
                    data-clipboard-action="copy"
                    @click="copy(userInfo.share)">复制</span>
            </div>
        </div>
        <div class="foot_text">kjoiho sas sak：0/20</div>
        <!-- <van-button type="default" @click="uploadimg">下载图片测试</van-button> -->
        <div class="footer_con">
            <img :src="$fnc.getImgUrl(piclink)"
                @click="$router.go(0)"
                class="ewm"
                mode>
            <div id='d1'>扫描二维码，下载APP</div>
        </div>
    </div>
</template>

<script>

export default {
    data () {
        return {
            piclink: "",
            userInfo: this.$store.state.user
        };
    },
    methods: {
        uploadimg () {
            this.$fnc.ykAppUpImage(this.piclink)
        },
        copy (value) {
            let _this = this;

            let clipboard = new this.clipboard(".sc_con1_box2_btn");

            clipboard.on("success", function (e) {
                _this.$toast.success("复制成功");
                e.clearSelection();
            });
            clipboard.on("error", function (e) {
                // _this.$toast.success('调用app方法');
                _this.$fnc.ykAPPCopy(value);


            });


        },
        getEwm () {
            this.$api.getSetting.getAppEwm({}).then(res => {
                if (res.code == 200) {
                    this.piclink = res.result;
                }
            });
        }
    },
    created () {
        this.getEwm();
    }
};
</script>


<style scoped>
.ewm {
    width: 100px;
    height: 100px;
    margin-bottom: 10px;
}
.wrapper {
    position: relative;
}
#input {
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0;
    z-index: -10;
}
.con_shar {
    background: #344390;
    min-height: 100vh;
}
.sc_head {
    width: 375px;
    height: 185px;
    background: #202253;
    text-align: center;
    padding-top: 50px;
    color: #fff;
    display: flex;
    flex-direction: column;
    align-items: center;
}
.sc_head_title1 {
    font-size: 15px;
}
.sc_head_title2 {
    font-size: 12px;
    color: #d2d3dd;
}
.head_img {
    width: 194px;
    height: 46px;
}
.sc_con {
    width: 306px;
    height: 156px;
    margin: -20px auto 0 auto;
    background: #3a3ba5;
    border-radius: 2px 2px 0 0;
}
.star {
    width: 280px;
    height: 170px;
    display: block;
    position: relative;
    top: -14px;
}
.sc_con1 {
    width: 306px;
    height: 118px;
    margin: 0 auto;
    background: url(../../assets/img/star/tuoyuan.png) no-repeat center center;
    background-size: 100%;
    color: #070707;
    font-size: 12px;

    display: flex;
    flex-direction: column;
}
.sc_con1_box1 {
    padding: 5px 25px 0 25px;
    font-size: 11px;
}
.line {
    border-bottom: 1px dashed #bfbfbf;
    margin: -10px 15px 0 15px;
    padding: 0 10px 10px 10px;
}
.sc_con1_box2 {
    padding: 0 25px 0 25px;
    align-items: flex-end !important;
}
.sc_con1_box2_text1 {
    font-size: 20px;
    font-weight: bold;
}
.sc_con1_box2_text2 {
    font-size: 11px;
}
.sc_con1_box2_btn {
    width: 78px;
    height: 28px;
    background: rgba(100, 254, 198, 0.8);
    border-radius: 13px;
    color: #3a3ba5;
    text-align: center;
    line-height: 28px;
    outline: none;
    border: none;
}
.foot_text {
    margin: 8px 34px 15px 34px;
    color: #ffffff;
    font-size: 14px;
}
.footer_con {
    display: flex;
    flex-direction: column;
    align-items: center;
    color: #ffffff;
    font-size: 12px;
}
</style>

