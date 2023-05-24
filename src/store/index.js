import Vue from "vue";
import Vuex from "vuex";
import cases from "./modules/cases.js";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    cases
  }
});
