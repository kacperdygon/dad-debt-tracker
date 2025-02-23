<script setup lang="ts">
import type { Entry } from '@/lib/entries.ts'

import { ref } from 'vue'
import { useEntryStore } from '@/store/entries.ts'

const DEFAULT_FORM_DATA: Entry = {
  title: '',
  date: new Date().toLocaleDateString('en-CA'),
  balanceChange: 0,
}

const formData = ref<Entry>(DEFAULT_FORM_DATA)

let isEditing: boolean
let targetEntry: Entry

const entryStore = useEntryStore()

const onSubmit = (event: Event) => {
  event.preventDefault()
  if (!dialogRef.value) throw new Error('Dialog ref not set')
  dialogRef.value.close()

  const newEntry: Entry = {
    title: formData.value.title,
    date: formData.value.date,
    balanceChange: formData.value.balanceChange,
  }

  if (isEditing) {
    entryStore.editEntry(targetEntry, newEntry)
  } else {
    entryStore.addEntry(newEntry)
  }
}

const dialogRef = ref<HTMLDialogElement | null>(null)

const openModal = (entry?: Entry) => {
  if (!dialogRef.value) {
    throw new Error('Dialog ref not set')
  }

  if (entry) {
    isEditing = true
    targetEntry = entry
    Object.assign(formData.value, entry)
  } else {
    isEditing = false
    formData.value = JSON.parse(JSON.stringify(DEFAULT_FORM_DATA))
  }

  dialogRef.value.showModal()

  console.log(formData.value.date)
}

const closeModal = () => {
  if (!dialogRef.value) {
    throw new Error('Dialog ref not set')
  }
  dialogRef.value.close()
}

defineExpose({
  openModal,
})
</script>

<template>
  <dialog ref="dialogRef">
    <div>
      <h3>{{ isEditing ? 'Edit entry' : 'Add new entry' }}</h3>
      <button @click="closeModal"></button>
    </div>
    <form @submit="onSubmit">
      <div>
        <input type="text" v-model="formData.title" required />
        <input type="date" v-model="formData.date" required />
        <input type="number" v-model="formData.balanceChange" step="0.01" required />
      </div>
      <input type="submit" />
    </form>
  </dialog>
</template>

<style scoped></style>
