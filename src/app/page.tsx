'use client';

import Wrapper from '@/components/Wrapper';
import styles from './index.module.scss';
import useBetMemeList from '@/hooks/useBetMemeList';
import Loading from '@/components/Common/Loading';
import Button from '@/components/Common/Button';
import BetMemeModal from '@/components/BetMemeModal';
import { useState } from 'react';

export default function Home() {
  const { isLoading, data: betMemes } = useBetMemeList();

  const [modalView, setModalView] = useState(false);

  return (
    <Wrapper>
      <div>
        {isLoading && <Loading />}
        {!isLoading && (
          <div className={styles.products}>
            {betMemes?.map((v) => {
              const lockedPrice = (v.denom1Amount + v.denom2Amount).toFixed(6);
              // 0xfef07a737803d73c50a3c8fc61b88fa2f8893801a51f7b49c6d203b207906231::fud::FUD
              // https://suiscan.xyz/testnet/coin/0xfef07a737803d73c50a3c8fc61b88fa2f8893801a51f7b49c6d203b207906231::fud::FUD/txs
              return (
                <div key={v.id} className={styles.betCard}>
                  <div>
                    <div>토큰이미지</div>
                    {v.title}
                    <div>Marked Price: {lockedPrice}</div>
                    <div>Marked Price: {lockedPrice}</div>
                  </div>
                  <Button name={`Pray for UP 🔺`} />
                  <Button name={`Pray for DOWN🔻`} />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Wrapper>
  );
}
