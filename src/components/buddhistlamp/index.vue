<template>
    <div>
        <div class="title">在线点灯祈福如意转轮藏</div>
        <!-- <img src="../../assets/img/buddhistlamp/buddhistal_03.png" alt="" /> -->
        <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white" style="max-height: 354px;">
            <van-swipe-item v-for="(item,index) in banner" :key="index">
                <img v-lazy="item.piclink" />
            </van-swipe-item>
        </van-swipe>
        <img src="../../assets/img/buddhistlamp/buddhistal_29.jpg" alt="" />
        <div class="bg">
            <van-field
                readonly
                clickable
                name="picker"
                :value="value"
                label="地区："
                placeholder=""
                @click="showPicker = true"
            />
            <van-popup v-model="showPicker" position="bottom">
            <van-picker
                show-toolbar
                :columns="columns"
                @confirm="onConfirm"
                @cancel="showPicker = false"
            />
             </van-popup>
             <div class="simiao" >
                 <div v-for="(item,index) in lampList" :key="index" :class="[item.article_id == select ? 'active':'']" @click.stop="selectLamp(item.article_id,item.id)">{{item.name}}</div>
             </div>
        </div>
    </div>
</template>
<script>
import {copyData,log} from '../../utils/common.js'
export default {
    name:'lampindex',
  data() {
    return {
      value: '',
      columns: [''],
      showPicker: false,
      banner:[],
      lampList:[],
      cityList:[],
      select:'',
    };
  },
  watch:{
    value(){
        this.lampList = this.cityList[this.value]
    }
  },
  methods: {
    onConfirm(value) {
      this.value = value;
      this.showPicker = false;
    },
    async getBanner(){
       let res = await  this.$api.lamp.getBanner({cate:'temple_lamp_index'})
       if(res.code == 200 && res.result.length){
           this.banner = res.result
       }
    },
    async getCity(){
        let res = await this.$api.lamp.getCity()
        let d = res.result
        this.columns = d.city
        this.cityList = d.list
    },
    selectLamp(id,temple_id){
        this.select = id
        this.$store.commit('setLamp',{temple_id:temple_id,article_id:id})
        setTimeout(()=>{
            this.$router.push({name:'lampdetail',params:{temple_id:temple_id,article_id:id}})
        },300)
    }
  },
  mounted(){
      this.getBanner()
      this.getCity()
      document.addEventListener('touchstart', function() {
        document.getElementById('audio1') && document.getElementById('audio1').play()
      })
  },
};
</script>
<style lang="less" scoped>
    img{width: 100%;}
    .title{
        text-align: center;
        color: #bb5b4b;
        font-size: 18px;
        font-weight: bold;
        padding: 5px 0;
    }
    .bg{
        background: #fffefc url('../../assets/img/buddhistlamp/yemian_18_02.jpg') no-repeat center/100%;
        height: 293px;
    }
    .simiao{
        font-size: 16px;
        text-align: center;
        height: 160px;
        overflow-y: auto;
        margin-top: 1em;
    }
    .simiao .active{
        color: #cc7d76;
    }
   /deep/.van-cell {
        /* padding: 0 88px; */
        font-size: 16px;
        /* border-bottom: 0 !important; */
        border: 1px solid #f7f2ee;
        width: 205px;
        margin: auto;
        border-radius: 100px;
        background: #fffbf5;
    }
    /deep/.van-field__label {
        width: 49px;
        color: #b4b3ae;
        margin-right: 3px;
        margin-top: 1px;
        margin-left: 13px;
    }
   /deep/.van-field__control {
        font-size: 16px;
        color: #cc7d76 ;
    }
    /deep/.van-cell::after{
        border-bottom: 0;
    }
</style>