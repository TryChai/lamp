<template>
    <div class="detail" >
        <div class="title">供灯</div>
       <div class="li">
            <div class="li-title">
                <span class="img"><img src="../../assets/img/buddhistlamp/yemian_20_03.jpg" alt=""></span>
                <span>供灯灯塔</span>
            </div>
            <div class="lampTown">
                <div style="margin-right:4px;position:relative" v-for="item in direction" :key=item.id>
                    <div v-if="formData.direction == item.id" class="active"><img src="../../assets/img/buddhistlamp/gou.png" alt=""></div>
                    <div @click.stop="setDirection(item.id)"><img :src="item.logo" alt=""></div>
                    <div class="text">{{item.name}}</div>
                    <div class="flex">
                        <div class="flex" style="width: 82px;">
                            <div class="flower"><img src="../../assets/img/buddhistlamp/buddhistal_13.jpg" alt=""></div>
                            <div class="num">{{item.choise_num}}</div>
                        </div>
                        <div class="flex">
                            <div class="flower"><img src="../../assets/img/buddhistlamp/buddhistal_11.jpg" alt=""></div>
                            <div class="num">{{item.no_choise_num}}</div>
                        </div>
                    </div>
                </div>
            </div>
       </div>
        <div class="li">
            <div class="li-title">
                <span class="img"><img src="../../assets/img/buddhistlamp/yemian_20_03.jpg" alt=""></span>
                <span>供灯位置</span>
            </div>
            <div class="posi" @click.stop="goPosi">
                <span class="posi-num" v-if="lights.x && lights.y" >{{lights.y}}-{{lights.x}}</span>
                <span class=posi-icon>&gt;</span>
            </div>
        </div>
        <div class="li">
            <div class="li-title">
                <span class="img"><img src="../../assets/img/buddhistlamp/yemian_20_03.jpg" alt=""></span>
                <span>供灯时长</span>
            </div>
            <div class="flex lamptime">
                <div :class="[formData.time == item.id ? 'active':'']" @click.stop="setTime(item.id)" v-for="item in timeList" :key="item.id">{{item.name}}</div>
            </div>
        </div>
        <div class="li">
            <div class="li-title">
                <span class="img"><img src="../../assets/img/buddhistlamp/yemian_20_03.jpg" alt=""></span>
                <span>祈福语</span>
            </div>
            <div class="flex qifu">
                <div :class="[formData.blessings == item.id ? 'active':'']" @click.stop="setBlessings(item.id)" v-for="item in qifuList" :key="item.id">{{item.name}}</div>
            </div>
            <div class="textarea"><textarea name="" id="" cols="30" rows="10">{{textarea}}</textarea></div>
        </div>
        <div class="li" style="margin-bottom:0">
             <div class="li-title bor-right">
                <span class="img"><img src="../../assets/img/buddhistlamp/yemian_20_03.jpg" alt=""></span>
                <span>祈福人姓名</span>
                <input class="input-text" type="text" placeholder="选填姓名" maxlength="30" v-model="formData.blessName" />
            </div>
            <div class="li-title bor-right">
                <span class="img"><img src="../../assets/img/buddhistlamp/yemian_20_03.jpg" alt=""></span>
                <span>祈福人手机</span>
                <input class="input-text" type="phone" placeholder="选填手机号用于提醒供灯到期" v-model="formData.blessPhone" maxlength="11" />
            </div>
             <div class="li-title bor-right">
                <span class="img"><img src="../../assets/img/buddhistlamp/yemian_20_03.jpg" alt=""></span>
                <span>收福人姓名</span>
                <input class="input-text" type="text" placeholder="选填姓名" maxlength="30" v-model="formData.name" />
            </div>
            <div class="li-title ">
                <span class="img"><img src="../../assets/img/buddhistlamp/yemian_20_03.jpg" alt=""></span>
                <span>收福人手机</span>
                <input class="input-text" type="phone" placeholder="选填手机号" v-model="formData.phobe" maxlength="11" />
            </div>
         <div class="flex lampbtn">
            <div class="flex">
                <div class="count">合计</div>
                <div class="money">￥{{money}}</div>
            </div>
            <div class="btn" @click.stop="submit">随喜捐赠</div>
         </div>  
            
        </div>
    </div>
</template>
<script>
import {copyData,log} from '../../utils/common.js'
import {mapGetters} from 'vuex'
export default {
    name:'lamppay',
  data() {
    return {
        direction:[],
        timeList:[],
        qifuList:[],
        formData:{
            blessings:'',
            time:'',
            direction:'',
            name:'',
            phone:'',
            blessName:'',
            blessPhone:'',
        },
        lights:{x:'',y:'',id:''}
    };
  },
  created(){
      if(this.$store.state.lamp.lamppay && Object.keys(this.$store.state.lamp.lamppay).length){
          this.formData = copyData(this.$store.state.lamp.lamppay)
      }
  },
  mounted(){
   this.getDetail()
  },
  watch:{
    'getLamp.location':{
        deep:true,
        immediate:true,
        handler(){
            if(this.getLamp.location && Object.keys(this.getLamp.location).length && this.getLamp.location.x){
                this.lights = copyData(this.getLamp.location)
            }
        }
      
    }
  },
  computed:{
    getLamp(){
        return this.$store.getters.getLamp
    },
    textarea(){
        let b = this.formData.blessings
        let str = ''
        if(this.qifuList.length){
          let res = this.qifuList.filter(item=>item.id == b)
          if(res && res.length){
              str = res[0].content
          }
        }
        return str
    },
    money(){
        let m = '' ,t = this.formData.time
        if(t.length){
            let res = this.timeList.filter(item=>item.id == t)
            if(res && res.length){
                m = res[0].money
            }
        }
        return m
    }
  },
  methods: {
   async getDetail(){
     let res = await this.$api.lamp.getLampDetail({type:1,temple_id:1})
     if(res.code == 200){
         this.qifuList = res.result.blessings
         this.timeList = res.result.time
         this.direction = res.result.direction
     }
    //  console.log(res)
   },
   submit(){
       let f = copyData(this.formData),{x,y} = this.lights
       let reg = /^1(3|4|5|7|8)\d{9}$/
       if(!f.direction || !f.direction.length){
           this.$toast('请选择灯塔位置！')
           return
       }
       if(!x || !y){
        this.$toast('请选择供灯位置！')
           return
       }
       if(!f.time || !f.time.length){
        this.$toast('请选择供灯时间！')
           return
       }
       if(!f.blessings || !f.blessings.length){
        this.$toast('请选择祈福语！')
           return
       }
       if(!this.textarea || !this.textarea.length){
        this.$toast('请填写祈福语！')
           return
       }
       if(!f.blessName || !f.blessName.length){
        this.$toast('请填写祈福人姓名！')
           return
       }
       if(!f.blessPhone || !f.blessPhone.length){
        this.$toast('请填写祈福人手机号！')
           return
       }
       if(!reg.test(f.blessPhone)){
        this.$toast('祈福人手机号填写不正确！')
           return
       }
       log(this.$store.state.lamp)
       let param = {
           type:this.$store.state.lamp.type,
           temple_id:this.$store.state.lamp.temple_id,
           direction_id:f.direction,
           time_id:f.time,
           money:this.money,
           user_id:this.$store.state.user.uid,
           being_user_name:f.blessName,
           being_user_tel:f.blessPhone,
           blessings_id:f.blessings,
           blessings_content:this.textarea,
           location_id:this.lights.id
       }
       this.$toast.loading({ mask: false,
                message: '加载中...'})
       this.$api.lamp.submitOrder(param).then(res=>{
           if(res.code == 200){
               let p = {
                    id:res.result,
                    money:this.money,
                    uid:this.$store.state.user.uid,
               }
               this.$api.lamp.payOrder(p).then(ret=>{
                   if(ret.code == 200){
                       setTimeout(() => {
                           this.$router.push({
                             path: "/order/payorder",
                             query: {
                               id: ret.result,
                             },
                           });
                         }, 1000);

                   }
                    log(ret)
               })
           }
       })
      

   },
   setBlessings(id){
        this.formData.blessings = id
   },
   setTime(id){
        this.formData.time = id
   },
   setDirection(id){
    this.formData.direction = id
   },
   goPosi(){
       this.$store.commit('setLamp',{lamppay:this.formData})
       this.$router.push({name:'lampposition',params:this.lights})
   }
  },
};
</script>
<style lang="less" scoped>
    img{width: 100%;}
    .flex{display: flex;}
    .relative{position: relative;}
    .detail{    
        position: relative;
        width: 100%;
        height: 100%;
        background: #fbf6f0;
        overflow: auto;
    }
    .title{
        text-align: center;
        color: #bb5b4b;
        font-size: 18px;
        font-weight: bold;
        padding: 5px 0;
    }
    .li{
        background: #ffffff;
        position: relative;
        padding-top: 5px;
        margin-bottom: 10px;
    }
    .li-title{
        display: flex;
        position: relative;
        font-size: 13px;
        padding: 10px 8px;
        color: #b10115;
        .img {
            width: 14px;
            margin-right: 5px;
        }
        .input-text{
            display: inline-block;
            margin-top: 3px;
            margin-left: 11px;
            width: 236px;
        }
    }
    .lampTown {
        display: flex;
        padding: 0 22px;
        flex-wrap: wrap;
        >div{flex:1}
        .text{
            font-size: 13px;
            color: #b10115;
        }
        .flower{
            width: 33px;
        }
        .num{
            font-size: 15px;
            line-height: 50px;
            color: #636363;
            margin-left: 2px;
            font-weight: 400;
        }
        .active{
            position: absolute;
            right: 1px;
            top: 0;
            border-top: 34px solid #aa050c;
            border-left: 42px solid transparent;
            img{
                width: 20px;
                position: absolute;
                top: -34px;
                right: 2px;
                z-index: 9;
            }
        }
    }
    .posi{
        position: absolute;
        top: 2px;
        right: 0.32rem;
        width: 140px;
        text-align: right;
        z-index: 5;
        .posi-num{
            font-size: 15px;
            margin-right: 4px;
            color: #ae5247;
        }
        .posi-icon{
            font-size: 15px;
            color: #5d5d5d;
        }
    }
    .lamptime{
        flex-wrap: wrap;
        width: 100%;
        padding: 0 9px;
        padding-bottom: 6px;
        >div{
            margin: 3px 6px 9px;
            font-size: 14px;
            background: #ececec;
            border-radius: 24px;
            color: #323232;
            width: 77px;
            text-align: center;
            height: 30px;
            line-height: 30px;
        }
        .active{
                background: #b95848;
                color: #fff;
        }
    }
    .qifu{
        flex-wrap: wrap;
        width: 100%;
        padding: 0 9px;
        padding-bottom: 6px;
        >div{
            margin: 0.08rem 0.16rem 0.24rem;
            font-size: 0.37333rem;
            /* background: #ececec; */
            border-radius: 0.64rem;
            color: #a9a9a9;
            width: 2.05333rem;
            text-align: center;
            height: 30px;
            line-height: 30px;
            border: 1px solid #cfccc3;
        }
         .active{
                background: #b95848;
                color: #fff;
                border: 0;
        }
    }
    .textarea{
        padding: 0 17px;
        textarea{
            width: 100%;
            height: 111px;
            background: #d9d9d1;
            border: 0;
            padding: 5px 7px;
        }
    }
    .bor-right:after{
        content: '';
        width: 87%;
        height: 0.02667rem;
        border-bottom: 0.02667rem solid #cbcbcb;
        position: absolute;
        bottom: 0;
        left: 21px;
    }
    .lampbtn{
        padding: 0 10px;
        margin-top: 15px;
        >div{
            flex:1;
            justify-content: center;
        }
        .btn{
            background: #c40606;
            color: #fff;
            text-align: center;
            font-size: 18px;
            line-height: 46px;
            height: 46px;
        }
        .count{
            font-size: 14px;
            color: #616161;
            line-height: 44px;
            margin-right: 4px;
        }
        .money{
            color: #c90507;
        }
    }
</style>