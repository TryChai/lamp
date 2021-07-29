<template>
    <div class="detail" >
        <div class=" top-box relative">
             <div><img src="../../assets/img/buddhistlamp/yemian_15_02.jpg" alt=""></div>
             <div class="flex top-text">
                <div>{{lights.noSelect}}</div>
                <div>{{lights.select}}</div>
                <div>{{lights.lights}}</div>
             </div>
        </div>
       <div class="light-list">
        <div v-for="(item,keys) in lightList" :key="keys" class="flex ">
            <div class="left">{{(lightList.length - keys) < 10 ? '0'+(lightList.length - keys):(lightList.length - keys)}}</div>
            <div v-for="(it,index) in item" :key="index" @click.stop="checkLight(keys,index)" class="light">
                <div v-if="it.value == 0"><img src="../../assets/img/buddhistlamp/buddhistal_11.jpg" alt="" data="未点灯"></div> 
                <div v-if="it.value == 1"><img src="../../assets/img/buddhistlamp/buddhistal_13.jpg" alt="" data="已选"></div>  
                <div v-if="it.value == 2"><img src="../../assets/img/buddhistlamp/yemian_15_05.jpg" alt="" data="已点灯" style="margin-top: -9px;width: 110%;margin-left: -2px;"></div>  
                <div style="font-size:14px;color: #5d5d5d;text-align: center;">{{lightList.length - keys}}-0{{index+1}}</div>
            </div>
        </div>
        
       </div>
       
    </div>
</template>
<script>
 import {copyData,log} from '../../utils/common.js'
export default {
    name:'lampposition',
  data() {
    return {
     lightList:[],
     light:{
        x:0,y:0
     },
     lights:{
         noSelect:0,
         select:0,
         lights:0,
     },
     select:{
         x:'',y:''
     },
     locationList:[]
    };
  },
  created(){
    
  },
  computed:{
    getLamp(){
        return this.$store.getters.getLamp
    },
  },
  watch:{
    light:{
        deep:true,
        handler(){
            let {x,y} = this.light 
            if(x<=0) return
            let t = 1
            let temp = []
            for(let i = 0;i<y;i++){
                temp.push([])
                for(let j = 0;j<x;j++){
                    let d = {id:t,value:0}
                    temp[i].push(d)
                    t++
                }
            }
            this.lightList = temp
        }
    },
    locationList(){
        let l = this.locationList,{x,y} = this.light
        let list = copyData(this.lightList)
        if(l.length){
            l.forEach(item => {
                let temp_y = y-item.location_y
                let temp_x = item.location_x-1
                list[temp_y][temp_x].value = item.lamp_status
            });
            this.lightList = copyData(list)
        }
        let loc = this.getLamp.location
        if(loc && Object.keys(loc).length && loc.x){
            let {x,y} = loc
            let x1 = this.light.x
            let y1 = this.light.y
            if(y1 >0 ){
                let temp_x,temp_y
                temp_y = Number(y1)-Number(y)
                temp_x = Number(x)-1
                let list = copyData(this.lightList)
                list[temp_y][temp_x].value = 1
                this.lightList = copyData(list)
            }
        }
    },
    // getLamp:{
    //     deep:true,
    //     handler(){
    //         let loc = this.getLamp.location
    //          log('loc',loc)
    //     }
      
    // }
  },
  mounted(){
   this.getPosi()

  },
  methods: {
      async getPosi(){
         let res = await this.$api.lamp.getLampPosition({type:1,temple_id:1,direction_id:1})
         if(res.code == 200){
             this.lights.noSelect = res.result.no_choise_num
             this.lights.select = res.result.choise_num
             this.lights.lights = res.result.lamp_num
             this.light.x = res.result.x_num
             this.light.y = res.result.y_num
             this.locationList = res.result.location_list && res.result.location_list.length && res.result.location_list.filter(item=>item.lamp_status != 0)
         }
        //  console.log(res)
      },
      checkLight(k,l){
        let lightList = JSON.parse(JSON.stringify(this.lightList))
        let val = lightList[k][l].value
        if(val == 2){
            return
        }
       val = val == 1 ? 0 : 1
       lightList[k][l].value = val
       let id = lightList[k][l].id
       this.select = {x:l,y:k}
       let {x,y} = this.light
       this.lightList = JSON.parse(JSON.stringify(lightList))
       let p = {
           x:l+1<10?'0'+(l+1):l+1,
           y:y-k<10?'0'+(y-k):y-k,
           id:id
       }
       this.$store.commit('setLamp',{location:p})
       this.$router.go(-1)
    //    this.$router.replace({name:'lamppay',params:{x:l+1<10?'0'+(l+1):l+1,y:y-k<10?'0'+(y-k):y-k ,id:id}})
      }
  },
  
};
</script>
<style lang="less" scoped>
    img{width: 100%;}
    .relative{position: relative;}
    .flex{display: flex;}
    .top-box{
        background: #fff;
        .top-text{
            position: absolute;
            bottom: 17px;
            left: 32px;
            width: 313px;
            font-size: 22px;
            font-weight: 600;
            >div{
                flex:1;
                text-align: center;
            }
        }
    }
    .detail{    
        position: relative;
        width: 100%;
        height: 100%;
        background: #ffffff;
        overflow: auto;
    }
    .title{
        text-align: center;
        color: #bb5b4b;
        font-size: 18px;
        font-weight: bold;
        padding: 5px 0;
    }
    .light-list{
        padding: 5px 10px;
        .left{
            // flex: 1;
            margin-right: 7px;
            background: #1c1e1d;
            color: #fff;
            padding: 0 4px;
            box-sizing: border-box;
            font-size: 13px;
            width: 23px;
            line-height: 67px;
        }
        .light{
            flex: 1;
        }
        
    }

</style>