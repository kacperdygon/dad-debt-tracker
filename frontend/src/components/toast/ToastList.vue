<script setup lang="ts">

import { useToastStore } from '@/store/toast.ts';
import { storeToRefs } from 'pinia';
import ToastItem from '@/components/toast/ToastItem.vue';

const toastStore = useToastStore();
const { toastList }  = storeToRefs(toastStore);

</script>

<template>
  <div class="toast-list">
    <TransitionGroup tag="ul" name="list" class="base-ul ul-margin">
      <li v-for="toast in toastList" :key="toast.id">
        <ToastItem :toast="toast" />
      </li>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.toast-list {
  position:fixed;
  top:calc(4rem + 1rem);
  right:0;
  padding-right: 1rem;
  overflow-x:hidden;
  width:20rem;
  height:calc(100vh - (4rem + 1rem));
  pointer-events: none;
}

ul{
  position:relative;
}

.list-move, /* apply transition to moving elements */
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
.list-enter-to,
.list-leave-from {
  opacity: 1;
  transform: translateX(0);
}

.list-leave-active {
  position:absolute;
}


</style>