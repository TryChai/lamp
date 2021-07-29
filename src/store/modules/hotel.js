import tim from "tim";

const hotel = {
  state: {
    startDate: "",
    endDate: "",
    hotelAdd: {},
    homeId: "",
    hotel_positon: {},
  },
  mutations: {
    setHotelDate(state, date) {
      if (date.startDate) {
        state.startDate = date.startDate;
      }
      if (date.endDate) {
        state.endDate = date.endDate;
      }
    },
    setHotelCity(state, add) {
      state.hotelAdd = add;
    },
    setHomeId(state, id) {
      state.homeId = id;
    },
    setNowPositon(state, positon) {
      state.hotel_positon = positon;
    },
  },
  getters: {},
  actions: {
    getHotelDate(context) {
      var star = new Date();
      star.setTime(star.getTime() + 24 * 60 * 60 * 1000);
      var startDate = `${star.getFullYear()}-${star.getMonth() +
        1}-${star.getDate()}`;
      var end = new Date();
      end.setTime(end.getTime() + 24 * 60 * 60 * 1000 * 2);
      var endDate = `${end.getFullYear()}-${end.getMonth() +
        1}-${end.getDate()}`;
      context.commit("setHotelDate", {
        startDate: startDate,
        endDate: endDate,
      });
    },
  },
};

export default hotel;
