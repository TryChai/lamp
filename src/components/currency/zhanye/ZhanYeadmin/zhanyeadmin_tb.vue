<template>
    <div>
        <div class="admin_part">
            <div class="z-zhan-box-title" style="padding-left:0">
                流量图表
            </div>
            <div class="admin_data_box">
                <div id="main"
                    style="width: 100%;height: 200px;"></div>
            </div>
        </div>

    </div>
</template>
<script>

let echarts = require('echarts/lib/echarts')
require('echarts/lib/chart/line')
require('echarts/lib/component/tooltip')   // tooltip组件
require('echarts/lib/component/title')   //  title组件
require('echarts/lib/component/legend')  // legend组件
export default {
   name: "zhanyeadmin_tb",
   data () {
      return {
      };
   },

   mounted(){
     this.getHitWeek();
   },
   methods:{
      getHitWeek(){
         this.$api.getZhanYe.getHitWeek({}).then(res=>{
            if(res.code==200){
                this.$nextTick(function() {
                  this.drawLine('main',res.result)
               })
            }
         })
      },
      drawLine(id,obj) {
         this.charts = echarts.init(document.getElementById(id))
         this.charts.setOption({
            tooltip: {
               trigger: 'axis'
            },
            // legend: {
            //    data: ['近七日点击']
            // },
            grid: {
               left: '6%',
               right: '8%',
               bottom: '3%',
               top:"12%",
               containLabel: true
            },

            toolbox: {
               feature: {
                  saveAsImage: {}
               }
            },
            xAxis: {
               type: 'category',
               boundaryGap: false,
               data: obj.day.reverse()
            
            },
            yAxis: {
               type: 'value'
            },

            series: [{
               name: '近七日点击',
               type: 'line',
               stack: '总量',
               data: obj.num.reverse(),
               color: "#007ffd"
            }]
         })
      },
   },
}
</script>
<style lang="less" scoped>

</style>