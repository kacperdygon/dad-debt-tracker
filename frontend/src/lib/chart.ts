import { fetchData } from '@/lib/database';
import { type BalanceByDate, ChartDataPeriod } from 'shared/dist';

export async function getChartData(period: ChartDataPeriod): Promise<{data: {x: string, y: number}[], dates: { startDate: string, endDate: string } }| null> {

  const res = await fetchData<{ previousSum: number, balanceByDate: BalanceByDate[] }>(`api/entries/chart-data?period=${period}`, {
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

    return {
      data: result,
      dates: {
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0]
      }
    }

  }

  return null;

}