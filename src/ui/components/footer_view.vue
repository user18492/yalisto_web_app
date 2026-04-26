<template>
  <footer class="footer-shell border-top">
    <div class="container-fluid px-3 px-md-4 px-lg-5 py-4">
      <div class="row gy-3 align-items-center">
        <div class="col-12 col-lg">
          <p class="mb-0 text-muted footer-copy text-center text-lg-start">
            &copy; {{ currentYear }} {{ companyName }}. All rights reserved.
          </p>
        </div>

        <div class="col-12 col-lg-auto">
          <nav
            class="d-flex flex-column flex-sm-row justify-content-center justify-content-lg-end align-items-center gap-3 gap-sm-4 footer-links"
            aria-label="Footer navigation"
          >
            <router-link
              v-for="link in footerLinks"
              :key="link.path"
              :to="link.path"
              class="footer-link"
            >
              {{ link.name }}
            </router-link>
          </nav>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { useFooterViewModel } from "@/ui/viewmodels/useFooterViewModel";

const { footerLinks, currentYear, companyName } = useFooterViewModel();
</script>

<style scoped>
.footer-shell {
  background-color: #f5f5f5;
  border-top-color: #e0e3e7 !important;
}

.footer-copy {
  font-size: 0.98rem;
}

.footer-link {
  color: #5f6f86;
  text-decoration: none;
  transition: color 0.2s ease;
}

.footer-link:hover,
.footer-link:focus {
  color: #f07f16;
}

@media (max-width: 575.98px) {
  .footer-copy,
  .footer-link {
    font-size: 0.95rem;
  }
}
</style>
