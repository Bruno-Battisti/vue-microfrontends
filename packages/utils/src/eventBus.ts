import type { AppEvents } from '@vue-mf/types';

type Handler<T> = (payload: T) => void;

/**
 * Event bus tipado e minúsculo, compartilhado como dependência (não como estado global).
 * Shell e microfrontends se comunicam só por estes eventos — nunca importando stores uns dos outros.
 */
class EventBus {
  private handlers = new Map<keyof AppEvents, Set<Handler<unknown>>>();

  on<K extends keyof AppEvents>(event: K, handler: Handler<AppEvents[K]>): () => void {
    const set = this.handlers.get(event) ?? new Set();
    set.add(handler as Handler<unknown>);
    this.handlers.set(event, set);
    return () => this.off(event, handler);
  }

  off<K extends keyof AppEvents>(event: K, handler: Handler<AppEvents[K]>): void {
    this.handlers.get(event)?.delete(handler as Handler<unknown>);
  }

  emit<K extends keyof AppEvents>(event: K, payload: AppEvents[K]): void {
    this.handlers.get(event)?.forEach((handler) => handler(payload));
  }
}

export const eventBus = new EventBus();
