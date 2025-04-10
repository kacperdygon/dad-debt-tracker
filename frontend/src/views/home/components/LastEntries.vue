<script setup lang="ts">
import { useEntryStore } from '@/store/entries';
import EntryList from '@/components/entries/EntryList.vue';
import { storeToRefs } from 'pinia';
import { computed, onMounted } from 'vue';

const entriesStore = useEntryStore();
const lastEntries = storeToRefs(entriesStore).lastEntries;
const unconfirmedEntryCount = storeToRefs(entriesStore).unconfirmedEntryCount;

const last3Entries = computed(() => lastEntries.value.slice(0, 3))


onMounted(() => {
  entriesStore.fetchUnconfirmedEntryCount();
});
</script>

<template>
  <section>
    <h3>Last entries <span v-if="unconfirmedEntryCount !== 0" class="font-1rem orange-color">{{ unconfirmedEntryCount }} not confirmed</span></h3>
    <EntryList :entries="last3Entries" type="partial" />
  </section>
</template>

<style scoped>
ul {
  padding-left: 0;
}

ul > * {
  margin: 0 0 1rem;
}

button {
  align-self: center;
  position: relative;
  left: 50%;
  transform: translate(-50%, 0%);
}
</style>
