import { useToastStore } from '@/store/toast';

export function handleError(error: unknown) {
  const toastStore = useToastStore();
  const message = error instanceof Error ? error.message : String(error);
  toastStore.addToast({ message, duration: 5000 });
}

export function addErrorToast(message: string){
  const toastStore = useToastStore();
  toastStore.addToast({ message, duration: 5000 });
}