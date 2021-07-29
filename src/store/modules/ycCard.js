import api from "../../assets/js/api/require/index";
import router from "../../router";
import { Toast } from "vant";
const ycCard = {
  state: {
    ycCardList: [],
    cardTime: new Date().getTime(),
    ycType: "",
    retailOutlet: [],
    exchangeGoods: [],
    exchangeGoodsPop: [],
  },
  getters: {
    ycExchangeStr(state) {
      var list = [];
      list = state.exchangeGoodsPop;
      var arr = [];
      for (var i in list) {
        arr.push({
          id: list[i].id,
          number: list[i].number,
        });
      }
      return arr;
    },
    ycExchangePrice(state) {
      var num = 0;
      var list = [];
      list = state.exchangeGoodsPop;
      for (var i in list) {
        num += Number(list[i].number) * list[i].price;
      }
      return num;
    },
    ycIdStr(state) {
      var list = [];
      if (state.ycType == "retail-outlet") {
        list = state.retailOutlet;
      } else if (state.ycType == "exchange-goods") {
        list = state.exchangeGoods;
      }
      var arr = [];
      for (var i in list) {
        arr.push({
          id: list[i].id,
          number: list[i].number,
        });
      }
      return arr;
    },
    ycAllNum(state) {
      var num = 0;
      var list = [];
      if (state.ycType == "my-yc") {
        list = state.ycCardList;
      } else if (state.ycType == "retail-outlet") {
        list = state.retailOutlet;
      } else if (state.ycType == "exchange-goods") {
        list = state.exchangeGoods;
      }
      for (var i in list) {
        num += Number(list[i].number);
      }
      return num;
    },
    ycAllPrice(state) {
      var num = 0;
      var list = [];
      if (state.ycType == "my-yc") {
        list = state.ycCardList;
      } else if (state.ycType == "retail-outlet") {
        list = state.retailOutlet;
      } else if (state.ycType == "exchange-goods") {
        list = state.exchangeGoods;
      }
      for (var i in list) {
        if (state.ycType == "my-yc") {
          num += Number(list[i].number) * list[i].pro.price;
        } else {
          num += Number(list[i].number) * list[i].price;
        }
      }
      return num;
    },
  },
  mutations: {
    delExchangeGoodsPop(state) {
      state.exchangeGoodsPop = [];
    },
    checkExchangeGoodsPop(state, row) {
      var index = -1;
      state.exchangeGoodsPop = state.exchangeGoodsPop || [];
      var result = state.exchangeGoodsPop.some((item, i) => {
        if (row.id == item.id) {
          index = i;
          return true;
        }
      });
      if (result && row.check) {
        if (
          state.exchangeGoodsPop[index].number + 1 > row.stock &&
          row.stock != 0
        ) {
          Toast("库存不足");
        } else {
          ++state.exchangeGoodsPop[index].number;
        }
      } else if (result && !row.check) {
        --state.exchangeGoodsPop[index].number;
        if (state.exchangeGoodsPop[index].number == 0) {
          state.exchangeGoodsPop.splice(index, 1);
        }
      } else {
        state.exchangeGoodsPop.push({
          id: row.id,
          number: 1,
          title: row.title,
          price: row.price,
          piclink: row.piclink,
        });
      }
    },
    delExchangeGoods(state) {
      state.exchangeGoods = [];
    },
    checkExchangeGoods(state, row) {
      var index = -1;
      state.exchangeGoods = state.exchangeGoods || [];
      var result = state.exchangeGoods.some((item, i) => {
        if (row.id == item.id) {
          index = i;
          return true;
        }
      });
      if (row.checkInput) {
        if (row.checkNumber > Number(row.stock)) {
          state.exchangeGoods[index].number = row.stock;
          Toast("库存不足");
        } else if (!result) {
          state.exchangeGoods.push({
            id: row.id,
            number: row.checkNumber,
            title: row.title,
            price: row.price,
            piclink: row.piclink,
            stock: row.number,
          });
        } else {
          state.exchangeGoods[index].number = row.checkNumber;
        }
      } else if (result && row.check) {
        if (
          state.exchangeGoods[index].number + 1 > row.number &&
          row.number != 0
        ) {
          Toast("库存不足");
        } else {
          if (row.checkInput) {
            state.exchangeGoods[index].number = row.number;
          } else {
            ++state.exchangeGoods[index].number;
          }
        }
      } else if (result && !row.check) {
        if (row.checkInput) {
          state.exchangeGoods[index].number = row.number;
        } else {
          --state.exchangeGoods[index].number;
        }

        if (state.exchangeGoods[index].number == 0) {
          state.exchangeGoods.splice(index, 1);
        }
      } else {
        state.exchangeGoods.push({
          id: row.id,
          number: 1,
          title: row.title,
          price: row.price,
          piclink: row.piclink,
        });
      }
    },
    delRetailOutlet(state) {
      state.retailOutlet = [];
    },
    checkRetailOutlet(state, row) {
      var index = -1;
      state.retailOutlet = state.retailOutlet || [];
      var result = state.retailOutlet.some((item, i) => {
        if (row.id == item.id) {
          index = i;
          return true;
        }
      });
      if (row.checkInput) {
        console.log(row, Number(row.stock));
        if (row.checkNumber > Number(row.stock)) {
          state.retailOutlet[index].number = row.stock;
          Toast("库存不足");
        } else if (!result) {
          state.retailOutlet.push({
            id: row.id,
            number: row.checkNumber,
            title: row.title,
            price: row.price,
            piclink: row.piclink,
            stock: row.number,
          });
        } else {
          state.retailOutlet[index].number = row.checkNumber;
        }
      } else if (result && row.check) {
        if (
          state.retailOutlet[index].number + 1 > row.number &&
          row.number != 0
        ) {
          Toast("库存不足");
        } else {
          ++state.retailOutlet[index].number;
        }
      } else if (result && !row.check) {
        if (row.checkInput) {
          state.retailOutlet[index].number = row.number;
        } else {
          --state.retailOutlet[index].number;
        }
        if (state.retailOutlet[index].number == 0) {
          state.retailOutlet.splice(index, 1);
        }
      } else {
        state.retailOutlet.push({
          id: row.id,
          number: 1,
          title: row.title,
          price: row.price,
          piclink: row.piclink,
          stock: row.number,
        });
      }
    },
    checkType(state, ycType) {
      state.ycType = ycType;
    },
    delYcCard(state, obj) {
      var list = state.ycCardList;
      var index, cardId;
      var params = {};

      list.some((item, i) => {
        if (obj.del == "one" && item.pid == obj.id) {
          index = i;
          cardId = item.id;
          return true;
        }
      });
      params.id_str = cardId || obj.id;
      api.getShop.delCard(params).then((res) => {
        if (res.code == 200) {
          if (obj.del == "all") {
            state.ycCardList = [];
          } else {
            state.ycCardList.splice(index, 1);
          }
          state.cardTime = new Date().getTime();
        }
      });
    },
    pushYcCard(state, row) {
      var list = state.ycCardList;
      var params = {};
      var number = 0;
      var index = -1;
      var cardId = -1;
      var result = list.some((item, i) => {
        if (item.pid == row.id && row.pid == undefined) {
          number = item.number || 0;
          index = i;
          cardId = item.id;
          return true;
        } else if (item.pid == row.pid) {
          number = item.number || 0;
          index = i;
          cardId = item.id;
          return true;
        }
      });

      if (!result) {
        params.pid = row.id;
        params.number = 1;
        if (row.checkInput) {
          params.number = row.checkNumber;
        }
        api.getShop.addCart(params).then((res) => {
          if (res.code == 200) {
            if (res.result.types == "0") {
              var obj = {};
              obj.id = res.result.id;
              obj.pro = row;
              obj.pid = row.id;
              obj.number = params.number;
              state.ycCardList.push(obj);
              state.cardTime = new Date().getTime();
            } else {
              router.push("/order/addorder?id=" + res.result.id);
            }
          }
        });
      } else {
        params.id = cardId;
        if (row.check) {
          params.number = Number(number) + 1;
        } else {
          params.number = Number(number) - 1;
        }
        if (row.checkInput) {
          params.number = row.checkNumber;
        }
        api.getShop.updateCardNumber(params).then((res) => {
          if (res.code == 200) {
            state.ycCardList[index].number = params.number;
            state.cardTime = new Date().getTime();

            this.$store.commit("set_carnum", res.result);
          }
        });
      }
    },
    updateYcCardList(state, res) {
      if (typeof res == "object" && res.length > 0) {
        state.ycCardList = res[0].data;
      } else {
        state.ycCardList = [];
      }
    },
    resetYcCard(state) {
      Object.assign(state, {
        cardID: "",
        cardlist: {},
        ycCardList: [],
        retailOutlet: [],
        exchangeGoodsPop: [],
      });
    },
  },
  actions: {
    getYcCardModuleList(context) {
      var params = {};
      params.sid = 0;
      params.types = 1;
      api.getShop.getCardList(params).then((res) => {
        if (res.code == 200) {
          context.commit("updateYcCardList", res.result);
        }
      });
    },
  },
};

export default ycCard;
