<template>
  <div class=''>
      <div class="text-element">
        <template v-for="(item, index) in contentList">
            <span :key="index" v-if="item.name === 'text'">{{ item.text }}</span>
            <img v-else-if="item.name === 'img'" :src="item.src" width="20px" height="20px" :key="index" />
        </template>
    </div>
  </div>
</template>

<script>
import { decodeText } from '../../../utils/decodeText'
export default {
  name: '',
  props: {
    payload: {
      type: Object,
      required: true
    },
    isMine: {
      type: Boolean
    }
  },
  data(){
    return {}
  },
  computed: {
    contentList() {
      return decodeText(this.payload)
    }
  },
  components: {},
  created(){},
  mounted(){},
  methods: {}
}
</script>
<style lang='less' scoped>
.jstx_conta_l .jstx_contant {
  background-color: #fff;
  max-width: 260px;
  padding:10px 15px;
  min-height: 40px;
  float: left;
  margin-left: 10px;
  border-radius: 10px;
  color: #333333;
  line-height: 25px;
  font-size: 16px;
}
.jstx_conta_l .jstx_red{
  float:left;
  background:url('../../../assets/img/im/red.png');
  background-size: 100% 100%;
  text-align: center;
  color: #fdaf6c;
  width: 140px;
  height: 167px;
  margin-left: 10px;
  top: 0;
  border-radius: 10px;
  line-height: 25px;
  font-size: 14px;
  padding-top: 130px;
}
.jstx_conta_r {
  width: 310px;
  margin-bottom: 10px;
  position: relative;
  float: right;
}
.jstx_conta_r .jstx_tx {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  position: absolute;
  bottom: 0;
  right: 0;
}
.jstx_conta_r .jstx_contant {
  float: right;
  background-color: #aef4f2;
  max-width: 260px;
  padding: 10px 15px;
  min-height: 40px;
  margin-right: 50px;
  top: 0;
  border-radius: 10px;
  color: #333333;
  line-height: 25px;
  font-size: 16px;
}
.jstx_conta_r .jstx_red{
  background:url('../../../assets/img/im/red.png');
  background-size: 100%;
  text-align: center;
  color: #fdaf6c;
  float: right;
  width: 150px;
  height: 167px;
  margin-right: 50px;
  top: 0;
  border-radius: 10px;
  line-height: 25px;
  font-size: 16px;
  padding-top: 130px;
}
</style>
