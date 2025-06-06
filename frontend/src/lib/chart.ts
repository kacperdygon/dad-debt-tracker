import { fetchData, type FetchResponse } from '@/lib/database';
import { type BalanceByDate, ChartDataPeriod } from 'shared';

export async function getChartData(period: ChartDataPeriod): Promise<{
  data: {x: string, y: number}[],
  dates: { startDate: string, endDate: string },
  options: { maxChartValue: number, minChartValue: number };
}| null> {

  const res = await fetchChartData(period);

  if (res.data) {

    const result = res.data.balanceByDate.map((value) => {
      return {
        x: new Date(value._id).toISOString().split('T')[0],
        y: value.summedBalance
      }
    });



    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() - getMonthsForPeriod(period));
    startDate.setDate(startDate.getDate() + 1);

    // put this in so chart won't stop in the middle, not sure if I should keep it
    const lastItem = Object.assign({}, result[result.length - 1]);
    const nextDay = new Date(startDate);
    nextDay.setDate(startDate.getDate() + 1);
    lastItem.x = nextDay.toISOString().split('T')[0];
    result.push(lastItem);

    const minMaxDifference = res.data.maxValue - res.data.minValue;
    const padding = minMaxDifference * 0.1;

    return {
      data: result,
      dates: {
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
      },
      options: {
        maxChartValue: res.data.maxValue + padding,
        minChartValue: res.data.minValue - padding,
      }
    }

  }

  return null;

}

async function fetchChartData(period: ChartDataPeriod): Promise<FetchResponse<{
  minValue: number,
  maxValue: number,
  balanceByDate: BalanceByDate[]
}>>{
  const res = await fetchData<{
    minValue: number,
    maxValue: number,
    balanceByDate: BalanceByDate[]
  }>(`api/entries/chart-data?period=${period}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error(`Error fetching chart data for ${period}`);
  }

  return res;
}

function getMonthsForPeriod(period: ChartDataPeriod): number {
  switch (period){
    case ChartDataPeriod.LAST_MONTH:
      return 1;
    case ChartDataPeriod.LAST_3_MONTHS:
      return 3;
    case ChartDataPeriod.LAST_6_MONTHS:
      return 6;
    case ChartDataPeriod.LAST_YEAR:
      return 12;
  }
  return 1;
}