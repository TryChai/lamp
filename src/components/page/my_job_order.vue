<template>
  <!-- 我的工单 -->
  <div class="my_job_order black_color">
    <van-nav-bar title="我的工单" left-arrow @click-left="toBack" />

    <div class="job_order">
      <div class="select_table">
        <van-tabs v-model="active" v-if="field.length > 0" @change="getFormField">
          <van-tab :title="item.title" v-for="(item,i) in field" :name="item.id" :key="i"></van-tab>
        </van-tabs>
      </div>

      <div class="order_data">
        <div class="job_data" v-for="(item,i) in list.data" :key="item.id">
          <div class="data_info">
            <div class="form_data form_time" v-if="item.created_time">
              <p>提交时间</p>
              <p>{{$fnc.getTimeFormat(item.created_time)}}</p>
            </div>
            <div class="form_data" v-if="item.oid">
              <p>订单id</p>
              <p>{{item.oid}}</p>
            </div>
            <div class="form_data" v-for="(field,i) in list.field" :key="i">
              <p>{{field.title}}</p>
              <p>{{item[field.iden]}}</p>
            </div>
          </div>
        </div>
        <div class="empty" v-if="list.data.length <= 0">
          <img src="../../assets/img/empty.png" alt="">
          <p>暂无数据~~~</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import MescrollVue from "mescroll.js/mescroll.vue";
  export default {
    data() {
      return {
        list: {
          data: []
        },
        field: [],
        table: {},
        active: ""
      }
    },
    components: {
      MescrollVue
    },
    methods: {
      getField() {
        //获取表格列表
        this.$api.getForm.getTableList().then(res => {
          if (res.code == 200) {
            this.field = res.result;
            if(this.$route.query.types){
              for(let i=0;i<this.field.length;i++){
                if(this.$route.query.types == this.field[i].title){
                  this.table = this.field[i];
                  break;
                }
              }
            }else{
              this.table = this.field[0];
            }
            this.active = this.table.id;
            this.getFormField();
          }
        })
      },
      getFormField() {
        //根据id获取表格
        this.$api.getForm.getFormFieldHistory({
          id: this.active
        }).then(res => {
          if (res.code == 200) {
            this.list = res.result;
            this.order = this.list.data[0];
          }
        })
      }
    },
    created() {
      this.getField();
    }
  }
</script>

<style lang="less" scoped>
  .my_job_order {
    background: #f6f6f6;
    height: 100%;
    overflow: auto;
    
    .job_order{
      margin: 15px;
      
      .order_data{
        .job_data{
          margin: 20px 0;
          background: #fff;
          padding: 10px 15px;
          border-radius: 10px;
        }
      }
      
      .data_info{
        .form_data{
          display: flex;
          justify-content: space-between;
          font-size: 14px;
          margin: 10px 0;
          color: #969799;
          
          p:nth-of-type(2){
            color: #000;
          }
        }
        
        .form_time{
          border-bottom: 1px solid #D6D6D6;
          font-size: 16px;
        }
      }
    }
    
    .empty{
      font-size: 14px;
      text-align: center;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%,-50%);
      
      >p{
        margin-top: 5px;
        color: rgb(198,198,198);
      }
    }
  }
</style>
