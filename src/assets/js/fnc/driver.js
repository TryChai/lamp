const md5 = require("md5");
import Cookies from "js-cookie";
import router from "../../../router";
import store from "./../../../../src/store/index";
import fnc from "./../fnc/fnc";

const GPSKEY = "9ea145d7d33cad98b37ddb1eb43dcb2d";
const driver = {
  IntervalTimeNum: 10000,
  continuousLocation: function(second) {
    var isnewapp;
    try {
      isnewapp = Cookies.get("newapp") || "0";
    } catch (error) {
      isnewapp = "0";
    }
    if (isnewapp == undefined) {
      isnewapp = "0";
    }
    var ua = window.navigator.userAgent.toLowerCase();
    if (ua.match(/ykapp/i) == "ykapp") {
      if (isnewapp == "0") {
        // eslint-disable-next-line no-undef
        try {
          //1驾车2步行3骑行
          // eslint-disable-next-line no-undef
          ykAPP.continuousLocation(second);
        } catch (error) {}
      } else {
        var data = {};
        data.data = second;
        data.type = "continuousLocation";
        this.postData(data);
      }
    }
  },
  stopContinuousLocation: function() {
    var isnewapp;
    try {
      isnewapp = Cookies.get("newapp") || "0";
    } catch (error) {
      isnewapp = "0";
    }
    if (isnewapp == undefined) {
      isnewapp = "0";
    }
    var ua = window.navigator.userAgent.toLowerCase();
    if (ua.match(/ykapp/i) == "ykapp") {
      if (isnewapp == "0") {
        // eslint-disable-next-line no-undef
        try {
          //1驾车2步行3骑行
          // eslint-disable-next-line no-undef
          ykAPP.stopContinuousLocation();
        } catch (error) {}
      } else {
        var data = {};
        data.type = "stopContinuousLocation";
        this.postData(data);
      }
    }
  },

  isturnGaode: function(obj) {
    var isiOS = !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    if (isiOS && (fnc.isapp() || fnc.isYkAPP())) {
      return true;
    }
    // else {
    //   return false;
    // }
    if (!fnc.isYkAPP()) {
      return true;
    } else {
      return false;
    }
  },
  gpsDriver: function(obj) {
    var isnewapp;
    try {
      isnewapp = Cookies.get("newapp") || "0";
    } catch (error) {
      isnewapp = "0";
    }
    if (isnewapp == undefined) {
      isnewapp = "0";
    }
    var ua = window.navigator.userAgent.toLowerCase();
    if (ua.match(/ykapp/i) == "ykapp") {
      if (isnewapp == "0") {
        // eslint-disable-next-line no-undef
        try {
          //1驾车2步行3骑行
          // eslint-disable-next-line no-undef
          ykAPP.startGPSNavi(
            Number(obj.naviType),
            Number(obj.startLai),
            Number(obj.startLon),
            Number(obj.endLai),
            Number(obj.endLon),
            Number(obj.isNight),
            obj.url
          );
        } catch (error) {}
      } else {
        var data = obj;
        data.type = "startGPSNavi";
        this.postData(data);
      }
    }
  },

  postData: function(data) {
    window.webkit.messageHandlers.ykApp.postMessage({
      data,
    });
  },
  /**
   * @LngLatArray [Array] 带转换坐标的数组
   * @success [Function]转换完成回调
   * driver.convertFrom(originPath, res => {
        console.log(res)
      })
   * 
   */
  convertFrom(LngLatArray, success) {
    var LngLatArray2 = [];
    // https://lbs.amap.com/api/javascript-api/reference/lnglat-to-address/#m_AMap.convertFrom
    // 将其他地图服务商的坐标批量转换成高德地图经纬度坐标。最多支持40对坐标。
    var size = 40;
    var pageNum = parseInt((LngLatArray.length + size - 1) / size);
    var convertNum = 0;
    for (var i = 0; i < pageNum; i++) {
      var LngLatArraySlice = LngLatArray.slice(i * size, (i + 1) * size);
      convert(LngLatArraySlice, i);
    }
    function convert(LngLatArray, n) {
      // 测试
      /*setTimeout(function () {
              LngLatArray2[n] = (LngLatArray);
              convertNum++;
              if (convertNum >= pageNum) {
                  typeof success == "function" ? success([].concat.apply([], LngLatArray2)) : null;
              }
          }, parseInt(Math.random() * 3) * 100);*/

      AMap.convertFrom(LngLatArray, "gps", function(status, result) {
        if (status == "complete") {
          LngLatArray2[n] = result.locations;
          convertNum++;
          if (convertNum >= pageNum) {
            typeof success == "function"
              ? success([].concat.apply([], LngLatArray2))
              : null;
          }
        }
      });
    }
  },
  /**
   * @LngLat 起始点经纬度，终点经纬度
   * @success [Function]转换完成回调
   */
  getDistance(start1, start2, end1, end2) {
    return new Promise((res, rej) => {
      var driving = new AMap.Driving({
        policy: AMap.DrivingPolicy.LEAST_DISTANCE,
      });
      driving.search(
        new AMap.LngLat(start1, start2),
        new AMap.LngLat(end1, end2),
        (status, result) => {
          if (status === "complete") {
            if (result.routes && result.routes.length) {
              res(Number(result.routes[0].distance) / 1000); //距离
            }
          }
        }
      );
    });
  },
  /**
   * @LngLat 起始点经纬度，终点经纬度
   * @success [Function]转换完成回调 两点之间直线经纬度
   */
  getLineDistance(start1, start2, end1, end2) {
    var a1 = new AMap.LngLat(start1, start2);
    var a2 = new AMap.LngLat(end1, end2);
    var distance = Math.round(a1.distance(a2));
    return distance;
  },
  getAddressDetail(longitude, latitude) {
    return new Promise((res, rej) => {
      var geocoder = null;
      AMap.service("AMap.Geocoder", function() {
        geocoder = new AMap.Geocoder({
          city: "010",
        });
      });
      // 利用地图地理编码查询地址
      geocoder.getAddress(
        new AMap.LngLat(longitude, latitude),
        (status, data) => {
          console.log(status, data);
          if (status === "complete" && data.info === "OK") {
            var name = data.regeocode.formattedAddress.replace(
              data.regeocode.addressComponent.province,
              ""
            );
            name = name.replace(data.regeocode.addressComponent.city, "");
            name = name.replace(data.regeocode.addressComponent.district, "");
            console.log(data);
            var obj = {
              province: data.regeocode.addressComponent.province,
              city: data.regeocode.addressComponent.city,
              area: data.regeocode.addressComponent.district,
              town: data.regeocode.addressComponent.street,
              latitude: latitude,
              longitude: longitude,
              name: name,
            };
            res(obj);
          }
        }
      );
    });
  },
  gotoOrderDeatil(info) {
    var uid = store.state.user.id;
    var isDriver = info.did == uid ? true : false;
    if (isDriver == true) {
      switch (info.status) {
        case "已派单":
          router.push("/driver/motor_confirmorder");
          break;
        case "已接单":
          router.push(`/driver/motor_order?id=${info.id}`);
          break;
        case "已到达":
          router.push(`/driver/motor_order?id=${info.id}`);
          break;
        case "已出发":
          router.push(`/driver/motor_order?id=${info.id}`);
          break;
        case "已完成":
          router.push(`/driver/motor_order?id=${info.id}`);
          break;
        case "已支付":
          router.push(`/driver/motor_order?id=${info.id}`);
          break;
        case "已取消":
          router.push(`/driver/motor_order?id=${info.id}`);
          break;
        default:
          break;
      }
    } else {
      switch (info.status) {
        case "待接单":
          router.push(`/driver/user_call?id=${info.id}`);
          break;
        case "已派单":
          router.push(`/driver/user_order?id=${info.id}`);
          break;
        case "已接单":
          router.push(`/driver/user_order?id=${info.id}`);
          break;
        case "已到达":
          router.push(`/driver/user_order?id=${info.id}`);
          break;
        case "已出发":
          router.push(`/driver/user_order?id=${info.id}`);
          break;
        case "已完成":
          router.push(`/driver/user_order?id=${info.id}`);
          break;
        case "已支付":
          router.push(`/driver/user_order?id=${info.id}`);
          break;
        case "已取消":
          router.push(`/driver/user_order?id=${info.id}`);
          break;
        default:
          break;
      }
    }
  },
  MapLoader() {
    return new Promise((resolve, reject) => {
      if (window.AMap) {
        resolve(window.AMap);
      } else {
        var url = `https://webapi.amap.com/maps?v=1.4.15&key=${GPSKEY}&callback=onLoad&plugin=AMap.Driving,AMap.Riding,AMap.Weather,AMap.GraspRoad,AMap.Geocoder`;
        var script = document.createElement("script");
        script.charset = "utf-8";
        script.src = url;
        script.onerror = reject;
        document.head.appendChild(script);
      }
      window.onLoad = () => {
        resolve(window.AMap);
      };
    });
  },
};

export default driver;
