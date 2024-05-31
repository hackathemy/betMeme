export const numberWithCommas = (value?: number | string): string => {
  const changeValue = String(value);
  const splitNum = changeValue.split('.');
  const number = splitNum[0]?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') || '0';

  if (splitNum[1]) {
    return `${number}.${splitNum[1]}`;
  }

  return `${number}`;
};
