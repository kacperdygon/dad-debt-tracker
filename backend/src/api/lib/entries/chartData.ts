import { Entry } from "@/api/models/entryModel";

export async function getBalanceByDate(startDate: Date, endDate: Date): Promise<{
    _id: Date,
    summedBalance: number;
}[]>{
    const result = await Entry.aggregate([
        { $match: { timestamp: { $gte: startDate, $lte: endDate }}},
        { $group: { _id: '$timestamp', summedBalance: {$sum: '$balanceChange'}}},
        { $sort: { _id: -1}}

    ]);

    return result;
}