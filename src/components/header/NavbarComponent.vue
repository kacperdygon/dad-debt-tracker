<script setup lang="ts">

import { computed, ref } from 'vue';

const displayUl = ref(false);

const ulTop = computed(() => {
  return displayUl.value ? '5rem' : '-15rem';
})

function toggleNavbar() {
  displayUl.value = !displayUl.value;
}

const isScreenWide = computed(() => {
  return window.innerWidth > 600;
})

</script>

<template>
  <nav>
    <Teleport to="#app" :disabled="isScreenWide">

        <ul :class="{'slide-down': displayUl, 'slide-up': !displayUl}">
          <li>
            <RouterLink to="/">Overview</RouterLink>
          </li>
          <li>
            <RouterLink to="/entries">Entries</RouterLink>
          </li>
          <li>
            <RouterLink to="/settings">Settings</RouterLink>
          </li>
        </ul>

    </Teleport>

    <button class="button-plain" @click="toggleNavbar">
      <i class="fa-solid fa-bars"></i>
    </button>
  </nav>

</template>

<style scoped>
  nav{
    display:flex;
    width:100%;
    justify-content: end;
  }

  ul{
    display:flex;
    list-style:none;
    box-sizing:border-box;
    overflow: auto;
    padding:0;
    gap: 2rem;
    margin:0;
  }

  li{
    box-sizing:border-box;
  }

  a{
    display:block;
  }

  i{
    width:1.5rem;
    font-size:1.5rem;
    text-align:center;
  }

  button{
    display:none;
    box-sizing: border-box;

  }

  @media screen and (max-width: 600px) {
    button{
      display: block;
      padding:0.5rem;
    }
    ul{

      left: 0;
      top:v-bind(ulTop);
      padding: 0.5rem 0 0.5rem 0;
      display:block;
      position:fixed;
      background-color: var(--background-color);
      z-index: 3;
      width:100%;
      box-shadow:0 0.125rem 0.25rem rgba(0, 0, 0, 0.2);
    }
    li{
      padding:1rem;
    }
  }

  @keyframes slide-down {
    0%   {top:-15rem;}
    100% {top:5rem;}
  }
  .slide-down {
    animation: slide-down .4s;
  }

  @keyframes slide-up {
    0%   {top:5rem;}
    100% {top:-15rem;}
  }
  .slide-up {
    animation: slide-up .4s;
  }


</style>