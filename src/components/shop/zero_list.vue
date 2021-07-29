<template>
  <!-- 零元购列表 -->
  <div class="zero_list">
    <van-nav-bar left-text left-arrow class="navbar" title="零元购" @click-left="toBack"></van-nav-bar>
    <div class="cut_top" v-show="banner">
      <img :src="$fnc.getImgUrl(banner)" alt />
    </div>
    <div class="zero" v-for="(item,k) in zeroList.pro" @click="$router.push({path:'/shop/shopdetails',query:{id:item.id}})">
      <p>
        <img :src="$fnc.getImgUrl(item.piclink)" alt="">
      </p>
      <div class="zero_info">
        <p style="line-height: 24px;">{{item.title.length > 25 ? item.title.slice(0,25) + "..." : item.title}}</p>
        <div class="zero_price">
          <div class="price">
            <p>市场价：￥{{$fnc.toFixedZ(item.price)}}</p>
            <p>￥<span>0.00</span></p>
          </div>
          <p class="zero_btn">马上抢</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default{
    data(){
      return{
        zeroList: {},
        banner: ""
      }
    },
    methods:{
      getZeroList(){
        this.$api.getShop.getZero().then(res => {
          if(res.code == 200){
            this.zeroList = res.result;
          }
        })
      },
      get_cut_banner() {
        this.$api.getConfig.get_iden({
          iden: "lyg"
        }).then(res => {
          if (res.code == 200) {
            this.banner = res.result;
          }
        });
      }
    },
    created() {
      this.getZeroList();
      this.get_cut_banner();
    }
  }
</script>

<style lang="less" scoped>
  .zero_list{
    overflow: auto;
    background: #f3f3f3;
    
    .cut_top {
      width: 100%;
      padding: 10px 15px;
      background-color: #ffffff;
      
      img {
        width: 100%;
      }
    }
    
    .zero{
      display: flex;
      background: #fff;
      margin: 10px 10px 0;
      padding: 10px;
      border-radius: 10px;
      
      >p{
        line-height: 1;
        
        img{
          width: 99px;
          height: 99px;
          border-radius: 10px;
        }
      }
      
      .zero_info{
        margin-left: 12.5px;
        font-size: 14px;
        width: 100%;
        
        .zero_price{
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          margin-top: 10px;
          
          .price{
            font-size: 12px;
            color: #b8b8b8;
            line-height: 20px;
            
            p:nth-of-type(1){
              text-decoration: line-through;
            }
            
            p:nth-of-type(2){
              color: #ff0000;
              
              span{
                font-size: 18px;
                font-weight: bold;
              }
            }
          }
          
          .zero_btn{
            font-size: 14px;
            font-weight: bold;
            color: #fff;
            background-image: linear-gradient(to right, #ff795f, #ff4363);
            padding: 0 15px;
            border-radius: 20px;
            margin-bottom: 3px;
          }
        }
      }
    }
  }
</style>
