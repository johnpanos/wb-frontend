import { InventoryService } from '@/common/api';

const PAGE_SIZE = 20;

export default {
  state: {
    currentPage: 1,
    search: '',
    loading: false,
    part: null,
    parts: {
      totalElements: 0,
      size: 0,
      content: []
    }
  },
  getters: {
    currentPage(state) {
      return state.currentPage;
    },
    search(state) {
      return state.search;
    },
    loading(state) {
      return state.loading;
    },
    part(state) {
      return state.part;
    },
    parts(state) {
      return state.parts;
    }
  },
  mutations: {
    setPage(state, page) {
      state.currentPage = page;
    },
    setPart(state, part) {
      state.part = part;
    },
    setParts(state, parts) {
      state.parts = parts;
    },
    setSearch(state, search) {
      if (search.length == 0) {
        state.currentPage = 1;
      }
      state.search = search;
    },
    fetchStart(state) {
      state.loading = true;
    },
    fetchEnd(state) {
      state.loading = false;
    }
  },
  actions: {
    deleteParts({ commit, dispatch }, parts) {
      commit('fetchStart');
      InventoryService.deleteParts(parts).then(() => {
        dispatch('getParts');
        commit('fetchEnd');
      });
    },
    getParts({ commit, state }) {
      commit('fetchStart');
      InventoryService.searchParts(PAGE_SIZE, state.currentPage - 1, state.search)
        .then(response => {
          commit('setParts', response.data);
          commit('fetchEnd');
        })
        .catch(() => {
          console.log('ERROR: PartStore');
        });
    },
    searchParts({ commit, dispatch }, search) {
      console.log(search);
      commit('setSearch', search);
      dispatch('getParts');
    }
  }
}