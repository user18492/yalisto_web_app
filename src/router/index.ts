import { createRouter, createWebHistory } from "vue-router";

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
    component: () => import("../ui/views/LoginView.vue"),
  },
  {
    path: "/cart",
    name: "Cart",
    component: () => import("../ui/views/CartView.vue"),
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
    // meta: { requiresAuth: true },
  },
  // fallback 404
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

// ejemplo de guard global simple (ajusta según tu store/auth)
router.beforeEach((to, from, next) => {
  const requiresAuth = to.meta.requiresAuth;
  const isAuthenticated = !!localStorage.getItem("authToken"); // usa tu método real
  if (requiresAuth && !isAuthenticated)
    return next({ name: "Login", query: { redirect: to.fullPath } });
  next();
});

export default router;
