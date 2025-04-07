<script setup lang="ts">
import EntryItem from '@/components/entries/EntryItem.vue';
import type { IEntry } from '@/lib/entries.ts';
import SmallEntryItem from '@/components/entries/SmallEntryItem.vue'

const props = defineProps<{
  entries: IEntry[],
  type: 'full' | 'partial',
}>()

</script>

<template>
  <div>
    <span v-if="!entries.length" class="entry-placeholder">No entries to show here</span>
    <Suspense>
      <ul v-if="props.type == 'full'">
        <EntryItem v-for="entry in props.entries" :key="entry._id" :entry="entry" />
      </ul>
      <ul v-else>
        <SmallEntryItem v-for="entry in props.entries" :key="entry._id" :entry="entry"></SmallEntryItem>
      </ul>
    </Suspense>
  </div>
</template>

<style scoped>
ul {
  padding-left: 0;
}

ul > * {
  margin: 0 0 1rem;
}

.entry-placeholder {
  width:100%;
  text-align: center;
  height:4rem;
  display:flex;
  align-items: center;
  justify-content: center;
  color:var(--text-gray)
}
</style>
