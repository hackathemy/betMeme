const decimals = 10;
export const pudMinValue = 0.0000002;
export const pudMaxValue = 0.0000003;

export const getRandomBetween = (min: number, max: number) => {
  const randomValue = Math.random() * (max - min) + min;
  return randomValue.toFixed(decimals);
};
