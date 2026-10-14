<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { AppButton } from '@vue-mf/ui';
import type { Customer, SaleItem } from '@vue-mf/types';
import { calculateSaleTotal } from '@vue-mf/types';

const props = defineProps<{ open: boolean; customers: Customer[] }>();
const emit = defineEmits<{ submit: [string, SaleItem[]]; cancel: [] }>();

const customerId = ref('');
const items = reactive<SaleItem[]>([{ productName: '', quantity: 1, unitPrice: 0 }]);
const error = ref<string | null>(null);

const total = computed(() => calculateSaleTotal(items));

function addItem() {
  items.push({ productName: '', quantity: 1, unitPrice: 0 });
}

function removeItem(index: number) {
  if (items.length > 1) items.splice(index, 1);
}

function reset() {
  customerId.value = '';
  items.splice(0, items.length, { productName: '', quantity: 1, unitPrice: 0 });
  error.value = null;
}

function handleSubmit() {
  error.value = null;
  if (!customerId.value) {
    error.value = 'Selecione um cliente.';
    return;
  }
  const valid = items.every((item) => item.productName.trim() && item.quantity > 0 && item.unitPrice >= 0);
  if (!valid) {
    error.value = 'Preencha produto, quantidade (>0) e valor para todos os itens.';
    return;
  }
  emit(
    'submit',
    customerId.value,
    items.map((item) => ({ ...item })),
  );
  reset();
}

function handleCancel() {
  reset();
  emit('cancel');
}
</script>

<template>
  <div v-if="open" class="form-overlay" @click.self="handleCancel">
    <form class="form-card" @submit.prevent="handleSubmit">
      <h2 class="form-card__title">Nova venda</h2>

      <label class="form-field">
        <span>Cliente</span>
        <select v-model="customerId">
          <option value="" disabled>Selecione um cliente</option>
          <option v-for="customer in props.customers" :key="customer.id" :value="customer.id">
            {{ customer.name }}
          </option>
        </select>
      </label>

      <div class="form-items">
        <div v-for="(item, index) in items" :key="index" class="form-items__row">
          <input v-model="item.productName" type="text" placeholder="Produto" />
          <input v-model.number="item.quantity" type="number" min="1" placeholder="Qtd." />
          <input v-model.number="item.unitPrice" type="number" min="0" step="0.01" placeholder="Valor unit." />
          <button
            type="button"
            class="form-items__remove"
            :disabled="items.length === 1"
            @click="removeItem(index)"
          >
            ✕
          </button>
        </div>
        <AppButton variant="ghost" type="button" @click="addItem">+ Adicionar item</AppButton>
      </div>

      <p class="form-total">Total: {{ total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) }}</p>

      <p v-if="error" class="form-error">{{ error }}</p>

      <div class="form-card__actions">
        <AppButton variant="ghost" type="button" @click="handleCancel">Cancelar</AppButton>
        <AppButton type="submit">Registrar venda</AppButton>
      </div>
    </form>
  </div>
</template>

<style scoped>
.form-overlay {
  position: fixed;
  inset: 0;
  background: rgba(2, 6, 23, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.form-card {
  width: min(480px, 92vw);
  max-height: 85vh;
  overflow-y: auto;
  background: var(--mf-color-surface);
  border: 1px solid var(--mf-color-border);
  border-radius: var(--mf-radius-lg);
  padding: var(--mf-space-5);
  display: flex;
  flex-direction: column;
  gap: var(--mf-space-3);
}

.form-card__title {
  margin: 0;
  font-size: 1.1rem;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: var(--mf-space-1);
  font-size: 0.85rem;
}

.form-field select,
.form-items__row input {
  width: 100%;
  min-width: 0;
  padding: var(--mf-space-2) var(--mf-space-3);
  border-radius: var(--mf-radius-sm);
  border: 1px solid var(--mf-color-border);
  background: var(--mf-color-surface-alt);
  color: var(--mf-color-text);
  font-size: 0.9rem;
}

.form-items {
  display: flex;
  flex-direction: column;
  gap: var(--mf-space-2);
}

.form-items__row {
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(0, 1fr) minmax(0, 1fr) 28px;
  align-items: center;
  gap: var(--mf-space-2);
}

.form-items__remove {
  border: 1px solid var(--mf-color-border);
  background: transparent;
  color: var(--mf-color-text-muted);
  border-radius: var(--mf-radius-sm);
  cursor: pointer;
}

.form-items__remove:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.form-total {
  margin: 0;
  font-weight: 600;
  text-align: right;
}

.form-error {
  color: var(--mf-color-danger);
  font-size: 0.85rem;
  margin: 0;
}

.form-card__actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--mf-space-2);
}
</style>
