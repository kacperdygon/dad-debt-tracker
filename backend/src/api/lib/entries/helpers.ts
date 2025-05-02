import { Request } from "express";
import { EntryStatus } from "shared";

export function getDifferences(oldValue: Record<string, unknown>, newValue: Record<string, unknown>): {
  oldValue: Record<string, unknown>,
  newValue: Record<string, unknown>
}{
  for (const key in newValue) {
    if (oldValue[key] === newValue[key]) {
      delete oldValue[key];
      delete newValue[key];
    }
  }

  return {
    oldValue: oldValue,
    newValue: newValue
  };
}

export function parseFilters(req: Request){
  let sign, status;
  // let author;
    const rejected = req.query.rejected === 'true';
  
    // if (req.query.author && typeof req.query.author === "string")
    //   author = req.query.author?.split(',');
    if (req.query.sign && typeof req.query.sign === "string")
      sign = req.query.sign?.split(',');
    if (req.query.status && typeof req.query.status === "string")
      status = req.query.status?.split(',');
  
    const signFilters: Array<unknown> = [ { balanceChange: 0 } ];
    if (sign?.includes('negative')) signFilters.push({balanceChange: {$lt: 0}});
    if (sign?.includes('positive')) signFilters.push({balanceChange: {$gt: 0}});
  
    const filters: Record<string, unknown> = {
      status: rejected ? EntryStatus.REJECTED : {$in: status, $ne: EntryStatus.REJECTED},
      // author: {$in: author},
      $or: signFilters
    }
  
    return filters;
  
}