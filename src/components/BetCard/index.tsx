import { IBetMemesProps } from '@/types/bet-memes';
import styles from './index.module.scss';
import Button from '../Common/Button';
import clsx from 'clsx';
import { useMemo, useState } from 'react';
import BetMemeModal from '../BetMemeModal';

interface IBetCardProps {
  betValue: IBetMemesProps;
}

const BetCard = ({ betValue }: IBetCardProps) => {
  const [modalView, setModalView] = useState(false);

  const lockedAmount = (Number(betValue.upAmount) + Number(betValue.downAmount)).toFixed(9);
  // 0xfef07a737803d73c50a3c8fc61b88fa2f8893801a51f7b49c6d203b207906231::fud::FUD
  // https://suiscan.xyz/testnet/coin/0xfef07a737803d73c50a3c8fc61b88fa2f8893801a51f7b49c6d203b207906231::fud::FUD/txs

  const nowStatus = useMemo(() => {
    if (!betValue.isActive && !betValue.isEnd) {
      return 'next';
    } else if (betValue.isActive && !betValue.isEnd) {
      return 'live';
    }

    return 'expired';
  }, [betValue]);

  const priceStatus = useMemo(() => {
    const status = 0.123432 - Number(betValue.startPrice);

    if (status > 0) {
      return '+';
    }

    return '-';
  }, [betValue]);

  return (
    <div className={styles.cardContainer}>
      {betValue.isEnd && <div className={clsx(styles.backgroundEnd, styles[betValue.win || 'down'])} />}
      <div className={styles.cardContent}>
        <div>
          <div className={styles.liveHeader}>
            <div className={styles.isLive}>
              <div className={clsx(styles.circle, styles[nowStatus])} />
              {nowStatus[0].toUpperCase() + nowStatus.slice(1, nowStatus.length)}
            </div>
            <div>00:00:00</div>
          </div>
          <div>
            <div className={styles.betInfo}>
              <img
                src="https://assets.coingecko.com/coins/images/33610/standard/pug-head.png"
                alt="fud the pug"
                className={styles.tokenImg}
              />
              {betValue.title}
            </div>
            <div className={styles.lockedContainer}>
              Current Price
              <div className={styles.betResult}>
                $0.12321112<div className={styles.betPercent}>+ 0.1243%</div>
              </div>
              <div className={styles.lockedAmount}>
                Locked Price:<div>${0.12321112}</div>
              </div>
              <div className={styles.lockedAmount}>
                Locked Pool:
                <div>
                  {lockedAmount} {betValue.denom}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          {!betValue.isActive && !betValue.isEnd && (
            <Button styled={styles.button} name="Let's Bet!!" onClick={() => setModalView(true)} />
          )}
          {betValue.isActive && !betValue.isEnd && (
            <div className={styles.betStatus}>
              <div className={clsx(styles.status, styles.up, priceStatus === '+' && styles.priceWin)}>Up</div>
              <div className={clsx(styles.status, styles.down, priceStatus === '-' && styles.priceWin)}>Down</div>
            </div>
          )}
          {betValue.isEnd && <Button styled={styles.button} name="End Bet" disabled={betValue.isEnd} />}
        </div>
      </div>
      <BetMemeModal betValue={betValue} modalView={modalView} onCloseModal={() => setModalView(false)} />
    </div>
  );
};

export default BetCard;
