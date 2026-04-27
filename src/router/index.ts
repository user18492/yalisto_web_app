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
    meta: { guestOnly: true },
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("../ui/views/login_view.vue"),
    meta: { guestOnly: true },
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
    meta: { requiresAuth: true },
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
  const is_authenticated = auth_store.is_authenticated;

  const requires_auth = to.meta.requiresAuth;
  const guest_only = to.meta.guestOnly;

  if (requires_auth && !is_authenticated) {
    return next({ name: "Login", query: { redirect: to.fullPath } });
  }

  if (guest_only && is_authenticated) {
    return next({ name: "Home" });
  }

  next();
});

export default router;
