<script setup lang="ts">
import { computed, inject, onMounted, onUnmounted, type Ref, ref } from 'vue';
import { changeEntryStatusDB, deleteEntryDB } from '@/lib/entries/entries';
import { EntryStatus, type IEntry } from 'shared';
import EntryModal from '@/components/entries/EntryModal.vue';
import { storeToRefs } from 'pinia';
import { useAuthStore } from '@/store/auth';
import { useRouter } from 'vue-router';

const entryModalRef = inject<Ref<InstanceType<typeof EntryModal>> | null>('entryModalRef');
const dropdownListRef = ref<HTMLElement | null>(null);
const dropdownButtonRef = ref<HTMLElement | null>(null);
const showDropdown = ref(false);

const authStore = useAuthStore();
const { userRole }  = storeToRefs(authStore);

const props = defineProps<{
  entry: IEntry;
}>();

defineExpose({
  animateGlow,
  scrollIntoView
})

const reloadEntries = inject<() => void>('reloadEntries')


async function handleDelete() {
  toggleDropdown();
  const response = await deleteEntryDB(props.entry._id);
  if (response.ok) {
    handleReloadEntries();
  } else {
    // handle error
  }
}

function handleReloadEntries(){
  if (!reloadEntries) throw new Error('Reload entries not provided');
  reloadEntries();
}

async function handleEdit() {
  toggleDropdown();
  if (!entryModalRef) {
    throw new Error('Entry modal ref is null');
  }
  const shouldReload = await entryModalRef.value.openModal(props.entry);
  if (shouldReload) {
    handleReloadEntries();
  }
}

const router = useRouter();
async function handleReroute(){
  router.push(`/logs/${props.entry._id}`)
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
  return new Date(props.entry.timestamp).toLocaleDateString('en-US', {
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

async function changeEntryStatus(newStatus: EntryStatus) {
  const response = await changeEntryStatusDB(props.entry._id, newStatus);
  if (response.ok) {
    handleReloadEntries();
  } else {
    // handle error
  }
}

const showGlow = ref(false);
function animateGlow(){
  showGlow.value = true;
  setTimeout(() => {
    showGlow.value = false;
  }, 1000);
}

const rootElement = ref<HTMLElement | null>(null);
function scrollIntoView(){
  rootElement.value?.scrollIntoView();
}

onMounted(() => {
  document.addEventListener('click', closeDropdown);
  authStore.reloadRole();
});
onUnmounted(() => document.removeEventListener('click', closeDropdown));
</script>

<template>
  <div class="entry-item" :class="{'glow': showGlow}" ref="rootElement">
    <div class="flex">
      <h6 class="title">
        {{ props.entry.title }}
        <span 
              v-if="props.entry.status && props.entry.status != 'confirmed'"
              class="font-1rem"
              :class="props.entry.status == 'pending' ? 'orange-color' : 'red-color'">
          {{props.entry.status == 'pending' || props.entry.status ? 'Not confirmed' : 'Rejected'}}
        </span>
      </h6>

      <div class="dropdown">
        <button class="button-plain dropdown-button" @click.prevent="toggleDropdown" ref="dropdownButtonRef">
          <i class="fas fa-ellipsis-v"></i>
        </button>
        <ul class="dropdown-list" ref="dropdownListRef" v-if="showDropdown">
          <li @click="handleEdit">Edit</li>
          <li @click="handleReroute">Show history</li>
          <li v-if="props.entry.status == 'rejected' && userRole == 'dad'" @click="changeEntryStatus(EntryStatus.PENDING)" class="pending-color">Change to pending</li>
          <li @click="handleDelete" style="color: var(--expense)">Delete</li>
        </ul>
      </div>
    </div>
    <span class="date-text inline-block secondary-text-color">{{ formattedDate }}</span>
    <div class="flex">
      <h6 class="balance">{{ balanceText }} zł</h6>
      <div v-if="props.entry.status == 'pending' && userRole == 'dad'"  class="confirmation-buttons">
        <button @click="changeEntryStatus(EntryStatus.REJECTED)" class="red-color outlined-button">
          Reject
        </button>
        <button @click="changeEntryStatus(EntryStatus.CONFIRMED)" class="green-color outlined-button">
          Confirm
        </button>
      </div>
    </div>

  </div>
</template>

<style scoped>

i {
  font-size: 1.125rem;
}

.flex {
  display: flex;
  align-items: start;
  justify-content: space-between;
}

.entry-item {
  background-color: var(--foreground-color);
  padding: 1.25rem;
  box-shadow: 0 0.25rem 0.25rem rgba(0, 0, 0, 0.2);
  border-radius: 0.25rem;
  box-sizing: border-box;
  transition: box-shadow 0.5s ease;
}

h6 {
  font-size: 1.25rem;
  font-weight: 300;
}

.title {
  margin-bottom: 0.25rem;
  color: var(--text-normal);
}

.date-text {
  padding-bottom: 0.75rem;
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

.dropdown-button {
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
  text-wrap:nowrap;
}

.dropdown-list li {
  padding: 0.5rem 1rem 0.5rem 1rem;
  cursor: pointer;
}

.dropdown-list li:hover {
  background-color: #eaeaea;
}

@media screen and (max-width: 600px) {
  .dropdown-button {
    height: 2rem;
    width: 2rem;
    top: -0.375rem;
    right: -0.5rem;
  }
}

.confirmation-buttons{
  display:flex;
  gap:0.5rem;
}

.entry-item.glow {
  box-shadow: 0 0 15px rgba(79, 195, 247, 1);
}
</style>
