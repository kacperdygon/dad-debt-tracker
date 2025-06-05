<script setup lang="ts">
import EntryItem from '@/components/entries/EntryItem.vue';
import { type IEntry } from 'shared'
import SmallEntryItem from '@/components/entries/SmallEntryItem.vue'
import { ref } from 'vue';

const props = defineProps<{
  entries: IEntry[],
  type: 'full' | 'partial',
}>();

const entryListElementsRef = ref<(InstanceType<typeof EntryItem> | null)[]>([]);

function jumpTo(position: number){
  if (props.entries.length == 0 || props.type === 'partial') return;
  entryListElementsRef.value[position]?.scrollIntoView();
}

function highlightChild(position: number){
  if (props.entries.length == 0 || props.type === 'partial') return;
  entryListElementsRef.value[position]?.animateGlow();
}

defineExpose({
  jumpTo,
  highlightChild
})

</script>

<template>
  <div>
    <span v-if="!entries.length" class="entry-placeholder">No entries to show here</span>
    <Suspense>
      <ul class="base-ul flex-ul">
        <li v-for="(entry, index) in props.entries" :key="entry._id" >
          <EntryItem 
          v-if="props.type == 'full'"
          :entry="entry" 
          :ref="(el) => entryListElementsRef[index] = el as InstanceType<typeof EntryItem>"
          />
          <SmallEntryItem 
          v-else
          :entry="entry"
          />
        </li>
      </ul>
    </Suspense>
  </div>
</template>

<style scoped>
div{
  width:100%;
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
