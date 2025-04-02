import { Entry } from '@/api/models/entryModel';

export async function getBalanceByDate(startDate: Date, endDate: Date): Promise<{
    _id: Date,
    summedBalance: number;
}[]>{
    // return Entry.aggregate([
    //     { $match: { timestamp: { $gte: startDate, $lte: endDate } } },
    //     { $sort: { timestamp: 1 } },
    //     { $setWindowFields: {
    //             sortBy: { timestamp: 1 },
    //             output: {
    //                 cumulativeBalance: {
    //                     $sum: "$balanceChange",
    //                     window: {
    //                         documents: [ "unbounded", "current" ]
    //                     }
    //                 }
    //             }
    //     }
    //     },
    //     {
    //         $group: {
    //             _id: "$timestamp",
    //             summedBalance: { $last: "$cumulativeBalance" },
    //             dailySummedBalance: { $sum: "$balanceChange"}
    //         }
    //     },
    //     { $sort: { _id: 1 } },

    // ]);

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

    let cumulativeBalance = 0;
    const mappedResult = result.map((value) => {
        cumulativeBalance += value.dailySummedBalance;
        return { _id: value._id, summedBalance: cumulativeBalance };
    })

    return mappedResult;
}