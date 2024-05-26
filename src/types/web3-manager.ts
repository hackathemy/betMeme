import { CoinMetadata, CoinStruct } from '@mysten/sui.js/client';
import BigNumber from 'bignumber.js';

export interface CoinObject extends Pick<CoinMetadata, 'symbol' | 'decimals'> {
  chain?: any;
  digest?: string;
  version?: string;
  balance: BigNumber;
  type: `0x${string}`;
  coinObjectId: string;
  previousTransaction?: string;
  lockedUntilEpoch?: number | null | undefined;
  metadata: Omit<CoinMetadata, 'symbol' | 'decimals'>;
  objects: ReadonlyArray<Omit<CoinStruct, 'coinType'> & { type: string }>;
}

export type CoinsMap = Record<string, CoinObject>;
