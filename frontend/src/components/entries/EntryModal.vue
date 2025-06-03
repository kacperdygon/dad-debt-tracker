<script setup lang="ts">
import { type FetchResponse } from '@/lib/database';
import { addEntryDB, updateEntryDB } from '@/lib/entries/entries';
import type { IEntry } from 'shared';

import { computed, ref, watch } from 'vue';

interface AddEntryFormData {
  title: string;
  timestamp: string;
  balanceChange: 0;
}

const DEFAULT_FORM_DATA: AddEntryFormData = {
  title: '',
  timestamp: new Date().toLocaleDateString('en-CA'),
  balanceChange: 0,
};

let startingFormData: AddEntryFormData;

const shouldReload = ref<boolean | null>(null);

const formData = ref(DEFAULT_FORM_DATA);
const errorMessage = ref('');

const targetEntryId = ref<string | undefined>(undefined);

const onSubmit = async (event: Event) => {
  event.preventDefault();

  if (formData.value.balanceChange === 0) {
    errorMessage.value = `Balance change can't be 0`;
    return;
  }

  if (targetEntryId.value){

  }

  //validate if there are changes
  if (targetEntryId.value) {
    if (formData.value.title == startingFormData.title &&
    formData.value.timestamp == startingFormData.timestamp &&
    formData.value.balanceChange == startingFormData.balanceChange
  ) {
    errorMessage.value = 'No changes in entry';
    return;
  }
  }
  

  if (!dialogRef.value) throw new Error('Dialog ref not set');
  dialogRef.value.close();
  errorMessage.value = '';

  const newEntry: Omit<IEntry, '_id' | 'status'> = {
    title: formData.value.title,
    timestamp: new Date(formData.value.timestamp),
    balanceChange: formData.value.balanceChange,
  };

  let response: FetchResponse<{entry: IEntry}>;

  if (targetEntryId.value) {
    response = await updateEntryDB(targetEntryId.value, newEntry);
  } else {
    response = await addEntryDB(newEntry);
  }

  if (response.ok) shouldReload.value = true;
  else shouldReload.value = false;

};

const gridTemplate = computed(() => {
  return errorMessage.value.length === 0
    ? `
        'title title'
        'date balanceChange'
        'submit submit'
      `
    : `
        'title title'
        'date balanceChange'
        'errorMessage errorMessage'
        'submit submit'
      `;
});

const dialogRef = ref<HTMLDialogElement | null>(null);

async function openModal(entry?: IEntry): Promise<boolean> {
  return new Promise((resolve) => {
    if (!dialogRef.value) {
    throw new Error('Dialog ref not set');
    }

    if (entry) {
      formData.value = JSON.parse(JSON.stringify(entry));
      const jsDate = new Date(entry.timestamp);
      formData.value.timestamp = jsDate.toISOString().split('T')[0];
    } else {
      formData.value = JSON.parse(JSON.stringify(DEFAULT_FORM_DATA));
    }

    startingFormData = JSON.parse(JSON.stringify(formData.value));

    targetEntryId.value = entry?._id;
    dialogRef.value.showModal();

    watch(shouldReload, (newValue) => {
      if (newValue) {
        resolve(true);
      } else {
        resolve(false);
      }
      shouldReload.value = null;
    }, { once: true });

  });
}

const closeModal = () => {
  if (!dialogRef.value) {
    throw new Error('Dialog ref not set');
  }
  dialogRef.value.close();
  errorMessage.value = '';
};

defineExpose({
  openModal,
});
</script>

<template>
  <dialog ref="dialogRef">
    <header>
      <h3>{{ targetEntryId ? 'Edit entry' : 'Add new entry' }}</h3>
      <button @click="closeModal" class="button-plain">
        <i class="fa-solid fa-xmark"></i>
      </button>
    </header>
    <form @submit="onSubmit">
      <input type="text" v-model="formData.title" required placeholder="Title" />
      <input type="date" v-model="formData.timestamp" required placeholder="Date" />
      <input
        type="number"
        v-model="formData.balanceChange"
        step="0.01"
        required
        placeholder="Balance"
      />
      <span class="error-message" v-if="errorMessage.length != 0">{{ errorMessage }}</span>
      <input
        type="submit"
        :value="targetEntryId ? 'Edit entry' : 'Add entry'"
        class="button-main padding-075rem"
      />
    </form>
  </dialog>
</template>

<style scoped>
form {
  display: grid;
  grid-template-columns: calc(50% - 0.5rem) calc(50% - 0.5rem);
  grid-template-areas: v-bind(gridTemplate);
  gap: 1rem;
  box-sizing: border-box;
}

button {
  height: 1.5rem;
  width: 1.5rem;
  transform: translate(0.25rem, -0.25rem);
}

.error-message {
  color: red;
  text-align: center;
  margin: 0;
  grid-area: errorMessage;
  font-size: 0.875rem;
}

dialog {
  border: 1px solid var(--light-border);
  border-radius: 0.25rem;
  padding: 1.25rem;
  box-sizing: border-box;
  position: fixed;
  top: 50%;
  transform: translate(0, -100%);
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
