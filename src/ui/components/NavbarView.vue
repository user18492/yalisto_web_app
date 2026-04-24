<template>
  <nav class="navbar navbar-expand sticky-top border-bottom navbar-shell">
    <div class="container-fluid px-3 px-md-4 px-lg-5">
      <router-link to="/" class="navbar-brand fw-bold brand-mark me-4"> YaListo </router-link>

      <div class="ms-auto d-flex align-items-center gap-2 gap-md-3">
        <router-link
          to="/cart"
          class="btn nav-icon-btn d-inline-flex align-items-center justify-content-center"
          aria-label="Ir al carrito"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
            fill="currentColor"
            viewBox="0 0 16 16"
            aria-hidden="true"
          >
            <path
              d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .49.402L2.89 3H14.5a.5.5 0 0 1 .49.598l-1.5 7A.5.5 0 0 1 13 11H4a.5.5 0 0 1-.49-.402L1.61 2H.5A.5.5 0 0 1 0 1.5zM3.102 4l1.313 6h8.183l1.286-6H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm6 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-6 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm6 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"
            />
          </svg>
        </router-link>

        <button
          type="button"
          class="btn nav-icon-btn d-inline-flex align-items-center justify-content-center"
          :aria-label="isAuthenticated ? 'Cerrar sesion' : 'Ir a iniciar sesion'"
          @click="handleAuthAction"
        >
          <svg
            v-if="isAuthenticated"
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
            fill="currentColor"
            viewBox="0 0 16 16"
            aria-hidden="true"
          >
            <path
              fill-rule="evenodd"
              d="M6 3a2 2 0 0 0-2 2v1h1V5a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-1H4v1a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H6z"
            />
            <path
              fill-rule="evenodd"
              d="M.146 8.354a.5.5 0 0 1 0-.708l2.5-2.5a.5.5 0 1 1 .708.708L1.707 7.5H9.5a.5.5 0 0 1 0 1H1.707l1.647 1.646a.5.5 0 0 1-.708.708l-2.5-2.5z"
            />
          </svg>

          <svg
            v-else
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
            fill="currentColor"
            viewBox="0 0 16 16"
            aria-hidden="true"
          >
            <path
              d="M10 5a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM8 8a4.99 4.99 0 0 0-4.546 2.916A.5.5 0 0 0 3.91 12h8.18a.5.5 0 0 0 .456-.684A4.99 4.99 0 0 0 8 8z"
            />
            <path
              fill-rule="evenodd"
              d="M15.854 8.354a.5.5 0 0 0 0-.708l-2.5-2.5a.5.5 0 0 0-.708.708L14.293 7.5H6.5a.5.5 0 0 0 0 1h7.793l-1.647 1.646a.5.5 0 0 0 .708.708l2.5-2.5z"
            />
          </svg>
        </button>

        <router-link
          v-if="isAuthenticated"
          to="/profile"
          class="d-inline-flex align-items-center justify-content-center nav-avatar-link text-decoration-none"
          aria-label="Ir al perfil"
        >
          <img
            v-if="userAvatar"
            :src="userAvatar"
            alt="Avatar del usuario"
            class="rounded-circle nav-avatar-image"
          />
          <span
            v-else
            class="rounded-circle nav-avatar-fallback d-inline-flex align-items-center justify-content-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              fill="currentColor"
              viewBox="0 0 16 16"
              aria-hidden="true"
            >
              <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3z" />
              <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
            </svg>
          </span>
        </router-link>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { useNavbarViewModel } from "@/ui/viewmodels/useNavbarViewModel";

// ========== ROUTER ==========
const router = useRouter();

// ========== VIEWMODEL ==========
const { isAuthenticated, userAvatar, logout } = useNavbarViewModel();

// ========== MÉTODOS UI ==========
const handleAuthAction = async () => {
  if (isAuthenticated.value) {
    await logout();
  } else {
    await router.push("/login");
  }
};
</script>

<style scoped>
.navbar-shell {
  background-color: #f5f5f5;
  border-bottom-color: #e9ecef !important;
  min-height: 5rem;
  z-index: 1030;
}

.brand-mark {
  color: #f07f16;
  font-size: clamp(1.7rem, 2vw, 2.2rem);
  letter-spacing: -0.02em;
}

.brand-mark:hover,
.brand-mark:focus {
  color: #d96f10;
}

.nav-icon-btn {
  color: #f07f16;
  border: 0;
  padding: 0.35rem;
  background-color: transparent;
}

.nav-icon-btn:hover,
.nav-icon-btn:focus {
  color: #d96f10;
  background-color: rgba(240, 127, 22, 0.08);
}

.nav-avatar-link {
  width: 2.85rem;
  height: 2.85rem;
}

.nav-avatar-image,
.nav-avatar-fallback {
  width: 100%;
  height: 100%;
  border: 2px solid #f07f16;
  object-fit: cover;
  background-color: #fff3ea;
  color: #17324d;
}

@media (max-width: 575.98px) {
  .navbar-shell {
    min-height: 4.5rem;
  }

  .nav-avatar-link {
    width: 2.55rem;
    height: 2.55rem;
  }
}
</style>
