<template>
    <div class="container pay_bg">
        <van-nav-bar
                :title="'选择提现'+ type_data"
                left-text
                left-arrow
                class="navbar"
                @click-left="click_back()"
        >
            <van-icon name="question-o" slot="right" style="font-size: 20px"/>
        </van-nav-bar>
        <div class="sel_draw">
            <div class="sel_draw_content" v-if="type == 1">
                <van-radio-group v-model="sel_type" >
                    <van-cell-group>
                        <van-cell title="" v-for="(item,i) in draw_option.txzczh" :key="i" clickable @click="back_account(i,item,userinfo[i])" >
                            <template slot="title">
                                <div class="recharge_account_cell">
                                    <div class="recharge_account_sel_logo">
<!--                                        <img :src="$fnc.getImgUrl(item.piclink)" alt="">-->
                                        <img v-if="item == '微信'" src="./../../assets/img/pay/wx.png" alt="">
                                        <img v-else-if="item == '支付宝'" src="./../../assets/img/pay/zfb2.png" alt="">
                                        <img v-else-if="item == '网银'" src="./../../assets/img/pay/card.png" alt="">
                                    </div>
                                    <div class="recharge_account_sel_logo_p">
                                        <p>{{item}}</p>
                                        <p>{{userinfo[i] |inspect_null}}</p>
                                    </div>
                                    <van-radio  :name="i" />
                                </div>
                            </template>
                        </van-cell>
                    </van-cell-group>
                </van-radio-group>

            </div>
            <div class="sel_draw_content" v-if="type == 2">
                <van-radio-group v-model="sel_type" >
                    <van-cell-group>
                        <van-cell title="" v-for="(item,i) in draw_option.balance" :key="i" clickable @click="back_type(i,item.title,item.money,item.iden)" >
                            <template slot="title">
                                <div class="recharge_account_cell">
                                    <div class="recharge_account_sel_logo">


                                        <img src="./../../assets/img/pay/money.png" alt="" v-if="item.iden=='money'">
                                        <img src="./../../assets/img/pay/tx.png" alt="" v-else-if="item.iden=='amount'">
                                        <img src="./../../assets/img/pay/yue.png" alt="" v-else-if="item.iden=='integral'">
                                        <img src="./../../assets/img/pay/tx.png" alt="" v-else>
                                    </div>
                                    <div class="recharge_account_sel_logo_p">
                                        <p>{{item.title}}</p>
                                        <p>可用{{item.title}}:{{item.money}}</p>
                                    </div>
                                    <van-radio  :name="i" />
                                </div>
                            </template>
                        </van-cell>
                    </van-cell-group>
                </van-radio-group>

            </div>
        </div>

    </div>
</template>

<script>
    export default {
        name: "sel_draw",
        props:{
            type:Number,
            box_show:Boolean,
        },
        data(){
            return{
                sel_type:"",
                radio:"",
                account:"",             //账户data

                type_data:"",
                draw_option:"",
                balance: [
                    {
                        "title": "余额",
                        "iden": "money",
                        "money": 865,
                    },
                    {
                        "title": "积分",
                        "iden": "jifen",
                        "money": 777,
                    }
                ],
                userinfo:[]
            }
        },
        created(){
            this.get_account();
        },
        methods:{
            back_type(i,title,money,iden){
                this.sel_type = i ;
                this.$emit("back_type",{type:i,title:title,money:money,iden:iden})
            },
            back_account(i,type,account){
                if (account != "" && account != undefined && account != null ){
                    this.sel_type = i ;
                    var data = {id:i,type:type,account:account}
                    this.$emit("back_account",data)
                }else{
                    if (type == "支付宝" ){
                        this.$router.push('/setting/alpaysetting')
                    }else if ( type =="网银"){
                        this.$router.push('/setting/skzh')
                    }else if( type == "微信"){
                        this.$router.push('/setting/alpaywx')
                    }
                }
            },
            click_back(){
                this.$emit("get_back")
            },
            get_account(){
                this.$api.getPay.getdraw_index({}).then(res=>{
                    if (res.code == 200){
                        this.draw_option = res.result;
                        var arr=this.draw_option.txzczh;
                        var user=this.$store.state.user;
                        for(var  i in arr){
                            if(arr[i]=='支付宝'){
                                this.userinfo[i] = user.alipay;
                            }else if(arr[i]=='微信'){
                                this.userinfo[i] = user.wechat;
                            }else{
                                 this.userinfo[i] = user.bank_card ;
                            }
                        }
                        // 取得账户
                    }
                });
            },

        },
        watch:{
            type(val){
                this.type_data = (val == "1")? "账户" : "类型" ;
            },
            box_show(val){
                if (val == true){
                    this.get_account();

                }
            },
        },
        filters:{
            inspect_null(val){
                if (val != "" && val != undefined && val != null){
                    return val
                }else {
                    return "前往绑定"
                }
            },
        }
    }
</script>

<style scoped>
    @import "./../../assets/css/pay.css";
</style>