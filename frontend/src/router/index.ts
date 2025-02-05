/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

import {ref} from "vue";
import HomeView from "@/views/HomeView.vue";
import CarListView from "@/views/CarListView.vue";
import type {RouteRecordRaw} from "vue-router";
import {createRouter, createWebHistory} from "vue-router";
import LoginView from "@/views/LoginView.vue";
import RegisterView from "@/views/RegisterView.vue";
import NotFound from "@/components/NotFound.vue";
import AdminCarList from "@/views/AdminCarList.vue";
import {useAuthService} from "@/composables/useAuthService";
import CarDetailView from "@/views/CarDetailView.vue";
import ReservationList from "@/views/ReservationList.vue";
import AdminReservationList from "@/views/AdminReservationList.vue";

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: HomeView,
  },
  {
    path: '/vehicles',
    name: 'Vehicles',
    component: CarListView,
  },
  {
    path: '/vehicles/:id',
    name: 'Car-detail',
    component: CarDetailView,
    props: true,
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterView,
  },
  {
    path: '/admin-vehicles',
    name: 'Admin-vehicles',
    component: AdminCarList,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/reservations',
    name: 'Reservations',
    component: ReservationList,
    meta: { requiresAuth: true }
  },
  {
    path: '/admin-reservations',
    name: 'Admin-reservations',
    component: AdminReservationList,
    meta: { requiresAuth: true }
  },
  { path: "/:pathMatch(.*)*", component: NotFound, name: "notfound" }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  const requiresAuth = to.meta.requiresAuth;
  const requiresAdmin = to.meta.requiresAdmin;
  const authStore = useAuthService()
  authStore.checkAuthStatus()
  const isAuthenticated = ref<Boolean>(authStore.state.authenticated);
  const isAdmin = ref<Boolean>(authStore.state.userRole === "admin");

  // check if user is authenticated
  if (requiresAuth && !isAuthenticated.value) {
    next({ name: 'Login' });
  } else {
    if (requiresAdmin && !isAdmin.value){
      next({ name: 'Home' });
    }
    else next();
  }
});

export default router
