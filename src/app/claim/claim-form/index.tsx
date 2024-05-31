import LottieContainer from '@/components/Common/Lottie';
import styles from './index.module.scss';
import TrophyLottie from '@/assets/icons/lottie/TrophyLottie.json';
import { SuiClient, getFullnodeUrl } from '@mysten/sui.js/client';
import { useCurrentAccount, useSignTransactionBlock, useSuiClientQuery } from '@mysten/dapp-kit';
import { TransactionBlock } from '@mysten/sui.js/transactions';
import { useMemo } from 'react';
import { RESULT_DURATION } from '@/constant';
import useBetMemeList from '@/hooks/useBetMemeList';
import clsx from 'clsx';
import GoodIconPNG from '@/assets/icons/common/GoodIcon.png';
import BadIconPNG from '@/assets/icons/common/BadIcon.png';

interface IClaimForm {
  value: any;
  price: string;
}

const ClaimForm = ({ value, price }: IClaimForm) => {
  const content = value.data?.content;
  const gameId = value.data?.content.fields.gameId;

  const client = new SuiClient({
    url: getFullnodeUrl('testnet'),
  });
  const currentAccount = useCurrentAccount();
  const signTransactionBlock = useSignTransactionBlock();
  const { data: betMemeList } = useBetMemeList();

  const getPbData = useMemo(() => {
    if (betMemeList) {
      return betMemeList.find((v) => v.object === gameId);
    }

    return null;
  }, [betMemeList]);

  const claim = async (type: string, userBet: any) => {
    if (!currentAccount) {
      return;
    }

    const txb = new TransactionBlock();
    txb.setGasBudget(10000000);

    //TODO: 게임 아이디로 gameObject 조회해서 타입 가져오기(pb에도 있긴 함)
    if (type === 'claim') {
      txb.moveCall({
        target: `${process.env.NEXT_PUBLIC_PACKAGE_ID}::betmeme::${type}`,
        typeArguments: ['0xfef07a737803d73c50a3c8fc61b88fa2f8893801a51f7b49c6d203b207906231::fud::FUD'],
        arguments: [
          txb.object(`${userBet.data.content.fields.gameId}`),
          txb.pure(`${userBet.data.objectId}`),
          txb.pure('0x6'),
        ],
      });
    } else {
      txb.moveCall({
        target: `${process.env.NEXT_PUBLIC_PACKAGE_ID}::betmeme::${type}`,
        typeArguments: ['0xfef07a737803d73c50a3c8fc61b88fa2f8893801a51f7b49c6d203b207906231::fud::FUD'],
        arguments: [txb.object(`${userBet.data.content.fields.gameId}`), txb.pure(`${userBet.data.objectId}`)],
      });
    }

    const { signature, transactionBlockBytes } = await signTransactionBlock.mutateAsync({
      transactionBlock: txb,
      account: currentAccount,
    });

    const tx = await client.executeTransactionBlock({
      signature,
      transactionBlock: transactionBlockBytes,
      requestType: 'WaitForEffectsCert',
    });

    const explorerLink = `https://testnet.suivision.xyz/txblock/${tx.digest}`;
    console.log(explorerLink);
  };

  const { data: object } = useSuiClientQuery('getObject', {
    id: gameId,
    options: {
      showType: true,
      showOwner: true,
      showPreviousTransaction: true,
      showDisplay: true,
      showContent: true,
    },
  });

  const objectData = useMemo(() => {
    const content: any = object?.data?.content;
    return content?.fields;
  }, [object]);
  const date = new Date();
  const nowStatus = useMemo(() => {
    if (date.getTime() > Number(objectData?.startTime) + Number(objectData?.duration) + RESULT_DURATION) {
      return 'expired';
    } else if (date.getTime() > Number(objectData?.startTime) + Number(objectData?.duration)) {
      return 'next';
    }

    return 'live';
  }, [objectData]);

  nowStatus === 'expired' && console.log(nowStatus, content, objectData);

  const isPriceUp = useMemo(() => {
    if (nowStatus !== 'expired' && getPbData) {
      return Number(price) > Number(getPbData.startPrice);
    }

    return false;
  }, [nowStatus, getPbData, price]);

  const returnStatus = useMemo(() => {
    if (nowStatus !== 'expired') {
      if (isPriceUp) {
        return (
          <div className={styles.statusContainer}>
            <p>
              Will <div className={styles.win}>Win</div>
            </p>
            <img className={styles.faceIcon} src={GoodIconPNG.src} />
          </div>
        );
      }

      return (
        <div className={styles.statusContainer}>
          <p>
            Will <div className={styles.lose}>Lose</div>
          </p>
          <img className={styles.faceIcon} src={BadIconPNG.src} />
        </div>
      );
    }
  }, [isPriceUp, getPbData, price]);

  const pricePercentage = useMemo(() => {
    const precent = (1 - Number(getPbData?.startPrice) / Number(price)) * 100;
    return precent;
  }, [isPriceUp, getPbData, price]);

  return (
    <div key={value.data?.digest} className={styles.claimContainer}>
      <div className={styles.item}>
        <div className={styles.itemRight}>
          <div className={styles.title}>
            {returnStatus}
            {nowStatus === 'expired' && (
              <>
                <p>Winner Price</p>
                <LottieContainer lottieData={TrophyLottie} className={styles.lottie} />
              </>
            )}
          </div>
          {/* 게임 정보가 있었으면 좋겠음, 게임아이디로 조회 하면 될 것 같은데 pb에 데이터들을 좀 넣어두면 도움이 되려나. */}
          <span className={styles.upBorder}></span>
          <span className={styles.downBorder}></span>
        </div>

        <div className={styles.itemLeft}>
          <div className={styles.betInfo}>
            <div className={styles.betList}>
              Bet Status<div>{content.fields.betUp ? <div>Up</div> : <div>Down</div>}</div>
            </div>
            <div className={styles.betList}>
              Bet Amount<div>{content.fields.amount}</div>
            </div>
            {nowStatus !== 'expired' && (
              <>
                <div className={styles.priceWrapper}>
                  <div className={styles.priceContainer}>
                    <div className={styles.priceTitle}>Start Price</div>
                    <div>{getPbData?.startPrice || '0.00'}</div>
                  </div>
                  <div className={styles.priceContainer}>
                    <div className={styles.priceTitle}>Current Price</div>
                    <div>{price}</div>
                  </div>
                </div>
                <div className={clsx(styles.percentage, pricePercentage > 0 && styles.isPlus)}>
                  {pricePercentage.toFixed(2)} %
                </div>
              </>
            )}
          </div>
          <div className={styles.buttons}>
            {/* 아직 진행중, 클레임, 챌린지 중에 한 상태만 있으면 됨 */}
            {nowStatus === 'expired' && (
              <>
                <button onClick={() => claim('claim', value)}>claim</button>
                <button onClick={() => claim('callenge', value)}>challenge</button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClaimForm;
