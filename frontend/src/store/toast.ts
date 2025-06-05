import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export enum ToastType {
  ERROR = 'error'
}

// base toast
interface Toast {
  message: string;
  duration: number;
  type: ToastType;
}

// toast with optional parameters for default options (message still needed)
export interface ToastOptions extends Partial<Omit<Toast, 'message'>> {
  message: string;
}

// toast stored in store
export interface StoredToast extends Toast {
  id: number;
}

export const useToastStore = defineStore('toast', () => {

  const _toastList = ref<StoredToast[]>([]); // should stay private
  const toastList = computed(() => _toastList.value); // getter

  let nextToastId = 0

  function addToast(newToast: ToastOptions) {
    const nextId = getNextId();
    const toast: Toast = {
      duration: 4000,
      type: ToastType.ERROR,
      ...newToast,
    };

    _toastList.value.push({...toast, id: nextId});

    setTimeout(() => {
      removeToast(nextId);
    }, toast.duration);
  }

  function removeToast(id: number) {
    _toastList.value = _toastList.value.filter((toast) => toast.id !== id);
  }

  function getNextId(){
    return nextToastId++;
  }

  return {addToast, toastList, removeToast};
});
