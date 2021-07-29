<template>
  <div>
    <van-popup v-model="pop_show" position="bottom" :style="{ height: '60%' }">
      <van-overlay :show="overlayshow" />
      <div class="seladdress">
        <div class="add_title">
          请选择(中国大陆)
          <van-icon name="cross" @click="pop_show = false" />
        </div>
        <div class="add_box">
          <div class="add_top">
            <div class="add_top_title" v-for="(item,i) in seldata" :key="i" @click="selcate(item,i)">
              <span>
                <b v-show="i <= nowindex - 2"></b>
              </span>
              <span>{{item.title}}</span>
            </div>

          </div>
          <div class="add_sel">
            <div class="add_sel_p" v-if="level > nowindex">
              <p v-if="nowindex == 0 ">选择省份/地区</p>
              <p v-else-if="nowindex == 1 ">选择城市</p>
              <p v-else-if="nowindex == 2 ">选择区/县</p>
              <p v-else-if="nowindex == 3 ">选择街道/镇</p>
              <p v-else></p>
            </div>
            <div class="add_sel_box" v-if="Number(this.level) > (this.nowindex )">
              <div class="add_sel_box_item" v-for="(item,i) in pinyinArr" :key="i">
                <span>{{item.letter}}</span>
                <div>
                  <p v-for="(add,j) in item.list" :key="j" @click="selbtn(add)">{{add.title}}</p>
                </div>
              </div>
              <div class="add_sel_box_item" v-show="nowindex == 3 ">
                <span></span>
                <div>
                  <p @click="selbtn({id:'','title':''})">暂不选择</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </van-popup>
  </div>
</template>
<script>
import { Popup, Overlay } from 'vant';
export default {
  name: "selAddress",
  data () {
    return {
      overlayshow: false,
      seldata: [],
      nowindex: 0,
      pinyinArr: [],
      addresslist: [],
      pop_show: false,
    };
  },
  props: {
    /*层级 1 省  2 省市  3 省市区 4 省市区县*/
    level: {
      type: [Number, String],
      default: 4
    },
    show: {
      type: Boolean,
      default: false,
    },
    is_not: {
      type: Boolean,
      default: false,
    }
  },
  watch: {
    pop_show (old, after) {
      if (old == false) {
        var arr = [];
        this.seldata.forEach((item, i) => {
          arr.push(item.title)
        })
        this.overlayshow = false;
        this.$emit('confirm', arr)
      }
    },
    show (old, after) {
      this.pop_show = old
    }
  },
  components: {
    [Popup.name]: Popup,
    [Overlay.name]: Overlay,
  },
  created () {
    this.getinfo();
  },

  methods: {
    init () {
      this.overlayshow = false;
      this.seldata = [];
      this.nowindex = 0;
      this.pinyinArr = [];
      this.addresslist = [];
      this.pop_show = false;
      this.getinfo();
    },
    selcate (item, i) {
      this.overlayshow = true;
      this.nowindex = i;
      var num = this.seldata.length - i;
      this.seldata.splice(i, num)
      if (this.seldata.length > 0) {
        this.getinfo(this.seldata[this.seldata.length - 1].id)
      } else {
        this.getinfo();
      }

    },
    selbtn (item) {
      this.overlayshow = true;
      this.seldata.push(item)
      this.addresslist = [];
      this.nowindex++;
      if (Number(this.level) <= (this.nowindex)) {
        var arr = [];
        this.seldata.forEach((item, i) => {
          arr.push(item.title)
        })
        this.overlayshow = false;
        // localStorage.setItem("address_info",JSON.stringify(arr))
        this.$emit('confirm', arr)
        return
      } else {
        this.getinfo(item.id)
      }
    },
    getinfo (pid) {

      var params = {};
      if (pid) {
        params.pid = pid;
      }
      if (this.is_not) {
        params.is_not = 1;
      }
      this.$api.getPage.get_addresslist(params).then(res => {
        if (res.result && res.result.length == 0) {
          var arr = [];
          this.seldata.forEach((item, i) => {
            arr.push(item.title)
          })
          this.overlayshow = false;
          this.$emit('confirm', arr)
          this.addresslist = [];
          this.pinyinArr = [];
          return
        } else {
          this.addresslist = res.result;
          this.overlayshow = false;
          this.pinyinArr = this.data_letter_sort(res.result, 'pinyin')
        }

      })
    },

    data_letter_sort (data, field) {
      var letter_reg = /^[A-Z]$/;
      var list = new Array();
      for (var i = 0; i < data.length; i++) {
        // 添加 # 分组，用来 存放 首字母不能 转为 大写英文的 数据
        list['#'] = new Array();
        // 首字母 转 大写英文
        var letter = (data[i][field]).substr(0, 1).toUpperCase();
        // 是否 大写 英文 字母
        if (!letter_reg.test(letter)) {
          letter = '#';
        }
        // 创建 字母 分组
        if (!(letter in list)) {
          list[letter] = new Array();
        }
        // 字母 分组 添加 数据
        list[letter].push(data[i]);
      }

      // 转换 格式 进行 排序；
      var resault = new Array();
      for (var key in list) {
        resault.push({
          letter: key,
          list: list[key]
        });
      }

      resault.sort(function (x, y) {
        return x.letter.charCodeAt(0) - y.letter.charCodeAt(0);
      });
      // # 号分组 放最后
      var last_arr = resault[0];
      resault.splice(0, 1);
      resault.push(last_arr);
      return resault;
    },
  },
}
</script>
<style lang="less" scoped>
.seladdress {
  width: 100%;
  height: 100%;
  display: flex;
  flex-flow: column;
  justify-content: flex-start;
  .add_title {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 14px;
    height: 30px;
    position: relative;
    > .van-icon {
      position: absolute;
      right: 15px;
      font-size: 22px;
      top: 0;
      bottom: 0;
      margin: auto;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
  .add_box {
    width: 92%;
    height: 100%;
    display: flex;
    flex-flow: column;
    justify-content: flex-start;
    margin: 0 auto;
    .add_top {
      width: 100%;
      height: auto;
      display: flex;
      flex-flow: column;
      justify-content: flex-start;
      align-items: flex-start;
      line-height: 1;
      font-size: 14px;
      border-bottom: 1px solid #eeeeee;
      .add_top_title {
        width: 100%;
        height: 40px;
        display: flex;
        flex-wrap: nowrap;
        justify-content: flex-start;
        align-items: center;
        > span:nth-of-type(1) {
          width: 7.5px;
          height: 7.5px;
          border-radius: 50%;
          background-color: #ff5c2b;
          margin-right: 23px;
          position: relative;
          > b {
            position: absolute;
            width: 2px;
            height: 40px;
            top: 0;
            left: 3.5px;
            background-color: #ff5c2b;
          }
        }
        > span:nth-of-type(2) {
          font-size: 14px;
          color: #ff5c2b;
        }
      }
    }
    .add_sel {
      width: 100%;
      flex: 1;
      overflow: auto;
      .add_sel_p {
        font-size: 14px;
        color: #a2a2a2;
        line-height: 38px;
      }
      .add_sel_box {
        width: 100%;
        display: flex;
        flex-flow: column;
        justify-content: flex-start;
        align-items: flex-start;
        .add_sel_box_item {
          width: 100%;
          display: flex;
          flex-wrap: nowrap;
          justify-content: flex-start;
          align-items: flex-start;
          font-size: 14px;
          margin-bottom: 10px;
          > span {
            width: 12px;
            font-size: 16px;
            color: #7c7c7c;
            margin-right: 20px;
            padding-top: 5px;
          }
          > div {
            font-size: 14px;
            line-height: 36px;
          }
        }
      }
    }
  }
}
</style>