'use client';

import Wrapper from '@/components/Wrapper';
import styles from './index.module.scss';
import useBetMemeList from '@/hooks/useBetMemeList';
import Loading from '@/components/Common/Loading';
import Button from '@/components/Common/Button';
import BetMemeModal from '@/components/BetMemeModal';
import { useState } from 'react';
import InfoIconSVG from '@/assets/icons/common/InfoIcon.svg';

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
              const lockedAmount = (Number(v.upAmount) + Number(v.downAmount)).toFixed(9);
              // 0xfef07a737803d73c50a3c8fc61b88fa2f8893801a51f7b49c6d203b207906231::fud::FUD
              // https://suiscan.xyz/testnet/coin/0xfef07a737803d73c50a3c8fc61b88fa2f8893801a51f7b49c6d203b207906231::fud::FUD/txs
              return (
                <div key={v.id} className={styles.betCard}>
                  <div>
                    <div className={styles.cardHeader}>
                      <div className={styles.cardBasic}>
                        <div className={styles.blackContainer}>
                          <div className={styles.live}>LIVE</div>00:00:00:00
                        </div>
                        <div className={styles.blackContainer}>Game 1</div>
                      </div>
                      <img src={InfoIconSVG.src} />
                    </div>
                    <div className={styles.cardContent}>
                      <img
                        src="https://assets.coingecko.com/coins/images/33610/standard/pug-head.png"
                        alt="fud the pug"
                        className={styles.tokenImg}
                      />
                      <div className={styles.cardInfo}>
                        <div className={styles.cardList}>
                          {v.title}
                          <div>price</div>
                        </div>
                        <div className={styles.cardList}>
                          Total Locked<div>{lockedAmount} FUD</div>
                        </div>
                        <div className={styles.cardList}>
                          Up<div>{v.upAmount} FUD</div>
                        </div>
                        <div className={styles.cardList}>
                          Down<div>{v.downAmount} FUD</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {v.isEnd && <Button name="Game is over 🤭" />}
                  {v.isActive && !v.isEnd && (
                    <div>
                      <Button styled={styles.button} name={`Pray for 🔺 UP`} disabled={v.isEnd} />
                      <Button styled={styles.button} name={`Pray for 🔻 DOWN`} disabled={v.isEnd} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Wrapper>
  );
}
