<script setup lang="ts">
import { EllipsisVerticalIcon } from '@heroicons/vue/24/solid';
import { computed } from 'vue';
import type { Entry } from '@/lib/entries.ts';

const props = defineProps<{
  entry: Entry;
}>();

const balanceTextColor = computed(() => {
  return props.entry.balanceChange > 0 ? 'var(--income)' : 'var(--expense)';
});

const balanceText = computed(() => {
  return props.entry.balanceChange < 0
    ? props.entry.balanceChange.toFixed(2)
    : '+' + props.entry.balanceChange.toFixed(2);
});

const formattedDate = computed(() => {
  return new Date(props.entry.date).toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
});
</script>

<template>
  <div class="entry-item">
    <div class="header">
      <h6 class="title">
        {{ props.entry.title }}
      </h6>
      <button class="button-plain">
        <i class="fas fa-ellipsis-v"></i>
      </button>
    </div>
    <p class="date-text">{{ formattedDate }}</p>
    <h6 class="balance">{{ balanceText }} zł</h6>
  </div>
</template>

<style scoped>
* {
  margin: 0;
  font-size: 1rem;
}

button {
  position: relative;
  height: 1rem;
  width: 1rem;
  top: 0.125rem;
}

@media (max-width: 600px) {
  button {
    height: 2rem;
    width: 2rem;
    top: -0.375rem;
    right: -0.5rem;
  }
}

i {
  font-size: 1.125rem;
}

.header {
  display: flex;
  align-items: start;
  justify-content: space-between;
}

.entry-item {
  background-color: var(--foreground-color);
  padding: 1.25rem;
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.2);
  border-radius: 0.25rem;
}

h6 {
  font-size: 1.25rem;
  font-weight: 300;
}

p {
  font-size: 1rem;
}

.title {
  margin-bottom: 0.25rem;
  color: var(--text-normal);
}

.date-text {
  margin-bottom: 0.75rem;
  color: var(--secondary-text-color);
}

.balance {
  color: v-bind(balanceTextColor);
}
</style>
