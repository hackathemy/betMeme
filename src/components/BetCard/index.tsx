import { IBetMemesProps } from '@/types/bet-memes';
import styles from './index.module.scss';
import Button from '../Common/Button';
import clsx from 'clsx';
import { useMemo, useState } from 'react';
import BetMemeModal from '../BetMemeModal';
import { useCurrentAccount, useSignTransactionBlock, useSuiClientQuery } from '@mysten/dapp-kit';
import { DECIMAL_UNIT, GAS_BUDGET, RESULT_DURATION } from '@/constant';
import { numberWithCommas } from '@/utils/formatNumber';
import { SuiClient, getFullnodeUrl } from '@mysten/sui.js/client';
import { TransactionBlock } from '@mysten/sui.js/transactions';
import { getImage, getPrice, getToken } from '@/utils/makePrice';

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
  const client = new SuiClient({
    url: getFullnodeUrl('testnet'),
  });
  const signTransactionBlock = useSignTransactionBlock();
  const currentAccount = useCurrentAccount();

  const updateLastPrice = async () => {
    try {
      if (!currentAccount) return;

      const txb = new TransactionBlock();
      txb.setGasBudget(GAS_BUDGET);
      txb.moveCall({
        target: `${process.env.NEXT_PUBLIC_PACKAGE_ID}::betmeme::gameEnd`,
        typeArguments: [betValue.denom],
        arguments: [
          txb.pure(betValue.object),
          txb.pure('0x6'),
          txb.pure((Number(getPrice(betValue.denom)) * DECIMAL_UNIT).toFixed(0)),
        ],
      });

      const { signature, transactionBlockBytes } = await signTransactionBlock.mutateAsync({
        transactionBlock: txb,
        account: currentAccount,
      });

      const tx = await client.executeTransactionBlock({
        signature,
        transactionBlock: transactionBlockBytes,
        requestType: 'WaitForEffectsCert',
      });
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };

  const content: any = data?.data?.content;
  const betData = content?.fields;
  const price = getPrice(betValue.denom);
  const pricePercentage = useMemo(() => {
    if (betData) {
      // TODO: markedPrice가 제대로 들어오면 다시 확인해 봐야 함 지금은 1이라서 애매
      // const precent = (1 - Number(betData?.markedPrice) / DECIMAL_UNIT / Number(price)) * 100;
      const percent =
        ((Number(price) - Number(betData.markedPrice / DECIMAL_UNIT)) / Number(betData.markedPrice / DECIMAL_UNIT)) *
        100;

      return percent;
    }

    return 0;
  }, [betData]);

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
                  ? `( ${remainResult.toFixed(0)} min remain )`
                  : `( ${remain.toFixed(0)} min remain )`}
            </div>
          </div>
          <div>
            <div className={styles.betInfo}>
              <img src={getImage(betValue.denom)} alt="img" className={styles.tokenImg} />
              {betValue.title} 🦇 ${(betData.markedPrice / DECIMAL_UNIT).toFixed(10)}
            </div>
            <div className={styles.lockedContainer}>
              {nowStatus === 'expired' && betData?.lastPrice > 0 ? <>Final Price</> : <>Current Price</>}
              <div className={styles.betResult}>
                {nowStatus === 'expired' && betData?.lastPrice > 0 ? (
                  <>
                    <>${Number(betData?.lastPrice / DECIMAL_UNIT).toFixed(10)}</>
                    {betData?.lastPrice - betData?.markedPrice > 0 ? (
                      <div className={clsx(styles.betPercent, styles.isPlus)}>Up Win !</div>
                    ) : (
                      <div className={clsx(styles.betPercent)}>Down Win !</div>
                    )}
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
                <div>
                  {numberWithCommas(lockedAmount)} {getToken(betValue.denom)}
                </div>
              </div>
              <div className={styles.lockedAmount}>
                Bet Up:
                <div>
                  {numberWithCommas(betData.upAmount / DECIMAL_UNIT)} {getToken(betValue.denom)} ( win to{' '}
                  {numberWithCommas(
                    betData.upAmount / DECIMAL_UNIT +
                      (betData.downAmount / DECIMAL_UNIT) * 0.7 +
                      Number(betData.prizeBalance) / DECIMAL_UNIT,
                  )}{' '}
                  {getToken(betValue.denom)} )
                </div>
              </div>
              <div className={styles.lockedAmount}>
                Bet Down:
                <div>
                  {numberWithCommas(betData.downAmount / DECIMAL_UNIT)} {getToken(betValue.denom)} ( win to{' '}
                  {numberWithCommas(
                    betData.downAmount / DECIMAL_UNIT +
                      (betData.upAmount / DECIMAL_UNIT) * 0.7 +
                      Number(betData.prizeBalance) / DECIMAL_UNIT,
                  )}{' '}
                  {getToken(betValue.denom)} )
                </div>
              </div>
              <div className={styles.lockedAmount}>
                Prize Pool:
                <div>
                  {numberWithCommas(Number(betData.prizeBalance) / DECIMAL_UNIT)} {getToken(betValue.denom)}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          {nowStatus === 'live' && (
            <Button styled={styles.betButton} name="Let's Bet !" onClick={() => setModalView(true)} />
          )}
          {nowStatus === 'next' && (
            <div className={styles.betStatus}>
              <div className={clsx(styles.status, styles.up, pricePercentage > 0 && styles.priceWin)}>
                [ Up ] Will be win
              </div>
              <div className={clsx(styles.status, styles.down, pricePercentage < 0 && styles.priceWin)}>
                [ Down ] Will be win
              </div>
            </div>
          )}
          {nowStatus === 'expired' && Number(betData.lastPrice) === 0 && (
            <Button styled={styles.checkButton} name="Check Price" onClick={() => updateLastPrice()} />
          )}
          {nowStatus === 'expired' && Number(betData.lastPrice) > 0 && (
            <Button styled={styles.button} name="Finished" disabled={nowStatus === 'expired'} />
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
