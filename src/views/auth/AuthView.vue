<script setup lang="ts">
import { ref } from 'vue';
import { signIn } from '@/lib/auth.ts';
import { useRouter } from 'vue-router';

const input = ref('');
const showErrorMessage = ref(false);
const router = useRouter();

async function handleSubmit() {
  const result = await signIn(input.value);
  if (result == 200) {
    await router.push('/');
  } else {
    showErrorMessage.value = true;
  }
}
</script>

<template>
  <main>
    <form @submit.prevent="handleSubmit">
      <h2>Enter PIN to proceed</h2>
      <input
        type="password"
        name="pin"
        pattern="[0-9]{4}"
        maxlength="4"
        placeholder="Enter PIN"
        inputmode="numeric"
        v-model="input"
        required
      />
      <span v-show="showErrorMessage">Wrong PIN</span>
      <input type="submit" class="button-main" value="Log in" />
    </form>
  </main>
</template>

<style scoped>
form {
  border: 1px solid var(--light-border);
  border-radius: 0.25rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.5rem 2rem 1.5rem 2rem;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.1);
  background-color: white;
}

main {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
}

span {
  font-weight: 500;
  color: red;
}

input[type='password'] {
  margin-bottom: 0.5rem;
  padding: 1rem;
  font-size: 1.25rem;
  border-radius: 0.25rem;
  border: 1px solid var(--light-border);
}

input[type='submit'] {
  font-size: 1.25rem;
  margin-top: 0.5rem;
}

h2 {
  margin-top: 0;
}

/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type='number'] {
  -moz-appearance: textfield;
  appearance: textfield;
}
</style>
