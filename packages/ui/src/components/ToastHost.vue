<script setup lang="ts">
import { useToastState } from '../toast';

const state = useToastState();
</script>

<template>
  <div class="toast-host">
    <TransitionGroup name="toast">
      <div v-for="toast in state.items" :key="toast.id" class="toast" :class="`toast--${toast.kind}`">
        {{ toast.text }}
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.toast-host {
  position: fixed;
  top: var(--mf-space-5);
  right: var(--mf-space-5);
  display: flex;
  flex-direction: column;
  gap: var(--mf-space-2);
  z-index: 200;
}

.toast {
  padding: var(--mf-space-3) var(--mf-space-4);
  border-radius: var(--mf-radius-md);
  background: var(--mf-color-surface);
  border: 1px solid var(--mf-color-border);
  color: var(--mf-color-text);
  font-size: 0.875rem;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
  min-width: 220px;
}

.toast--success {
  border-color: var(--mf-color-success);
}

.toast--error {
  border-color: var(--mf-color-danger);
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.2s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(12px);
}
</style>
