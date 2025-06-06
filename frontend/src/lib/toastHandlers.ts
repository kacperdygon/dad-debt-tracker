import { ToastType, useToastStore } from '@/store/toast';

export function handleErrorWithToast(error: unknown) {
  const toastStore = useToastStore();
  const message = error instanceof Error ? error.message : String(error);
  toastStore.addToast({ message, duration: 3000 });
}

export function addErrorToast(message: string){
  const toastStore = useToastStore();
  toastStore.addToast({ message, duration: 3000 });
}

export function addSuccessToast(message: string){
  const toastStore = useToastStore();
  toastStore.addToast({ message, duration: 3000, type: ToastType.SUCCESS });
}