<template>
  <div id="app">
    <navbar_view />

    <main class="app-content">
      <router-view />
    </main>

    <footer_view />
  </div>
</template>

<script setup lang="ts">
import navbar_view from "@/ui/components/navbar_view.vue";
import footer_view from "@/ui/components/footer_view.vue";
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
