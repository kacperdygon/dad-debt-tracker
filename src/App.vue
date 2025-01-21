<script setup lang="ts">

  import type {Entry} from "@/main.ts";
  import {computed, provide, ref} from "vue";
  import HeroComponent from "@/components/HeroComponent.vue";
  import HeaderComponent from "@/components/HeaderComponent.vue"
  import LastEntries from "@/components/LastEntries.vue";

  const storedEntries = localStorage.getItem("entries");
  let parsedStoredEntries;

  if (storedEntries) {
    parsedStoredEntries = JSON.parse(storedEntries);
  } else {
    parsedStoredEntries = [];
  }

  const entries = ref<Entry[]>(parsedStoredEntries);

  const totalDebt = computed(() => {
    let totalDebt = 0;
    for (const entry of entries.value) {
      totalDebt += entry.balanceChange;
    }
    return totalDebt;
  });

  const addEntry = (newEntry: Entry) => {
    if (!newEntry) {
      return;
    }
    if (!(newEntry.date && newEntry.balanceChange && newEntry.title)) {
      return;
    }
    entries.value.push(newEntry);
    saveEntries();
  }

  provide('addEntry', addEntry);

  const editEntry = (targetEntry: Entry, newEntry: Entry) => {
    if (!newEntry) {
      return;
    }
    if (!(newEntry.date && newEntry.balanceChange && newEntry.title)) {
      return;
    }
    const matchingIndex = entries.value.indexOf(targetEntry);
    entries.value[matchingIndex] = newEntry;
    saveEntries();
  }

  provide('editEntry', editEntry);

  const deleteEntry = (targetEntry: Entry) => {
    const matchingIndex = entries.value.indexOf(targetEntry);
    entries.value.splice(matchingIndex, 1);
    saveEntries();
  }

  provide('deleteEntry', deleteEntry);

  const saveEntries = () => {
    localStorage.setItem("entries", JSON.stringify(entries.value));
  }

</script>

<template>
  <HeaderComponent/>
  <HeroComponent :totalDebt="totalDebt"/>
  <LastEntries :last-entries="entries"/>
</template>

<style scoped>

</style>
