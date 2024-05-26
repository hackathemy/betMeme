import { CoinObject } from '@/types/web3-manager';

interface BaseObjectData {
  type: string;
  objectId: string;
  display?: Record<string, string> | undefined | null;
}

export interface AllObjects {
  ownedNfts: ReadonlyArray<ObjectData>;
  coinsObjects: ReadonlyArray<ObjectData>;
  otherObjects: ReadonlyArray<ObjectData>;
}

export interface CoinObjectData extends Omit<BaseObjectData, 'display'> {
  display: CoinObject;
}

export type ObjectData = BaseObjectData | CoinObjectData;
