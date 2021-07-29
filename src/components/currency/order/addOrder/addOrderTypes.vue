<template>
  <div>
    <div class="add_order_coupon fx" @click="show=true">
      <div><b>请选择预约时间</b></div>
      <div>
          {{$fnc.getTimeFormat(new Date(currentTime).getTime())}}
        <van-icon name="arrow" color="#575757" size="14px"/>
      </div>
      <!-- 优惠券列表 -->
    </div>
        <van-popup v-model="show" position="bottom">

            <van-datetime-picker
            @change='changeTime'
            @confirm='addTime'
            @cancel='addTime'
            v-model="currentTime"
            type="datetime"
            :filter="filter"
            />
        </van-popup>
        
  </div>
</template>

<script>
import { DatetimePicker } from 'vant';
export default {
  components: {
      [DatetimePicker.name]:DatetimePicker
  },
  

  data() {
    return {
        currentTime: new Date((new Date().getFullYear()+'/'+(new Date().getMonth()+1)+'/'+new Date().getDate()+' '+(new Date().getHours()+1+':00'))),
        show:false
    };
  },
  methods: {
      addTime(time){
            this.show=false;
            if(time){
                this.currentTime=time;
                 this.$emit('sendTime',(new Date(time).getTime()+'').slice(0,10))
            }
           
      },
      changeTime(picker){
          var time=picker.getValues();
          this.$emit('sendTime',(new Date(time).getTime()+'').slice(0,10))
          
      },
      filter(type, options) {
      if (type === 'minute') {
        return options.filter(option => option % 30 === 0)
      }

      return options;
    }
  }
};
</script>


<style lang="less" scoped>
.coupon_popup {
  height: 95%;
  border-radius: 0;
  .van-tabs__nav{
    align-items: center;
  }
}
.add_order_coupon {
  line-height: 1.4;
  padding: 15px 16px;
  color: #333333;
  font-size: 14px;
  align-items: center;
  margin-bottom: 10px;
  border-radius: 10px;
  
  
}
</style>
