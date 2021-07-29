<template>
  <div class="fx topHotel">
    <p class="fx">
      <span @click="showCity = true">你要去哪里？</span>
      <span @click="showDate = true">入驻日期</span>
      <span>共{{jgDay}}晚</span>
    </p>
    <p class="fx">
      <span @click="showCity = true">{{hotelAdd}}</span>
      <span @click="showDate = true">{{startDate | dateFormat}}&nbsp;-&nbsp;{{endDate | dateFormat}}</span>
    </p>
    <p class="fx">
      <span @click="$router.push('/hotel/search')">查找酒店</span>
    </p>
    <van-calendar
      title="入驻日期"
      v-model="showDate"
      color="#07c160"
      type="range"
      :show-confirm="false"
      @confirm="onConfirmDate"
    />
    <selAddress :level="2" :show="showCity" @confirm="onConfirmCity"></selAddress>
  </div>
</template>

<script>
import { Calendar } from "vant";
import { mapState } from "vuex";
import selAddress from "@/components/currency/selAddress/selAddress";
export default {
  components: {
    [Calendar.name]: Calendar,
    selAddress
  },
  data() {
    return {
      showDate: false,
      showCity: false
    };
  },
  props: {},
  computed: {
    ...mapState({
      hotel: state => state.hotel
    }),
    startDate() {
      if (this.hotel.startDate) {
        return this.hotel.startDate;
      } else {
        return "";
      }
    },
    endDate() {
      if (this.hotel.endDate) {
        return this.hotel.endDate;
      } else {
        return "";
      }
    },
    hotelAdd() {
      if (this.hotel.hotelAdd && this.hotel.hotelAdd.city) {
        if (this.hotel.hotelAdd.city == "直辖区") {
          return this.hotel.hotelAdd.province;
        } else {
          return this.hotel.hotelAdd.city;
        }
      } else {
        return "请选择";
      }
    },
    jgDay() {
      if (this.startDate && this.endDate) {
        var startTime = Date.parse(
          new Date(this.startDate.replace(/\-/g, "/"))
        );
        var endTime = Date.parse(new Date(this.endDate.replace(/\-/g, "/")));
        return (endTime - startTime) / 1000 / 3600 / 24 + "";
      } else {
        return 0;
      }
    }
  },
  created() {
    if (this.startDate == "" || this.startDate == "") {
      this.$store.dispatch("getHotelDate");
    }
  },
  methods: {
    onConfirmCity(data) {
      this.$store.commit("setHotelCity", {
        province: data[0] || "",
        city: data[1] || ""
      });
      this.showCity = false;
    },
    onConfirmDate(date) {
      var startDate = `${date[0].getFullYear()}-${date[0].getMonth() +
        1}-${date[0].getDate()}`;
      var endDate = `${date[1].getFullYear()}-${date[1].getMonth() +
        1}-${date[1].getDate()}`;
      this.$store.commit("setHotelDate", {
        startDate: startDate,
        endDate: endDate
      });
      this.showDate = false;
    }
  },
  filters: {
    dateFormat(date) {
      if (typeof date == "string" && date != "") {
        var arr = date.split("-");
        return arr[1] + "月" + arr[2] + "日";
      } else {
        return "请选择";
      }
    }
  },
  watch: {}
};
</script>
<style lang='less' scoped>
.topHotel {
  width: 94%;
  height: 120px;
  margin: 100px auto 0 auto;
  z-index: 10;
  background: #ffffff;
  border-radius: 10px;
  padding: 10px;
  box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.16);
  flex-direction: column;
  > p {
    width: 100%;
    &:nth-of-type(1) {
      font-size: 12px;
      color: #b5b5b5;
      > span {
        width: 33%;
        &:nth-of-type(3) {
          color: #333333;
          text-align: right;
        }
      }
    }
    &:nth-of-type(2) {
      font-size: 18px;
      color: #333333;
      > span {
        width: 33%;
        line-height: 1;
        &:nth-of-type(2) {
          width: 66%;
        }
      }
    }
    &:nth-of-type(3) {
      font-size: 20px;
      font-weight: bold;
      color: #333333;
      text-align: center;
      justify-content: center;
      padding-top: 3px;
      > span {
        width: 100%;
        background: #ffdd00;
        border-radius: 4px;
      }
    }
  }
}
</style>