// Vue过滤器
import store from "../../../store/index";

const getLanFilters = function (val) {
  let lanList = {};
  if (
    store.state.config &&
    store.state.config.plugin &&
    store.state.config.plugin.dyy &&
    store.state.config.plugin.dyy.is_open == 1
  ) {
    if (JSON.stringify(store.state.language_list) != {}) {
      lanList = store.state.language_list;
    } else if (localStorage.getItem("languagelist")) {
      lanList = JSON.parse(localStorage.getItem("languagelist"));
    }
    let lan = store.state.nowlanguage.iden || "EN";
    if (lan && lanList[lan] && lanList[lan][val]) {
      return lanList[lan][val];
    } else {
      return val;
    }
  }
  return val;
};

export default {
  getLanFilters,
};
