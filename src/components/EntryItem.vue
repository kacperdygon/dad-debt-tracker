<script setup lang="ts">

import type {Entry} from "@/main.ts";

const props = defineProps<{
  entry: Entry;
}>()

</script>

<template>
  <div>
    <div>{{props.entry.title}}</div>
    <p class="date-text">{{props.entry.date}}</p>
    <p class="balance">{{props.entry.balanceChange}} zł</p>
  </div>
</template>

<style scoped>

</style>