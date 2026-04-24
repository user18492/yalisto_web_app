<template>
  <section class="profile-view py-4 py-lg-5">
    <div class="container">
      <div class="mb-4 mb-lg-5">
        <h1 class="display-6 fw-bold text-dark mb-2">Configuracion de Perfil</h1>
        <p class="text-secondary mb-0">
          Gestione sus datos personales y preferencias de seguridad.
        </p>
      </div>

      <div class="row g-4 align-items-start">
        <div class="col-lg-3 col-md-4">
          <div class="profile-sidebar sticky-top">
            <div class="list-group profile-nav shadow-sm">
              <button
                v-for="item in navigationItems"
                :key="item.id"
                type="button"
                class="list-group-item list-group-item-action border-0 text-start"
                :class="{
                  active: activeSection === item.id && !item.isDanger,
                  'danger-active': activeSection === item.id && item.isDanger,
                  'text-danger': item.isDanger && activeSection !== item.id,
                }"
                @click="scrollToCategory(item.id)"
              >
                {{ item.label }}
              </button>
            </div>
          </div>
        </div>

        <div class="col-lg-9 col-md-8">
          <div class="d-flex flex-column gap-4">
            <div id="personal-data" class="card border-0 shadow-sm profile-section">
              <div class="card-body p-4 p-lg-5">
                <div class="d-flex align-items-center gap-2 mb-4">
                  <span class="section-icon" aria-hidden="true">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      fill="currentColor"
                      viewBox="0 0 16 16"
                    >
                      <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3z" />
                      <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
                    </svg>
                  </span>
                  <h2 class="h3 fw-bold mb-0">Datos Personales</h2>
                </div>

                <form @submit.prevent="handlePersonalData" novalidate>
                  <div class="row g-4 align-items-start">
                    <div class="col-lg-3">
                      <div class="text-center">
                        <div class="avatar-frame mx-auto mb-3">
                          <img
                            v-if="userData.avatar"
                            :src="userData.avatar"
                            alt="Avatar del usuario"
                            class="avatar-image"
                          />
                          <div v-else class="avatar-placeholder">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="52"
                              height="52"
                              fill="currentColor"
                              viewBox="0 0 16 16"
                            >
                              <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3z" />
                              <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
                            </svg>
                          </div>
                        </div>
                        <label class="form-label fw-semibold d-block" for="avatar">Avatar</label>
                        <input
                          id="avatar"
                          v-model="userData.avatar"
                          type="url"
                          class="form-control profile-input"
                          :class="{ 'is-invalid': errors.avatar }"
                          placeholder="https://ejemplo.com/avatar.jpg"
                        />
                        <div v-if="errors.avatar" class="invalid-feedback d-block">
                          {{ errors.avatar }}
                        </div>
                      </div>
                    </div>

                    <div class="col-lg-9">
                      <div class="row g-3">
                        <div class="col-md-6">
                          <label class="form-label fw-semibold" for="name">Nombre</label>
                          <input
                            id="name"
                            v-model="userData.name"
                            type="text"
                            class="form-control profile-input"
                            :class="{ 'is-invalid': errors.name }"
                            placeholder="Maria"
                            autocomplete="given-name"
                          />
                          <div v-if="errors.name" class="invalid-feedback d-block">
                            {{ errors.name }}
                          </div>
                        </div>

                        <div class="col-md-6">
                          <label class="form-label fw-semibold" for="lastName">Apellido</label>
                          <input
                            id="lastName"
                            v-model="userData.lastName"
                            type="text"
                            class="form-control profile-input"
                            :class="{ 'is-invalid': errors.lastName }"
                            placeholder="Gonzalez"
                            autocomplete="family-name"
                          />
                          <div v-if="errors.lastName" class="invalid-feedback d-block">
                            {{ errors.lastName }}
                          </div>
                        </div>

                        <div class="col-12">
                          <label class="form-label fw-semibold" for="profileEmail">
                            Correo Electronico
                          </label>
                          <input
                            id="profileEmail"
                            v-model="userData.email"
                            type="email"
                            class="form-control profile-input"
                            :class="{ 'is-invalid': errors.email }"
                            placeholder="maria.g@ejemplo.com"
                            autocomplete="email"
                          />
                          <div v-if="errors.email" class="invalid-feedback d-block">
                            {{ errors.email }}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="border-top mt-4 pt-4 d-flex justify-content-end">
                    <button
                      type="submit"
                      class="btn btn-primary profile-primary-btn"
                      :disabled="isLoading"
                    >
                      <span
                        v-if="isLoading && activeAction === 'personal'"
                        class="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      <span>Guardar Cambios</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>

            <div id="addresses" class="card border-0 shadow-sm profile-section">
              <div class="card-body p-4 p-lg-5">
                <div class="d-flex align-items-center gap-2 mb-4">
                  <span class="section-icon" aria-hidden="true">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      fill="currentColor"
                      viewBox="0 0 16 16"
                    >
                      <path
                        d="M8 16s6-5.686 6-10A6 6 0 1 0 2 6c0 4.314 6 10 6 10zm0-7.5A2.5 2.5 0 1 1 8 3a2.5 2.5 0 0 1 0 5.5z"
                      />
                    </svg>
                  </span>
                  <h2 class="h3 fw-bold mb-0">Direcciones</h2>
                </div>

                <form @submit.prevent="handleAddress" novalidate>
                  <div class="border rounded-4 p-3 p-md-4 address-box">
                    <h3 class="h4 mb-4">Direccion Principal</h3>

                    <div class="row g-3">
                      <div class="col-md-8">
                        <label class="form-label fw-semibold" for="street">Calle</label>
                        <input
                          id="street"
                          v-model="addressData.street"
                          type="text"
                          class="form-control profile-input"
                          :class="{ 'is-invalid': errors.street }"
                          placeholder="Av. del Libertador"
                          autocomplete="address-line1"
                        />
                        <div v-if="errors.street" class="invalid-feedback d-block">
                          {{ errors.street }}
                        </div>
                      </div>

                      <div class="col-md-4">
                        <label class="form-label fw-semibold" for="number">Numero</label>
                        <input
                          id="number"
                          v-model="addressData.number"
                          type="number"
                          class="form-control profile-input"
                          :class="{ 'is-invalid': errors.number }"
                          placeholder="2341"
                          inputmode="numeric"
                        />
                        <div v-if="errors.number" class="invalid-feedback d-block">
                          {{ errors.number }}
                        </div>
                      </div>

                      <div class="col-md-6">
                        <label class="form-label fw-semibold" for="floor">Piso</label>
                        <input
                          id="floor"
                          v-model="addressData.floor"
                          type="text"
                          class="form-control profile-input"
                          :class="{ 'is-invalid': errors.floor }"
                          placeholder="3"
                        />
                        <div v-if="errors.floor" class="invalid-feedback d-block">
                          {{ errors.floor }}
                        </div>
                      </div>

                      <div class="col-md-6">
                        <label class="form-label fw-semibold" for="apartment">Apartamento</label>
                        <input
                          id="apartment"
                          v-model="addressData.apartment"
                          type="text"
                          class="form-control profile-input"
                          :class="{ 'is-invalid': errors.apartment }"
                          placeholder="B"
                        />
                        <div v-if="errors.apartment" class="invalid-feedback d-block">
                          {{ errors.apartment }}
                        </div>
                      </div>

                      <div class="col-md-4">
                        <label class="form-label fw-semibold" for="city">Ciudad</label>
                        <input
                          id="city"
                          v-model="addressData.city"
                          type="text"
                          class="form-control profile-input"
                          :class="{ 'is-invalid': errors.city }"
                          placeholder="CABA"
                          autocomplete="address-level2"
                        />
                        <div v-if="errors.city" class="invalid-feedback d-block">
                          {{ errors.city }}
                        </div>
                      </div>

                      <div class="col-md-4">
                        <label class="form-label fw-semibold" for="province">Provincia</label>
                        <input
                          id="province"
                          v-model="addressData.province"
                          type="text"
                          class="form-control profile-input"
                          :class="{ 'is-invalid': errors.province }"
                          placeholder="Buenos Aires"
                          autocomplete="address-level1"
                        />
                        <div v-if="errors.province" class="invalid-feedback d-block">
                          {{ errors.province }}
                        </div>
                      </div>

                      <div class="col-md-4">
                        <label class="form-label fw-semibold" for="postalCode">Codigo Postal</label>
                        <input
                          id="postalCode"
                          v-model="addressData.postalCode"
                          type="text"
                          class="form-control profile-input"
                          :class="{ 'is-invalid': errors.postalCode }"
                          placeholder="1425"
                          autocomplete="postal-code"
                        />
                        <div v-if="errors.postalCode" class="invalid-feedback d-block">
                          {{ errors.postalCode }}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="border-top mt-4 pt-4 d-flex justify-content-end">
                    <button
                      type="submit"
                      class="btn btn-primary profile-primary-btn"
                      :disabled="isLoading"
                    >
                      <span
                        v-if="isLoading && activeAction === 'address'"
                        class="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      <span>Guardar Direccion</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>

            <div id="security" class="card border-0 shadow-sm profile-section">
              <div class="card-body p-4 p-lg-5">
                <div class="d-flex align-items-center gap-2 mb-4">
                  <span class="section-icon" aria-hidden="true">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      fill="currentColor"
                      viewBox="0 0 16 16"
                    >
                      <path
                        d="M8 1a2 2 0 0 1 2 2v1h1.5A1.5 1.5 0 0 1 13 5.5v7A1.5 1.5 0 0 1 11.5 14h-7A1.5 1.5 0 0 1 3 12.5v-7A1.5 1.5 0 0 1 4.5 4H6V3a2 2 0 0 1 2-2zm1 3V3a1 1 0 1 0-2 0v1h2z"
                      />
                    </svg>
                  </span>
                  <h2 class="h3 fw-bold mb-0">Seguridad</h2>
                </div>

                <form @submit.prevent="handlePassword" novalidate>
                  <div class="row g-3">
                    <div class="col-12">
                      <label class="form-label fw-semibold" for="currentPassword">
                        Contrasena Actual
                      </label>
                      <input
                        id="currentPassword"
                        v-model="passwords.currentPassword"
                        type="password"
                        class="form-control profile-input"
                        :class="{ 'is-invalid': errors.currentPassword }"
                        placeholder="Ingrese su contrasena actual"
                        autocomplete="current-password"
                      />
                      <div v-if="errors.currentPassword" class="invalid-feedback d-block">
                        {{ errors.currentPassword }}
                      </div>
                    </div>

                    <div class="col-12">
                      <label class="form-label fw-semibold" for="newPassword">
                        Nueva Contrasena
                      </label>
                      <input
                        id="newPassword"
                        v-model="passwords.newPassword"
                        type="password"
                        class="form-control profile-input"
                        :class="{ 'is-invalid': errors.newPassword }"
                        placeholder="Ingrese nueva contrasena"
                        autocomplete="new-password"
                      />
                      <div v-if="errors.newPassword" class="invalid-feedback d-block">
                        {{ errors.newPassword }}
                      </div>
                    </div>

                    <div class="col-12">
                      <label class="form-label fw-semibold" for="confirmPassword">
                        Confirmar Nueva Contrasena
                      </label>
                      <input
                        id="confirmPassword"
                        v-model="passwords.confirmPassword"
                        type="password"
                        class="form-control profile-input"
                        :class="{ 'is-invalid': errors.confirmPassword }"
                        placeholder="Repita la nueva contrasena"
                        autocomplete="new-password"
                      />
                      <div v-if="errors.confirmPassword" class="invalid-feedback d-block">
                        {{ errors.confirmPassword }}
                      </div>
                    </div>
                  </div>

                  <div class="border-top mt-4 pt-4 d-flex justify-content-end">
                    <button
                      type="submit"
                      class="btn btn-outline-primary profile-secondary-btn"
                      :disabled="isLoading"
                    >
                      <span
                        v-if="isLoading && activeAction === 'password'"
                        class="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      <span>Cambiar Contrasena</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>

            <div id="danger-zone" class="card shadow-sm profile-section danger-card">
              <div class="card-body p-4 p-lg-5">
                <div class="d-flex align-items-center gap-2 mb-3 text-danger">
                  <span aria-hidden="true">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      fill="currentColor"
                      viewBox="0 0 16 16"
                    >
                      <path
                        d="M7.938 2.016A.13.13 0 0 1 8.002 2a.13.13 0 0 1 .063.016.146.146 0 0 1 .054.057l6.857 11.667c.036.06.044.115.044.154a.69.69 0 0 1-.698.706H1.678A.69.69 0 0 1 .98 13.894c0-.04.008-.094.044-.154L7.884 2.073a.145.145 0 0 1 .054-.057zM8 5c-.535 0-.954.462-.9.995l.35 3.507a.55.55 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 5zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"
                      />
                    </svg>
                  </span>
                  <h2 class="h3 fw-bold mb-0">Eliminar cuenta</h2>
                </div>

                <p class="danger-copy mb-4">
                  Al eliminar su cuenta, perdera acceso a todos sus datos y servicios asociados.
                  Esta accion no se puede deshacer.
                </p>

                <button
                  type="button"
                  class="btn btn-danger profile-danger-btn"
                  :disabled="isLoading"
                  @click="handleDeleteAccount"
                >
                  <span
                    v-if="isLoading && activeAction === 'delete'"
                    class="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  <span>Eliminar Cuenta Definitivamente</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useProfileViewModel } from "@/ui/viewmodels/useProfileViewModel";

const {
  userData,
  addressData,
  passwords,
  errors,
  navigationItems,
  isLoading,
  activeSection,
  activeAction,
  scrollToCategory,
  updatePersonalData,
  updateAddress,
  changePassword,
  deleteAccount,
  setupScrollListener,
  cleanupScrollListener,
} = useProfileViewModel();

// Wrappers para manejar el estado de acción activa
const handlePersonalData = () => updatePersonalData();
const handleAddress = () => updateAddress();
const handlePassword = () => changePassword();
const handleDeleteAccount = () => deleteAccount();

// Setup scroll listener
setupScrollListener();

// Cleanup
import { onBeforeUnmount } from "vue";
onBeforeUnmount(() => {
  cleanupScrollListener();
});
</script>

<style scoped>
.profile-view {
  background-color: #fdf7f2;
  min-height: calc(100vh - 8rem);
}

.profile-sidebar {
  top: 6.5rem;
}

.profile-nav {
  border-radius: 1rem;
  overflow: hidden;
  background-color: rgba(255, 255, 255, 0.82);
}

.profile-nav .list-group-item {
  padding: 1rem 1.1rem;
  font-weight: 600;
  color: #53311d;
  background-color: transparent;
}

.profile-nav .list-group-item:hover {
  background-color: #fff1e5;
  color: #f07f16;
}

.profile-nav .list-group-item.active {
  background-color: #fce8da;
  color: #b85c09;
}

.profile-nav .list-group-item.danger-active {
  background-color: #fde2df;
  color: #c62828;
}

.profile-section {
  border-radius: 1.5rem;
  background-color: #ffffff;
  scroll-margin-top: 7.5rem;
}

.section-icon {
  color: #b85c09;
}

.avatar-frame {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 4px solid #f7dcc8;
  overflow: hidden;
  background-color: #fff3ea;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #b85c09;
}

.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
}

.address-box {
  border-color: #f2d7c4 !important;
}

.profile-input {
  min-height: 3.25rem;
  border-color: #e8c4a6;
  border-radius: 0.95rem;
  box-shadow: none;
}

.profile-input:focus {
  border-color: #f07f16;
  box-shadow: 0 0 0 0.2rem rgba(240, 127, 22, 0.15);
}

.profile-primary-btn,
.profile-secondary-btn,
.profile-danger-btn {
  min-height: 3rem;
  border-radius: 0.9rem;
  font-weight: 600;
}

.profile-primary-btn {
  border: 0;
  background-color: #f07f16;
  box-shadow: 0 0.75rem 1.5rem rgba(240, 127, 22, 0.18);
}

.profile-primary-btn:hover,
.profile-primary-btn:focus {
  background-color: #d96f10;
}

.profile-secondary-btn {
  color: #b85c09;
  border-color: #f0c6a2;
  background-color: #faeadf;
}

.profile-secondary-btn:hover,
.profile-secondary-btn:focus {
  color: #9c4f0b;
  border-color: #efbb8d;
  background-color: #f7e0cf;
}

.danger-card {
  border: 1px solid #f6c9c4;
}

.danger-copy {
  max-width: 42rem;
  color: #5b3428;
}

.profile-danger-btn {
  background-color: #c62828;
  border-color: #c62828;
  box-shadow: 0 0.75rem 1.5rem rgba(198, 40, 40, 0.18);
}

.profile-danger-btn:hover,
.profile-danger-btn:focus {
  background-color: #ad2323;
  border-color: #ad2323;
}

@media (max-width: 991.98px) {
  .profile-sidebar {
    position: static !important;
    top: auto;
  }
}

@media (max-width: 767.98px) {
  .profile-view {
    min-height: auto;
  }
}
</style>
