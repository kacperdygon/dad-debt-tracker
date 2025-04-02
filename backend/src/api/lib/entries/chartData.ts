import { Entry } from '@/api/models/entryModel';
import { BalanceByDate } from 'shared/dist';

export async function getBalanceByDate(startDate: Date, endDate: Date): Promise<
    BalanceByDate[]
>{

    const result = await Entry.aggregate([
        { $match: { timestamp: { $gte: startDate, $lte: endDate } } },
        { $sort: { timestamp: 1 } },
        {
            $group: {
                _id: "$timestamp",
                dailySummedBalance: { $sum: "$balanceChange"}
            }
        },
        { $sort: { _id: 1 } },

    ]);

    const previousSum = await Entry.aggregate([
        { $match: { timestamp: { $lt: startDate } } },
        {
            $group: {
                _id: 0,
                summedBalance: { $sum: "$balanceChange"}
            }
        },
        { $sort: { _id: 1 } },
    ])



    let cumulativeBalance = 0;
    const mappedResult = result.map((value) => {
        cumulativeBalance += value.dailySummedBalance;
        return { _id: value._id, summedBalance: cumulativeBalance };
    })

    return [{_id: startDate, summedBalance: previousSum[0] ? previousSum[0].summedBalance : 0 }, ...mappedResult];
}