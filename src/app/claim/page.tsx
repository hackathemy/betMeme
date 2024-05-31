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

  const [pudPrice, setPudPrice] = useState('0.0000002688');

  useEffect(() => {
    const intervalId = setInterval(() => {
      const randomValue = getRandomBetween(pudMinValue, pudMaxValue);
      setPudPrice(randomValue);
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <Wrapper>
      <div className={styles.container}>
        <h1>claim page</h1>
        <div className={styles.cardWrapper}>
          {data?.data
            .filter((d) => d.data?.type?.includes('UserBet'))
            .map((d: any) => {
              return <ClaimForm key={d.data?.digest} value={d} price={pudPrice} />;
            })}
        </div>
      </div>
    </Wrapper>
  );
}
