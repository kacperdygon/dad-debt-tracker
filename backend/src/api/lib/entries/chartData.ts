import { Entry } from '@/api/models/entryModel';
import { BalanceByDate, EntryStatus } from 'shared';

export async function getChartBalanceByDate(startDate: Date, endDate: Date): Promise<
    BalanceByDate[]
>{

    const result = await Entry.aggregate([
        { $match: { timestamp: { $gte: startDate, $lte: endDate }, status: { $ne: EntryStatus.REJECTED } } },
        { $sort: { timestamp: 1 } },
        {
            $group: {
                _id: "$timestamp",
                dailySummedBalance: { $sum: "$balanceChange"}
            }
        },
        { $sort: { _id: 1 } },

    ]);

    const previousSumResult = await Entry.aggregate([
        { $match: { timestamp: { $lt: startDate }, status: { $ne: EntryStatus.REJECTED } } },
        {
            $group: {
                _id: 0,
                summedBalance: { $sum: "$balanceChange"}
            }
        },
        { $sort: { _id: 1 } },
    ])


    const previousSum = previousSumResult[0] ? previousSumResult[0].summedBalance : 0
    let cumulativeBalance = previousSum;
    const mappedResult = result.map((value) => {
        cumulativeBalance += value.dailySummedBalance;
        return { _id: value._id, summedBalance: cumulativeBalance };
    })

    startDate.setUTCHours(0, 0, 0, 0);

    return [{_id: startDate, summedBalance: previousSum }, ...mappedResult];
}