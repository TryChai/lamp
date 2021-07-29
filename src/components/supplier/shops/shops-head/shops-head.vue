<template>
  <div class="shops-head" >
    <div class="fx">
      <span @click="showHead">{{address}}</span>
    </div>
    <div class="fx_3 shops-head-search">
      <div class="fx">
            <form action="/" class="fx_3">
            <van-search v-model="search"
                :placeholder="placeholder"
                background='#fff'
                style="padding:0"
                @search="search_btn" />
            </form>
      </div>
    </div>
    <!-- <div> -->
      <div class="city-con" id="city-ocn"  :class="{showPop:show}">
      </div>
        <van-popup class="city-con-pop" get-container="#city-ocn" v-model="show" position="top" :overlay="false">
          <shops-head-citys @emitAddress='getemitAddress' :paramsCity='paramsCity' />
        </van-popup>
    <!-- </div> -->
  </div>
</template>

<script>
import {  Search } from 'vant';
import shopsHeadCitys from "./shops-head-citys";
export default {
  name: "",
  props:{
    dia_show:{
      type:Boolean,
      default:false
    },
    paramsCity:{
      type:Object,
      default:()=>{}
    },
    placeholder:{
      type:String,
      default:'请输入店铺名'
    }
  },
  data() {
    return {
      show: false,
      params:{
        province: "",
        city: "",
        area: "",
      },
      search:'',

    };
  },
  computed:{
    address(){
      var params=this.params;
      if(params.area){
        if(params.city=='直辖区'){
            return this.sliceCity(params.province)+params.area;
        }else{
          return this.sliceCity(params.city)+params.area;
        }
      }else if(params.city){
        if(params.city=='直辖区'){
            return this.sliceCity(params.province);
        }else{
          return this.sliceCity(params.city);
        }
      }else{
        return "地区";
      }
    }
  },
  components: {
    shopsHeadCitys,
    [Search.name]: Search,
  },
  created() {
        this.params=this.paramsCity;
    if(this.dia_show){
        this.show=true;
    }
  },
  mounted() {},
  methods: {
    showHead(){
      this.show=!this.show;
      this.$bus.$emit('toggleHead')
    },
    search_btn(){
      this.$emit('searchTitle',this.search);
    },
    sliceCity(str){
      return str.slice(0,str.indexOf('市'))
    },
    getemitAddress(params){

        this.show=false;
        this.params=params;
        
        this.$emit('emitAddress',params);
    }
  },
  watch:{
    dia_show(val){
      console.log(val)
      this.show=val;
    },
    show(val){
      this.$emit('showTabs',val)
    }
  }
};
</script>
<style lang='less' scoped>
.showPop{
  max-height: 100% !important;
}
.search_box{
  height: 30px;
  >div{
    height: 30px;
    padding: 0;
  }
}
.shops-head {
  display: flex;
  height: 54px;
  // background-color: #fff;
  user-select: none;
  position: relative;
  z-index: 10;
  > div:first-child {
    justify-content: flex-start;
    min-width: 50px;
    height: 54px;
    margin-left: 10px;
    padding-right: 10px;
    font-weight: bold;
    > span {
      position: relative;
      max-width: 100%;
      color: #323233;
      font-size: 15px;
      padding: 0 6px 0 0;
    }
    > span::after {
      position: absolute;
      top: 50%;
      right: -4px;
      margin-top: -5px;
      border: 3px solid;
      border-color: transparent transparent currentColor currentColor;
      -webkit-transform: rotate(-45deg);
      transform: rotate(-45deg);
      opacity: 0.8;
      content: "";
    }
  }
  .shops-head-search {
    > div {
      height: 31px;
      justify-content: flex-start;
      color: #888888;
      // background: #f2f2f2;
      margin: 11px 10px 11px 0;
      border-radius: 27px;
      // padding-left: 12px;
      i {
        margin-right: 4px;
        font-weight: bold;
      }
    }
  }
  .city-con {
    position: fixed;
    right: 0;
    left: 0;
    bottom: 0;
    top: 54px;
    overflow: hidden;
    // height: 100%;
    background: #ddd;
    z-index: 10;
        max-height: 0;
        transition: all .3s ease-out,-webkit-transform .3s ease-out;
  }
}
.city-con-pop {
  position: absolute;
  max-height: 100%;
  height: ceil(100%-8px);
  border-radius: 0;
 
}
</style>
