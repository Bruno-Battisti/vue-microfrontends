<script setup lang="ts">
import AppHeader from './AppHeader.vue';
import AppSidebar from './AppSidebar.vue';
</script>

<template>
  <div class="layout">
    <AppSidebar />
    <div class="layout__main">
      <AppHeader />
      <main class="layout__content">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<style scoped>
.layout {
  display: flex;
  min-height: 100vh;
}

.layout__main {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.layout__content {
  flex: 1;
  padding: var(--mf-space-5);
  overflow: auto;
}
</style>
