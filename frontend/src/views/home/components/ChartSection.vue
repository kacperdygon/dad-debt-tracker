<script setup lang="ts">
import Chart from 'chart.js/auto';
import { onMounted, ref } from 'vue';
import { getChartData } from '@/lib/chart';
import { ChartDataPeriod } from 'shared/dist';

const props = defineProps<{
  period: ChartDataPeriod
}>()

const canvasRef = ref<HTMLCanvasElement | null>(null);
const chartData = ref<{labels: string[], data: number[]} | null>(null);

onMounted(() => {
  LoadChart();
});

async function loadChartData(){
  chartData.value = await getChartData(props.period);
}

async function LoadChart(){
  if (!canvasRef.value) {
    throw new Error('Canvas ref not set');
  }
  await loadChartData();
    if (chartData.value) {
      new Chart(canvasRef.value, {
        type: 'line',
        data: {
          labels: chartData.value.labels,
          datasets: [{
            label: 'Balance',
            data: chartData.value.data,
            borderWidth: 1,
          }]
        },
        options: {
          plugins: {
            legend: {
              display: false
            }
          }
        }
      });
    }
}


</script>

<template>
<section class="chart">
  <canvas ref="canvasRef"></canvas>
</section>
</template>

<style scoped>

</style>