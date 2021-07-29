// import fnc from "../assets/js/fnc/fnc";
import router from "../../router";
import api from "../../assets/js/api/require/index";
import { Toast } from "vant";
const cardModule = {
  state: {
    cardlist: {},
    cardID: 0,
    cardTime: new Date(),
  },
  getters: {
    nowCardNumber: (state) => {
      if (!state.cardID && !state.cardlist[state.cardID + "cardItem"]) {
        return "0";
      }
      var number = 0;
      var list = state.cardlist[state.cardID + "cardItem"];
      if (list == undefined) {
        return "0";
      }
      if (list[0] == undefined && typeof list[0].data != "object") {
        return 0;
      } else {
        for (var i in list[0].data) {
          number += Number(list[0].data[i].number);
        }
        return number;
      }
    },
    shopCardList(state) {
      if (!state.cardID && !state.cardlist[state.cardID + "cardItem"]) {
        return [];
      }
      var list = state.cardlist[state.cardID + "cardItem"];

      if (list[0] == undefined && typeof list[0].data != "object") {
        return [];
      } else {
        return list[0].data;
      }
    },
  },
  mutations: {
    delAllCard(state, id) {
      if (id != state.cardID) {
        return;
      }
      var params = {};
      var str = "";
      var list = state.cardlist[state.cardID + "cardItem"][0].data;
      for (var i in list) {
        str += list[i].id + "@";
      }
      params.id_str = str;
      api.getShop.delCard(params).then((res) => {
        if (res.code == 200) {
          state.cardlist[state.cardID + "cardItem"][0].data = [];
          state.cardTime = new Date().getTime();
        }
      });
    },
    delCard(state, row) {
      if (row.cardId != state.cardID) {
        return;
      }
      var params = {};
      params.id_str = row.id;
      var list = state.cardlist[state.cardID + "cardItem"][0].data;
      for (var i in list) {
        if (list[i].id == row.id) {
          api.getShop.delCard(params).then((res) => {
            if (res.code == 200) {
              state.cardlist[row.cardId + "cardItem"][0].data.splice(i, 1);
              state.cardTime = new Date().getTime();
            }
          });
          break;
        }
      }
    },
    checkCard(state, row) {
      if (row.cardId != state.cardID) {
        return;
      }
      var list = state.cardlist[state.cardID + "cardItem"][0].data;
      for (var i in list) {
        if (list[i].id == row.id) {
          var params = {};
          params.id = row.id;
          if (row.check) {
            params.number = Number(row.number) + 1;
          } else {
            params.number = Number(row.number) - 1;
          }
          api.getShop.updateCardNumber(params).then((res) => {
            if (res.code == 200) {
              state.cardlist[row.cardId + "cardItem"][0].data[i].number =
                params.number;
              state.cardTime = new Date().getTime();

              this.$store.commit("set_carnum", res.result);
            }
          });

          break;
        }
      }
    },
    pushCard(state, row) {
      row.sid = state.cardID;
      //单sku 加减购物车数量
      // if (row.sid != state.cardID) {
      //     return;
      // }
      row.card_ku_cn = row.card_ku_cn ? row.card_ku_cn.trim() : "";
      var data;
      if (state.cardlist[row.sid + "cardItem"] != undefined) {
        data = state.cardlist[row.sid + "cardItem"][0].data;
      } else {
        data = [(data = [])];
      }
      var result = data.some((item) => {
        item.sku_cn = item.sku_cn || "";

        if (
          item.sku_cn.trim() == row.card_ku_cn &&
          item.pid == row.id &&
          item.sku_cn != ""
        ) {
          return true;
        } else if (item.pid == row.id && item.sku_cn == "") {
          return true;
        }
      });
      if (
        state.cardlist[row.sid + "cardItem"] != undefined &&
        state.cardlist[row.sid + "cardItem"].length > 0 &&
        result
      ) {
        //已存在购物车的直接加减数量
        var params = {};

        for (var i in data) {
          if (
            row.card_ku_cn &&
            data[i].pid == row.id &&
            row.card_ku_cn.trim() == data[i].sku_cn.trim()
          ) {
            params.number = Number(row.shopNumber);
            if (row.delNumber) {
              params.id_str = data[i].id;
              api.getShop.delCard(params).then((res) => {
                if (res.code == 200) {
                  state.cardlist[row.sid + "cardItem"][0].data.splice(i, 1);
                  state.cardTime = new Date().getTime();
                }
              });
            } else {
              params.id = data[i].id;
              api.getShop.updateCardNumber(params).then((res) => {
                if (res.code == 200) {
                  state.cardlist[row.sid + "cardItem"][0].data[i].number =
                    params.number;
                  state.cardTime = new Date().getTime();

                  this.$store.commit("set_carnum", res.result);
                }
              });
            }
            break;
          } else if (
            data[i].pid == row.id &&
            (row.card_ku_cn == "" || row.card_ku_cn == undefined)
          ) {
            if (row.delNumber) {
              params.id_str = data[i].id;
              api.getShop.delCard(params).then((res) => {
                if (res.code == 200) {
                  state.cardlist[row.sid + "cardItem"][0].data.splice(i, 1);
                  state.cardTime = new Date().getTime();
                }
              });
            } else {
              params.id = data[i].id;
              if (row.check) {
                params.number = Number(data[i].number) + 1;
              } else {
                params.number = Number(data[i].number) - 1;
              }
              api.getShop.updateCardNumber(params).then((res) => {
                if (res.code == 200) {
                  state.car_num = res.result;
                  if (state.car_num == 0) {
                    state.cardList = [];
                  }
                  state.cardlist[row.sid + "cardItem"][0].data[i].number =
                    params.number;
                  state.cardTime = new Date().getTime();
                }
              });
            }
            break;
          }
        }
      } else {
        //未存在购物车的，先加入购物车，在往购物车模拟加入数据
        var params1 = {};
        params1.pid = row.id;
        params1.number = row.shopNumber || 1;
        params1.sku_iden = row.sku_idens;
        api.getShop.addCart(params1).then((res) => {
          if (res.code == 200) {
            if (res.result.types == "0" || res.result.types == undefined) {
              Toast("添加成功");
              var obj = {};
              obj.id = res.result.id;
              obj.pro = row;
              obj.pid = row.id;
              obj.sku_id = row.sku_id;
              obj.number = row.shopNumber || 1;
              if (row.sku_id > 0) {
                obj.sku_cn = row.card_ku_cn;
              }
              if (typeof data != "object") {
                data = [];
              }
              data.push(obj);
              if (state.cardlist[row.sid + "cardItem"] == undefined) {
                state.cardlist[row.sid + "cardItem"] = [data];
              } else {
                state.cardlist[row.sid + "cardItem"][0].data = data;
              }
              console.log(state.cardlist);
              state.cardTime = new Date().getTime();
            } else {
              router.push("/order/addorder?id=" + res.result.id);
            }
          }
        });
      }
    },
    updateCardList(state, obj) {
      const data = obj.data;
      const id = obj.id;
      state.cardID = obj.id || 0;
      const result = data.filter((item) => item.info.sid == state.cardID);
      if (result.length > 0) {
        state.cardlist[id + "cardItem"] = result;
      } else {
        state.cardlist[id + "cardItem"] = [
          {
            data: [],
          },
        ];
      }
      state.cardTime = new Date().getTime();
    },
    resetCard(state) {
      Object.assign(state, {
        cardID: "",
        cardlist: {},
      });
    },
  },
  actions: {
    getCardModuleList(context, id) {
      var params = {};
      params.sid = id || 0;
      api.getShop.getCardList(params).then((res) => {
        if (res.code == 200) {
          context.commit("updateCardList", {
            data: res.result,
            id: params.sid,
          });
        }
      });
    },
  },
};

export default cardModule;
