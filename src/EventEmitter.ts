import { Listeners } from './model';

export default class EventEmitter {
  #listeners: Listeners = {};

  on(event: string, fn: Function) {
    if (!Array.isArray(this.#listeners[event])) {
      this.#listeners[event] = new Set();
    }

    this.#listeners[event].add(fn);
  }

  off(event: string, fn: Function) {
    this.#listeners[event]?.delete(fn);
  }

  emit(event: string, ...args: any[]) {
    if (this.#listeners[event]) {
      for (const listeners of this.#listeners[event]) {
        listeners(...args);
      }
    }
  }
}