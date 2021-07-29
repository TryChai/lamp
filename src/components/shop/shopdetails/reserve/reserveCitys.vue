<template>
  <div class="reserveCitys">
    <div class="city-liubai"></div>
    <div class="shops-citys-box fx">
      <ul class="shops-citys-box-province">
        <li
          v-for="(item,i) in provinceList"
          :key="i"
          @click="clickProv(item,i)"
          :class="{provinceActive:(item.t==province)}"
        >{{item.t}}</li>
      </ul>
      <ul class="shops-citys-box-city">
        <li
          v-for="(item,i) in provinceList[provinceIndex].z"
          :key="i"
          @click="clickCity(item,i)"
          :class="{provinceActive:item.t==city}"
        >
          <p>{{item.t}}</p>
          <img src="../../../../assets/img/supplier/gou.png" v-if="item.t==city" alt />
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { DropdownMenu, DropdownItem } from "vant";
import addressLists from "@/assets/js/address3";
export default {
  name: "",
  props: {},
  data() {
    return {
      provinceList: addressLists,
      provinceIndex: 0,
      province: "",
      city: "",
      cityIndex: 0
    };
  },

  components: {
    [DropdownMenu.name]: DropdownMenu,
    [DropdownItem.name]: DropdownItem
  },
  created() {},
  mounted() {},
  methods: {
    clickProv(item, i) {
      this.province = item.t;
      this.provinceIndex = i;
      this.cityIndex = 0;
      this.city = item.z[0].t;
      this.$emit(
        "setProvCity",
        { province: this.province, city: this.city },
        item.z.length == 1
      );
    },
    clickCity(item, i) {
      this.city = item.t;
      this.cityIndex = i;
      this.$emit(
        "setProvCity",
        { province: this.province, city: this.city },
        true
      );
    }
  }
};
</script>
<style lang='less' scoped>
.provinceActive {
  background: #fff;
}
.areaActive {
  background: #d5ac5a;
  color: #382d0d !important;
  font-weight: bold;
}
.reserveCitys {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  font-size: 14px;
  background: #fff;
  .city-liubai {
    height: 6px;
    background: #f6f6f6;
  }
  .shops-citys-box {
    flex: 3;
    overflow: auto;
    .shops-citys-box-province {
      width: 131px;
      background: #f6f6f6;
      height: 100%;
      overflow: auto;
      padding-bottom: 20px;
      > li {
        height: 40px;
        line-height: 40px;
        padding-left: 16px;
        color: #636363;
      }
    }
    .shops-citys-box-city {
      height: 100%;
      overflow: auto;
      padding-left: 15px;
      flex: 3;
      padding-bottom: 40px;
      > li {
        display: flex;
        justify-content: space-between;
        height: 41px;
        align-items: center;
        color: #545454;
        border-bottom: 1px solid #eeeeee;
        img {
          width: 20px;
          margin-right: 16px;
        }
      }
    }
  }
}
</style>
