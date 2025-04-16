import type {Request, Response} from 'express'
import {ChartDataPeriod} from 'shared'
import { getChartBalanceByDate } from '@/api/lib/entries/chartData';

export const getChartData = async (req: Request, res: Response) => {
  const periodString = req.query.period;

  if (!Object.values(ChartDataPeriod).includes(periodString as ChartDataPeriod)){
    return void res.status(400).json(
      { message: 'Invalid period param' }
    )
  }


  const period: ChartDataPeriod = periodString as ChartDataPeriod;

  const endDate = new Date();
  const startDate = new Date(endDate);

  let subtractedMonthsCount;

  switch (period){
    case ChartDataPeriod.LAST_MONTH:
      subtractedMonthsCount = 1;
    break;
    case ChartDataPeriod.LAST_3_MONTHS:
      subtractedMonthsCount = 3;
    break;
    case ChartDataPeriod.LAST_6_MONTHS:
      subtractedMonthsCount = 6;
    break;
    case ChartDataPeriod.LAST_YEAR:
      subtractedMonthsCount = 12;
    break;
  }

  startDate.setMonth(startDate.getMonth() - subtractedMonthsCount);

  try {
    const balanceByDate = await getChartBalanceByDate(startDate, endDate);
    const values = balanceByDate.map(item => item.summedBalance)
    const maxValue = Math.max(...values);
    const minValue = Math.min(...values);
    return void res.status(200).json({ message: 'Returned entries',  data: {
        balanceByDate: balanceByDate,
        maxValue: maxValue,
        minValue: minValue,
    } });
  } catch (error) {
    console.error('MongoDB error:', error);
    return void res.status(500).json({ message: 'Server error' });
  }
};