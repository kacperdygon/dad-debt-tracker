<script setup lang="ts">
import EntryItem from '@/components/entries/EntryItem.vue';
import { type IEntry } from '@/lib/entries';
import SmallEntryItem from '@/components/entries/SmallEntryItem.vue'
import { ref } from 'vue';

const props = defineProps<{
  entries: IEntry[],
  type: 'full' | 'partial',
}>();

const entryListUlRef = ref<HTMLDivElement | null>(null);

function jumpTo(position: number){
  if (props.entries.length == 0) return;
  if (!entryListUlRef.value){
    throw new Error('Entry list ul ref value not set');
  }
  const liElements = entryListUlRef.value.querySelectorAll('li');
  liElements[position].scrollIntoView();
}

defineExpose({
  jumpTo
})

</script>

<template>
  <div>
    <span v-if="!entries.length" class="entry-placeholder">No entries to show here</span>
    <Suspense>
      <ul v-if="props.type == 'full'" ref="entryListUlRef">
        <li v-for="entry in props.entries" :key="entry._id" >
          <EntryItem :entry="entry" />
        </li>
      </ul>
      <ul v-else ref="entryListUlRef">
        <li v-for="entry in props.entries" :key="entry._id" >
          <SmallEntryItem :entry="entry" />
        </li>
      </ul>
    </Suspense>
  </div>
</template>

<style scoped>
div{
  width:100%;
}

ul {
  margin:0;
  padding-left: 0;
  display:flex;
  flex-direction:column;
  gap:1rem;
  list-style: none;
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

li > *{
  box-sizing: border-box;
}

</style>
