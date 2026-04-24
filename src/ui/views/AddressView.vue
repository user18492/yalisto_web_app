<template>
  <section class="address-view py-4 py-lg-5">
    <div class="container">
      <div
        class="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-3 gap-lg-4 mb-4 mb-lg-5"
      >
        <div>
          <h1 class="display-6 fw-bold text-dark mb-2">Mis Direcciones</h1>
          <p class="text-secondary mb-0">Administra tus lugares de entrega.</p>
        </div>

        <button
          type="button"
          class="btn btn-primary address-add-btn"
          :disabled="isLoading"
          @click="openCreateModal"
        >
          <span class="me-2" aria-hidden="true">+</span>
          <span>Agregar nueva direccion</span>
        </button>
      </div>

      <div v-if="addresses.length" class="row g-4">
        <div v-for="address in addresses" :key="address.id" class="col-12 col-md-6 col-xl-4">
          <article class="card border-0 shadow-sm h-100 address-card">
            <div class="card-body p-4 d-flex flex-column">
              <div class="d-flex justify-content-between align-items-start gap-3 mb-4">
                <div class="d-flex align-items-center gap-3 min-w-0">
                  <div
                    class="address-icon rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                    :class="iconColorClass(address.type)"
                  >
                    <svg
                      v-if="address.type === 'home'"
                      xmlns="http://www.w3.org/2000/svg"
                      width="22"
                      height="22"
                      fill="currentColor"
                      viewBox="0 0 16 16"
                      aria-hidden="true"
                    >
                      <path
                        d="M8.354 1.146a.5.5 0 0 0-.708 0l-6 6A.5.5 0 0 0 2 8h1v6a.5.5 0 0 0 .5.5H6v-4a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 .5.5v4h2.5a.5.5 0 0 0 .5-.5V8h1a.5.5 0 0 0 .354-.854l-6-6z"
                      />
                    </svg>
                    <svg
                      v-else-if="address.type === 'work'"
                      xmlns="http://www.w3.org/2000/svg"
                      width="22"
                      height="22"
                      fill="currentColor"
                      viewBox="0 0 16 16"
                      aria-hidden="true"
                    >
                      <path
                        d="M6.5 0a.5.5 0 0 0-.5.5V2H3a2 2 0 0 0-2 2v8.5A1.5 1.5 0 0 0 2.5 14H6v-2.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 .5.5V14h3.5a1.5 1.5 0 0 0 1.5-1.5V4a2 2 0 0 0-2-2h-3V.5a.5.5 0 0 0-.5-.5h-3z"
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
                        d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748z"
                      />
                    </svg>
                  </div>

                  <div class="min-w-0">
                    <h2 class="h3 fw-semibold mb-0 text-truncate">{{ address.label }}</h2>
                  </div>
                </div>

                <span
                  v-if="address.isPrimary"
                  class="badge rounded-pill text-primary-emphasis address-primary-badge"
                >
                  Principal
                </span>
              </div>

              <div class="address-copy text-secondary-emphasis mb-4">
                <p class="mb-2">{{ formatStreet(address) }}</p>
                <p class="mb-2">{{ formatLocation(address) }}</p>
                <p class="mb-0">CP: {{ address.postalCode }}</p>
              </div>

              <div class="mt-auto border-top pt-4">
                <button
                  v-if="!address.isPrimary"
                  type="button"
                  class="btn btn-outline-primary w-100 address-outline-btn mb-3"
                  :disabled="isLoading"
                  @click="handleSetPrimary(address.id)"
                >
                  <span
                    v-if="isLoading && isLoadingAction === address.id"
                    class="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  <span>Establecer como principal</span>
                </button>

                <div class="d-flex gap-2">
                  <button
                    type="button"
                    class="btn flex-grow-1 address-edit-btn"
                    :disabled="isLoading"
                    @click="openEditModal(address)"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      viewBox="0 0 16 16"
                      class="me-2"
                      aria-hidden="true"
                    >
                      <path
                        d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10L3 14l.146-2.854 10-10zM11.207 2 4 9.207V10h.793L12 2.793 11.207 2z"
                      />
                      <path fill-rule="evenodd" d="M1 13.5V16h2.5l7.379-7.379-2.5-2.5L1 13.5z" />
                    </svg>
                    <span>Editar</span>
                  </button>

                  <button
                    type="button"
                    class="btn address-delete-btn"
                    :disabled="isLoading"
                    @click="openDeleteModal(address)"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      viewBox="0 0 16 16"
                      aria-hidden="true"
                    >
                      <path
                        d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5.5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6zm2 .5a.5.5 0 0 1 1 0v6a.5.5 0 0 1-1 0V6z"
                      />
                      <path
                        fill-rule="evenodd"
                        d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1 0-2H5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1h2.5a1 1 0 0 1 1 1zM6 2v1h4V2H6zm-2 2v9a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4H4z"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>

      <div v-else class="card border-0 shadow-sm empty-state-card">
        <div class="card-body p-5 text-center">
          <div
            class="empty-state-icon mx-auto mb-3 d-flex align-items-center justify-content-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              fill="currentColor"
              viewBox="0 0 16 16"
              aria-hidden="true"
            >
              <path
                d="M4 .5A.5.5 0 0 1 4.5 0h7A.5.5 0 0 1 12 .5V1h1.5A1.5 1.5 0 0 1 15 2.5v11a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 1 13.5v-11A1.5 1.5 0 0 1 2.5 1H4V.5zM4 2H2.5a.5.5 0 0 0-.5.5V5h12V2.5a.5.5 0 0 0-.5-.5H12v.5a.5.5 0 0 1-1 0V2h-6v.5a.5.5 0 0 1-1 0V2zm10 4H2v7.5a.5.5 0 0 0 .5.5h11a.5.5 0 0 0 .5-.5V6z"
              />
            </svg>
          </div>
          <h2 class="h3 fw-semibold mb-2">Aun no tienes direcciones guardadas</h2>
          <p class="text-secondary mb-4">
            Agrega tu primera direccion para agilizar tus pedidos y entregas.
          </p>
          <button
            type="button"
            class="btn btn-primary address-add-btn"
            :disabled="isLoading"
            @click="openCreateModal"
          >
            <span class="me-2" aria-hidden="true">+</span>
            <span>Agregar primera direccion</span>
          </button>
        </div>
      </div>
    </div>

    <div
      v-if="isFormModalOpen"
      class="modal fade show d-block"
      tabindex="-1"
      role="dialog"
      aria-modal="true"
    >
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content border-0 shadow-lg address-modal">
          <div class="modal-header border-0 pb-0">
            <div>
              <h2 class="modal-title h4 fw-bold mb-1">
                {{ isEditing ? "Editar direccion" : "Agregar nueva direccion" }}
              </h2>
              <p class="text-secondary mb-0">
                Completa los datos para guardar tu lugar de entrega.
              </p>
            </div>

            <button
              type="button"
              class="btn-close"
              aria-label="Cerrar"
              :disabled="isLoading"
              @click="closeFormModal"
            ></button>
          </div>

          <form @submit.prevent="handleSubmitAddress">
            <div class="modal-body pt-4">
              <div class="row g-3">
                <div class="col-md-6">
                  <label class="form-label fw-semibold" for="addressLabel">Nombre</label>
                  <input
                    id="addressLabel"
                    v-model="addressForm.label"
                    type="text"
                    class="form-control address-input"
                    placeholder="Casa"
                  />
                </div>

                <div class="col-md-6">
                  <label class="form-label fw-semibold" for="addressType">Tipo</label>
                  <select
                    id="addressType"
                    v-model="addressForm.type"
                    class="form-select address-input"
                  >
                    <option value="home">Casa</option>
                    <option value="work">Oficina</option>
                    <option value="favorite">Favorita</option>
                  </select>
                </div>

                <div class="col-md-8">
                  <label class="form-label fw-semibold" for="street">Calle</label>
                  <input
                    id="street"
                    v-model="addressForm.street"
                    type="text"
                    class="form-control address-input"
                    placeholder="Av. Libertador"
                  />
                </div>

                <div class="col-md-4">
                  <label class="form-label fw-semibold" for="number">Numero</label>
                  <input
                    id="number"
                    v-model="addressForm.number"
                    type="text"
                    class="form-control address-input"
                    placeholder="1234"
                  />
                </div>

                <div class="col-md-6">
                  <label class="form-label fw-semibold" for="floor">Piso</label>
                  <input
                    id="floor"
                    v-model="addressForm.floor"
                    type="text"
                    class="form-control address-input"
                    placeholder="5"
                  />
                </div>

                <div class="col-md-6">
                  <label class="form-label fw-semibold" for="apartment">Depto</label>
                  <input
                    id="apartment"
                    v-model="addressForm.apartment"
                    type="text"
                    class="form-control address-input"
                    placeholder="B"
                  />
                </div>

                <div class="col-md-6">
                  <label class="form-label fw-semibold" for="city">Ciudad</label>
                  <input
                    id="city"
                    v-model="addressForm.city"
                    type="text"
                    class="form-control address-input"
                    placeholder="Buenos Aires"
                  />
                </div>

                <div class="col-md-6">
                  <label class="form-label fw-semibold" for="province">Provincia</label>
                  <input
                    id="province"
                    v-model="addressForm.province"
                    type="text"
                    class="form-control address-input"
                    placeholder="CABA"
                  />
                </div>

                <div class="col-md-6">
                  <label class="form-label fw-semibold" for="postalCode">Codigo Postal</label>
                  <input
                    id="postalCode"
                    v-model="addressForm.postalCode"
                    type="text"
                    class="form-control address-input"
                    placeholder="1425"
                  />
                </div>

                <div class="col-md-6 d-flex align-items-end">
                  <div class="form-check">
                    <input
                      id="isPrimary"
                      v-model="addressForm.isPrimary"
                      class="form-check-input"
                      type="checkbox"
                    />
                    <label class="form-check-label fw-semibold" for="isPrimary">
                      Establecer como principal
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div class="modal-footer border-0 pt-0">
              <button
                type="button"
                class="btn btn-light address-cancel-btn"
                :disabled="isLoading"
                @click="closeFormModal"
              >
                Cancelar
              </button>
              <button type="submit" class="btn btn-primary address-add-btn" :disabled="isLoading">
                <span
                  v-if="isLoading"
                  class="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                <span>{{ isEditing ? "Guardar cambios" : "Guardar direccion" }}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <div
      v-if="isDeleteModalOpen"
      class="modal fade show d-block"
      tabindex="-1"
      role="dialog"
      aria-modal="true"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow-lg address-modal">
          <div class="modal-header border-0 pb-0">
            <h2 class="modal-title h4 fw-bold mb-0">Eliminar direccion</h2>
            <button
              type="button"
              class="btn-close"
              aria-label="Cerrar"
              :disabled="isLoading"
              @click="closeDeleteModal"
            ></button>
          </div>

          <div class="modal-body pt-3">
            <p class="text-secondary mb-0">
              {{ deleteModalCopy }}
            </p>
          </div>

          <div class="modal-footer border-0">
            <button
              type="button"
              class="btn btn-light address-cancel-btn"
              :disabled="isLoading"
              @click="closeDeleteModal"
            >
              Cancelar
            </button>
            <button
              type="button"
              class="btn btn-danger"
              :disabled="isLoading"
              @click="handleDeleteAddress"
            >
              <span
                v-if="isLoading"
                class="spinner-border spinner-border-sm me-2"
                role="status"
                aria-hidden="true"
              ></span>
              <span>Eliminar</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="isFormModalOpen || isDeleteModalOpen" class="modal-backdrop fade show"></div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, computed } from "vue";
import {
  useAddressViewModel,
  type Address,
  type AddressPayload,
} from "@/ui/viewmodels/useAddressViewModel";

// ========== VIEWMODEL ==========
const {
  addresses,
  isLoading,
  isLoadingAction,
  fetchAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  setAsPrimary,
} = useAddressViewModel();

// ========== ESTADO LOCAL DE UI ==========
const isFormModalOpen = ref(false);
const isDeleteModalOpen = ref(false);
const isEditing = ref(false);
const selectedAddress = ref<Address | null>(null);

// ========== FORMULARIO ==========
type AddressForm = {
  id: string | number | null;
  label: string;
  type: "home" | "work" | "favorite";
  street: string;
  number: string;
  floor: string;
  apartment: string;
  city: string;
  province: string;
  postalCode: string;
  isPrimary: boolean;
};

const createEmptyForm = (): AddressForm => ({
  id: null,
  label: "",
  type: "home",
  street: "",
  number: "",
  floor: "",
  apartment: "",
  city: "",
  province: "",
  postalCode: "",
  isPrimary: false,
});

const addressForm = reactive<AddressForm>(createEmptyForm());

// ========== COMPUTED ==========
const deleteModalCopy = computed(() => {
  if (!selectedAddress.value) return "¿Eliminar esta dirección?";
  return `¿Eliminar la dirección "${selectedAddress.value.label}"?`;
});

// ========== MÉTODOS DE FORMULARIO ==========
const resetForm = () => {
  Object.assign(addressForm, createEmptyForm());
};

const mapAddressToForm = (address: Address) => {
  Object.assign(addressForm, {
    id: address.id,
    label: address.label,
    type: address.type,
    street: address.street,
    number: String(address.number ?? ""),
    floor: address.floor ?? "",
    apartment: address.apartment ?? "",
    city: address.city,
    province: address.province,
    postalCode: address.postalCode,
    isPrimary: address.isPrimary,
  });
};

// ========== MODALES ==========
const openCreateModal = () => {
  isEditing.value = false;
  selectedAddress.value = null;
  resetForm();
  isFormModalOpen.value = true;
};

const openEditModal = (address: Address) => {
  isEditing.value = true;
  selectedAddress.value = address;
  mapAddressToForm(address);
  isFormModalOpen.value = true;
};

const closeFormModal = () => {
  if (isLoading.value) return;
  isFormModalOpen.value = false;
  isEditing.value = false;
  selectedAddress.value = null;
  resetForm();
};

const openDeleteModal = (address: Address) => {
  selectedAddress.value = address;
  isDeleteModalOpen.value = true;
};

const closeDeleteModal = () => {
  if (isLoading.value) return;
  isDeleteModalOpen.value = false;
  selectedAddress.value = null;
};

// ========== ACCIONES CRUD ==========
const handleSubmitAddress = async () => {
  const payload: AddressPayload = {
    label: addressForm.label,
    type: addressForm.type,
    street: addressForm.street,
    number: addressForm.number,
    floor: addressForm.floor,
    apartment: addressForm.apartment,
    city: addressForm.city,
    province: addressForm.province,
    postalCode: addressForm.postalCode,
    isPrimary: addressForm.isPrimary,
  };

  if (isEditing.value && addressForm.id !== null) {
    await updateAddress(addressForm.id, payload);
  } else {
    await addAddress(payload);
  }

  closeFormModal();
};

const handleDeleteAddress = async () => {
  if (!selectedAddress.value) return;
  await deleteAddress(selectedAddress.value.id);
  closeDeleteModal();
};

const handleSetPrimary = async (addressId: string | number) => {
  await setAsPrimary(addressId);
};

// ========== FORMATTERS ==========
const formatStreet = (address: Address) => {
  const optionalParts = [
    address.floor ? `Piso ${address.floor}` : "",
    address.apartment ? `Depto ${address.apartment}` : "",
  ]
    .filter(Boolean)
    .join(", ");

  return optionalParts
    ? `${address.street} ${address.number}, ${optionalParts}`
    : `${address.street} ${address.number}`;
};

const formatLocation = (address: Address) => `${address.city}, ${address.province}`;

const iconColorClass = (type: Address["type"]) => {
  if (type === "work") return "address-icon-work";
  if (type === "favorite") return "address-icon-favorite";
  return "address-icon-home";
};

// ========== LIFECYCLE ==========
onMounted(() => {
  fetchAddresses();
});
</script>

<style scoped>
.address-view {
  background-color: #fdf7f2;
  min-height: calc(100vh - 8rem);
}

.address-card,
.address-modal,
.empty-state-card {
  border-radius: 1.5rem;
  background-color: #ffffff;
}

.address-add-btn {
  min-height: 3.5rem;
  padding-inline: 1.5rem;
  border: 0;
  border-radius: 1rem;
  background-color: #f07f16;
  box-shadow: 0 0.75rem 1.5rem rgba(240, 127, 22, 0.2);
  font-weight: 600;
}

.address-add-btn:hover,
.address-add-btn:focus {
  background-color: #d96f10;
}

.address-icon {
  width: 3.25rem;
  height: 3.25rem;
}

.address-icon-home {
  background-color: #ffe6d3;
  color: #f07f16;
}

.address-icon-work {
  background-color: #dcecff;
  color: #5c7189;
}

.address-icon-favorite {
  background-color: #ffe4c8;
  color: #8a4d00;
}

.address-primary-badge {
  background-color: #fff0e2;
  font-size: 0.95rem;
  font-weight: 600;
  padding: 0.55rem 1rem;
}

.address-copy {
  font-size: 1rem;
  line-height: 1.8;
}

.address-outline-btn {
  min-height: 3rem;
  border-color: #f07f16;
  color: #f07f16;
  border-radius: 0.95rem;
  font-weight: 600;
}

.address-outline-btn:hover,
.address-outline-btn:focus {
  border-color: #d96f10;
  color: #d96f10;
  background-color: #fff7f0;
}

.address-edit-btn,
.address-delete-btn,
.address-cancel-btn {
  border-radius: 0.95rem;
}

.address-edit-btn {
  min-height: 3rem;
  background-color: #fdf4ee;
  color: #4f3421;
  font-weight: 600;
}

.address-edit-btn:hover,
.address-edit-btn:focus {
  background-color: #f8e8dc;
  color: #4f3421;
}

.address-delete-btn {
  width: 3rem;
  min-width: 3rem;
  min-height: 3rem;
  background-color: #fdf4ee;
  color: #4f3421;
}

.address-delete-btn:hover,
.address-delete-btn:focus {
  background-color: #fde2df;
  color: #c62828;
}

.address-input {
  min-height: 3.2rem;
  border-color: #e8c4a6;
  border-radius: 0.95rem;
  box-shadow: none;
}

.address-input:focus {
  border-color: #f07f16;
  box-shadow: 0 0 0 0.2rem rgba(240, 127, 22, 0.15);
}

.empty-state-card {
  max-width: 40rem;
  margin-inline: auto;
}

.empty-state-icon {
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
  background-color: #fff0e2;
  color: #f07f16;
}

.modal-backdrop {
  background-color: rgba(26, 18, 10, 0.35);
}

@media (max-width: 767.98px) {
  .address-view {
    min-height: auto;
  }

  .address-add-btn {
    width: 100%;
  }
}
</style>
