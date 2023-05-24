import axios from "axios";

const state = {
  loading: false,
  tiles: {
    cols: 0,
    rows: 0,
    tileSize: 0
  },
  profile: {},
  user: {},
  searchedUser: {}
};

const getters = {
  tiles: state => state.tiles,
  profile: state => state.profile,
  user: state => state.user,
  loading: state => state.loading,
  searchedUser: state => state.searchedUser
};
const mutations = {
  setTiles: (state, tiles) => (state.tiles = tiles),
  setProfile: (state, profile) => (state.profile = profile),
  setUser: (state, user) => (state.user = user),
  setLoading: (state, loading) => (state.loading = loading),
  setSearchedUser: (state, search) => (state.searchedUser = search)
};
const actions = {
  getTiles({ commit }, id) {
    return axios
      .get(`${process.env.VUE_APP_ENV}/${id}/getConfig`)
      .then(res => {
        commit("setTiles", res.data);
      })
      .catch(err => {
        console.log(err);
      });
  },
  createProfile({ commit }, payload) {
    const { profile, router, id } = payload;
    return axios
      .post(`${process.env.VUE_APP_ENV}/${id}/postNewImage`, profile)
      .then(res => {
        const { COLUMN_POS, ROW_POS } = res.data;
        commit("setProfile", res.data);
        commit("setLoading", false);
        router.push({
          name: "Case32",
          query: {
            col: COLUMN_POS,
            row: ROW_POS
          }
        });
      })
      .catch(err => {
        commit("setLoading", false);
        const { status } = err.response;
        commit("setProfile", { code: status });
      });
  },
  getUser({ commit }, payload) {
    const { col, row, id } = payload;
    return axios
      .get(`${process.env.VUE_APP_ENV}/${id}/getItem/${col}/${row}`)
      .then(res => {
        const user = res.data;
        commit("setUser", user);
      })
      .catch(err => {
        commit("setUser", {});
        console.log(err);
      });
  },
  filterByName({ commit }, payload) {
    const { search, id } = payload;
    return axios
      .get(`${process.env.VUE_APP_ENV}/${id}/filterByName/${search}`)
      .then(res => {
        commit("setSearchedUser", res.data[0]);
      })
      .catch(err => {
        commit("setSearchedUser", {});
        console.log(err);
      });
  }
};
const cases = {
  state,
  getters,
  mutations,
  actions
};

export default cases;
