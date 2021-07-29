<template>
  <div class="module_part_body" :style="{backgroundColor:background}">
    <moduleTitle :info="info" background="#ffffff"></moduleTitle>
    <div class="active_box moduleHotel">
    
    </div>
  </div>
</template>

<script>
import moduleTitle from "@/components/page/vip/moduleTitle";
export default {
  name: "",
  props: {
    info: {
      type: Object,
      default: () => {
        return {
          banner: []
        };
      }
    },
    background: {
      type: String,
      default: "transparent"
    }
  },
  data() {
    return {
      hotelList: []
    };
  },
  components: {
    moduleTitle,
  },
  created() {
    this.getshop();
  },
  mounted() {},
  methods: {
    getshop() {
      var params = {};
      params.is_home = 1;
      this.$api.getHotel.hotel_lists(params).then(res => {
        if (res.code == 200) {
          this.hotelList = res.result;
        }
      });
    }
  },
  watch: {}
};
</script>
<style lang='less' scoped>
.moduleHotel {
  background-color: #ffffff;
}
</style>
