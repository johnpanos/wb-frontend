import ApiService, { InventoryService } from '@/common/api';
import {
  GET_PARTS,
  GET_PART,
  SEARCH_PARTS,
  DELETE_PARTS
} from './actions';
import {
  SET_PARTS,
  SET_PART
} from './mutations';

const PAGE_SIZE = 20;

export default {
  namespaced: true,
  state: {
    currentPage: 0,
    search: '',
    loading: false,
    part: null,
    parts: null
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
    [SET_PART](state, part) {
      state.part = part;
    }
  },
  actions: {
    [GET_PARTS]({ commit, state }) {
      InventoryService.searchParts(PAGE_SIZE, state.currentPage - 1, state.search)
        .then(response => {
          commit(SET_PART, response.data);
        })
        .catch(() => {
          console.log('ERROR: PartStore');
        });
    },
    [SEARCH_PARTS]({ dispatch }, search) {
      dispatch(GET_PARTS, search);
    }
  }
}