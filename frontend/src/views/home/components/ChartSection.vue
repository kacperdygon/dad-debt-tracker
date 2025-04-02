<script setup lang="ts">
import Chart from 'chart.js/auto';
import 'chartjs-adapter-date-fns';
import { onMounted, ref } from 'vue';
import { getChartData } from '@/lib/chart';
import { ChartDataPeriod } from 'shared/dist';

const props = defineProps<{
  period: ChartDataPeriod
}>()

const canvasRef = ref<HTMLCanvasElement | null>(null);
const chartData = ref<
  { data: {x: string, y: number}[],
    dates: { startDate: string, endDate: string } }
  | null
>(null);

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
          datasets: [{
            label: 'Balance',
            data: chartData.value.data,
            borderWidth: 1,
            pointRadius: 0,
            pointHitRadius: 5,
            stepped: true,
          }]
        },
        options: {

          scales: {

            x: {

              type: 'time',
              time: {
                unit: 'day',
              },
              ticks: {
                stepSize: 1,
                autoSkip: true,
              },
              min: chartData.value.dates.endDate,
              max: chartData.value.dates.startDate,
            }
          },
          plugins: {
            legend: {
              display: false
            },
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