<script setup lang="ts">
import { computed, inject, onMounted, onUnmounted, ref } from 'vue';
import type { Entry } from '@/lib/entries.ts';
import { useEntryStore } from '@/store/entries.ts';
import EntryModal from '@/components/EntryModal.vue';

const entryStore = useEntryStore();
const entryModalRef = inject('entryModalRef') as typeof EntryModal;
const dropdownListRef = ref<HTMLElement | null>(null);
const dropdownButtonRef = ref<HTMLElement | null>(null);
const showDropdown = ref(false);

const props = defineProps<{
  entry: Entry;
}>();

function handleDelete() {
  toggleDropdown();
  entryStore.deleteEntry(props.entry);
}

function handleEdit() {
  toggleDropdown();
  if (!entryModalRef) {
    throw new Error('Entry modal ref is null');
  }
  entryModalRef.value.openModal(props.entry);
}

function toggleDropdown() {
  showDropdown.value = !showDropdown.value;
}

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

const closeDropdown = (event: Event) => {
  if (
    dropdownListRef.value &&
    dropdownButtonRef.value &&
    !dropdownListRef.value.contains(event.target as Node) &&
    !dropdownButtonRef.value.contains(event.target as Node) &&
    showDropdown.value
  ) {
    showDropdown.value = false;
  }
};

onMounted(() => document.addEventListener('click', closeDropdown));
onUnmounted(() => document.removeEventListener('click', closeDropdown));
</script>

<template>
  <div class="entry-item">
    <div class="header">
      <h6 class="title">
        {{ props.entry.title }}
      </h6>
      <div class="dropdown">
        <button class="button-plain" @click.prevent="toggleDropdown" ref="dropdownButtonRef">
          <i class="fas fa-ellipsis-v"></i>
        </button>
        <ul class="dropdown-list" ref="dropdownListRef" v-if="showDropdown">
          <li @click="handleEdit">Edit</li>
          <li @click="handleDelete" style="color: var(--expense)">Delete</li>
        </ul>
      </div>
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
  box-shadow: 0 0.25rem 0.25rem rgba(0, 0, 0, 0.2);
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

.dropdown {
  position: relative;
  height: 1rem;
  width: 1rem;
  top: 0.125rem;
}

button {
  position: absolute;
  height: 1rem;
  width: 1rem;
}

.dropdown-list {
  list-style: none;
  background-color: var(--background-color);
  position: absolute;
  z-index: 1;
  border-radius: 0.25rem;
  right: 0;
  top: 140%;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.2);
  padding: 0.5rem 0 0.5rem 0;
}

.dropdown-list li {
  padding: 0.5rem 1rem 0.5rem 1rem;
  cursor: pointer;
}

.dropdown-list li:hover {
  background-color: #eaeaea;
}

@media screen and (max-width: 600px) {
  button {
    height: 2rem;
    width: 2rem;
    top: -0.375rem;
    right: -0.5rem;
  }
}
</style>
