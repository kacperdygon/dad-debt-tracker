import { Request } from "express";
import { ParsedQs } from 'qs'

export function parseFilters(req: Request){

    const filters: Record<string, unknown> = {};

    parseStatusFilters(req.query, filters);
    parseDateFilters(req.query, filters);
    parseMinMaxBalanceFilters(req.query, filters);

  return filters;
  
}

function parseStatusFilters(query: ParsedQs, filters: Record<string, unknown>){
  let status;

  if (typeof query.status === "string")
    status = query.status.split(',');

  if (status){
    filters.status = {$in: status};
  }
}

function parseDateFilters(query: ParsedQs, filters: Record<string, unknown>){
  let startDate, endDate;

  if (typeof query.startDate === "string")
    startDate = new Date(query.startDate);
  if (typeof query.endDate === "string")
    endDate = new Date(query.endDate);

  startDate = (startDate && !isNaN(startDate.getTime())) ? startDate : undefined;
  endDate = (endDate && !isNaN(endDate.getTime())) ? endDate : undefined;

  if (startDate || endDate) filters.timestamp = {};
  if (startDate) (filters.timestamp as Record<string, unknown>).$gte = startDate;
  if (endDate) (filters.timestamp as Record<string, unknown>).$lte = endDate;
}

function parseMinMaxBalanceFilters(query: ParsedQs, filters: Record<string, unknown>){
  let minBalance, maxBalance;

  if (typeof query.minChange === "string")
    minBalance = parseFloat(query.minChange);
  if (typeof query.maxChange === "string")
    maxBalance = parseFloat(query.maxChange);

  minBalance = (minBalance !== undefined && !isNaN(minBalance)) ? minBalance : undefined;
  maxBalance = (maxBalance !== undefined && !isNaN(maxBalance)) ? maxBalance : undefined;

  if (minBalance !== undefined || maxBalance !== undefined) filters.balanceChange = {};
  if (minBalance !== undefined) (filters.balanceChange as Record<string, unknown>).$gte = minBalance;
  if (maxBalance !== undefined) (filters.balanceChange as Record<string, unknown>).$lte = maxBalance;
}