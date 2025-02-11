<script setup lang="ts">

import EntryItem from "@/components/EntryItem.vue";
import type {Entry} from "@/main.ts";
import EntryModal from "@/components/EntryModal.vue";
import {ref} from "vue";

const props = defineProps<{
  lastEntries: Entry[],
}>();

const entryModalRef = ref<typeof EntryModal | null>(null);

const handleAddEntry = () => {
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
      <EntryItem v-for="entry in props.lastEntries" :key="entry.date.getTime" :entry="entry" />
    </ul>
    <button @click="handleAddEntry">Add entry</button>
  </section>

  <Teleport to="body">
    <EntryModal ref="entryModalRef" />
  </Teleport>
</template>

<style scoped>
  ul{
    padding-left:0;
  }

  ul > * {
    margin: 0 0 1rem;
  }

</style>