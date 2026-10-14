<script setup lang="ts">
import { remoteModules } from '../remotes/registry';
</script>

<template>
  <aside class="sidebar">
    <div class="sidebar__brand">VMF</div>
    <nav class="sidebar__nav">
      <RouterLink
        v-for="mod in remoteModules"
        :key="mod.name"
        :to="mod.routeBase"
        class="sidebar__link"
        active-class="sidebar__link--active"
      >
        <span class="sidebar__icon">{{ mod.icon }}</span>
        <span>{{ mod.navLabel }}</span>
      </RouterLink>
    </nav>
  </aside>
</template>

<style scoped>
.sidebar {
  width: 220px;
  flex-shrink: 0;
  background: var(--mf-color-surface);
  border-right: 1px solid var(--mf-color-border);
  display: flex;
  flex-direction: column;
  padding: var(--mf-space-4) var(--mf-space-3);
}

.sidebar__brand {
  font-weight: 700;
  letter-spacing: 0.08em;
  color: var(--mf-color-primary);
  padding: var(--mf-space-2) var(--mf-space-2) var(--mf-space-5);
}

.sidebar__nav {
  display: flex;
  flex-direction: column;
  gap: var(--mf-space-1);
}

.sidebar__link {
  display: flex;
  align-items: center;
  gap: var(--mf-space-2);
  padding: var(--mf-space-2) var(--mf-space-3);
  border-radius: var(--mf-radius-sm);
  color: var(--mf-color-text-muted);
  text-decoration: none;
  font-size: 0.9rem;
}

.sidebar__link:hover {
  background: var(--mf-color-surface-alt);
  color: var(--mf-color-text);
}

.sidebar__link--active {
  background: var(--mf-color-surface-alt);
  color: var(--mf-color-text);
  font-weight: 600;
}

.sidebar__icon {
  font-size: 1rem;
}
</style>
