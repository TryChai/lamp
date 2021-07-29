<template>
    <div class="conn">
        <van-nav-bar
        :title="$h('发红包')"
        :left-text="$h('取消')"
        @click-left="chanbank"
        :border="false"
        />
        <div class="con_paly"> 
        <van-row type="flex" justify="center">
            <van-col span="24" class="tc">
                <img :src="$fnc.getImgUrl(list.avter,'sex') ||   require('../../../assets/img/member/sex1.png') " class="man" alt="">
            </van-col>
        </van-row>
        <van-row type="flex" justify="center">
            <van-col span="24" class="tc">{{$h('给')}}{{list.name}} {{$h('发红包')}}</van-col>
        </van-row>
        <van-row type="flex" justify="center" class="paly_item">
            <van-col span="12" class="tl money_it">
                <van-icon name="balance-list" />
                {{$h('选择资金类型')}}
            </van-col>
            <van-col span="12" class="tr">
                <van-dropdown-menu :overlay="false" class="mon_c" active-color="red">
                    <van-dropdown-item v-model="value1" :options="info.coin" @change="getItem" class="mon_menu"  />
                </van-dropdown-menu>
            </van-col>
        </van-row>
        <van-row type="flex" justify="space-between">
            <van-col span="24" class="tl paly_tishi">{{$h('请选择发红包的资金类型')}}</van-col>
        </van-row>
        <van-row type="flex" justify="center" class="paly_item">
            <van-col span="12" class="tl money_it">  {{$h('输入金额')}}  </van-col>
            <van-col span="12" class="tr">
                <van-row type="flex" justify="end" class="play_shuru">
                    <van-field  @blur="windowScorll" v-model="money" :border="false" type="number" placeholder="0.00"  class="tr" /> 
                    <!-- <span >{{value1}}</span> -->
                </van-row>
            </van-col>
        </van-row>
        <van-row type="flex" justify="space-between">
            <van-col span="12" class="tl paly_tishi">{{$h('可用')}}:{{sum}}</van-col>
            <van-col span="12" class="tr paly_tishi">{{$h('手续费')}}:{{money*info.fee/100}}</van-col>
        </van-row>
        <van-row type="flex" justify="center" class="paly_item">
            <van-col span="24" class="tl content_play">
                <van-field  @blur="windowScorll" v-model="content"  ref="ss" :border="false" type="text" :placeholder="$h('恭喜发财，大吉大利')" class="input_textarec"   /> 
                <!-- <span class="place_text">{{text}}</span> -->
            </van-col>
        </van-row>
        <van-row type="flex" justify="center" class="but_paly">
            <van-button type="danger" :disabled=" money<=0 || money>sum || show" @click="sendHongBao">{{$h('塞钱进红包')}}</van-button>
        </van-row>
    </div>
        <van-row type="flex" justify="center" class="bottom_tishi">
            <van-col span="24" class="tc">{{$h('未领取的红包，将于24小时后发起退款')}}</van-col>
        </van-row>

        <van-popup v-model="showPass" class="pop_pass ">
           <div class=""> 
               <p class="p_title">{{$h('输入密码')}}</p>
             <van-cell-group> 
                 <van-field  @blur="windowScorll"
                        v-model="password"
                        type="password"
                        :label="$h('密码')"
                        :placeholder="$h('请输入支付密码')"
                        required
                    />
                
            </van-cell-group>
            <p class="forget_pwd">
              <span @click="$router.push('/setting/pay_password').catch(() => {})">忘记密码</span>
            </p>
            <van-button type="info" @click="cikHb">{{$h('确认支付')}}</van-button>
           </div>
        </van-popup>

    </div>
    
</template>

<script>
import { Field } from 'vant';
export default {
    name:"playhb",
    components:{
        [Field.name]:Field
    },
    props:{
        list:{
            type:Object,
            default:{}
        }
    },
    data(){
        return{
            value1: '',
            show:false,
            option1: [
                { text: '全部商品', value: 0 },
                { text: '新款商品', value: 1 },
                { text: '活动商品', value: 2 }
            ],
            money:"",
            info:{
                coin:[],
                fee:""
            },
            text:"恭喜发财，大吉大利",
            content:"",
            sum:"0.00",
            showPass:false,
            password:""
        }
    },
    mounted(){
        this.getInfo();
    },
    methods:{
        getItem(val){
            var arr=this.info.coin;
            for(var i in arr){
                if(arr[i].iden==val){
                    this.sum=arr[i].money;
                }
            }
        },
        chanbank(){
            this.$emit("closePlay",false)
        },
        cikHb(){
            
            this.show=true;
            var params={};
            var im=this.$route.query.id || '';
                if(im.indexOf('C2C')>=0){
                    im=im.replace('C2C','');
                }
                params.im=im;
                params.iden=this.value1 || '';
                params.money=this.money;
                params.password=this.$getCode(this.password);
                params.content=this.content || '恭喜发财大吉大利';
                this.$api.getIm.playHongBao(params).then(res=>{
                    this.show=false;
                    if(res.code==200){
                        
                        this.money='';
                        this.value1=this.info.coin[0].iden;
                        this.sum=this.sum-this.money;
                        this.$emit('hbsucc',{content:params.content,oid:res.result})
                        // this.$bus.$emit('toHb', params.content)
                        this.chanbank();
                    }else{
                        this.password='';
                    }
                })
        },
        sendHongBao(){
            this.showPass=true;
            

        },
        getInfo(){
            this.$api.getCoin.getHz({}).then(res=>{
                if(res.code==200){
                    for(var i in res.result.coin){
                        res.result.coin[i].value=res.result.coin[i].iden;
                        res.result.coin[i].text=res.result.coin[i].title;
                        this.value1=res.result.coin[0].iden;
                        this.sum=res.result.coin[0].money;

                    }
                    this.info=res.result;
                }
            })
        }
    },
    watch:{
        content(val){
            if(val==''){
                this.text='恭喜发财，大吉大利'
            }else{
                this.text='';
            }
        }
    }
}
</script>

<style lang="less" scoped>
.pop_pass{
    width: 95%;
    padding: 10px 16px 10px;
    .p_title{
        padding: 10px 0;
        font-size: 15px;
        font-weight: bold;
    }
    
    .forget_pwd{
      width: 100%;
      text-align: right;
      margin-top: 5px;
      line-height: 0.3;
      
      span{
        font-size: 13px;
        color: #1ba2ff;
      }
    }
    
    .van-cell{
        align-items: center;
    }
    button{
        margin: 20px 0;
    }
}
.content_play{
    position: relative;
    >div{
        padding: 0 !important;
    }
    .input_textarec{
        position: relative;
        z-index: 2;
            background: none;
    }
    .place_text{
        position: absolute;
        top: 17.5px;
        color: #d8d8d8;
        z-index: 1;
    }
}
.bottom_tishi{
    position: fixed;
    bottom: 8px;
    width: 100%;
    color: #858585;
    font-size: 15px;
}
.but_paly{
    margin-top: 24px;
    button{
        border-radius: 5px;
        width: 174px;
        font-size: 16px;
    }
}
.play_shuru{
    align-items: center;
    .van-cell{
        padding: 0 !important;
    }
    input{
        text-align: right;
    }
}
.paly_tishi{
    color: #d5d5d5;
    padding: 5px 16px 9px;
    font-size: 12px;
}
.mon_menu{
    margin: 10px;
}
.mon_c::after{
    border: none !important;
}
.money_it{
    color: #1a1a1a;
    font-size: 16px;
    >i{
        vertical-align: middle;
        color: #bf8f40;
    }
}
.paly_item{
    background: #fff;
    border-radius: 5px;
    padding: 0px 16px;
    align-items: center;
    min-height: 54px;
}

.conn{
    height: 100%;
    font-size: 14px;
    background: #f2f2f2;
   
}
.con_paly{
    padding: 10px;
}
.man{
    width: 60px;
    height: 60px;
    border-radius: 50%;
}
</style>
