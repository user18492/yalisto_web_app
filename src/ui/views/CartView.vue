<template>
  <section class="cart-view py-4 py-lg-5">
    <div class="container">
      <div
        class="d-flex flex-column flex-lg-row justify-content-between align-items-lg-start gap-3 pb-4 mb-4 cart-header"
      >
        <div>
          <h1 class="display-5 fw-bold text-dark mb-2">Su Carrito de Compras</h1>
          <p class="text-secondary mb-0">
            Tiene {{ itemCount }} {{ itemCount === 1 ? "articulo" : "articulos" }} en su orden.
          </p>
        </div>

        <button
          v-if="cartItems.length"
          type="button"
          class="btn btn-link cart-clear-btn text-decoration-none p-0"
          @click="clearCart"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            fill="currentColor"
            viewBox="0 0 16 16"
            class="me-2"
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
          Vaciar carrito
        </button>
      </div>

      <div v-if="cartItems.length" class="row g-4 g-xl-5 align-items-start">
        <div class="col-lg-8">
          <div class="d-flex flex-column gap-4">
            <article
              v-for="item in cartItems"
              :key="item.id"
              class="card border-0 shadow-sm product-card overflow-hidden"
            >
              <div class="row g-0">
                <div class="col-md-3">
                  <div class="product-image-wrap">
                    <img :src="item.imageUrl" :alt="item.name" class="product-image" />
                  </div>
                </div>

                <div class="col-md-9">
                  <div class="card-body h-100 p-4 d-flex flex-column">
                    <div class="d-flex justify-content-between align-items-start gap-3 mb-2">
                      <div>
                        <h2 class="h2 fw-semibold mb-2">{{ item.name }}</h2>
                        <p class="text-secondary-emphasis fs-4 mb-0">{{ item.description }}</p>
                      </div>

                      <strong class="product-price">{{ formatCurrency(item.price) }}</strong>
                    </div>

                    <div class="border-top mt-4 pt-3 d-flex justify-content-between align-items-center gap-3 flex-wrap">
                      <div class="input-group quantity-group">
                        <button
                          type="button"
                          class="btn btn-outline-secondary"
                          @click="updateQuantity(item.id, item.quantity - 1)"
                        >
                          -
                        </button>
                        <span class="input-group-text justify-content-center quantity-value">
                          {{ item.quantity }}
                        </span>
                        <button
                          type="button"
                          class="btn btn-outline-secondary"
                          @click="updateQuantity(item.id, item.quantity + 1)"
                        >
                          +
                        </button>
                      </div>

                      <div class="d-flex align-items-center gap-4 flex-wrap ms-auto">
                        <span class="fw-semibold text-dark">
                          {{ formatCurrency(getItemSubtotal(item.id)) }}
                        </span>

                        <button
                          type="button"
                          class="btn btn-link cart-remove-btn text-decoration-none p-0"
                          @click="removeItem(item.id)"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            viewBox="0 0 16 16"
                            class="me-1"
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
                          Quitar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </div>

        <div class="col-lg-4">
          <aside class="card border-0 shadow-sm summary-card">
            <div class="card-body p-4 p-xl-5">
              <div class="d-flex align-items-center gap-2 mb-4">
                <span class="summary-icon" aria-hidden="true">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="22"
                    height="22"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path
                      d="M14 3h-3.5V1.5a1.5 1.5 0 0 0-3 0V3H4a1 1 0 0 0-1 1v9a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4a1 1 0 0 0-1-1zM8.5 1.5a.5.5 0 0 1 1 0V3h-1V1.5zM13 13a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V5h10v8z"
                    />
                    <path
                      d="M6 7.5A.5.5 0 0 1 6.5 7h3a.5.5 0 0 1 0 1h-3A.5.5 0 0 1 6 7.5zm0 2A.5.5 0 0 1 6.5 9h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5H8a.5.5 0 0 1 0 1H6.5a.5.5 0 0 1-.5-.5z"
                    />
                  </svg>
                </span>
                <h2 class="h1 fw-bold mb-0">Resumen de su orden</h2>
              </div>

              <div class="d-flex justify-content-between align-items-center mb-4">
                <span class="fs-3 text-dark">Subtotal</span>
                <span class="fs-3 text-dark">{{ formatCurrency(subtotal) }}</span>
              </div>

              <div class="d-flex justify-content-between align-items-center mb-4">
                <span class="fs-3 text-dark">Costo de envio</span>
                <span class="fs-3 text-dark">{{ formatCurrency(deliveryCost) }}</span>
              </div>

              <div class="border-top my-4"></div>

              <div class="text-end small text-secondary mb-2">Incluye impuestos</div>
              <div class="d-flex justify-content-between align-items-end mb-4">
                <span class="h2 mb-0">Total</span>
                <strong class="summary-total">{{ formatCurrency(total) }}</strong>
              </div>

              <button
                type="button"
                class="btn btn-primary w-100 cart-confirm-btn mb-4"
                @click="confirmOrder"
              >
                <span>Confirmar pedido</span>
                <span class="ms-2" aria-hidden="true">&rarr;</span>
              </button>

              <p class="text-muted text-center small mb-0 d-flex align-items-center justify-content-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                  aria-hidden="true"
                >
                  <path
                    d="M8 1a2 2 0 0 0-2 2v2H5.5A1.5 1.5 0 0 0 4 6.5v6A1.5 1.5 0 0 0 5.5 14h5A1.5 1.5 0 0 0 12 12.5v-6A1.5 1.5 0 0 0 10.5 5H10V3a2 2 0 0 0-2-2zM7 3a1 1 0 0 1 2 0v2H7V3zm-1.5 3h5a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-.5.5h-5a.5.5 0 0 1-.5-.5v-6a.5.5 0 0 1 .5-.5z"
                  />
                </svg>
                <span>Pago 100% seguro y encriptado</span>
              </p>
            </div>
          </aside>
        </div>
      </div>

      <div v-else class="card border-0 shadow-sm empty-cart-card">
        <div class="card-body text-center py-5">
          <h2 class="display-6 fw-bold mb-2">Tu carrito esta vacio</h2>
          <p class="text-secondary mb-4">
            Agrega productos para ver aqui el resumen de tu compra.
          </p>
          <router-link to="/" class="btn btn-primary cart-confirm-btn text-decoration-none">
            Seguir comprando
          </router-link>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useCartViewModel } from "@/ui/viewmodels/useCartViewModel";

const {
  cartItems,
  subtotal,
  deliveryCost,
  total,
  itemCount,
  updateQuantity,
  removeItem,
  clearCart,
  confirmOrder,
  formatCurrency,
  getItemSubtotal,
} = useCartViewModel();
</script>

<style scoped>
.cart-view {
  background-color: #fdf7f2;
  min-height: calc(100vh - 8rem);
}

.cart-header {
  border-bottom: 1px solid #ecd7c6;
}

.cart-clear-btn {
  color: #415a77;
  font-weight: 600;
}

.cart-clear-btn:hover,
.cart-clear-btn:focus,
.cart-remove-btn:hover,
.cart-remove-btn:focus {
  color: #f07f16;
}

.product-card,
.summary-card,
.empty-cart-card {
  border-radius: 1.5rem;
  background-color: #ffffff;
}

.product-image-wrap {
  height: 100%;
  min-height: 14rem;
  padding: 1.75rem 1rem 1.75rem 1.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.product-image {
  width: 100%;
  max-width: 10rem;
  aspect-ratio: 1;
  object-fit: cover;
  border-radius: 1rem;
  background-color: #111111;
}

.product-price,
.summary-total {
  font-size: clamp(2rem, 2.5vw, 2.35rem);
  line-height: 1;
}

.quantity-group {
  width: auto;
  border: 1px solid #e7c2a6;
  border-radius: 999px;
  overflow: hidden;
}

.quantity-group .btn,
.quantity-value {
  min-height: 3.15rem;
  min-width: 3rem;
  border: 0;
  background-color: #fffaf6;
  font-size: 1.25rem;
}

.quantity-group .btn:hover,
.quantity-group .btn:focus {
  background-color: #fdf0e4;
  color: #a75509;
}

.quantity-value {
  font-weight: 600;
  color: #111111;
}

.cart-remove-btn {
  color: #415a77;
  font-weight: 600;
}

.summary-card {
  position: sticky;
  top: 6.5rem;
}

.summary-icon {
  color: #a75509;
}

.cart-confirm-btn {
  min-height: 4.3rem;
  border: 0;
  border-radius: 1rem;
  background-color: #f07f16;
  box-shadow: 0 0.9rem 1.8rem rgba(240, 127, 22, 0.2);
  font-size: 1.3rem;
  font-weight: 600;
}

.cart-confirm-btn:hover,
.cart-confirm-btn:focus {
  background-color: #d96f10;
}

@media (max-width: 991.98px) {
  .summary-card {
    position: static;
    top: auto;
  }
}

@media (max-width: 767.98px) {
  .cart-view {
    min-height: auto;
  }

  .product-image-wrap {
    min-height: 11rem;
    padding: 1.5rem 1.5rem 0;
  }

  .product-image {
    max-width: 8.5rem;
  }
}
</style>
