const decimals = 10;
export const pudMinValue = 0.0000002;
export const pudMaxValue = 0.0000003;

export const getRandomBetween = (basePrice: number) => {
  const randomValue = Math.random() * 0.2 * basePrice + basePrice * 0.9;
  return randomValue.toFixed(decimals);
};

export const getPrice = (coinType: string) => {
  if (coinType.indexOf('FUD') >= 0) {
    return getRandomBetween(0.0000002688);
  } else if (coinType.indexOf('SCB') >= 0) {
    return getRandomBetween(0.00000003895);
  } else {
    return getRandomBetween(1);
  }
};

export const getImage = (coinType: string) => {
  if (coinType.indexOf('FUD') >= 0) {
    return 'https://assets.coingecko.com/coins/images/33610/standard/pug-head.png';
  } else if (coinType.indexOf('SCB') >= 0) {
    return 'https://dd.dexscreener.com/ds-data/tokens/sui/0x9a5502414b5d51d01c8b5641db7436d789fa15a245694b24aa37c25c2a6ce001::scb::scb.png?size=lg&key=834c5a';
  } else {
    return 'https://assets.coingecko.com/coins/images/26375/standard/sui_asset.jpeg?1696525453';
  }
};

export const getToken = (coinType: string) => {
  const regex = /([^:]+)::[^:]+::([^>]+)/;
  const match = coinType.match(regex);
  const type = match?.[2] || '';
  return type;
};
