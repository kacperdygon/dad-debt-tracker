import { Request } from "express"; 

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

    let startDate, endDate;
  
    // if (req.query.author && typeof req.query.author === "string")
    //   author = req.query.author?.split(',');
    if (typeof req.query.sign === "string")
      sign = req.query.sign.split(',') as Array<string>;
    if (typeof req.query.status === "string")
      status = req.query.status.split(',');
    if (typeof req.query.startDate === "string")
      startDate = new Date(req.query.startDate);
    if (typeof req.query.endDate === "string")
      endDate = new Date(req.query.endDate);
  
    const signFilters: Array<unknown> = [];
    if (sign?.includes('negative')) signFilters.push({balanceChange: {$lte: 0}});
    if (sign?.includes('positive')) signFilters.push({balanceChange: {$gte: 0}});
    

    const filters: Record<string, unknown> = {};

    //Applying filters
    if (status){
      filters.status = {$in: status};
    }

    if (signFilters.length != 0) filters.$or = signFilters;
    else filters.$or = [{balanceChange: 0}];

    startDate = (startDate && !isNaN(startDate.getTime())) ? startDate : undefined;
    endDate = (endDate && !isNaN(endDate.getTime())) ? endDate : undefined;

    if (startDate || endDate) filters.timestamp = {};
    if (startDate) (filters.timestamp as Record<string, unknown>).$gte = startDate;
    if (endDate) (filters.timestamp as Record<string, unknown>).$lte = endDate;
    
    return filters;
  
}