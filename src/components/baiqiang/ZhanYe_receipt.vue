<template>

    <div class="container con_bg receipt">
        <van-nav-bar title="店铺收款二维码"
            left-text
            left-arrow
            class="navbar"
            :border="false"
            @click-left="toBack()">
            <van-icon name="qr"
                slot="right"
                size="24px"
                color="#333333"
                @click="save_ewm" />
        </van-nav-bar>

        <div class="receipt_body"
            ref="receipt">
            <div class="receipt_body_bj">
                <img :src="$fnc.getImgUrl(bj_img)"
                    v-lazy="bj_img"
                    alt="">
                <!-- <img src="./../../assets/img/supplier/bj.jpg"
                    alt=""> -->

            </div>
            <div class="receipt_content">
                <div class="receipt_content_img">
                    <div id="qrcode_receipt"
                        ref="qrcode"></div>
                </div>
                <p>{{supplier_title}}-百强微店</p>
            </div>
            <!-- <div class="receipt_box">
                <div class="receipt_box_top">
                    <van-icon name="balance-o"
                        color="#dbb14b"
                        size="24px"></van-icon>
                    二维码收款
                </div>
                <div class="receipt_box_content">
                    <p>扫描二维码向商家付钱</p>
                    <p v-if="$route.query.money ">￥{{$fnc.toFixedZ(money,2)}}</p>
                    <div class="receipt_box_content_img">
                   
                        <div id="qrcode_receipt"
                            ref="qrcode"></div>

                    </div>

                </div>
            </div> -->
        </div>
        <van-popup v-model="show"
            :close-on-click-overlay="false"
            class="upload_shaer "
            get-container="body">
            <div class="upload_shaer_img">
                <img :src="imgUrl"
                    class="imgUrl"
                    alt="">
                <van-icon name="clear"
                    size="28px"
                    color='red'
                    @click="show=false" />

            </div>
            <div class="upload_shaer_btn ">
                <div class="tc"
                    @click="uploadShare(isWx)">
                    <img src="./../../assets/img/member/uplodeimg.png"
                        class="upload_img_ewm"
                        alt="">
                    <span>{{isWx==0?'长按保存':"保存到系统相册"}}</span>
                </div>
            </div>

        </van-popup>
    </div>

</template>
<script>
import QRCode from 'qrcodejs2'
import { setTimeout } from 'timers';
import html2canvas from "html2canvas";
export default {
    name: "ZhanYe_receipt",
    data () {
        return {
            supplier_title: "",
            bj_img: "",
            isWx: "0",
            imgUrl: "",
            show: false,                 //弹窗
            id: this.$store.state.user.uid,
            tshare: this.$store.state.user.username,
            ewmsrc: "",
            money: this.$route.query.money || 0,
            set_show: true,
        };
    },
    components: {

    },
    created () {
        this.get_img();
        this.get_supplier_info();
        setTimeout(() => {
            this.qrcode()
        }, 500);
    },
    mounted () {
        var ua = window.navigator.userAgent.toLowerCase();
        if (ua.match(/MicroMessenger/i) == 'micromessenger') {
            this.isWx = '0';                                      //第一个微信端
        } else if (ua.match(/ykapp/i) == 'ykapp') {
            this.isWx = '1';                        //第二个app
        } else {
            this.isWx = '2';       //剩下的网页
        }
    },
    methods: {
        get_supplier_info () {
            this.$api.getSupplier.getSupplierShopInfo({}).then(res => {
                if (res.code == 200) {
                    this.supplier_title = res.result.shop_title
                }
            })
        },
        get_img () {
            this.$api.getConfig.getConfigInfo({ cate: 'supplier_apply' }).then(res => {
                if (res.code == 200) {
                    res.result.forEach(item => {
                        if (item.iden == 'supplier_backgroud') {
                            this.bj_img = item.value;
                            return
                        }
                    });

                }
            })
        },
        uploadShare (wx) {
            this.show = false;
            this.$fnc.ykAppUpImage(this.imgUrl);
        },
        save_ewm () {
            html2canvas(this.$refs.receipt).then(canvas => {
                let dataURL = canvas.toDataURL("image/png");
                this.imgUrl = dataURL;
                if (this.imgUrl !== "") {
                    this.show = true;
                }
            });
        },
        set_money () {
            if (this.$route.query.money) {
                this.$router.push({ path: "/zhanye/receipt" })
            } else {
                this.$router.push({ path: "/zhanye/receipt/set" })
            }
        },
        qrcode () {
            // this.ewmsrc = `/zhanye/receipt/transaction`
            this.ewmsrc = `${window.location.protocol}//${window.location.host}/zhanye/receipt/transaction?money=${this.money}&tshare=${this.tshare}&id=${this.id}`
            document.getElementById('qrcode_receipt').innerHTML = '';
            let qrcode = new QRCode('qrcode_receipt', {
                width: 150,
                height: 150,
                text: this.ewmsrc, // 二维码地址
                colorDark: "#000",
                colorLight: "#fff",
            })

        },
    },
}
</script>
<style scoped>
.receipt {
    position: relative;
    /* background-color: #dbb14b; */
}
.receipt_body {
    width: 100%;
    /* height: 93.5%; */
    color: #ffffff;
    position: absolute;
    top: 50px;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #f7ac1c;
}
.receipt_body_bj {
    width: 100%;
    height: 100%;
}
.receipt_body_bj img {
    width: 100%;
    /* height: 500px; */
    /* height: 100%; */
}
.receipt_content {
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    display: flex;
    flex-flow: column;
    margin-top: 115px;
    margin-right: 2px;
    align-items: center;
}

.receipt_content_img {
    width: 200px;
    height: 200px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 10px;
    /* border: 8px solid #eeeeee; */
    position: relative;
    padding: 10px;
    border: 5px solid #fff;
}
.receipt_content p {
    font-size: 16px;
    font-weight: 600;
    color: #221815;
    /* position: absolute;
    bottom: -35px; */
}
.receipt_box {
    width: 91%;
    margin: 20px auto;
    background-color: #ffffff;
    border-radius: 5px;
    overflow: hidden;
}
.receipt_box_top {
    width: 100%;
    padding: 0 20px;
    height: 50px;
    margin: 0 auto;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    font-size: 14px;
    background-color: #eeeeee;
    color: #dbb14b;
}
.receipt_box_top .van-icon {
    padding-right: 5px;
}
.receipt_box_content {
    width: 60%;
    margin: 0 auto;
}
.receipt_box_content > p:nth-of-type(1) {
    font-size: 14px;
    color: #545454;
    text-align: center;
    line-height: 36px;
    padding-top: 20px;
    padding-bottom: 10px;
}
.receipt_box_content > p:nth-of-type(2) {
    font-size: 36px;
    color: #000000;
    font-weight: bold;
    text-align: center;
    line-height: 36px;
    padding-bottom: 10px;
}
.receipt_box_content_img {
    width: 90%;
    margin: 0 auto;
}
.receipt_box_content_img img {
    width: 100%;
}
.receipt_box_content_set {
    width: 80%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 0 auto;
    padding: 30px 0;
}
.receipt_box_content_set span:nth-of-type(1) {
    font-size: 12px;
    color: #4f5168;
}
.receipt_box_content_set span:nth-of-type(2) {
    font-size: 12px;
    color: #4f5168;
}
.receipt_box_content_set span:nth-of-type(3) {
    font-size: 12px;
    color: #4f5168;
}
.upload_shaer {
    width: 100%;
    background-color: transparent;
}
.upload_shaer_img {
    position: relative;
    width: 82%;
    margin: 0 auto;
}
.upload_shaer_img i {
    position: absolute;
    top: 10px;
    right: 10px;
}
.imgUrl {
    display: block;
    max-width: 100%;
    margin: 0 auto;
}
.upload_shaer_btn {
    padding-top: 10px;
    color: #fff;
    font-size: 14px;
    position: relative;
    text-align: center;
}
.upload_shaer_btn .upload_img_ewm {
    display: block;
    width: 34px;
    margin: 0 auto;
}
.upload_shaer_btn span {
    display: inline-block;
    margin-top: 20px;
}

.receipt #qrcode_receipt img {
    width: 80% !important;
}
</style>