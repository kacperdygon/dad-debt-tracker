<script setup lang="ts">
import type { Entry } from '@/lib/entries.ts';

import { ref } from 'vue';
import { useEntryStore } from '@/store/entries.ts';

const DEFAULT_FORM_DATA: Entry = {
  title: '',
  date: new Date().toLocaleDateString('en-CA'),
  balanceChange: 0,
};

const formData = ref<Entry>(DEFAULT_FORM_DATA);

let isEditing: boolean;
let targetEntry: Entry;

const entryStore = useEntryStore();

const onSubmit = (event: Event) => {
  event.preventDefault();
  if (!dialogRef.value) throw new Error('Dialog ref not set');
  dialogRef.value.close();

  const newEntry: Entry = {
    title: formData.value.title,
    date: formData.value.date,
    balanceChange: formData.value.balanceChange,
  };

  if (isEditing) {
    entryStore.editEntry(targetEntry, newEntry);
  } else {
    entryStore.addEntry(newEntry);
  }
};

const dialogRef = ref<HTMLDialogElement | null>(null);

const openModal = (entry?: Entry) => {
  if (!dialogRef.value) {
    throw new Error('Dialog ref not set');
  }

  if (entry) {
    isEditing = true;
    targetEntry = entry;
    Object.assign(formData.value, entry);
  } else {
    isEditing = false;
    formData.value = JSON.parse(JSON.stringify(DEFAULT_FORM_DATA));
  }

  dialogRef.value.showModal();

  console.log(formData.value.date);
};

const closeModal = () => {
  if (!dialogRef.value) {
    throw new Error('Dialog ref not set');
  }
  dialogRef.value.close();
};

defineExpose({
  openModal,
});
</script>

<template>
  <dialog ref="dialogRef">
    <header>
      <h3>{{ isEditing ? 'Edit entry' : 'Add new entry' }}</h3>
      <button @click="closeModal" class="button-plain">
        <i class="fa-solid fa-xmark"></i>
      </button>
    </header>
    <form @submit="onSubmit">
      <input type="text" v-model="formData.title" required placeholder="Title" />
      <input type="date" v-model="formData.date" required placeholder="Date" />
      <input
        type="number"
        v-model="formData.balanceChange"
        step="0.01"
        required
        placeholder="Balance"
      />

      <input type="submit" value="Add entry" class="button-main" />
    </form>
  </dialog>
</template>

<style scoped>
form {
  display: grid;
  grid-template-columns: calc(50% - 0.5rem) calc(50% - 0.5rem);
  grid-template-areas:
    'title title'
    'date balanceChange'
    'submit submit';
  gap: 1rem;
  box-sizing: border-box;
}

button {
  height: 1.5rem;
  width: 1.5rem;
  transform: translate(0.25rem, -0.25rem);
}

dialog {
  border: 0;
  border-radius: 0.25rem;
  padding: 1.25rem;
  box-sizing: border-box;
  position: fixed;
  top: 50%;
  transform: translate(0, -75%);
  border: none;
}

h3 {
  margin: 0;
}

header {
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: 1rem;
}

input {
  box-sizing: border-box;
}

input:not([type='submit']) {
  padding: 0.5rem;
  border-radius: 0.25rem;
  height: fit-content;
  border: 1px solid var(--text-gray);
  outline: none;
}

input[type='text'] {
  box-sizing: border-box;
  grid-area: title;
}

input[type='date'] {
  grid-area: date;
}

input[type='number'] {
  grid-area: balanceChange;
}

input[type='submit'] {
  font-size: 1rem;
  grid-area: submit;
  width: fit-content;
  position: relative;
  left: 50%;
  transform: translate(-50%);
}
</style>
