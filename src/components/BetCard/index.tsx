import { IBetMemesProps } from '@/types/bet-memes';
import styles from './index.module.scss';
import Button from '../Common/Button';
import clsx from 'clsx';
import { useState } from 'react';
import BetMemeModal from '../BetMemeModal';
import { useSuiClientQuery } from '@mysten/dapp-kit';
import { RESULT_DURATION } from '@/constant';

interface IBetCardProps {
  betValue: IBetMemesProps;
}

const BetCard = ({ betValue }: IBetCardProps) => {
  const [modalView, setModalView] = useState(false);
  const { data, isPending, error } = useSuiClientQuery('getObject', {
    id: betValue.object,
    options: {
      showType: true,
      showOwner: true,
      showPreviousTransaction: true,
      showDisplay: true,
      showContent: true,
    },
  });

  if (isPending || error) return <div>Loading...</div>;

  const content: any = data.data?.content;
  const betData = content.fields;
  const date = new Date();
  const lockedAmount = (Number(betData.upAmount) + Number(betData.downAmount)).toFixed(9);
  let nowStatus = '';
  if (date.getTime() > Number(betData.startTime) + Number(betData.duration) + RESULT_DURATION) {
    nowStatus = 'expired';
  } else if (date.getTime() > Number(betData.startTime) + Number(betData.duration)) {
    nowStatus = 'next';
  } else {
    nowStatus = 'live';
  }

  const remain = (Number(betData.duration) - (date.getTime() - Number(betData.startTime))) / (1000 * 60);
  const remainResult =
    (RESULT_DURATION + Number(betData.duration) - (date.getTime() - Number(betData.startTime))) / (1000 * 60);

  return (
    <div className={styles.cardContainer}>
      {nowStatus === 'expired' && <div className={clsx(styles.backgroundEnd, styles[betData.win || 'down'])} />}
      <div className={styles.cardContent}>
        <div>
          <div className={styles.liveHeader}>
            <div className={styles.isLive}>
              <div className={clsx(styles.circle, styles[nowStatus])} />
              {nowStatus === 'expired' ? 'Bet game ended' : nowStatus === 'next' ? 'Wait for result' : 'Betting now'}
            </div>
            <div>
              {nowStatus === 'expired'
                ? ''
                : nowStatus === 'next'
                  ? `${remainResult.toFixed(0)} min`
                  : `${remain.toFixed(0)} min`}
            </div>
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
              Price
              <div className={styles.betResult}>
                Marked ${betData.markedPrice}
                <div className={styles.betPercent}>Current $1.1</div>
              </div>
              <div className={styles.lockedAmount}>
                Locked Pool:
                <div>{lockedAmount}</div>
              </div>
              <div className={styles.lockedAmount}>
                Prize Pool:
                <div>{betData.prizeAmount}</div>
              </div>
            </div>
          </div>
        </div>
        <div>
          {nowStatus === 'live' && (
            <Button styled={styles.button} name="Let's Bet!!" onClick={() => setModalView(true)} />
          )}
          {nowStatus === 'next' && (
            <div className={styles.betStatus}>
              <div className={clsx(styles.status, styles.up, betData.upAmount > betData.downAmount && styles.priceWin)}>
                Up {betData.upAmount}
              </div>
              <div
                className={clsx(styles.status, styles.down, betData.upAmount <= betData.downAmount && styles.priceWin)}
              >
                Down {betData.downAmount}
              </div>
            </div>
          )}
          {nowStatus === 'expired' && (
            <Button styled={styles.button} name="End Bet" disabled={nowStatus === 'expired'} />
          )}
        </div>
      </div>
      <BetMemeModal
        betValue={betValue}
        betData={betData}
        modalView={modalView}
        onCloseModal={() => setModalView(false)}
      />
    </div>
  );
};

export default BetCard;
