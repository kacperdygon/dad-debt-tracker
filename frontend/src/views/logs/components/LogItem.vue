<script setup lang="ts">

import { ActionType, type IActionResponse } from 'shared/dist';
import { constructLogMessage } from '@/views/logs/logMessageHelpers';
import { computed, onMounted, ref } from 'vue';
import { getEntryPosition } from '@/lib/entries';
import { useRouter } from 'vue-router';

const props = defineProps<{
  action: IActionResponse;
}>()

const logMessage = constructLogMessage(props.action);

const isExpanded = ref<boolean>(false);

const formattedDate = new Date(props.action.timestamp).toLocaleString('pl-PL', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false
}).replace(',', '');

const mappedArray = ref<{
  key: string;
  newValue: string;
  oldValue: string;
}[]>([])

onMounted(() => {
  if (props.action.changes.newValue && props.action.changes.oldValue) {
    for (const key of Object.keys(props.action.changes.newValue)) {
      mappedArray.value.push({
        key: key,
        newValue: props.action.changes.newValue[key],
        oldValue: props.action.changes.oldValue[key]
      });
    }
  }
})

const logStyle = computed(() => {
  if (props.action.actionType == ActionType.AddEntry) return {
    text: 'New values: ',
    class: 'green-color',
  };
  else if (props.action.actionType == ActionType.RemoveEntry) return {
    text: 'Removed: ',
    class: 'red-color'
  };
  else return {
      text: 'Changes: ',
      class: 'orange-color'
  };
})

function switchExpanded(){
  isExpanded.value = !isExpanded.value;
}

const router = useRouter();

async function handleJumpTo(id: string){
  const response = await getEntryPosition(id);
  if (response.ok) {
  
    await router.push({path: '/entries',
    query: {
      page: response.data.page,
      positionOnPage: response.data.positionOnPage,
      rejected: String(response.data.rejected)
    }
  })
  } else {
    throw new Error('Error: ' + response.message)
  }

  
}

//trzeba cos zrbic by timestamp w value byl jako data
//i jeszcze ze mozna rozwinac te zmiany

</script>

<template>

<div class="log-item">
  <header>

    <span class="timestamp">{{formattedDate}}</span>
    <h4 :class="logStyle.class">{{logMessage}}</h4>
  </header>

  <section class="changes" v-show="isExpanded">
    <h5>
      {{logStyle.text}}
    </h5>
    <ul v-if="action.actionType != ActionType.UpdateEntry && action.actionType != ActionType.ChangeEntryStatus ">
      <li v-for="[key, value] of
      action.changes.oldValue ? Object.entries(action.changes.oldValue) : Object.entries(action.changes.newValue)
      "
          :key='key'>{{
          `${key}: ${value}`}}</li>
    </ul>
    <ul v-else>
      <li v-for="{key, newValue, oldValue} in mappedArray" :key='key'>{{
          `${key}: ${oldValue} > ${newValue}`}}</li>
    </ul>
  </section>
  <section class="buttons">
    <button class="button-plain" @click="switchExpanded">
      <i class="fa-solid fa-chevron-down" :class="{'fa-rotate-180': isExpanded}"></i>
      &nbsp;{{ isExpanded ? 'Collapse' : 'Expand' }}</button>
    <button 
      v-if="action.actionType != ActionType.RemoveEntry" 
      class="primary-color button-plain"
      @click="handleJumpTo(action.targetId)"
      >
      Jump to entry
    </button>

  </section>


</div>

</template>

<style scoped>
.log-item{
  caret-color: transparent;
  background-color: var(--foreground-color);
  padding: 1.25rem;
  box-shadow: 0 0.25rem 0.25rem rgba(0, 0, 0, 0.2);
  border-radius: 0.25rem;
}

header{
  gap: 0.25rem;
  display:flex;
  flex-direction: row-reverse;
  justify-content: space-between;
}

h4{
  margin:0;
  font-size: 1.25rem;
  font-weight: 500;
}

.changes{
  margin-top: 0.5rem;
}

h5{

  all: unset;
  font-weight: 500;
  font-size: 1rem;
}

.timestamp{
  color: var(--text-gray);
  text-align: right;
}

ul{
  list-style: none;
  padding-left: 0.75rem;
}

.buttons{
  display: flex;
  justify-content: space-between;
  margin-top:0.5rem;
}

</style>