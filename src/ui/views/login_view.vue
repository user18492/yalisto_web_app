<template>
  <section
    class="login-view flex-grow-1 d-flex align-items-center justify-content-center px-3 py-5"
  >
    <div class="card login-card border-0 shadow-sm w-100">
      <div class="card-body p-4 p-md-5">
        <div class="text-center mb-4">
          <h1 class="login-brand fw-bold mb-3">YaListo</h1>
          <p class="text-secondary mb-0">Bienvenido de nuevo. Por favor, ingrese sus datos.</p>
        </div>

        <form @submit.prevent="submit_form" novalidate>
          <div class="mb-3">
            <label class="form-label fw-semibold" for="email">Correo electronico</label>
            <input
              id="email"
              v-model="form_data.email"
              type="email"
              class="form-control form-control-lg login-input"
              :class="{ 'is-invalid': errors.email }"
              placeholder="usted@empresa.com"
              autocomplete="email"
            />
            <div v-if="errors.email" class="invalid-feedback d-block">
              {{ errors.email }}
            </div>
          </div>

          <div class="mb-3">
            <label class="form-label fw-semibold" for="password">Contrasena</label>
            <div class="input-group input-group-lg">
              <input
                id="password"
                v-model="form_data.password"
                :type="show_password ? 'text' : 'password'"
                class="form-control login-input login-input-password"
                :class="{ 'is-invalid': errors.password }"
                placeholder="********"
                autocomplete="current-password"
              />
              <button
                type="button"
                class="btn btn-outline-secondary login-toggle"
                @click="toggle_show_password"
                :aria-label="show_password ? 'Ocultar contrasena' : 'Mostrar contrasena'"
                :aria-pressed="show_password"
              >
                <svg
                  v-if="show_password"
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                  aria-hidden="true"
                >
                  <path
                    d="M13.359 11.238 15 12.879l-.707.707-1.764-1.764a8.94 8.94 0 0 1-4.53 1.178C3.823 13 1.55 8.816 1.455 8.638a.5.5 0 0 1 0-.476 14.64 14.64 0 0 1 2.087-2.713L1 2.907 1.707 2.2l12.652 12.652zM11.297 9.176l-1.442-1.442a2 2 0 0 1-2.727-2.727L5.808 3.687A13.134 13.134 0 0 0 2.51 8.4C3.216 9.597 5.005 12 8 12a7.94 7.94 0 0 0 3.297-.824z"
                  />
                  <path
                    d="M11.354 7.94a3 3 0 0 0-3.294-3.294l.835.835a2 2 0 0 1 1.624 1.624l.835.835zM8 3c4.177 0 6.45 4.184 6.545 4.362a.5.5 0 0 1 0 .476 14.67 14.67 0 0 1-1.318 1.928l-.732-.732c.526-.622.981-1.265 1.005-1.3C12.784 6.537 10.995 4 8 4c-.79 0-1.5.187-2.133.476l-.77-.77A8.77 8.77 0 0 1 8 3z"
                  />
                </svg>
                <svg
                  v-else
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                  aria-hidden="true"
                >
                  <path
                    d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8a13.133 13.133 0 0 1-1.66 2.043C11.879 11.332 10.12 12.5 8 12.5s-3.879-1.168-5.168-2.457A13.133 13.133 0 0 1 1.172 8z"
                  />
                  <path
                    d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zm0 1a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3z"
                  />
                </svg>
              </button>
            </div>
            <div v-if="errors.password" class="invalid-feedback d-block">
              {{ errors.password }}
            </div>
          </div>

          <div
            class="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4"
          >
            <div class="form-check">
              <input
                id="remember_me"
                v-model="form_data.remember_me"
                class="form-check-input"
                type="checkbox"
              />
              <label class="form-check-label text-secondary-emphasis" for="remember_me">
                Recordarme
              </label>
            </div>

            <router-link
              to="/recuperar-contrasena"
              class="login-link text-decoration-none fw-semibold"
            >
              &#191;Olvido su contrasena?
            </router-link>
          </div>

          <button
            type="submit"
            class="btn btn-primary btn-lg w-100 login-submit"
            :disabled="is_loading"
          >
            <span
              v-if="is_loading"
              class="spinner-border spinner-border-sm me-2"
              role="status"
              aria-hidden="true"
            ></span>
            <span>{{ is_loading ? "Ingresando..." : "Iniciar sesion" }}</span>
          </button>
        </form>

        <div class="text-center mt-4">
          <p class="text-secondary mb-0">
            &#191;No tiene una cuenta?
            <router-link to="/register" class="login-link text-decoration-none fw-semibold">
              Registrese
            </router-link>
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { use_login_view_model } from "@/ui/viewmodels/use_login_view_model";

const { form_data, errors, is_loading, show_password, toggle_show_password, submit_form } =
  use_login_view_model();
</script>

<style scoped>
.login-view {
  background-color: #fdf7f2;
  min-height: calc(100vh - 8rem);
}

.login-card {
  max-width: 450px;
  border-radius: 1rem;
  background-color: #ffffff;
}

.login-brand {
  color: #f07f16;
  font-size: clamp(2.25rem, 5vw, 3rem);
  line-height: 1;
}

.login-input,
.login-toggle {
  border-color: #e8c4a6;
}

.login-input {
  min-height: 3.5rem;
  border-radius: 1rem;
  box-shadow: none;
}

.login-input:focus,
.login-toggle:focus {
  border-color: #f07f16;
  box-shadow: 0 0 0 0.2rem rgba(240, 127, 22, 0.15);
}

.login-input-password {
  border-right: 0;
}

.login-toggle {
  border-left: 0;
  border-radius: 0 1rem 1rem 0;
  color: #6b4c3b;
  background-color: #ffffff;
}

.login-toggle:hover,
.login-toggle:active {
  color: #f07f16;
  background-color: #fff8f2;
  border-color: #e8c4a6;
}

.login-submit {
  min-height: 3.5rem;
  border: 0;
  border-radius: 1rem;
  background-color: #f07f16;
  box-shadow: 0 0.75rem 1.5rem rgba(240, 127, 22, 0.2);
}

.login-submit:hover,
.login-submit:focus {
  background-color: #d96f10;
}

.login-submit:disabled {
  background-color: #f3a766;
}

.login-link {
  color: #f07f16;
}

.login-link:hover {
  color: #d96f10;
}

.form-check-input {
  border-color: #e8c4a6;
}

.form-check-input:checked {
  background-color: #f07f16;
  border-color: #f07f16;
}

.form-check-input:focus {
  box-shadow: 0 0 0 0.2rem rgba(240, 127, 22, 0.15);
}

@media (max-width: 575.98px) {
  .login-card {
    max-width: 100%;
  }

  .login-view {
    min-height: auto;
  }
}
</style>
