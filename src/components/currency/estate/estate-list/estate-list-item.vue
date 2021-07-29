<template>
  <div class="estate-list-item fx">
    <van-image src="https://img.yzcdn.cn/vant/cat.jpeg" lazy-load width="76" height="114">
      <template v-slot:loading>
        <van-loading type="spinner" size="20" />
      </template>
    </van-image>
    <div class="estate-list-item-box">
        <div class="fx">
            <p>姓名：***</p>
            <p>电话：13577771234</p>
        </div>
        <div class="fx">
            <p>职业：医生</p>
            <p>性别：男</p>
        </div>
        <div class="fx">
            <p>年龄：32岁</p>
            <p>收入：13200元/月</p>
        </div>
        <div class="fx">
            <p>区域：福建省-福州市-台江区</p>
        </div>
        <div class="estate-list-item-box-footer">
            <span>跟进人：某某某</span>
        </div>
    </div>
  </div>
</template>

<script>
import { Image, Loading } from "vant";
export default {
  name: "estate-list-item",
  data() {
    return {};
  },
  components: {
    [Image.name]: Image,
    [Loading.name]: Loading
  },
  created() {},
  mounted() {},
  methods: {}
};
</script>
<style lang='less' scoped>
.estate-list-item{
    font-size: 14px;
    line-height: 1.3;
    
    .estate-list-item-box{
        color: #333333;
        font-weight: 400;
        flex: 3;
        margin-left: 14px;
        min-height: 114px;
        >div.fx{
            margin-bottom: 5px;
            >p:first-child{
                width: 105px;
            }
            >p:last-child{
                flex: 3;
            }
        }
        .estate-list-item-box-footer{
            margin-top: 5px;
            span{
                display: inline-block;
                background: #e11c84;
                color: #fff;
                border-radius: 3px;
                padding: 2px 6px;
            }
        }
    }
}
</style>
