<template>
    <div class="detail" >
        <div class="title">供灯信息</div>
        <div class="relative">
             <div class="flex tab">
                <div v-for="(item,index) in tab" :key="index" @click.stop="changeTab(index)"
                    :class="[index == tabIndex ? 'active':'']">{{item}}</div>
             </div>
             <div v-if="isnodata" class="nodata relative">
                <div><img src="../../assets/img/buddhistlamp/buddhistal_21.png" alt=""></div>
                <div class="dianBtn" @click.stop="goDiandeng"></div>
             </div>
             <scroll-list v-if="orderList[0].length" @scrollBottom="scrollBottom" :loading="loading">
                <!-- <keep-alive> -->
                    <div v-show="tabIndex == 0">
                        <ul>
                            <li class="relative" v-for="(item,index) in orderList[0]" :key="index">
                                <div v-if="item.else_time<=0" class="gone"><img src="../../assets/img/buddhistlamp/yemian_06_03.jpg" alt=""></div>
                                <div>{{item.temple_direction_name}}</div>
                                <div class="flex" style="width:100%;">
                                    <div style="margin-right:50px"><span>收福人：</span><span class="color-h">{{item.being_user_name}}</span></div>
                                    <div><span>类型：</span><span class="color-h">{{item.blessings_name}}</span></div>
                                </div>
                                <timecut v-if="item.else_time>=0" :time="item.else_time" @stop="timestop(1)" />
                                <div v-if="item.else_time<=0" class="lightagain-box">
                                    <div class="lightagain-btn" @click.stop="goDiandeng">再次点灯</div>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div v-show="tabIndex == 1">
                        <ul>
                            <li class="relative" v-for="(item,index) in orderList[1]" :key="index">
                                <div v-if="item.else_time<=0" class="gone"><img src="../../assets/img/buddhistlamp/yemian_06_03.jpg" alt=""></div>
                                <div>{{item.temple_direction_name}}</div>
                                <div class="flex" style="width:100%;">
                                    <div style="margin-right:50px"><span>收福人：</span><span class="color-h">{{item.being_user_name}}</span></div>
                                    <div><span>类型：</span><span class="color-h">{{item.blessings_name}}</span></div>
                                </div>
                                <timecut v-if="item.else_time>=0" :time="item.else_time" @stop="timestop(1)" />
                                <div v-if="item.else_time<=0" class="lightagain-box">
                                    <div class="lightagain-btn" @click.stop="goDiandeng">再次点灯</div>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div v-show="tabIndex == 2">
                        <ul>
                            <li class="relative" v-for="(item,index) in orderList[2]" :key="index">
                                <div v-if="item.else_time<=0" class="gone"><img src="../../assets/img/buddhistlamp/yemian_06_03.jpg" alt=""></div>
                                <div>{{item.temple_direction_name}}</div>
                                <div class="flex" style="width:100%;">
                                    <div style="margin-right:50px"><span>收福人：</span><span class="color-h">{{item.being_user_name}}</span></div>
                                    <div><span>类型：</span><span class="color-h">{{item.blessings_name}}</span></div>
                                </div>
                                <timecut v-if="item.else_time>=0" :time="item.else_time" @stop="timestop(1)" />
                                <div v-if="item.else_time<=0" class="lightagain-box">
                                    <div class="lightagain-btn" @click.stop="goDiandeng">再次点灯</div>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div v-show="tabIndex == 3">
                        <ul>
                            <li class="relative" v-for="(item,index) in orderList[3]" :key="index">
                                <div v-if="item.else_time<=0" class="gone"><img src="../../assets/img/buddhistlamp/yemian_06_03.jpg" alt=""></div>
                                <div>{{item.temple_direction_name}}</div>
                                <div class="flex" style="width:100%;">
                                    <div style="margin-right:50px"><span>收福人：</span><span class="color-h">{{item.being_user_name}}</span></div>
                                    <div><span>类型：</span><span class="color-h">{{item.blessings_name}}</span></div>
                                </div>
                                <timecut v-if="item.else_time>=0" :time="item.else_time" @stop="timestop(1)" />
                                <div v-if="item.else_time<=0" class="lightagain-box">
                                    <div class="lightagain-btn" @click.stop="goDiandeng">再次点灯</div>
                                </div>
                            </li>
                        </ul>
                    </div>
                <!-- </keep-alive> -->

             </scroll-list>
        </div>
      
       
    </div>
</template>

<script>
import scrollList from './scrollList.vue'
import timecut from './time.vue'
import {copyData,log} from '../../utils/common.js'
export default {
  name:'lamporder',
  data() {
    return {
        info: this.$store.state.user,
        tabIndex:0,
        tab:['全部','即将过期','已过期','预约点灯'],
        orderList:[[],[],[],[]],
        page:[0,0,0,0],
        loading: false,
        finished: false,
        isnodata:false
    };
  },
  created(){
      
  },
  mounted(){ 
     this.getOrder(1,0)
  },
  methods: {
      changeTab(index){
          this.tabIndex = index
        //   this.page[index] = 0
          if(!this.orderList[index].length){
            this.getOrder(this.page[index],index)
          }
      },
      goDiandeng(){
        this.$store.commit('setLamp',{type:1})
        this.$router.push({name:'lampindex'})

      },
      async scrollBottom(){
          if(!this.finished){
              console.log('到底了')
              this.loading = true
            await this.getOrder(this.page[this.tabIndex],this.tabIndex)
            this.loading = false
          }
      },
      async getOrder(page,status){
          let index = this.tabIndex
          let orderList = copyData(this.orderList)
          this.$toast.loading({ mask: false,
                message: '加载中...'})
        let res = await  this.$api.lamp.getOrder({type:1,user_id:this.info.uid,lamp_status:status,page:page})
        if(res.code == 200){
            if(this.page[0] == 0 && !res.result.list.length && !this.orderList[0].length &&!this.orderList[1].length&&!this.orderList[2].length&&!this.orderList[3].length){
                this.isnodata = true
            }
            this.finished = res.result.is_not_data
            if(res.result.list.length){
                if(this.page[index] < 1 && this.orderList[index].length >0 && this.orderList[index].length < 5){
                    orderList[index] = copyData(res.result.list)
                }else{
                    orderList[index] = [...orderList[index],...copyData(res.result.list)]
                }  
            }
            this.orderList = copyData(orderList)
            this.page[index]++
        }
        console.log(res)
      },
      timestop(id){
        log(id)
      }
    },
    components:{
        scrollList,
        timecut
    }
};
</script>
<style lang="less" scoped>
    img{width: 100%;}
    .relative{position: relative;}
    .flex{display: flex;}
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
    .tab {
        justify-content: space-around;
        font-size: 16px;
        border: 1px solid #ddab6c;
        font-weight: 600;
        .active{
           background: #b95848;
           color: #fff;
        }
        >div{
            flex: 1;
            padding: 10px 0;
            border-right:1px solid #ddab6c;
            text-align: center;
        }
        >div:last-child{
            border-right: 0;
        }
    }
    .dianBtn{
        position: absolute;
        width: 103px;
        height: 100px;
        bottom: 12px;
        margin-left: 135px;
        z-index: 8;
    }
    .list{
        ul {
            padding: 8px 0;
            padding-bottom: 88px;
           li{
               background: #fff;
                width: 94%;
                margin: auto;
                padding: 7px 10px 10px;
                font-size: 14px;
                border-radius: 4px;
                color: #323232;
                margin-bottom: 10px;
                >div{
                    margin-bottom: 3px;
                }
                .color-h{
                    color:#b55b50
                }
                .cut-t{
                    background: #353535;
                    color: #fff;
                    padding: 0 3px;
                    margin-right: 3px;
                }
                .lightagain-box{
                    display: flex;
                    justify-content: flex-end;
                }
                .lightagain-btn{
                    border: 1px solid #bb5e4f;
                    padding: 2px 14px;
                    border-radius: 15px;
                    margin-top: 7px;
                    margin-right: 10px;
                    color: #bb5e4f;
                }
                .gone{
                    position: absolute;
                    top: 0;
                    right: 20px;
                    width: 61px;
                    z-index: 9;
                }
           } 
        }
    }
    .loading{
        text-align: center;
        margin: 10px 0;
    }
</style>