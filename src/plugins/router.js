import Vue from 'vue';
import VueRouter from 'vue-router';
import { PermissionService } from '@/common/permissions';
import store from '@/store/index.js';

import Login from '@/components/Login.vue';
import MentorList from '@/components/hr/mentor/MentorList.vue';
import MentorCreate from '@/components/hr/mentor/MentorCreate.vue';
import StudentList from '@/components/hr/student/StudentList.vue';
import StudentCreate from '@/components/hr/student/StudentCreate.vue';
import StudentPermission from '@/components/hr/student/StudentPermission.vue';
import Inventory from '@/components/inventory/Inventory.vue';
import PartView from '@/components/inventory/part/PartView.vue';
import PartCreate from '@/components/inventory/part/PartCreate.vue';
import AuthenticationSuccessful from '@/components/AuthenticationSuccessful.vue';

Vue.use(VueRouter);

const routes = [
  { path: '/login', component: Login },
  { path: '/hr/mentors', component: MentorList, meta: {
      allowedRoles: ['ADMIN', 'MENTOR']
    }
  },
  { path: '/hr/mentors/create', component: MentorCreate, meta: {
      allowedRoles: ['ADMIN', 'MENTOR']
    }
  },
  { path: '/hr/mentors/update/:userId', component: MentorCreate, props: true, meta: {
      allowedRoles: ['ADMIN', 'MENTOR']
    }
  },
  { path: '/hr/students', component: StudentList, meta: {
      allowedRoles: ['ADMIN', 'MENTOR']
    }
  },
  { path: '/hr/students/create', component: StudentCreate, meta: {
      allowedRoles: ['ADMIN', 'MENTOR']
    }
  },
  { path: '/hr/students/permissions/:studentId', component: StudentPermission, props: true, meta: {
      allowedRoles: ['ADMIN', 'MENTOR']
    }
  },
  { path: '/hr/students/update/:studentId', component: StudentCreate, props: true, meta: {
      allowedRoles: ['ADMIN', 'MENTOR']
    }
  },
  { path: '/inventory', component: Inventory },
  { path: '/inventory/parts/create', component: PartCreate, meta: {
      allowedRoles: ['ADMIN', 'MENTOR', 'INV_EDIT']
    }
  },
  { path: '/inventory/part/:partId', component: PartView, props: true },
  { path: '/authentication-successful', component: AuthenticationSuccessful }
];

const router = new VueRouter({
  mode: 'history',
  routes // short for `routes: routes`
});

router.beforeEach((to, from, next) => {
  if (to.path == '/login' && store.state.authentication.token != null) {
    next({
      path: '/',
      params: { nextUrl: to.fullPath }
    });
  }
  if (to.path != '/login' && store.state.authentication.token == null) {
    next({
      path: '/login',
      params: { nextUrl: to.fullPath }
    });
  } else {
    const allowedRoles = to.matched.some(record => record.meta.allowedRoles);
    const user = store.state.authentication.user;

    if (allowedRoles && user != null) {
      if (PermissionService.hasRole(user, to.meta.allowedRoles)) {
        next();
      } else {
        next({
          path: '/',
          params: { nextUrl: to.fullPath }
        });
      }
    } else {
      next();
    }
  }
});

export default router;