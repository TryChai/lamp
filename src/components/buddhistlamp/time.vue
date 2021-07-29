<template>
    <div>
        <span>剩余时长：</span>
        <span class="cut-t">{{show.y}}</span>年
        <span class="cut-t">{{show.m}}</span>月
        <span class="cut-t">{{show.d}}</span>日
        <span class="cut-t">{{show.h}}</span>时
        <span class="cut-t">{{show.mn}}</span>分
        <span class="cut-t">{{show.s}}</span>秒
    </div>

</template>

<script>
 import {copyData,log} from '../../utils/common.js'
  export default{
     name:'timecut',
    props:['time'],
    data(){
      return {
        timer:null,
        tempTime:null,
        show:{
            y:'00',
            m:'00',
            d:'00',
            h:'00',
            mn:'00',
            s:'00'
        }
      }
    },
    mounted(){
        if(this.time > 0){
            this.tempTime = this.time
            this.calculation()
            // this.$emit('stop')
        }
    },
    watch:{
        tempTime(){
            if(this.tempTime <= 0 ){
                clearInterval(this.timer)
                this.show = { y:'00',m:'00',d:'00',h:'00',mn:'00',s:'00'}
                return
            }
            let time = this.tempTime
            let y = Math.floor((time / 31556926)) > 0 ? zero(Math.floor((time / 31556926))): "00";
            let m = Math.floor((time / 2629744)) > 0 ? zero(Math.floor(((time -(31556926*y)) / 2629744)) % 12) : "00";
            let d = Math.floor((time / 86400)) > 0 ? zero(Math.floor((time -(31556926*y+2629744*m)) / 86400)) : "00";
            let h = Math.floor((time / 3600)) > 0 ? zero(Math.floor(((time - ((31556926*y+2629744*m+d*86400))) / 3600)) % 24) : "00";
            let mn = Math.floor((time / 60)) > 0 ? zero(Math.floor(((time - (31556926*y+2629744*m+d*86400+h*3600)) / 60)) % 60) : "00";
            let s = zero((time - (31556926*y+2629744*m+d*86400+h*3600 + mn*60))% 60);
            //pms.day = Math.floor((dur / 86400)) > 0 ? f.zero(Math.floor((dur / 86400)) % 30) : "00";
            //月份，以实际平均每月秒数计算
            //年份，按回归年365天5时48分46秒算
            this.show.y = y
            this.show.m = m
            this.show.d = d
            this.show.h = h
            this.show.mn = mn
            this.show.s = s
            function zero(num){
                return num < 10 ? '0'+(num) : num
            }
        }
    },
    methods:{
        calculation(){
            this.timer = setInterval(() => {
                this.tempTime--
            }, 1000);
            
        }
    },
    beforeDestroy(){
        clearInterval(this.timer)
    }
  }
</script>
<style scoped>
.cut-t{
    background: #353535;
    color: #fff;
    padding: 0 3px;
    margin-right: 3px;
}
</style>

