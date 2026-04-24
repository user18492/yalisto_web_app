<template>
  <div id="app">
    <NavbarView />

    <main class="app-content">
      <router-view />
    </main>

    <FooterView />
  </div>
</template>

<script setup lang="ts">
import NavbarView from "@/ui/components/NavbarView.vue";
import FooterView from "@/ui/components/FooterView.vue";
</script>

<style scoped>
#app {
  display: flex;
  min-height: 100vh;
  flex-direction: column;
}

/* Contenido dinámico crece */
.app-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

/* Empuja el footer hacia abajo si falta contenido */
</style>
