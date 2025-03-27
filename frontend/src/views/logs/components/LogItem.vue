<script setup lang="ts">

import type { IActionResponse } from 'shared/dist';

const props = defineProps<{
  action: IActionResponse;
}>()

</script>

<template>

<div class="log-item">
  {{props.action.authId}}

</div>

</template>

<style scoped>
.log-item{
  background-color: var(--foreground-color);
  padding: 1.25rem;
  box-shadow: 0 0.25rem 0.25rem rgba(0, 0, 0, 0.2);
  border-radius: 0.25rem;
}

</style>