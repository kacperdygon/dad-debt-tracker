<script setup lang="ts">
import { ChartDataPeriod } from 'shared';
import ChartComponent from './ChartComponent.vue';
import { ref } from 'vue';

const selectedPeriod = ref<ChartDataPeriod>(ChartDataPeriod.LAST_3_MONTHS);

const periodsArray = Object.values(ChartDataPeriod)

function formatStringForButton(text: string){
    text = text.replace(/-/g, ' ');
    text = text[0].toUpperCase() + text.slice(1);
    return text;
}

function changePeriod(newPeriod: ChartDataPeriod){
    selectedPeriod.value = newPeriod;
}

</script>

<template>

    <ul>
        <li v-for="(item, index) in periodsArray" :key="index">
            <button :class="item === selectedPeriod ? 'button-main' : 'secondary-button'" @click="changePeriod(item)">
                {{ formatStringForButton(item) }}
            </button>
        </li>
    </ul>

<ChartComponent :period="selectedPeriod"/>

</template>

<style scoped>

button{
    padding:0.75rem;
}

ul{
    list-style:none;
    padding-left:0;
    display:flex;
    gap:0.5rem;
}

</style>