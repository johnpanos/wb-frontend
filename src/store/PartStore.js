import { InventoryService } from '@/common/api';
//import router from '@/plugins/router';

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
    getPart({ commit, dispatch }, partId) {
      commit('fetchStart');
      InventoryService.getPartById(partId)
        .then(response => {
          commit('setPart', response.data);
          commit('fetchEnd');
        })
        .catch(() => {
          dispatch('messageError', '[PartStore] Part does not exist with id: ' + partId);
          //router.push('/inventory');
        });
    },
    getParts({ commit, dispatch, state }) {
      commit('fetchStart');
      InventoryService.searchParts(PAGE_SIZE, state.currentPage - 1, state.search)
        .then(response => {
          commit('setParts', response.data);
          commit('fetchEnd');
        })
        .catch(() => {
          dispatch('messageError', '[PartStore] Could not search get response for query "' + state.search + '"');
        });
    },
    deleteVendorInfo(id) {
      commit('fetchStart');
      InventoryService.deletePartVendorInformation(id).then(() => {
        commit('fetchEnd');
      }).catch(() => {
        dispatch('messageError', '[PartStore] An error occured deleting vendor info with id: ' + id);
      });
    },
    updatePart({ commit, dispatch }, part) {
      commit('fetchStart');
      InventoryService.updatePartLocation(part.id, part.location.id).catch(() => {
        dispatch('messageError', '[PartStore] An error occured updating the part with id: ' + part.id);
      });
      InventoryService.updatePart(part).then(() => {
        part.vendorInformation.map(vendorInfo => {
          console.log(vendorInfo);
          if (vendorInfo.id != null) {
            InventoryService.updatePartVendorInformation(vendorInfo.id, vendorInfo).then(() => {
              dispatch('getPart', part.id);
              commit('fetchEnd');
            });
          } else {
            InventoryService.addVendorInformationToPart(part.id, vendorInfo.partNumber, vendorInfo.vendor.id).then(() => {
              dispatch('getPart', part.id);
              commit('fetchEnd');
            });
          }
        });
      }).catch(() => {
        dispatch('messageError', '[PartStore] An error occured updating the part with id: ' + part.id);
        dispatch('getPart', part.id);
      });
    },
    searchParts({ commit, dispatch }, search) {
      console.log(search);
      commit('setSearch', search);
      dispatch('getParts');
    }
  }
}