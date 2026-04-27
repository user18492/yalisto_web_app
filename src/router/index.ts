import { createRouter, createWebHistory } from "vue-router";
import { use_auth_store } from "@/stores/use_auth_store";

const routes = [
  {
    path: "/",
    name: "Home",
    component: () => import("../ui/views/HomeView.vue"),
  },
  {
    path: "/register",
    name: "Register",
    component: () => import("../ui/views/register_view.vue"),
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("../ui/views/login_view.vue"),
  },
  {
    path: "/cart",
    name: "Cart",
    component: () => import("../ui/views/CartView.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/profile",
    name: "Profile",
    component: () => import("../ui/views/ProfileView.vue"),
  },
  {
    path: "/address",
    name: "Address",
    component: () => import("../ui/views/AddressView.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/restaurants",
    name: "Restaurant",
    component: () => import("../ui/views/RestaurantView.vue"),
    props: true,
  },
  {
    path: "/order/:id",
    name: "Order",
    component: () => import("../ui/views/OrderView.vue"),
    props: true,
    meta: { requiresAuth: true },
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: () =>
      import("../ui/views/NotFoundView.vue").catch(() => import("../ui/views/HomeView.vue")),
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  const auth_store = use_auth_store();
  const requiresAuth = to.meta.requiresAuth;
  const isAuthenticated = auth_store.is_authenticated;

  if (requiresAuth && !isAuthenticated) {
    return next({ name: "Login", query: { redirect: to.fullPath } });
  }

  next();
});

export default router;
