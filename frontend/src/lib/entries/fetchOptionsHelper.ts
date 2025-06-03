import { SortBy, type EntryFetchOptions } from "shared";

export function getDefaultFetchOptions(){
  const options = {
    sortBy: SortBy.DATE_DESC,
    filter: {
      author: ['dad', 'son'],
      status: ['confirmed', 'pending'],
      sign: ['positive', 'negative']
    },
    time: {}
  }
  return options;
}

export function arraysEqual(a: Array<unknown>, b: Array<unknown>) {
  if (a.length !== b.length) return false;
  a.sort();
  b.sort();
  return a.every((val, index) => val === b[index]);
}

export function constructParams(page: number, options: EntryFetchOptions): URLSearchParams{
  const params = new URLSearchParams({
    page: page.toString(),
    sortBy: options.sortBy,
  });

  const defaultOptions = getDefaultFetchOptions();

  if (!arraysEqual(options.filter.author, defaultOptions.filter.author)){
    params.append('author', options.filter.author.join(','));
  }
  if (!arraysEqual(options.filter.sign, defaultOptions.filter.sign)){
    params.append('sign', options.filter.sign.join(','));
  }
  if (!arraysEqual(options.filter.status, defaultOptions.filter.status)){
    params.append('status', options.filter.status.join(','));
  }
  if (options.time?.startDate) {
    const parsedDate = options.time.startDate.toISOString().split('T')[0];
    params.append('startDate', parsedDate);
  }
  if (options.time?.endDate) {
    const parsedDate = options.time.endDate.toISOString().split('T')[0];
    params.append('endDate', parsedDate);
  }

  return params
}
