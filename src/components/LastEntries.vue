<script setup lang="ts">

import EntryItem from "@/components/EntryItem.vue";
import EntryModal from "@/components/EntryModal.vue";
import {ref} from "vue";
import {useEntryStore} from "@/store/entries.ts";
import {storeToRefs} from "pinia";

const entryModalRef = ref<typeof EntryModal | null>(null);

const entriesStore = useEntryStore();
const { lastEntries } = storeToRefs(entriesStore);

const handleOpenModal = () => {
  if (!entryModalRef.value) {
    throw new Error("Entry modal ref is null");
  }
  entryModalRef.value.openModal();
}

</script>

<template>
  <section>
    <h3>
      Last entries
    </h3>
    <ul>
      <EntryItem v-for="entry in lastEntries" :key="entry.date.getTime" :entry="entry" />
    </ul>
    <button @click="handleOpenModal">Add entry</button>
  </section>

  <Teleport to="body">
    <EntryModal ref="entryModalRef" />
  </Teleport>
</template>

<style scoped>

</style>