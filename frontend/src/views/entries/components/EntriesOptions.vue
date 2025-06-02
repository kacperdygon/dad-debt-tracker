<script setup lang="ts">
import { EntryStatus, SortBy } from 'shared';
import { type EntryFetchOptions } from 'shared';
import { onMounted, ref } from 'vue';

const formData = defineModel<EntryFetchOptions>({ required: true });

function handleCheckboxChange(event: Event, category: string[]){
    const target = event.target as HTMLInputElement;
    if (target.checked) {
        const index = category.indexOf(target.value);
        if (index !== -1) throw new Error('Shouldnt happen');
        category.push(target.value);
    } else {
        const index = category.indexOf(target.value);
        if (index === -1) throw new Error('Shouldnt happen');
        category.splice(index, 1);
    }
}

const showOptions = ref<boolean>(false);
const isScreenWide = ref<boolean>(window.innerWidth > 800);
const updateIsScreenWide = () => {
  isScreenWide.value = window.innerWidth > 800;
}

function handleRejectedChange(){
  if (formData.value.filter.status.includes(EntryStatus.REJECTED)) {
    formData.value.filter.status.length = 0;
    formData.value.filter.status.push(EntryStatus.CONFIRMED, EntryStatus.PENDING);
  } else {
    formData.value.filter.status.length = 0;
    formData.value.filter.status.push(EntryStatus.REJECTED);
  }
}

function handleDateChange(event: Event, editedField: keyof EntryFetchOptions['time']){
  const target = event.target as HTMLInputElement;
  formData.value.time[editedField] = new Date(target.value);
}

onMounted(() => {
  window.addEventListener('resize', updateIsScreenWide);
})

</script>

<template>

    <div class="options">
      <header>
        <h2>Options</h2>
        <button class="button-plain" v-if="!isScreenWide" @click="showOptions = !showOptions">
          <i 
          :class="{ 'rotate-up': showOptions, 'rotate-down': !showOptions }"
          class="fa-solid fa-chevron-down"></i>
        </button>
      </header>
      <section v-show="showOptions || isScreenWide">
<label>
            <input type="checkbox" @change="handleRejectedChange" value="rejected">
            Show rejected
        </label>

        <section>
            <h3>Sort by</h3>
            <div class="option-group">
                <label>
                    <input 
                      type="radio" 
                      name="sortBy" 
                      :value="SortBy.DATE_DESC" 
                      v-model="formData.sortBy" 
                      checked
                    >
                    Date descending
                </label>
                <label>
                    <input type="radio" name="sortBy" :value="SortBy.DATE_ASC" v-model="formData.sortBy" >
                    Date ascending
                </label>
                <label>
                    <input type="radio" name="sortBy" :value="SortBy.BALANCE_DESC" v-model="formData.sortBy" >
                    Balance descending
                </label>
                <label>
                    <input type="radio" name="sortBy" :value="SortBy.BALANCE_ASC" v-model="formData.sortBy" >
                    Balance ascending
                </label>
            </div>
                
        </section>

        <section>
    <h3>Filter</h3>

    <div class="option-group">
      <h4>Author</h4>
      <label>
        <input 
          type="checkbox" 
          @change="handleCheckboxChange($event, formData.filter.author)" 
          value="dad"
          checked
        >
        Dad
      </label>
      <label>
        <input 
          type="checkbox" 
          @change="handleCheckboxChange($event, formData.filter.author)" 
          value="son"
          checked
        >
        Son
      </label>
    </div>

    <div class="option-group" v-if="!formData.filter.status.includes('rejected')">
      <h4>Status</h4>
      <label>
        <input 
          type="checkbox" 
          @change="handleCheckboxChange($event, formData.filter.status)" 
          value="pending"
          checked
        >
        Pending
      </label>
      <label>
        <input 
          type="checkbox" 
          @change="handleCheckboxChange($event, formData.filter.status)" 
          value="confirmed"
          checked
        >
        Confirmed
      </label>
    </div>

    <div class="option-group">
      <h4>Sign</h4>
      <label>
        <input 
          type="checkbox" 
          @change="handleCheckboxChange($event, formData.filter.sign)" 
          value="positive"
          checked
        >
        Positive
      </label>
      <label>
        <input 
          type="checkbox" 
          @change="handleCheckboxChange($event, formData.filter.sign)" 
          value="negative"
          checked
        >
        Negative
      </label>
    </div>
  </section>
  <section>
    <h3>Time</h3>
    <div class="option-group">
      <label>
        Start date
        <input type="date" @change="handleDateChange($event, 'startDate')">
        
      </label>
      </div>
      <div class="option-group">
      <label>
        End date
        <input type="date" @change="handleDateChange($event, 'endDate')">
        
      </label>
    </div>
  </section>
      </section>
        
        
        
    </div>

</template>

<style scoped>

header{
  display:flex;
  justify-content: space-between;
}

.options{
    padding:1.5rem 1rem 1.5rem 1rem;
    background-color: var(--foreground-color);
    border-radius:0.5rem;
    box-shadow: 0 0.25rem 0.25rem rgba(0, 0, 0, 0.2);

    display:flex;
    flex-direction: column;
    gap:1rem;
}

ul{
    list-style:none;
    padding: 0 0 0 0;
    margin-left:0;
}

.option-group{
    display:flex;
    flex-direction: column;
}

section{
    display:flex;
    flex-direction: column;
    gap:0.5rem;
}

h4{
    margin:0 0 0.25rem 0;
}

h3{
    margin:0;
}

h2{
    margin:0;
}

@keyframes rotate-up {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(180deg);
  }
}
.rotate-up {
  animation: rotate-up 0.4s;
  transform: rotate(180deg);
}

@keyframes rotate-down {
  0% {
    transform: rotate(180deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
.rotate-down {
  animation: rotate-down 0.4s;
}

</style>