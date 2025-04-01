import type {Request, Response} from 'express'
import {Entry, IEntryDocument} from '@/api/models/entryModel'
import {ChartDataPeriod} from 'shared/dist'
import { getBalanceByDate } from '@/api/lib/entries/chartData';

export const getChartData = async (req: Request, res: Response) => {
  // const periodString = req.params.period;
  // const query = Entry.find();

  // let period;

  // if (Object.values(ChartDataPeriod).includes(periodString as ChartDataPeriod)) {
  //   period = periodString;
  // }

  const today = new Date();
const lastMonth = new Date(today); 
lastMonth.setMonth(today.getMonth() - 1); 

  try {
    const balanceByDate = await getBalanceByDate(lastMonth, today);
    return void res.status(200).json({ message: 'Returned entries',  data: {
        balanceByDate: balanceByDate
    } });
  } catch (error) {
    console.error('MongoDB error:', error);
    return void res.status(500).json({ message: 'Server error' });
  }
};