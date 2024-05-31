'use client';

import Wrapper from '@/components/Wrapper';

import { useCurrentAccount, useSuiClientQuery } from '@mysten/dapp-kit';
import styles from './index.module.scss';
import ClaimForm from './claim-form';
import { getRandomBetween, pudMaxValue, pudMinValue } from '@/utils/makePrice';
import { useEffect, useState } from 'react';

export default function Claim() {
  const currentAccount = useCurrentAccount();
  const { data, isPending, error } = useSuiClientQuery('getOwnedObjects', {
    owner: currentAccount?.address as string,
    options: {
      showType: true,
      showOwner: true,
      showPreviousTransaction: true,
      showDisplay: true,
      showContent: true,
    },
  });

  return (
    <Wrapper>
      <div className={styles.container}>
        <h1>My Bet</h1>
        <div className={styles.cardWrapper}>
          {data?.data
            .filter((d) => d.data?.type?.includes('UserBet'))
            .map((d: any) => {
              return <ClaimForm key={d.data?.digest} value={d} />;
            })}
        </div>
      </div>
    </Wrapper>
  );
}
