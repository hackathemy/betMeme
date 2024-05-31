import { IBetMemesProps } from '@/types/bet-memes';
import styles from './index.module.scss';
import Button from '../Common/Button';
import clsx from 'clsx';
import { useMemo, useState } from 'react';
import BetMemeModal from '../BetMemeModal';
import { useSuiClientQuery } from '@mysten/dapp-kit';
import { DECIMAL_UNIT, RESULT_DURATION } from '@/constant';
import { numberWithCommas } from '@/utils/formatNumber';

interface IBetCardProps {
  betValue: IBetMemesProps;
  price: string;
}

const BetCard = ({ betValue, price }: IBetCardProps) => {
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

  const content: any = data?.data?.content;
  const betData = content?.fields;

  const pricePercentage = useMemo(() => {
    if (betData) {
      // const precent = (1 - Number(betData?.markedPrice) / DECIMAL_UNIT / Number(price)) * 100;
      const precent = (1 - 0.0000002688 / Number(price)) * 100;
      return precent;
    }

    return 0;
  }, [betData, price]);

  if (isPending || error) return <div>Loading...</div>;

  const date = new Date();
  const lockedAmount = ((Number(betData.upAmount) + Number(betData.downAmount)) / DECIMAL_UNIT).toFixed(6);
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
                {nowStatus === 'expired' ? (
                  <>
                    Marked ${(Number(betData?.markedPrice) / DECIMAL_UNIT).toFixed(9)}
                    <div className={clsx(styles.betPercent, styles.endPercent)}>
                      Last ${(Number(betData?.lastPrice) / DECIMAL_UNIT).toFixed(2)}
                    </div>
                  </>
                ) : (
                  <>
                    ${price}
                    <div className={clsx(styles.betPercent, pricePercentage > 0 && styles.isPlus)}>
                      {pricePercentage?.toFixed(2)} %
                    </div>
                  </>
                )}
              </div>
              <div className={styles.lockedAmount}>
                Locked Pool:
                <div>{numberWithCommas(lockedAmount)} FUD</div>
              </div>
              <div className={styles.lockedAmount}>
                Prize Pool:
                <div>{numberWithCommas(Number(betData.prizeAmount) / DECIMAL_UNIT)} FUD</div>
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
              <div className={clsx(styles.status, styles.up, pricePercentage > 0 && styles.priceWin)}>
                Up {betData.upAmount}
              </div>
              <div className={clsx(styles.status, styles.down, pricePercentage < 0 && styles.priceWin)}>
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
