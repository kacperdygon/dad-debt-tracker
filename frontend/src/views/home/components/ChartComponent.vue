<script setup lang="ts">
import Chart from 'chart.js/auto';
import 'chartjs-adapter-date-fns';
import { onMounted, ref } from 'vue';
import { getChartData } from '@/lib/chart';
import { ChartDataPeriod } from 'shared';
import { watch } from 'vue';
import { handleErrorWithToast } from '@/lib/toastHandlers.ts';

const props = defineProps<{
  period: ChartDataPeriod
}>();

let currentChart: InstanceType<typeof Chart>;

const canvasRef = ref<HTMLCanvasElement | null>(null);
const chartData = ref<
  {data: {x: string, y: number}[],
    dates: {startDate: string, endDate: string},
    options: {maxChartValue: number, minChartValue: number}}
  | null
>(null);

onMounted(() => {
  loadChart();
});

watch(() => props.period, () => {
    loadChart();
})

async function loadChartData(){
  try {
    chartData.value = await getChartData(props.period);
  } catch (error) {
    handleErrorWithToast(error);
  }
}

async function loadChart(){
  if (!canvasRef.value) {
    console.warn('Canvas ref not set');
    return;
  }

  await loadChartData();
    if (chartData.value) {

      if (currentChart) currentChart.destroy();
      currentChart = new Chart(canvasRef.value, {
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
                unit: props.period == ChartDataPeriod.LAST_YEAR ? 'month' : 'day',
              },
              ticks: {
                stepSize: 1,
                autoSkip: true,
              },
              min: chartData.value.dates.endDate,
              max: chartData.value.dates.startDate,
            },
            y: {
              suggestedMax: chartData.value.options.maxChartValue,
              suggestedMin: chartData.value.options.minChartValue,
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