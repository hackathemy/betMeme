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

  const claim = async (userBet: any) => {
    if (!currentAccount) {
      return;
    }

    const txb = new TransactionBlock();
    txb.setGasBudget(10000000);
    txb.moveCall({
      target: `0xcaa782e6d3bb6bfa9819a57312292d4558900f96f8fe46062f4059d4d9673ecd::betmeme::claim`,
      typeArguments: ['0xfef07a737803d73c50a3c8fc61b88fa2f8893801a51f7b49c6d203b207906231::fud::FUD'],
      arguments: [
        txb.object(`${userBet.data.content.fields.gameId}`),
        txb.pure(`${userBet.data.objectId}`),
        txb.pure('0x6'),
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
            .map((d) => {
              return (
                <div key={d.data?.digest} className={styles.claimContainer}>
                  <div className={styles.item}>
                    <div className={styles.itemRight}>
                      <div className={styles.title}>
                        <p>Winner Price</p>
                        <LottieContainer lottieData={TrophyLottie} className={styles.lottie} />
                      </div>

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
                        <button onClick={() => claim(d)}>claim</button>
                        <button onClick={() => console.log('')}>challenge</button>
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
