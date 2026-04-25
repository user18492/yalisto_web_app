<template>
  <section class="home-view py-4 py-lg-5">
    <div class="container">
      <header class="text-center py-4 py-lg-5">
        <h1 class="display-3 fw-bold text-dark home-title mb-3">&#191;Que desea pedir hoy?</h1>
        <p class="lead text-secondary mx-auto home-subtitle mb-0">
          Encuentre sus restaurantes favoritos y reciba su comida en minutos.
        </p>
      </header>

      <div class="row justify-content-center mb-5">
        <div class="col-12 col-lg-8">
          <div class="position-relative">
            <span class="search-icon" aria-hidden="true">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path
                  d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.834h-.017zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"
                />
              </svg>
            </span>

            <input
              v-model="searchQuery"
              type="search"
              class="form-control form-control-lg home-search-input"
              placeholder="Buscar productos o restaurantes..."
              aria-label="Buscar productos o restaurantes"
            />

            <button
              v-if="searchQuery || selectedCategory"
              type="button"
              class="btn btn-link position-absolute end-0 top-50 translate-middle-y text-decoration-none home-clear-btn"
              @click="clearSearch"
            >
              Limpiar
            </button>
          </div>
        </div>
      </div>

      <section class="mb-5">
        <div class="d-flex justify-content-between align-items-center gap-3 mb-3">
          <h2 class="h1 mb-0">Explorar Categorias</h2>
          <button type="button" class="btn btn-link home-link-btn text-decoration-none p-0" @click="clearSearch">
            Ver todos
          </button>
        </div>

        <div class="row row-cols-2 row-cols-md-4 row-cols-lg-4 g-3">
          <div v-for="category in filteredCategories" :key="category.id" class="col">
            <button
              type="button"
              class="card h-100 border-0 shadow-sm text-center w-100 category-card"
              :class="{ 'category-card-active': selectedCategory === category.slug }"
              @click="setSelectedCategory(category.slug)"
            >
              <div class="card-body d-flex flex-column align-items-center justify-content-center py-4">
                <div class="category-icon rounded-circle d-flex align-items-center justify-content-center mb-3">
                  <svg
                    v-if="getCategoryIcon(category.icon) === 'drink'"
                    xmlns="http://www.w3.org/2000/svg"
                    width="28"
                    height="28"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                    aria-hidden="true"
                  >
                    <path
                      d="M3 2a1 1 0 0 1 1-1h8v1H4v8a3 3 0 0 0 3 3h1v1H7a4 4 0 0 1-4-4V2zm9.5 0H15a1 1 0 0 1 1 1v1a3 3 0 0 1-3 3h-.5V2zm1.5 2V3h-1v3h.5A2 2 0 0 0 14 4z"
                    />
                    <path
                      d="M11 1H5v5.382a2 2 0 0 0 .553 1.382L7 9.382V15h2V9.382l1.447-1.618A2 2 0 0 0 11 6.382V1z"
                    />
                  </svg>
                  <svg
                    v-else-if="getCategoryIcon(category.icon) === 'dessert'"
                    xmlns="http://www.w3.org/2000/svg"
                    width="28"
                    height="28"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                    aria-hidden="true"
                  >
                    <path
                      d="M4.5 8.5A2.5 2.5 0 0 1 7 6h2a2.5 2.5 0 0 1 2.5 2.5V9h-7v-.5zM3 10h10v1H3v-1zm1 2h8v1H4v-1zM8 1a2 2 0 0 1 2 2c0 .73-.39 1.367-.975 1.714A2 2 0 0 0 7.95 3.5c0-.63.29-1.19.744-1.556A1.99 1.99 0 0 0 8 1z"
                    />
                  </svg>
                  <svg
                    v-else-if="getCategoryIcon(category.icon) === 'burger'"
                    xmlns="http://www.w3.org/2000/svg"
                    width="28"
                    height="28"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                    aria-hidden="true"
                  >
                    <path
                      d="M6.69 1.997h2.62c1.54 0 2.994.734 3.876 1.971.29.405.47.894.47 1.407 0 .345-.277.625-.619.625H2.963a.622.622 0 0 1-.619-.625c0-.513.18-1.002.47-1.407A4.75 4.75 0 0 1 6.69 1.997zM1.5 7A.5.5 0 0 1 2 6.5h12a.5.5 0 0 1 .5.5 2.5 2.5 0 0 1-2.5 2.5h-8A2.5 2.5 0 0 1 1.5 7zm1 4h11a1.5 1.5 0 0 1 0 3h-11a1.5 1.5 0 0 1 0-3z"
                    />
                  </svg>
                  <svg
                    v-else
                    xmlns="http://www.w3.org/2000/svg"
                    width="28"
                    height="28"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                    aria-hidden="true"
                  >
                    <path
                      d="M8 1C5.243 1 3 3.243 3 6c0 3.703 2.392 6.419 4.623 8.17a.6.6 0 0 0 .754 0C10.608 12.419 13 9.703 13 6c0-2.757-2.243-5-5-5zm1.094 2.786c.281-.28.737-.28 1.018 0 .28.281.28.737 0 1.018-.488.487-1.27.926-1.977 1.188-.353.13-.719-.236-.589-.589.262-.707.701-1.489 1.188-1.977z"
                    />
                  </svg>
                </div>

                <h3 class="h4 mb-0 fw-semibold">{{ category.name }}</h3>
              </div>
            </button>
          </div>
        </div>
      </section>

      <section>
        <div class="d-flex justify-content-between align-items-center gap-3 mb-3">
          <h2 class="h1 mb-0">Restaurantes Destacados</h2>
          <button type="button" class="btn btn-link home-link-btn text-decoration-none p-0" @click="clearSearch">
            Ver todos
          </button>
        </div>

        <div v-if="filteredRestaurants.length" class="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
          <div v-for="restaurant in filteredRestaurants" :key="restaurant.id" class="col">
            <article class="card h-100 border-0 shadow-sm restaurant-card overflow-hidden">
              <img
                :src="restaurant.imageUrl"
                :alt="restaurant.name"
                class="restaurant-image"
              />

              <div class="card-body d-flex flex-column">
                <h3 class="card-title restaurant-title mb-2">{{ restaurant.name }}</h3>
                <p class="card-text text-secondary mb-3">{{ restaurant.description }}</p>

                <div class="d-flex align-items-center flex-wrap gap-2 mt-auto text-secondary-emphasis">
                  <div class="d-inline-flex align-items-center gap-1 text-warning">
                    <template v-for="(star, index) in getRatingStars(restaurant.rating)" :key="`${restaurant.id}-${index}`">
                      <svg
                        v-if="star === 'full'"
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
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
                      <svg
                        v-else
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                        class="text-warning opacity-25"
                        aria-hidden="true"
                      >
                        <path
                          d="M2.866 14.85c-.078.444.36.791.746.593L8 13.187l4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.523-3.356c.33-.314.16-.888-.282-.95l-4.899-.696L8.465.792a.513.513 0 0 0-.93 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.282.95l3.523 3.356-.83 4.73z"
                        />
                      </svg>
                    </template>
                  </div>

                  <span class="fw-semibold text-dark">{{ restaurant.rating.toFixed(1) }}</span>
                  <span class="text-muted">&bull;</span>
                  <span>{{ restaurant.deliveryTime }}</span>
                </div>
              </div>
            </article>
          </div>
        </div>

        <div v-else-if="!hasResults" class="card border-0 shadow-sm empty-state-card">
          <div class="card-body text-center py-5">
            <h3 class="h3 fw-semibold mb-2">No se encontraron resultados</h3>
            <p class="text-secondary mb-4">
              Pruebe con otra busqueda o quite el filtro de categoria.
            </p>
            <button type="button" class="btn btn-primary home-reset-btn" @click="clearSearch">
              Limpiar filtros
            </button>
          </div>
        </div>
      </section>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useHomeViewModel } from "@/ui/viewmodels/useHomeViewModel";

const {
  searchQuery,
  filteredCategories,
  filteredRestaurants,
  selectedCategory,
  hasResults,
  setSelectedCategory,
  clearSearch,
  getCategoryIcon,
  getRatingStars,
} = useHomeViewModel();
</script>

<style scoped>
.home-view {
  background-color: #fdf7f2;
  min-height: calc(100vh - 8rem);
}

.home-title {
  letter-spacing: -0.03em;
}

.home-subtitle {
  max-width: 48rem;
}

.home-search-input {
  min-height: 4.8rem;
  padding-left: 3.8rem;
  padding-right: 5.5rem;
  border-color: #e7c5a8;
  border-radius: 1.2rem;
  box-shadow: 0 0.75rem 1.5rem rgba(15, 23, 42, 0.04);
}

.home-search-input:focus {
  border-color: #f07f16;
  box-shadow: 0 0 0 0.2rem rgba(240, 127, 22, 0.12);
}

.search-icon {
  position: absolute;
  top: 50%;
  left: 1.35rem;
  z-index: 2;
  transform: translateY(-50%);
  color: #5a3b2a;
}

.home-clear-btn,
.home-link-btn {
  color: #f07f16;
  font-weight: 600;
}

.home-clear-btn:hover,
.home-link-btn:hover,
.home-clear-btn:focus,
.home-link-btn:focus {
  color: #d96f10;
}

.category-card {
  border-radius: 1.4rem;
  background-color: #ffffff;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    border-color 0.2s ease;
}

.category-card:hover,
.category-card:focus {
  transform: translateY(-2px);
  box-shadow: 0 1rem 2rem rgba(33, 24, 18, 0.08) !important;
}

.category-card-active {
  box-shadow: 0 1rem 2rem rgba(240, 127, 22, 0.16) !important;
  outline: 2px solid rgba(240, 127, 22, 0.32);
}

.category-icon {
  width: 4.4rem;
  height: 4.4rem;
  background-color: #fde9dc;
  color: #a75509;
}

.restaurant-card {
  border-radius: 1.35rem;
  background-color: #ffffff;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.restaurant-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 1.2rem 2.2rem rgba(33, 24, 18, 0.12) !important;
}

.restaurant-image {
  width: 100%;
  height: 13rem;
  object-fit: cover;
}

.restaurant-title {
  font-size: clamp(1.4rem, 2vw, 1.75rem);
}

.half-star {
  position: relative;
  display: inline-flex;
  color: #f0ad4e;
}

.half-star::after {
  content: "";
  position: absolute;
  inset: 0 0 0 50%;
  background-color: rgba(253, 247, 242, 0.9);
}

.empty-state-card {
  border-radius: 1.4rem;
  background-color: #ffffff;
}

.home-reset-btn {
  min-height: 3rem;
  padding-inline: 1.4rem;
  border: 0;
  border-radius: 0.95rem;
  background-color: #f07f16;
}

.home-reset-btn:hover,
.home-reset-btn:focus {
  background-color: #d96f10;
}

@media (max-width: 767.98px) {
  .home-view {
    min-height: auto;
  }

  .home-search-input {
    min-height: 4.1rem;
    padding-right: 4.8rem;
  }
}
</style>
