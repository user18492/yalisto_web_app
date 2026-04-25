<template>
  <section class="order-view py-4 py-lg-5">
    <div class="container">
      <header class="mb-4 mb-lg-5">
        <h1 class="display-5 fw-bold text-dark mb-0">Mis Pedidos</h1>
      </header>

      <div v-if="!isLoading" class="row g-4 align-items-start">
        <div class="col-lg-4">
          <div class="d-flex flex-column gap-4">
            <section>
              <h2 class="h4 fw-semibold mb-3">Pedidos activos</h2>
              <div class="list-group order-list gap-3">
                <button
                  v-for="order in activeOrders"
                  :key="order.id"
                  type="button"
                  class="list-group-item list-group-item-action border-0 shadow-sm order-item"
                  :class="{ 'order-item-active': selectedOrder?.id === order.id }"
                  @click="selectOrder(order.id)"
                >
                  <div class="d-flex justify-content-between align-items-start gap-3 mb-3">
                    <div>
                      <h3 class="h2 fw-semibold mb-1">{{ order.restaurantName }}</h3>
                      <p class="text-secondary mb-0">Pedido #{{ order.id }}</p>
                    </div>
                    <span class="badge rounded-pill order-badge" :class="getStatusClass(order.status)">
                      {{ getStatusText(order.status) }}
                    </span>
                  </div>

                  <div class="d-flex justify-content-between align-items-center pt-3 border-top text-secondary-emphasis">
                    <span>{{ getEstimatedWindow(order) }}</span>
                    <strong class="text-dark">{{ formatCurrency(order.total) }}</strong>
                  </div>
                </button>
              </div>
            </section>

            <section v-if="completedOrders.length">
              <button
                type="button"
                class="btn btn-link p-0 history-toggle text-decoration-none"
                @click="toggleHistory"
              >
                {{ showHistory ? "Ocultar historial" : "Ver historial completo" }}
              </button>

              <div v-if="showHistory" class="list-group order-list gap-3 mt-3">
                <button
                  v-for="order in completedOrders"
                  :key="order.id"
                  type="button"
                  class="list-group-item list-group-item-action border-0 shadow-sm order-item"
                  :class="{ 'order-item-active': selectedOrder?.id === order.id }"
                  @click="selectOrder(order.id)"
                >
                  <div class="d-flex justify-content-between align-items-start gap-3 mb-3">
                    <div>
                      <h3 class="h2 fw-semibold mb-1">{{ order.restaurantName }}</h3>
                      <p class="text-secondary mb-0">Pedido #{{ order.id }}</p>
                    </div>
                    <span class="badge rounded-pill order-badge" :class="getStatusClass(order.status)">
                      {{ getStatusText(order.status) }}
                    </span>
                  </div>

                  <div class="d-flex justify-content-between align-items-center pt-3 border-top text-secondary-emphasis">
                    <span>{{ formatHistoryMoment(order.createdAt) }}</span>
                    <strong class="text-dark">{{ formatCurrency(order.total) }}</strong>
                  </div>
                </button>
              </div>
            </section>
          </div>
        </div>

        <div class="col-lg-8">
          <div v-if="selectedOrder" class="d-flex flex-column gap-4">
            <div class="card border-0 shadow-sm detail-card">
              <div class="card-body p-4 p-xl-5">
                <div class="row g-4 align-items-center">
                  <div class="col-xl-5">
                    <div class="summary-visual d-flex align-items-center justify-content-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 320 220"
                        class="summary-map"
                        aria-hidden="true"
                      >
                        <path
                          d="M160 8 286 79v118l-126 15L34 141V58L160 8z"
                          fill="#eef4d6"
                        />
                        <path
                          d="M81 57 64 104l33 30 7 45M146 24l17 55 58 27-16 45 24 42M178 62l-62 12-17 41-40-8"
                          fill="none"
                          stroke="#ffffff"
                          stroke-width="8"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M88 118c13 0 18-8 25-8s12 8 18 8 12-8 19-8 12 8 18 8 12-8 19-8 12 8 18 8 12-8 19-8"
                          fill="none"
                          stroke="#7d7a86"
                          stroke-width="8"
                          stroke-linecap="round"
                        />
                        <circle cx="92" cy="137" r="10" fill="#4a4037" />
                      </svg>
                    </div>
                  </div>

                  <div class="col-xl-7">
                    <span class="summary-status d-inline-flex align-items-center gap-2 mb-3">
                      <span class="summary-status-dot"></span>
                      {{ getStatusText(selectedOrder.status) }}
                    </span>
                    <h2 class="summary-title fw-bold mb-3">
                      Llegada estimada:
                      <br />
                      {{ selectedOrder.estimatedDeliveryStart || "--:--" }} -
                      {{ selectedOrder.estimatedDeliveryEnd || "--:--" }}
                    </h2>
                    <p class="summary-copy mb-0">
                      Su pedido de {{ selectedOrder.restaurantName }} esta siendo
                      {{ getStatusText(selectedOrder.status).toLowerCase() }} con dedicacion.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div class="row g-4">
              <div class="col-xl-6">
                <div class="card border-0 shadow-sm detail-card h-100">
                  <div class="card-body p-4 p-xl-5">
                    <h2 class="h1 fw-semibold mb-4">Estado del Pedido</h2>

                    <div class="timeline">
                      <div
                        v-for="(step, index) in orderStatusTimeline"
                        :key="step.key"
                        class="timeline-step"
                        :class="[
                          `timeline-step-${step.status}`,
                          { 'timeline-step-last': index === orderStatusTimeline.length - 1 },
                        ]"
                      >
                        <div class="timeline-marker">
                          <span v-if="step.status === 'completed'" class="timeline-check">&#10003;</span>
                        </div>
                        <div class="timeline-content">
                          <h3 class="h3 fw-semibold mb-1">{{ step.label }}</h3>
                          <p v-if="step.timestamp" class="text-secondary mb-0">
                            {{ step.timestamp }}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="col-xl-6">
                <div class="card border-0 shadow-sm detail-card h-100">
                  <div class="card-body p-4 p-xl-5">
                    <div class="d-flex justify-content-between align-items-center mb-4">
                      <h2 class="h1 fw-semibold mb-0">Detalles de Entrega</h2>
                      <span class="delivery-edit-indicator" aria-hidden="true">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          fill="currentColor"
                          viewBox="0 0 16 16"
                        >
                          <path
                            d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10L3 14l.146-2.854 10-10zM11.207 2 4 9.207V10h.793L12 2.793 11.207 2z"
                          />
                          <path
                            fill-rule="evenodd"
                            d="M1 13.5V16h2.5l7.379-7.379-2.5-2.5L1 13.5z"
                          />
                        </svg>
                      </span>
                    </div>

                    <p v-if="!canEditSelectedOrder" class="alert alert-light border mb-4 delivery-warning">
                      Esta direccion ya no puede editarse porque el pedido se encuentra en una etapa avanzada.
                    </p>

                    <form @submit.prevent="handleSaveDelivery">
                      <fieldset :disabled="!canEditSelectedOrder || isUpdating" class="delivery-fieldset">
                        <div class="row g-3">
                          <div class="col-12">
                            <label class="form-label fw-semibold" for="deliveryStreet">
                              Calle / Avenida
                            </label>
                            <input
                              id="deliveryStreet"
                              v-model="deliveryForm.deliveryStreet"
                              type="text"
                              class="form-control order-input"
                            />
                          </div>

                          <div class="col-md-4">
                            <label class="form-label fw-semibold" for="deliveryHouseNumber">
                              Numero
                            </label>
                            <input
                              id="deliveryHouseNumber"
                              v-model="deliveryForm.deliveryHouseNumber"
                              type="text"
                              class="form-control order-input"
                            />
                          </div>

                          <div class="col-md-4">
                            <label class="form-label fw-semibold" for="deliveryFloor">Piso</label>
                            <input
                              id="deliveryFloor"
                              v-model="deliveryForm.deliveryFloor"
                              type="text"
                              class="form-control order-input"
                            />
                          </div>

                          <div class="col-md-4">
                            <label class="form-label fw-semibold" for="deliveryApartment">
                              Depto
                            </label>
                            <input
                              id="deliveryApartment"
                              v-model="deliveryForm.deliveryApartment"
                              type="text"
                              class="form-control order-input"
                            />
                          </div>

                          <div class="col-md-6">
                            <label class="form-label fw-semibold" for="deliveryCity">Ciudad</label>
                            <input
                              id="deliveryCity"
                              v-model="deliveryForm.deliveryCity"
                              type="text"
                              class="form-control order-input"
                            />
                          </div>

                          <div class="col-md-6">
                            <label class="form-label fw-semibold" for="deliveryPostalCode">
                              Codigo Postal
                            </label>
                            <input
                              id="deliveryPostalCode"
                              v-model="deliveryForm.deliveryPostalCode"
                              type="text"
                              class="form-control order-input"
                            />
                          </div>

                          <div class="col-12">
                            <label class="form-label fw-semibold" for="deliveryProvince">
                              Provincia
                            </label>
                            <input
                              id="deliveryProvince"
                              v-model="deliveryForm.deliveryProvince"
                              type="text"
                              class="form-control order-input"
                            />
                          </div>

                          <div class="col-12">
                            <label class="form-label fw-semibold" for="deliveryNotes">
                              Instrucciones para el repartidor
                            </label>
                            <textarea
                              id="deliveryNotes"
                              v-model="deliveryForm.deliveryNotes"
                              rows="4"
                              class="form-control order-input"
                            ></textarea>
                          </div>
                        </div>
                      </fieldset>

                      <div class="d-flex justify-content-end mt-4">
                        <button
                          type="submit"
                          class="btn btn-primary order-save-btn"
                          :disabled="!canEditSelectedOrder || isUpdating"
                        >
                          <span
                            v-if="isUpdating"
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
              </div>
            </div>
          </div>

          <div v-else class="card border-0 shadow-sm detail-card">
            <div class="card-body p-5 text-center">
              <h2 class="h2 fw-semibold mb-2">No hay pedidos para mostrar</h2>
              <p class="text-secondary mb-0">Seleccione un pedido para ver su seguimiento.</p>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="card border-0 shadow-sm detail-card">
        <div class="card-body p-5 text-center">
          <div class="spinner-border text-warning mb-3" role="status" aria-hidden="true"></div>
          <p class="mb-0 text-secondary">Cargando pedidos...</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted } from "vue";

import { useOrderViewModel } from "@/ui/viewmodels/useOrderViewModel";

const {
  selectedOrder,
  isLoading,
  isUpdating,
  activeOrders,
  completedOrders,
  orderStatusTimeline,
  deliveryForm,
  showHistory,
  canEditSelectedOrder,
  selectOrder,
  updateDeliveryDetails,
  getStatusText,
  getStatusClass,
  loadOrders,
  toggleHistory,
  formatCurrency,
  formatHistoryMoment,
  getEstimatedWindow,
} = useOrderViewModel();

const handleSaveDelivery = async () => {
  if (!selectedOrder.value) return;

  await updateDeliveryDetails(selectedOrder.value.id, deliveryForm);
};

onMounted(() => {
  loadOrders();
});
</script>

<style scoped>
.order-view {
  background-color: #fdf7f2;
  min-height: calc(100vh - 8rem);
}

.order-list {
  background: transparent;
}

.order-item,
.detail-card {
  border-radius: 1.45rem;
  background-color: #ffffff;
}

.order-item {
  padding: 1.4rem 1.35rem;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    border-color 0.2s ease;
}

.order-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 0.9rem 1.7rem rgba(33, 24, 18, 0.08) !important;
}

.order-item-active {
  border: 1px solid rgba(240, 127, 22, 0.7) !important;
  box-shadow: 0 0.9rem 1.7rem rgba(240, 127, 22, 0.12) !important;
}

.order-badge {
  font-size: 0.95rem;
  font-weight: 600;
  padding: 0.55rem 0.9rem;
}

.history-toggle {
  color: #f07f16;
  font-weight: 600;
}

.history-toggle:hover,
.history-toggle:focus {
  color: #d96f10;
}

.summary-visual {
  min-height: 15rem;
  border-radius: 1.2rem;
  background: radial-gradient(circle at top, rgba(255, 255, 255, 0.9), rgba(252, 245, 236, 0.9));
}

.summary-map {
  width: 100%;
  max-width: 20rem;
}

.summary-status {
  color: #f07f16;
  font-size: 1.4rem;
  font-weight: 600;
}

.summary-status-dot {
  width: 0.8rem;
  height: 0.8rem;
  border-radius: 50%;
  background-color: #f07f16;
  display: inline-block;
}

.summary-title {
  font-size: clamp(2rem, 4vw, 3.6rem);
  line-height: 1.05;
}

.summary-copy {
  max-width: 30rem;
  color: #3f3128;
  font-size: 1.15rem;
}

.timeline {
  position: relative;
}

.timeline-step {
  position: relative;
  display: flex;
  gap: 1rem;
  padding-bottom: 2.15rem;
}

.timeline-step::before {
  content: "";
  position: absolute;
  top: 0.8rem;
  left: 1.05rem;
  width: 2px;
  height: 100%;
  background-color: #efd8c7;
}

.timeline-step-last::before {
  display: none;
}

.timeline-marker {
  position: relative;
  z-index: 1;
  width: 2.15rem;
  height: 2.15rem;
  border-radius: 50%;
  border: 2px solid #efd8c7;
  background-color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.timeline-step-completed .timeline-marker {
  border-color: #3fa36f;
  background-color: #3fa36f;
  color: #ffffff;
}

.timeline-step-current .timeline-marker {
  border-color: #f07f16;
  background-color: #f07f16;
  box-shadow: 0 0 0 6px rgba(240, 127, 22, 0.14);
}

.timeline-step-pending .timeline-marker {
  border-color: #efd8c7;
  background-color: #ffffff;
}

.timeline-step-current .timeline-content h3 {
  color: #f07f16;
}

.timeline-step-pending .timeline-content h3,
.timeline-step-pending .timeline-content p {
  color: #7a6d63;
}

.timeline-check {
  font-size: 1rem;
  line-height: 1;
}

.delivery-edit-indicator {
  color: #d8b79d;
}

.delivery-warning {
  background-color: #fff8f2;
  border-color: #efd8c7 !important;
  color: #6a4a38;
}

.delivery-fieldset:disabled {
  opacity: 0.7;
}

.order-input {
  min-height: 3.25rem;
  border-color: #e7c2a6;
  border-radius: 0.95rem;
  box-shadow: none;
}

.order-input:focus {
  border-color: #f07f16;
  box-shadow: 0 0 0 0.2rem rgba(240, 127, 22, 0.12);
}

textarea.order-input {
  min-height: 7rem;
}

.order-save-btn {
  min-height: 3.25rem;
  min-width: 13rem;
  border: 0;
  border-radius: 0.95rem;
  background-color: #f07f16;
  box-shadow: 0 0.8rem 1.6rem rgba(240, 127, 22, 0.18);
  font-weight: 600;
}

.order-save-btn:hover,
.order-save-btn:focus {
  background-color: #d96f10;
}

@media (max-width: 991.98px) {
  .summary-visual {
    min-height: 11rem;
  }
}

@media (max-width: 767.98px) {
  .order-view {
    min-height: auto;
  }

  .summary-title {
    font-size: 2.35rem;
  }
}
</style>
