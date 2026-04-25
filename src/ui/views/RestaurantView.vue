<template>
  <section class="restaurant-view py-4 py-lg-5">
    <div class="container">
      <header class="mb-4 mb-lg-5">
        <h1 class="display-5 fw-bold text-dark mb-2">Descubra Restaurantes</h1>
        <p class="lead text-secondary mb-0">Los mejores sabores, listos para usted.</p>
      </header>

      <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        <div v-for="restaurant in restaurants" :key="restaurant.id" class="col">
          <article class="card h-100 border-0 shadow-sm restaurant-card">
            <div class="position-relative px-3 pt-3">
              <img
                :src="restaurant.imageUrl"
                :alt="restaurant.name"
                class="card-img-top restaurant-image"
              />

              <div
                class="position-absolute top-0 end-0 mt-4 me-4 rounded-pill rating-badge d-flex align-items-center gap-1"
              >
                <span class="text-warning d-inline-flex" aria-hidden="true">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path
                      d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792a.513.513 0 0 1 .924 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"
                    />
                  </svg>
                </span>
                <span class="fw-semibold">{{ restaurant.rating.toFixed(1) }}</span>
              </div>
            </div>

            <div class="card-body d-flex flex-column p-4">
              <div class="mb-3">
                <h2 class="card-title restaurant-title fw-semibold mb-2">
                  {{ restaurant.name }}
                </h2>
                <p class="card-text text-secondary restaurant-description mb-0">
                  {{ restaurant.description }}
                </p>
              </div>

              <div class="mb-3">
                <span
                  v-for="tag in restaurant.tags"
                  :key="`${restaurant.id}-${tag}`"
                  class="badge rounded-pill restaurant-tag me-2 mb-2"
                >
                  {{ tag }}
                </span>
              </div>

              <div class="border-top pt-3 mt-auto">
                <div class="d-flex align-items-center justify-content-between mb-3">
                  <h3 class="h4 fw-semibold mb-0">Platos Destacados</h3>

                  <div class="d-inline-flex align-items-center gap-1 text-warning small">
                    <template
                      v-for="(star, index) in getRestaurantRating(restaurant.rating)"
                      :key="`${restaurant.id}-rating-${index}`"
                    >
                      <svg
                        v-if="star === 'full'"
                        xmlns="http://www.w3.org/2000/svg"
                        width="12"
                        height="12"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                        aria-hidden="true"
                      >
                        <path
                          d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792a.513.513 0 0 1 .924 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"
                        />
                      </svg>
                      <span v-else-if="star === 'half'" class="half-star" aria-hidden="true">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="12"
                          height="12"
                          fill="currentColor"
                          viewBox="0 0 16 16"
                        >
                          <path
                            d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792a.513.513 0 0 1 .924 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"
                          />
                        </svg>
                      </span>
                      <svg
                        v-else
                        xmlns="http://www.w3.org/2000/svg"
                        width="12"
                        height="12"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                        class="opacity-25"
                        aria-hidden="true"
                      >
                        <path
                          d="M2.866 14.85c-.078.444.36.791.746.593L8 13.187l4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.523-3.356c.33-.314.16-.888-.282-.95l-4.899-.696L8.465.792a.513.513 0 0 0-.93 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.282.95l3.523 3.356-.83 4.73z"
                        />
                      </svg>
                    </template>
                  </div>
                </div>

                <div class="d-flex flex-column gap-3">
                  <div
                    v-for="dish in restaurant.featuredDishes"
                    :key="dish.id"
                    class="d-flex justify-content-between align-items-center gap-3 dish-row"
                  >
                    <div class="d-flex align-items-center gap-3 min-w-0">
                      <img
                        :src="dish.imageUrl"
                        :alt="dish.name"
                        class="dish-image flex-shrink-0"
                      />

                      <div class="min-w-0">
                        <h4 class="h4 fw-semibold mb-1 text-truncate">{{ dish.name }}</h4>
                        <p class="mb-0 dish-price">{{ formatCurrency(dish.price) }}</p>
                      </div>
                    </div>

                    <button
                      type="button"
                      class="btn btn-sm restaurant-add-btn rounded-circle flex-shrink-0"
                      :disabled="isLoading"
                      @click="addToCart(restaurant.id, dish.id)"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                        aria-hidden="true"
                      >
                        <path
                          d="M8 4a.5.5 0 0 1 .5.5V7.5H11.5a.5.5 0 0 1 0 1H8.5v3a.5.5 0 0 1-1 0v-3H4.5a.5.5 0 0 1 0-1H7.5v-3A.5.5 0 0 1 8 4z"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useRestaurantViewModel } from "@/ui/viewmodels/useRestaurantViewModel";

const { restaurants, isLoading, addToCart, getRestaurantRating, formatCurrency } =
  useRestaurantViewModel();
</script>

<style scoped>
.restaurant-view {
  background-color: #fdf7f2;
  min-height: calc(100vh - 8rem);
}

.restaurant-card {
  border-radius: 1.5rem;
  background-color: #ffffff;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.restaurant-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 1.15rem 2.2rem rgba(33, 24, 18, 0.12) !important;
}

.restaurant-image {
  height: 13.5rem;
  object-fit: cover;
  border-radius: 1rem;
}

.rating-badge {
  padding: 0.45rem 0.8rem;
  background-color: rgba(255, 255, 255, 0.95);
  color: #111111;
}

.restaurant-title {
  font-size: clamp(1.7rem, 2vw, 2.2rem);
}

.restaurant-description {
  font-size: 1rem;
  line-height: 1.55;
}

.restaurant-tag {
  background-color: #fff0e2;
  color: #f07f16;
  font-size: 0.95rem;
  font-weight: 600;
  padding: 0.55rem 0.9rem;
}

.dish-row {
  min-width: 0;
}

.dish-image {
  width: 3.9rem;
  height: 3.9rem;
  border-radius: 0.8rem;
  object-fit: cover;
}

.dish-price {
  color: #b55308;
  font-weight: 600;
}

.restaurant-add-btn {
  width: 2.5rem;
  height: 2.5rem;
  border: 0;
  background-color: #f07f16;
  color: #ffffff;
  box-shadow: 0 0.55rem 1.1rem rgba(240, 127, 22, 0.2);
}

.restaurant-add-btn:hover,
.restaurant-add-btn:focus {
  background-color: #d96f10;
  color: #ffffff;
}

.half-star {
  position: relative;
  display: inline-flex;
}

.half-star::after {
  content: "";
  position: absolute;
  inset: 0 0 0 50%;
  background-color: rgba(255, 255, 255, 0.85);
}

@media (max-width: 767.98px) {
  .restaurant-view {
    min-height: auto;
  }

  .restaurant-image {
    height: 12rem;
  }
}
</style>
