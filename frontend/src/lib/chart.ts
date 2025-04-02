import { fetchData } from '@/lib/database';
import { type BalanceByDate, ChartDataPeriod } from 'shared/dist';

export async function getChartData(period: ChartDataPeriod): Promise<{labels: string[], data: number[]}> {

  const res = await fetchData<{ balanceByDate: BalanceByDate[] }>(`api/entries/chart-data?period=${period}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error(`Error fetching chart data for ${period}`);
  }

  const labels: string[] = [];
  const data: number[] = [];

  if (res.data) {
    res.data.balanceByDate.map((value) => {
      const parsedDate = new Date(value._id);
      const label = parsedDate.toLocaleString('en-US', {day: 'numeric', month: 'short'});
      labels.push(label);
      data.push(value.summedBalance);
    })
  }

  

  console.log(labels);
  console.log(data);

  return {
    labels: labels,
    data: data
  }

}