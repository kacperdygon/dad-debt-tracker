<script setup lang="ts">
import { type StoredToast, ToastType, useToastStore } from '@/store/toast.ts';
import { computed } from 'vue';

const props = defineProps<{
    toast: StoredToast
  }>()

const backgroundColor = computed(() => {
  switch(props.toast.type){
    case ToastType.ERROR:
      return 'var(--error)';
    case ToastType.SUCCESS:
      return 'var(--success)';
    default:
      return 'transparent'
  }
})

function removeThisToast() {
  useToastStore().removeToast(props.toast.id);
}
</script>

<template>
  <div class="toast-item">
    <div class="top-section">
      <p class="margin-0">
        {{props.toast.message}}
      </p>
      <button class="button-plain" @click="removeThisToast">
        <i class="fa-solid fa-xmark"/>
      </button>
    </div>
    <div class="progress-bar-wrapper">
      <div :style="{animationDuration: toast.duration + 'ms'}" class="progress-bar"></div>
    </div>
  </div>
</template>

<style scoped>

.toast-item {
  width:20rem;
  background-color: v-bind(backgroundColor);
  border-radius: 0.5rem;
  position:relative;
  overflow: hidden;
  pointer-events: auto;
}

.top-section {
  display:flex;
  justify-content:space-between;
  align-items: start;
  padding: 1.5rem;
}

p, i{
  color: var(--background-color);
  font-size:1rem;
  line-height: 1rem;
}

.progress-bar-wrapper{
  overflow:hidden;
}

.progress-bar{
  position:absolute;
  width:0;
  background-color:rgba(255, 255, 255, 0.6);
  height:5px;
  top:calc(100% - 5px);
  animation-name: shrink;
  animation-timing-function: linear;
}

@keyframes shrink {
  from { width: 100%; }
  to { width: 0; }
}

</style>