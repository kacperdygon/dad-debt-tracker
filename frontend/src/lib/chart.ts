import { fetchData } from '@/lib/database';
import { type BalanceByDate, ChartDataPeriod } from 'shared/dist';

export async function getChartData(period: ChartDataPeriod): Promise<{
  data: {x: string, y: number}[],
  dates: { startDate: string, endDate: string },
  options: { maxChartValue: number, minChartValue: number };
}| null> {

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

  if (res.data) {

    const result = res.data.balanceByDate.map((value) => {

      return {
        x: new Date(value._id).toISOString().split('T')[0],
        y: value.summedBalance
      }
    });

    const startDate = new Date();
    const endDate = new Date();
    startDate.setDate(startDate.getDate() + 1);
    endDate.setMonth(endDate.getMonth() - 1);

    // put this in so chart won't stop in the middle
    const lastItem = Object.assign({}, result[result.length - 1]);
    const nextDay = new Date(startDate);
    nextDay.setDate(startDate.getDate() + 1);
    lastItem.x = nextDay.toISOString().split('T')[0];
    result.push(lastItem);

    console.log(result);

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