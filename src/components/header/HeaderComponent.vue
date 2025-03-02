<script setup lang="ts">
  import Navbar from './NavbarComponent.vue'
</script>

<template>
  <div class="header-border">
    <header>
      <h1>Dad debt tracker</h1>
      <Navbar />
    </header>
  </div>

</template>

<style scoped>
h1{
  text-wrap:nowrap;
}

.header-border {
  border-bottom: solid 1px var(--text-gray);
  position: relative;
  z-index:10;
}

header {
  margin:auto;
  width:60%;
  display: flex;
  justify-content: space-between;
  padding:1rem;
  min-width:800px;
  box-sizing:border-box;
  align-items: center;
  height:5rem;
  background:var(--background-color);
}

a{
  display:flex;
  align-items: center;
  text-decoration: none;
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

@media screen and (max-width: 800px) {
  header{
    width:100%;
    min-width:0;
  }
}


</style>
