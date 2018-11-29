import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import store from '../store'

//const baseURL = 'https://mywb.vcs.net'
const baseURL = 'http://localhost:8080';

const ApiService = {
  init () {
    Vue.use(VueAxios, axios)
    Vue.axios.defaults.baseURL = baseURL + '/api'
    this.setHeader();
  },

  setHeader() {
    if (store.state.authentication.token != null) {
      Vue.axios.defaults.headers.common['Authorization'] = `Bearer ${store.state.authentication.token}`;
    } else {
      Vue.axios.defaults.headers.common['Authorization'] = '';
    }
  },

  query (resource, params) {
    return Vue.axios
      .get(resource, params)
      .catch((error) => {
        if (error.response.data.status == 401) {
          store.dispatch('authentication/logout');
        }
        throw new Error(`[RWV] ApiService ${error}`);
      })
  },

  get (resource) {
    return Vue.axios
      .get(resource)
      .catch((error) => {
        if (error.response.data.status == 401) {
          store.dispatch('authentication/logout');
        }
        throw new Error(`[RWV] ApiService ${error}`)
      })
  },

  post (resource, params) {
    return Vue.axios.post(resource, params)
      .catch((error) => {
        if (error.response.data.status == 401) {
          store.dispatch('authentication/logout');
        }
        throw new Error(`[RWV] ApiService ${error}`)
      })
  },

  update (resource, slug, params) {
    return Vue.axios.put(resource, params)
      .catch((error) => {
        if (error.response.data.status == 401) {
          store.dispatch('authentication/logout');
        }
        throw new Error(`[RWV] ApiService ${error}`)
      })
  },

  put (resource, params) {
    return Vue.axios
      .put(resource, params)
      .catch((error) => {
        if (error.response.data.status == 401) {
          store.dispatch('authentication/logout');
        }
        throw new Error(`[RWV] ApiService ${error}`)
      })
  },

  delete (resource, params) {
    return Vue.axios
      .delete(resource, params)
      .catch((error) => {
        if (error.response.data.status == 401) {
          store.dispatch('authentication/logout');
        }
        throw new Error(`[RWV] ApiService ${error}`)
      })
  }
}

export default ApiService;

export const AuthService = {
  login(email, password) {
    return axios
            .post(baseURL + '/auth/generate-token/', {
              email: email,
              password: password
            });
  },
  logout() {
    return ApiService.setHeader();
  },
  getUserInfo() {
    return ApiService.get('hr/user/info/');
  }
}

export const HRService = {
  getMentors() {
    return ApiService.get('hr/mentor/');
  },
  createMentor(mentor) {
    return ApiService.post('/hr/mentor/', mentor);
  },
  deleteMentor(id) {
    return ApiService.delete('/hr/mentor/' + id);
  },
  getStudents() {
    return ApiService.get('hr/student/');
  },
  createStudent(student) {
    return ApiService.post('/hr/student/', student);
  },
  updateStudent(student) {
    return ApiService.put('/hr/student/' + student.id, student);
  },
  updateStudentRoles(id, roles) {
    return ApiService.put(`/hr/student/${id}/role/`, roles);
  },
  getUser(id) {
    return ApiService.get('/hr/user/' + id + '/');
  },
  changePassword(password) {
    return ApiService.put('/hr/user/password', { password: password });
  },
  updateUser(user) {
    return ApiService.put('/hr/user/' + user.id + '/', user);
  },
  deleteUser(id) {
    return ApiService.delete(`/hr/user/${id}/`);
  },
  getRoles() {
    return ApiService.get('/hr/role/');
  }
}

export const InventoryService = {
  createVendor(vendor) {
    return ApiService.post('/inventory/vendor/', vendor);
  },
  getVendors() {
    return ApiService.get('inventory/vendor/');
  },
  updateVendor(id, vendor) {
    return ApiService.put(`/inventory/vendor/${id}/`, vendor);
  },
  deleteVendor(id) {
    return ApiService.delete(`/inventory/vendor/${id}/`);
  },
  getLocations() {
    return ApiService.get('/inventory/location/')
  },
  createLocation(name) {
    return ApiService.post('/inventory/location/', { name: name });
  },
  updateLocation(id, location) {
    return ApiService.put(`/inventory/location/${id}/`, location);
  },
  deleteLocation(id) {
    return ApiService.delete(`/inventory/location/${id}/`);
  },
  getPartById(id) {
    return ApiService.get('inventory/part/' + id + '/');
  },
  getParts(size, page) {
    return ApiService.query('inventory/part/', {
      params: {
        size: size,
        page: page,
        sort: 'name,desc',
      }
    });
  },
  searchParts(size, page, search) {
    return ApiService.query('inventory/part/search/', {
      params: {
        size: size,
        page: page,
        sort: 'name,desc',
        q: search
      }
    });
  },
  createPart(part) {
    return ApiService.post('inventory/part/', part);
  },
  deletePart(part) {
    return ApiService.delete(`inventory/part/${part.id}/`, part);
  },
  deleteParts(parts) {
    parts = parts.map(part => part.id);
    return ApiService.delete('inventory/part/', { data: parts });
  },
  addVendorInformationToPart(id, partNumber, vendorId) {
    return ApiService.post(`inventory/part/vendor-info/${id}/?vendor=${vendorId}`, { partNumber: partNumber });
  },
  updatePart(part) {
    return ApiService.put(`inventory/part/${part.id}/`, part);
  },
  updatePartLocation(partId, locationId) {
    return ApiService.put(`inventory/part/${partId}/${locationId}/`);
  },
  updatePartVendorInformation(vendorInformationId, vendorInfo) {
    return ApiService.put('inventory/part/vendor-info/' + vendorInformationId, vendorInfo);
  },
  deletePartVendorInformation(id) {
    return ApiService.delete('inventory/part/vendor-info/' + id);
  },
  getPartLowCount() {
    return ApiService.get('inventory/part/lowCount/');
  },
  getPartCount() {
    return ApiService.get('inventory/part/count/');
  }
}

export const PurchaseOrderService = {
  createPurchaseOrder(order) {
    return ApiService.post('inventory/order/', order);
  },
  getPurchaseOrders(size, page) {
    return ApiService.query('inventory/order/', {
      params: {
        size: size,
        page: page
      }
    });
  },
  getPurchaseOrder(id) {
    return ApiService.get('inventory/order/' + id);
  },
  getPurchaseOrderCount() {
    return ApiService.get('inventory/order/count/');
  }
}