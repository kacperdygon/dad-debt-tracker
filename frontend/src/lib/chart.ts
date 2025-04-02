import { fetchData } from '@/lib/database';
import { type BalanceByDate, ChartDataPeriod } from 'shared/dist';

export async function getChartData(period: ChartDataPeriod): Promise<{labels: string[], data: number[]} | null> {

  const res = await fetchData<{ previousSum: number, balanceByDate: BalanceByDate[] }>(`api/entries/chart-data?period=${period}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error(`Error fetching chart data for ${period}`);
  }

  if (res.data) {
    const parsedBalanceByDate = res.data.balanceByDate.map<BalanceByDate>((value) => {
      return {
        _id: new Date(value._id),
        summedBalance: value.summedBalance,
      };
    })

    return mapBalanceByDate(period, parsedBalanceByDate, res.data.previousSum);
  }

  return null;

}

function mapBalanceByDate(period: ChartDataPeriod, balanceByDate: BalanceByDate[], previousSum: number ): {labels: string[], data: number[]} {
  const iteratedDate: Date = new Date();
  iteratedDate.setMonth(iteratedDate.getMonth() - 1);
  iteratedDate.setUTCHours(0, 0, 0, 0);
  let balanceByDateIndex = 0;
  let pushedBalance = previousSum;
  const chartDataObject: {labels: string[], data: number[]} = {
    labels: [],
    data: []
  };
  for(let i = 0; iteratedDate.getTime() <= balanceByDate[balanceByDate.length - 1]._id.getTime(); i++){
    if (iteratedDate.getTime() == balanceByDate[balanceByDateIndex]._id.getTime()) {
      pushedBalance = balanceByDate[balanceByDateIndex].summedBalance;
      balanceByDateIndex++;
    }

    chartDataObject.labels.push(iteratedDate.toLocaleString('en-US', {day: 'numeric', month: 'short'}));
    chartDataObject.data.push(pushedBalance);

    iteratedDate.setDate(iteratedDate.getDate() + 1);
  }

  return chartDataObject;

}