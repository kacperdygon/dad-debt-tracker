<script setup lang="ts">

</script>

<template>
  <nav>
    <ul>
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
    <button class="button-plain">
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
  }

  li{
    box-sizing:border-box;
  }

  a{
    display:block;
  }

  button{
    display:none;
    margin: 1rem 0 1rem 0;
    box-sizing: border-box;
    justify-self:end;
  }

  @media screen and (max-width: 600px) {
    button{
      display: block;
    }
    ul{
      position:fixed;
      display:none;
    }
  }
</style>