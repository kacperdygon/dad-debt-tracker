<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

const displayUl = ref(false);

const ulTop = computed(() => {
  return displayUl.value ? '5rem' : '-15rem';
});

function toggleNavbar() {
  displayUl.value = !displayUl.value;
}

function closeNavbar() {
  displayUl.value = false;
}

const isScreenWide = ref(window.innerWidth > 600);
const updateScreenWidth = () => {
  isScreenWide.value = window.innerWidth > 600;
};

onMounted(() => window.addEventListener('resize', updateScreenWidth));
onUnmounted(() => window.removeEventListener('resize', updateScreenWidth));

const route = useRoute();
watch(route, () => {
  closeNavbar(); // Close dropdown when route changes
});
</script>

<template>
  <nav>
    <Teleport to="#app" :disabled="isScreenWide">
      <ul :class="{ 'slide-up': !displayUl, 'slide-down': displayUl }">
        <li>
          <RouterLink to="/">Overview</RouterLink>
        </li>
        <li>
          <RouterLink to="/entries">Entries</RouterLink>
        </li>
<!--        <li>-->
<!--          <RouterLink to="/logs">Logs</RouterLink>-->
<!--        </li>-->
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
nav {
  display: flex;
  width: 100%;
  justify-content: end;
}

ul {
  display: flex;
  list-style: none;
  box-sizing: border-box;
  overflow: auto;
  padding: 0;
  gap: 2rem;
  margin: 0;
}

li {
  box-sizing: border-box;
}

a {
  display: block;
}

i {
  width: 1.5rem;
  font-size: 1.5rem;
  text-align: center;
}

button {
  display: none;
  box-sizing: border-box;
}

@media screen and (max-width: 600px) {
  button {
    display: block;
    padding: 0.5rem;
  }
  ul {
    left: 0;
    top: v-bind(ulTop);
    padding: 0.5rem 0 0.5rem 0;
    display: block;
    position: fixed;
    background-color: var(--foreground-color);
    z-index: 3;
    width: 100%;
    box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.2);
  }
  li {
    padding: 1rem;
  }
}

@keyframes slide-down {
  0% {
    top: -15rem;
  }
  100% {
    top: 5rem;
  }
}
.slide-down {
  animation: slide-down 0.4s;
}

@keyframes slide-up {
  0% {
    top: 5rem;
  }
  100% {
    top: -15rem;
  }
}
.slide-up {
  animation: slide-up 0.4s;
}
</style>
