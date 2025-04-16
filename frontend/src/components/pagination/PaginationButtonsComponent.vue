<script setup lang="ts">
import { computed, nextTick, ref } from 'vue';

const props = defineProps<{
  totalPages: number;
}>()
const model = defineModel<number>({ required: true });

const showInputIndex = ref<number | null>(null);

const mappedPagesToShow = computed<Array<number | null>>(() => {
  const firstPage = 1;
  const mappedPages: Array<number | null> = [];
  mappedPages.push(firstPage);

  if (props.totalPages < model.value || firstPage > model.value) return mappedPages;
  if (props.totalPages <= firstPage) return mappedPages;

  //first half of pages buttons
  if (model.value >= firstPage + 4) {
    mappedPages.push(null, model.value - 1, model.value);
  } else {
    for (let i = 2; i <= model.value; i++) {
      mappedPages.push(i);
    }
  }

  //sec half
  if (model.value <= props.totalPages - 4) {
    mappedPages.push(model.value + 1, null, props.totalPages);
  } else {
    for (let i = model.value + 1; i <= props.totalPages; i++){
      mappedPages.push(i);
    }
  }

  return mappedPages;
});

function handlePageChange(page: number){
  model.value = page;
  showInputIndex.value = null;
}

function getTextForValue(number: number | null, index: number){
  if (number) return number;
  if (showInputIndex.value != index) return '...';
  return '';
}

function handleEnter(event: Event){
  const newValue = Number((event.target as HTMLInputElement).value);
  if (isNaN(newValue) || newValue < 1 || newValue > props.totalPages){
    return;
  }
  handlePageChange(newValue);
  (event.target as HTMLInputElement).value = '';
}

function handlePageButtonClick(event: Event, number: number |  null , index: number){
  if (number != null){
    handlePageChange(number);
    showInputIndex.value = null;
    return;
  }
  showInputIndex.value = index;
  nextTick(() => {
    const input = (event.target as HTMLButtonElement).firstElementChild as HTMLInputElement;
    input.focus();
    input.addEventListener('blur', () => {
      showInputIndex.value = null;
    }, { once: true })
  });
}


</script>

<template>
    <div>
      <button @click="model > 1 ? model-- : null" class=" secondary-button">
        <i class="fa-solid fa-chevron-left"></i>
      </button>
      <ul>
        <li v-for="(number, index) in mappedPagesToShow" :key="index">
          <button
            @click="(event) => handlePageButtonClick(event, number, index)"
            class="padding-075rem"
            :class="number == model ? 'button-main' : 'secondary-button'">
            {{getTextForValue(number, index)}}
            <input v-if="number == null" v-show="showInputIndex == index" @keydown.enter="handleEnter">
          </button>
        </li>
      </ul>
      <button @click="model < totalPages ? model++ : null" class=" secondary-button">
        <i class="fa-solid fa-chevron-right"></i>
      </button>
  </div>


</template>

<style scoped>
ul{
  list-style-type: none;
  display:flex;
  gap:0.25rem;
  padding-left:0;
}

li > *{
  font-size:1rem;
}

button{
  min-width:3rem;
  height:3rem;
  display:flex;
  justify-content: center;
  align-items: center;
}

.button-main{
  border: 2px var(--primary-color) solid;
}

.secondary-button{
  color:var(--text-normal);
  box-sizing: border-box;
  border:none;
}

input{
  height:2rem;
  border:0;
  font-size:1rem;
  padding:0;
  width:2rem;
  box-sizing: border-box;
  border-radius: 0.125rem;
  text-align: center;
  background-color:transparent;
  outline:solid 1px var(--primary-color);

}

input:focus{
  outline:solid 1px var(--primary-color);
}

div{
  width:100%;
  margin:auto;
  display:flex;
  align-items: center;
  justify-content: space-between;
}
</style>