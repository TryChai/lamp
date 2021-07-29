<template>
  <div class="module_part_body" :style="{backgroundColor:background}">
    <moduleTitle :info="info">
    </moduleTitle>
    <div class="active_box">
      <div class="active_box_item" v-for="(item,k) in supplierlist" :key="k">
        <SupplierShopItem :item="item" style="margin:0 auto;width:95%;"></SupplierShopItem>
      </div>
    </div>
    <div style="display:none">
      <getaddress @sendAddress="recaddress" :isauto="false" ref="getaddress"></getaddress>
    </div>
  </div>
</template>

<script>
import moduleTitle from '@/components/page/vip/moduleTitle'
import SupplierShopItem from '@/components/currency/supplier/supplierShop/SupplierShopItem'
import getaddress from "@/components/currency/getaddress"
export default {
  name: "",
  props: {
    info: {
      type: Object,
      default: () => {
        return {
          banner: [],
        };
      }
    },
    background: {
      type: String,
      default: "transparent"
    }
  },
  data () {
    return {
      supplierlist: [],
      bannerHeight: "",
    };
  },
  components: {
    moduleTitle,
    SupplierShopItem,
    getaddress

  },
  created () {
    if (this.info.style == 1) {
      this.$nextTick(() => {
        this.$refs.getaddress.getnowaddress();
      })
    } else {
      this.supplierlist = this.info.banner || [];
    }
  },
  mounted () { },
  methods: {
    recaddress (val) {

      if (val.longitude) {
        var params = {};
        params.province = val.province;
        params.city = val.city;
        params.area = val.area;
        params.town = val.town || "";
        params.latitude = val.latitude || "";
        params.longitude = val.longitude || "";
        this.$api.getSupplier.get_pageaddress(params).then(res => {
          if (res.code == 200) {
            //merchant.is_show
            this.supplierlist = res.result.info.merchant.pro || [];
          }
        });
      } else {
        //获取位置失败显示推荐商家
        this.supplierlist = this.info.banner || [];
      }
    },

    href_inspect (val) {
      if (val == "/plugin/turntable") {
        this.$store.commit("set_turnshow", true);
        return;
      }
      this.$fnc.goLink(val);

    }
  }
};
</script>
<style lang='less' scoped>
.righttitlte {
  //   width: 50% !important;
  font-size: 16px;
  color: #313131;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.assemble-item {
  padding: 13px 10px 17px;
  > div:not(:first-child) {
    margin-top: 10px;
  }
}
</style>
