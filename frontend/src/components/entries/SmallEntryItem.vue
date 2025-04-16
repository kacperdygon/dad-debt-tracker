<script setup lang="ts">
import type { IEntry } from 'shared';
import { computed } from 'vue';

const props = defineProps<{
    entry: IEntry;
}>();


const formattedDate = computed(() => {
  return new Date(props.entry.timestamp).toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
});

</script>


<template>
    <div class="entry-item">
      <header>
        <h6 class="title">
          {{ props.entry.title }}
          <span v-if="props.entry.status != 'confirmed'"
              class="font-1rem"
              :class="props.entry.status == 'pending' ? 'orange-color' : 'red-color'">
          {{props.entry.status == 'pending' ? 'Not confirmed' : 'Rejected'}}
        </span>
        </h6>
        
      </header>
      <div class="flex">
        <span class="date-text secondary-text-color">{{ formattedDate }}</span>
        <span class="balance-text font-125rem" :class="{ 
            'red-color': entry.balanceChange < 0,
            'green-color': entry.balanceChange > 0
            }">
            {{ entry.balanceChange > 0 ? `+${entry.balanceChange.toFixed(2)}` : entry.balanceChange.toFixed(2)}}
        </span>
      </div>
    </div>
</template>

<style>

.flex{
    display:flex;
    justify-content: space-between;
}

.title span{
    text-wrap:nowrap;
}


</style>