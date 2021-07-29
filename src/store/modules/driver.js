import api from "../../assets/js/api/require/index";
import driverFnc from "@/assets/js/fnc/driver.js";
const driver = {
  state: {
    audioObj: null,
    addressTimer: null,
    AMapMyPosition: null,
    startPoint: {},
    endPoint: {},
  },

  mutations: {
    playAudio(state, status) {
      if (state.audioObj) {
        try {
          state.audioObj.pause();
        } catch (error) {}
      }
      var file = null;
      switch (status) {
        case "上班了": //1
          file = require("./../../assets/img/driver/audio/01.mp3");
          break;
        case "下班了": //1
          file = require("./../../assets/img/driver/audio/02.mp3");
          break;
        case "指派订单": //1
          file = require("./../../assets/img/driver/audio/03.mp3");
          break;
        case "大厅订单":
          file = require("./../../assets/img/driver/audio/04.mp3");
          break;
        case "新订单":
          file = require("./../../assets/img/driver/audio/05.mp3");
          break;
        case "您已接单":
          file = require("./../../assets/img/driver/audio/06.mp3");
          break;
        case "到达起点":
          file = require("./../../assets/img/driver/audio/07.mp3");
          break;
        case "开始出发":
          file = require("./../../assets/img/driver/audio/08.mp3");
          break;
        case "到达终点":
          file = require("./../../assets/img/driver/audio/09.mp3");
          break;
        case "等待开始":
          file = require("./../../assets/img/driver/audio/10.mp3");
          break;
        case "等待结束":
          file = require("./../../assets/img/driver/audio/11.mp3");
          break;
        default:
          break;
      }
      if (file) {
        state.audioObj = new Audio();
        state.audioObj.src = file;
        state.audioObj.play();
      }
    },
    clearAddressTimer(state) {
      clearInterval(state.addressTimer);
      console.log(111);
      state.addressTimer = null;
    },
    setaddressTimer(state, obj) {
      state.addressTimer = obj;
    },
    setAMapMyPosition(state, obj) {
      state.AMapMyPosition = obj;
    },
    setStartPoint(state, obj) {
      if (!obj.name && Object.keys(obj).length != 0) {
        driverFnc.MapLoader().then((aMap) => {
          var geocoder = new AMap.Geocoder({
            // city 指定进行编码查询的城市，支持传入城市名、adcode 和 citycode
            city: "010",
          });
          var lnglat = [obj.lng, obj.lat];
          geocoder.getAddress(lnglat, (status, result) => {
            console.log(11);
            if (status === "complete" && result.info === "OK") {
              var name = result.regeocode.formattedAddress.replace(
                result.regeocode.addressComponent.province,
                ""
              );
              name = name.replace(result.regeocode.addressComponent.city, "");
              name = name.replace(
                result.regeocode.addressComponent.district,
                ""
              );
              // result为对应的地理位置详细信息
              obj.province = result.regeocode.addressComponent.province;
              obj.city = result.regeocode.addressComponent.city;
              obj.area = result.regeocode.addressComponent.district;
              obj.name = name;
              state.startPoint = obj;
            } else {
              state.startPoint = obj;
            }
          });
        });
      } else {
        state.startPoint = obj;
      }
    },
    setEndPoint(state, obj) {
      if (!obj.name && Object.keys(obj).length != 0) {
        var geocoder = new AMap.Geocoder({
          // city 指定进行编码查询的城市，支持传入城市名、adcode 和 citycode
          city: "010",
        });
        var lnglat = [obj.lng, obj.lat];
        geocoder.getAddress(lnglat, (status, result) => {
          if (status === "complete" && result.info === "OK") {
            // result为对应的地理位置详细信息
            obj.province = result.regeocode.addressComponent.province;
            obj.city = result.regeocode.addressComponent.city;
            obj.area = result.regeocode.addressComponent.district;
            obj.name = result.regeocode.formattedAddress;
            state.endPoint = obj;
          } else {
            state.endPoint = obj;
          }
        });
      } else {
        state.endPoint = obj;
      }
    },
  },
  actions: {
    updateDriverPosition({ rootState }, obj) {
      console.log("driver.js-updateDriverPosition");
      var params = obj || {};
      params.longitude = rootState.nowposition.longitude;
      params.latitude = rootState.nowposition.latitude;
      api.getDriver.submit_motor_position(params);
    },
  },
};

export default driver;
