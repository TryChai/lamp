<template>
  <div class="shops-head-citys">
    <div class="fx">
      <div>
        当前：
        <span>{{city=='直辖区'?province+area:area?city+area:city+'全城'}}</span>
      </div>
      <div class="ssss" @click.stop="show=!show">
        <van-dropdown-menu :overlay="false" class="citys-dropdown-menu">
          <van-dropdown-item title="切换区县" class="hide-down"></van-dropdown-item>
        </van-dropdown-menu>
      </div>
    </div>
    <div class="shops-addresss">
      <div :class="{addressActive:show}">
        <div v-for="(item,i) in areaList" @click="clickArea(item)" :class="{areaActive:(area==item.title)}" :key="i">
          {{item.title}}</div>
      </div>
    </div>
    <div class="shops-liubai"></div>
    <div class="shops-citys-box fx">
      <ul class="shops-citys-box-province">
        <li @click="toHitCity" :class="{provinceActive:isHit}">热门城市</li>
        <li v-for="(item,i) in provinceList" :key="i" @click="selcity(item,i)" :class="{provinceActive:(item.title==province && !isHit)}">
          {{item.title}}
        </li>
      </ul>
      <div v-if="isHit" class="shops-citys-box-city shops-citys-box-city-hot">
        <p>常用</p>
        <div class="supplier-hit-box">
          <div v-if="dwCity.province" :class="{areaActive:showHit(dwCity)}" @click="clickCity(dwCity,0,'hit')">
            <van-icon style="vertical-align: text-top;" name="location-o" />{{dwCity.city}}</div>
          <div v-for="(item,i) in hit" @click="clickCity(item,0,'hit')" :class="{areaActive:showHit(item)}" :key="i">
            {{item.city=='直辖区'?item.province:item.city}}</div>
        </div>
      </div>

      <ul class="shops-citys-box-city" v-show="!isHit">
        <li v-for="(item,i) in cityList" :key="i" @click="clickCity(item,i)" :class="{provinceActive:item.title==city}">
          <p>{{item.title}}</p>
          <img src="../../../../assets/img/supplier/gou.png" v-if="item.title==city" alt />
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
  props: {
    paramsCity: {
      type: Object,
      default: () => { }
    }
  },
  data () {
    return {
      dwCity: {},
      isHit: true,
      value: 0,
      show: false,
      areaList: [],
      cityList: [],
      // provinceList: addressLists,
      provinceList: [],
      province: "",
      provinceIndex: 0,
      city: "",
      cityIndex: 0,
      area: "",
      hit: []
    };
  },

  components: {
    [DropdownMenu.name]: DropdownMenu,
    [DropdownItem.name]: DropdownItem
  },
  created () {
    var hit = localStorage.getItem("hitCity");
    var dwCity = localStorage.getItem("dw-city");

    if (dwCity) {
      this.dwCity = JSON.parse(dwCity);
    }
    if (hit) {
      this.hit = JSON.parse(hit);
    }
    var address = this.paramsCity;
    if (address) {
      var params = address;
      this.province = params.province;
      this.city = params.city;
      this.area = params.area;
      // this.provinceList.filter((item, i) => {
      //   if (item.t == params.province) {
      //     this.provinceIndex = i;
      //   }
      // });
    }
    this.$api.getPage.get_addresslist({}).then(res => {
      if (res.code == 200) {
        this.provinceList = res.result;
      }
    })
  },
  mounted () {
    this.$bus.$on("toggleHead", () => {
      this.toHitCity();
    });
    this.$bus.$on('updateCity', (citys) => {
      this.dwCity = citys;
      var address = citys;
      if (address) {
        var params = address;
        this.province = params.province;
        this.city = params.city;
        this.area = params.area;
        // this.provinceList.filter((item, i) => {
        //   if (item.t == params.province) {
        //     this.provinceIndex = i;
        //   }
        // });
      }
    })
  },
  methods: {
    selcity (item, i) {
      this.province = item.title;
      this.provinceIndex = i;
      this.$api.getPage.get_addresslist({ pid: item.id }).then(res => {
        if (res.code == 200) {
          this.cityList = res.result;
          this.city = res.result[0].title || ''
          this.$api.getPage.get_addresslist({ pid: res.result[0].id }).then(res2 => {
            if (res2.code == 200) {
              this.areaList = res2.result;
              this.area = ''
            }
          })
        }
      })
      this.isHit = false;
      // this.cityIndex = 0;


    },
    showHit (item) {
      if (item.city == this.paramsCity.city && item.province == this.paramsCity.province) {
        return true;
      }
    },
    toHitCity () {
      // this.province = "";
      this.isHit = true;
    },
    clickArea (item) {
      this.area = item.title;
      this.emitAddress();
    },
    clickCity (item, i, hit) {
      if (hit == "hit") {
        this.province = item.province;
        this.city = item.city;
      } else {
        this.city = item.title;
        this.$api.getPage.get_addresslist({ pid: item.id }).then(res => {
          if (res.code == 200) {
            this.areaList = res.result;
          }
        })
      }
      this.isHit = true;
      this.cityIndex = i;
      this.area = "";
      this.emitAddress();
    },
    emitAddress () {
      this.show = false; // 折叠 区
      var params = {};
      params.province = this.province;
      params.city = this.city;
      params.area = this.area;
      localStorage.setItem('checkSupplierCity', JSON.stringify(params))
      var hit = localStorage.getItem("hitCity");
      if (hit) {
        hit = JSON.parse(hit);
        var bool = true;
        hit.filter((item, i) => {
          if (item.city == this.city && item.province == this.province && item.city == this.dwCity.city) {
            bool = false;
          }
        });

        if (bool) {
          if (hit.length >= 9) {
            hit.unshift(params);
            hit.pop();
          } else {
            hit.unshift(params);
          }
        }
        var obj = {};

        hit = hit.reduce(function (item, next) {          obj[next.province] ? '' : obj[next.province] = true && item.push(next);
          return item;
        }, []);
        localStorage.setItem("hitCity", JSON.stringify(hit));
      } else {
        localStorage.setItem("hitCity", JSON.stringify([params]));
      }
      this.hit = [];
      this.hit = hit;

      this.$emit("emitAddress", params);
    }
  }
};
</script>
<style lang='less' scoped>
.shops-citys-box-city-hot {
  > p {
    height: 40px;
    line-height: 40px;
    font-weight: bold;
    color: #979797;
    font-size: 15px;
  }
  .supplier-hit-box {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    font-size: 14px;
    line-height: 1.2;
    > div {
      border: 0.02667rem solid #dbdbdb;
      border-radius: 0.08rem;
      color: #6d6d6d;
      padding: 0.21333rem;
      margin: 0 0.26667rem 0.26667rem 0;
    }
  }
}
.addressActive {
  max-height: 800px !important;
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
.shops-addresss {
  padding: 6px 16px;
  > div {
    display: flex;
    flex-wrap: wrap;
    max-height: 0;
    overflow: hidden;
    transition: all 0.5s linear;
    > div {
      border: 1px solid #dbdbdb;
      border-radius: 3px;
      color: #6d6d6d;
      padding: 8px;
      margin: 0 10px 10px 0;
    }
  }
}
.shops-head-citys {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: auto;
  font-size: 14px;
  line-height: 1.2;
  > div:first-child {
    color: #8c8c8c;
    font-weight: 400;
    padding: 0 16px;
    span {
      color: #2d2d2d;
      font-weight: bold;
      font-weight: 500;
    }
  }
}
.shops-liubai {
  height: 6px;
  background: #f6f6f6;
}
.provinceActive {
  background: #fff;
}
.hide-down {
  display: none;
}
.areaActive {
  background: #d5ac5a;
  color: #382d0d !important;
  font-weight: bold;
}
</style>
