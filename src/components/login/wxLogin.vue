<template>

    <div>
        <!-- <van-button type="primary" @click="wxLogin">微信登录测试</van-button>
        <div>
            {{text}}
        </div> -->
        <div id="app_wxlogin">
            <div class="text-wrapper">
                <div class="text part1">
                    <div>
                        <span class="letter">
                            <div class="character">L</div> <span></span>
                        </span>
                        <span class="letter">
                            <div class="character">o</div> <span></span>
                        </span>
                        <span class="letter">
                            <div class="character">a</div> <span></span>
                        </span>
                        <span class="letter">
                            <div class="character">d</div> <span></span>
                        </span>
                        <span class="letter">
                            <div class="character">i</div> <span></span>
                        </span>
                        <span class="letter">
                            <div class="character">n</div> <span></span>
                        </span>
                        <span class="letter">
                            <div class="character">g</div> <span></span>
                        </span>
                    </div>
                </div>
                <div class="how-to"><span>正在加载中，请您耐心等待...</span></div>
            </div>
        </div>

    </div>
</template>


<script>
export default {
    data () {
        return {
            redirect_url: "",
            share: "",
            text: "",
            toast: null,
            url: ""
        }
    },
    created () {
        sessionStorage.setItem('is_announ', JSON.stringify(true))     //弹出框
        this.wxLogin();
    },
    methods: {
        wxLogin () {
            if (this.$route.query.redirect) {
                this.redirect_url = decodeURIComponent(this.$route.query.redirect);
                if (this.$route.query.redirect.indexOf("&tshare=") >= 0) {
                    let reg = new RegExp("(^|&?)tshare=([^&]*)(&)");
                    let r = this.redirect_url.substr(1).match(reg);
                    if (r != null) {
                        this.share = unescape(r[2]);
                    } else if (this.$route.query.stshare) {
                        this.share = this.$route.query.tshare
                    }else if (this.$route.query.tshare) {
                        this.share = this.$route.query.tshare
                    }

                }
            } else if (sessionStorage.getItem('url')) {
                this.redirect_url = sessionStorage.getItem('url');
                let url = sessionStorage.getItem('url')
                if (url.indexOf("&tshare=")) {
                    let reg = new RegExp("(^|&?)tshare=([^&]*)(&)");
                    let r = url.substr(1).match(reg);
                    if (r != null) {
                        this.share = unescape(r[2]);
                    } else if (this.$route.query.stshare) {
                        this.share = this.$route.query.stshare
                    }else if (this.$route.query.tshare) {
                        this.share = this.$route.query.tshare
                    }
                }
            }

            var params = {};
            // params.tshare = this.$route.query.tshare || '';

            params.tshare = this.share;
            params.final_link = this.redirect_url || '';

            this.$api.getUser.wxLogin(params).then(res => {
                this.text = res;
                if (res.code == 200) {
                    window.location.href = res.result;
                }
            })
        },

    },
}
</script>


<style lang="less" scoped>
@import "../../assets/css/wxloginLoding.css";
.load_login {
    position: fixed;
    margin: auto;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    > div {
        background: #062734;
        // width:120px;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }
}
</style>
