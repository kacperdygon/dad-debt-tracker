<script setup lang="ts">
import { SortBy } from 'shared';
import { type EntryFetchOptions } from 'shared';

const formData = defineModel<EntryFetchOptions>();

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

</script>

<template>

    <div class="options">
        <h2>Options</h2>
        
        <label>
            <input type="checkbox" v-model="formData.showRejected">
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

    <div class="option-group" v-if="!formData.showRejected">
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
    </div>

</template>

<style scoped>



.options{
    padding:1.5rem 1rem 1.5rem 1rem;
    background-color: var(--foreground-color);
    margin:0 1rem 0 0;
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

</style>