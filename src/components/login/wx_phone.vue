<template>
    <div class="container phone_bg">
        <van-nav-bar
                title="绑定手机号"
                left-text
                left-arrow
                class="navbar"
                 @click-left="toBack"
        ></van-nav-bar>
        <div class="phone">
            <div class="phone_top">
                <img src="./../../assets/img/phone_bj.png" alt="">
            </div>
            <div class="phone_content">
                <div class="phone_content_top">
                    <p>绑定成功会让您的帐号更加安全,</p>
                    <p>完成绑定后,您还可以通过手机号登录哟~</p>
                </div>
                <div class="phone_content_input">
                    <input @blur="windowScorll" type="text" v-model="phone_num"  placeholder="请输入手机号码" class="wx_input input_tel">
                    <div class="phone_content_code">
                        <input @blur="windowScorll" type="text" v-model="input_code" maxlength='4'  placeholder="请输入手机收到的验证码" class="wx_input input_code">
                        <span v-show="show" @click="getCode">点我获取验证码</span>
                        <span v-show="!show" >{{timer}}s后重新获取</span>
                    </div>
                    <input @blur="windowScorll" type="text" v-model="recommen_code"  placeholder="请输入邀请码，获得更多优惠" class="wx_input input_recommend">

                </div>
                <div class="phone_content_btn">
                    <van-button round type="danger" @click="login" >下一步</van-button>
                </div>
            </div>
        </div>
    </div>

</template>

<script>
    export default {
        name: "wx_phone",
        data(){
            return{
                show: true,
                count: '',
                timer: null,
                wx_id:"",               //wxid
                phone_num:"",           //手机号码
                unicode:"",                //唯一码
                input_code:"",          //输入的验证码
                recommen_code:"",       //推荐码
            }
        },
        created(){
            this.wx_id = this.$route.query.wx_id;

        },
        watch:{
            input_code:function (v) {
                if (v.length >= 6){
                    this.input_code = this.input_code.slice(0,6)
                }
            }
        },

        methods:{
            login(){
                this.$api.getUser.wxphone_login(
                    {   wx_id:this.wx_id,
                        unicode:this.unicode,
                        tel: this.phone_num,
                        code:this.input_code,
                        tshare:this.recommen_code
                    }).then(res=>{
                    if (res.code == 200){
                        this.$router.push({path:"/"})
                    }
                });
            },
            getCode(){
                this.$api.getUser.sendCode({ tel: this.phone_num }).then(res => {
                    if (res.code === 200) {
                        this.$toast.success("发送成功");
                        this.unicode = res.result;         //唯一码
                        const TIME_COUNT = 60;
                        if (!this.timer) {
                            this.count = TIME_COUNT;
                            this.show = false;
                            this.timer = setInterval(() => {
                                if (this.count > 0 && this.count <= TIME_COUNT) {
                                    this.count--;
                                } else {
                                    this.show = true;
                                    clearInterval(this.timer);
                                    this.timer = null;
                                }
                            }, 1000)
                        }
                    }
                });
            }

        }
    }
</script>

<style scoped>
    * {
        touch-action: pan-y;
    }
    .phone_bg{
        width: 100%;
        background-color: white;
    }
    .phone_top{
        width: 40%;
        margin: 20px auto ;
    }
    .phone_top img{
        width: 100%;
    }
    .phone_content{
        display: flex;
        flex-flow: column;
        justify-content: center;
        align-items: center;
    }
    .phone_content_top p{
        font-size: 14px;
        text-align: center;
        color: #989898;
        line-height: 20px;
    }
    .phone_content_input{
        width: 280px;
        padding: 20px 0 ;
        display: flex;
        flex-flow: wrap;
        justify-content: center;
        align-items: flex-start;

    }
    .wx_input{
        width: 100%;
        height: 45px;
        border-radius: 20px;
        text-indent:40px;
        font-size: 12px;
        line-height: 50px;
    }
    .input_tel{
        background: url("./../../assets/img/wx_input.png") no-repeat top left /100% 100%;
    }
    .input_code{
        background: url("./../../assets/img/wx_code.png") no-repeat top left /100% 100%;
    }
    .input_recommend{
        background: url("./../../assets/img/wx_recommend.png") no-repeat top left /100% 100%;
    }
    .phone_content_code{
        width:100%;
        position:relative;
    }
    .phone_content_code span{
        height: 45px;
        font-size: 12px;
        color: #fbad27;
        position: absolute;
        top: 3px;
        right: 10px;
        line-height: 45px;
    }
    .phone_content_btn .van-button{
        width: 260px;
    }
</style>