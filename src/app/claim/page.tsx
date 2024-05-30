'use client';

import Wrapper from '@/components/Wrapper';

import { useCurrentAccount, useSignTransactionBlock, useSuiClientQuery } from '@mysten/dapp-kit';
import { SuiClient, getFullnodeUrl } from '@mysten/sui.js/client';
import { TransactionBlock } from '@mysten/sui.js/transactions';
import styles from './index.module.scss';
import LottieContainer from '@/components/Common/Lottie';
import TrophyLottie from '@/assets/icons/lottie/TrophyLottie.json';

export default function Claim() {
  const client = new SuiClient({
    url: getFullnodeUrl('testnet'),
  });
  const currentAccount = useCurrentAccount();
  const signTransactionBlock = useSignTransactionBlock();
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

  const claim = async (type: string, userBet: any) => {
    if (!currentAccount) {
      return;
    }

    const txb = new TransactionBlock();
    txb.setGasBudget(10000000);

    //게임 아이디로 gameObject 조회해서 타입 가져오기(pb에도 있긴 함)
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

  return (
    <Wrapper>
      <div className={styles.container}>
        <h1>claim page</h1>
        <div className={styles.cardWrapper}>
          {data?.data
            .filter((d) => d.data?.type?.includes('UserBet'))
            .map((d: any) => {
              return (
                <div key={d.data?.digest} className={styles.claimContainer}>
                  <div className={styles.item}>
                    <div className={styles.itemRight}>
                      <div className={styles.title}>
                        <p>Winner Price</p>
                        <LottieContainer lottieData={TrophyLottie} className={styles.lottie} />
                      </div>
                      {/* 게임 정보가 있었으면 좋겠음, 게임아이디로 조회 하면 될 것 같은데 pb에 데이터들을 좀 넣어두면 도움이 되려나. */}
                      <span className={styles.upBorder}></span>
                      <span className={styles.downBorder}></span>
                    </div>

                    <div className={styles.itemLeft}>
                      <div className={styles.betInfo}>
                        <div className={styles.betList}>
                          Bet Status<div>{d.data?.content.fields.betUp ? <div>Up</div> : <div>Down</div>}</div>
                        </div>
                        <div className={styles.betList}>
                          Bet Amount<div>{d.data?.content.fields.amount}</div>
                        </div>
                      </div>
                      <div className={styles.buttons}>
                        {/* 아직 진행중, 클레임, 챌린지 중에 한 상태만 있으면 됨 */}
                        <button onClick={() => claim('claim', d)}>claim</button>
                        <button onClick={() => claim('callenge', d)}>challenge</button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </Wrapper>
  );
}
