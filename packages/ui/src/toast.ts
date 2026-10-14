import { reactive } from 'vue';

export interface ToastMessage {
  id: number;
  text: string;
  kind: 'info' | 'success' | 'error';
}

const state = reactive<{ items: ToastMessage[] }>({ items: [] });
let counter = 0;

export function pushToast(text: string, kind: ToastMessage['kind'] = 'info'): void {
  const id = ++counter;
  state.items.push({ id, text, kind });
  setTimeout(() => {
    const index = state.items.findIndex((item) => item.id === id);
    if (index !== -1) state.items.splice(index, 1);
  }, 4000);
}

export function useToastState() {
  return state;
}
