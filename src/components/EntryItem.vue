<script setup lang="ts">

import type {Entry} from "@/main.ts";
import {EllipsisVerticalIcon} from "@heroicons/vue/24/solid"
import {computed} from 'vue'

const props = defineProps<{
  entry: Entry;
}>()

const balanceTextColor = computed(() => {
  return props.entry.balanceChange > 0 ? 'var(--income)' : 'var(--expense)';
})

const balanceText = computed(() => {
  return props.entry.balanceChange < 0 ? props.entry.balanceChange.toFixed(2) : "+" + props.entry.balanceChange.toFixed(2)
})

</script>

<template>
    <div class="entry-item">
    <div class="header">
      <h6 class="title">
        {{props.entry.title}}
      </h6>
      <button>
        <EllipsisVerticalIcon class="icon" :stroke-width="3"/>
      </button>
    </div>
    <p class="date-text">{{props.entry.date}}</p>
    <h6 class="balance">{{balanceText}} zł</h6>
  </div>
  
</template>

<style scoped>

  *{
    margin:0;
    font-size:1rem;
  }

  .icon{
    height:1.5rem;
  }

  .header{
    display:flex;
    align-items:end;
    justify-content:space-between
  }

  .entry-item{
    background-color: var(--foreground-color);
    padding:1rem;
    box-shadow: 0 4px 4px  rgba(0, 0, 0, 0.3);
    border-radius:0.25rem;
  }

  h6{
    font-size:1.5rem;
    font-weight:unset;
  }

  p{
    font-size:1.25rem;
  }

  button{
    all:unset;
    cursor:pointer;
  }

  .title{
    margin-bottom:0.25rem;
    color: var(--text-color);
  }

  .date-text{
    margin-bottom:0.75rem;
    color: var(--secondary-text-color)
  }

  .balance{
    color: v-bind(balanceTextColor)
  }

</style>