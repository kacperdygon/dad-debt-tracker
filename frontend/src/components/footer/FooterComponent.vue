<script setup lang="ts">

import { RouterLink, useRoute } from 'vue-router';

</script>

<template>

    <footer v-if="useRoute().path !== '/auth'">
        <h3>
            Dad debt tracker
        </h3>
        <ul>
        <li>
          <RouterLink to="/">Overview</RouterLink>
        </li>
        <li>
          <RouterLink to="/entries">Entries</RouterLink>
        </li>
        <li>
          <RouterLink to="/logs">Logs</RouterLink>
        </li>
        <li>
          <RouterLink to="/settings">Settings</RouterLink>
        </li>
      </ul>
    </footer>

</template>

<style scoped>
h3{
    margin:0;
}
footer{
    border-top: solid 1px var(--light-border);
    height:10rem;
    display:flex;
    align-items: center;
    justify-content:center;
    flex-direction: column;
    background-color: var(--foreground-color);
}
ul{
    list-style:none;
    padding:0;
    display:flex;
    justify-content: center;
    gap:2rem;
    margin-bottom:0;
}
</style>