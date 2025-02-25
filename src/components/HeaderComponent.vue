<script setup lang="ts"></script>

<template>
  <header>
    <button class="button-plain">
      <i class="fas fa-gear"></i>
    </button>
  </header>
</template>

<style scoped>
header {
  height: 3rem;
  display: flex;
  justify-content: end;
}

i {
  font-size: 2rem;
}

@media (max-width: 600px) {
  button {
    height: 3rem;
    width: 3rem;
  }
}
</style>
