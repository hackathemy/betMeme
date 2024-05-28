'use client';

import Wrapper from '@/components/Wrapper';
import styles from './index.module.scss';
import useBetMemeList from '@/hooks/useBetMemeList';
import Loading from '@/components/Common/Loading';
import Button from '@/components/Common/Button';
import BetMemeModal from '@/components/BetMemeModal';
import { useState } from 'react';
import InfoIconSVG from '@/assets/icons/common/InfoIcon.svg';
import { TransactionBlock } from '@mysten/sui.js/transactions';
import { useCurrentAccount, useSignTransactionBlock, useSuiClientQuery } from '@mysten/dapp-kit';
import { SuiClient, getFullnodeUrl } from '@mysten/sui.js/client';

export default function Home() {
  const { isLoading, data: betMemes } = useBetMemeList();
  const client = new SuiClient({
    url: getFullnodeUrl('testnet'),
  });
  const currentAccount = useCurrentAccount();
  const signTransactionBlock = useSignTransactionBlock();

  const [modalView, setModalView] = useState(false);

  const testBet = async () => {
    if (!currentAccount) {
      return;
    }

    const txb = new TransactionBlock();
    const [coin] = txb.splitCoins(txb.object('0x5ebcbb21d0fc805fd0cab535550e032e557285d498b3a55ac50416843966c5f7'), [
      txb.pure(1000 * 1000000000),
    ]);
    txb.setGasBudget(10000000);
    txb.moveCall({
      target: `0x14832e50d21c6d6083995e85bb08be0dac26fa9f5ce2af3a0df1d1e9fe825361::betmeme::bet`,
      typeArguments: ['0xfef07a737803d73c50a3c8fc61b88fa2f8893801a51f7b49c6d203b207906231::fud::FUD'],
      arguments: [
        txb.pure('0x9ad0d5055aa29850d9b52a07ad7b5531bc3930403142708752434b74ef1ad1d2'),
        txb.pure('0x6'),
        txb.pure(true),
        coin,
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

    const explorerLink = `https://suiscan.xyz/testnet/tx/${tx.digest}`;
    console.log(explorerLink);
  };

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
                      <Button
                        styled={styles.button}
                        name={`Pray for 🔺 UP`}
                        disabled={v.isEnd}
                        onClick={() => testBet()}
                      />
                      <Button
                        styled={styles.button}
                        name={`Pray for 🔻 DOWN`}
                        disabled={v.isEnd}
                        onClick={() => setModalView(true)}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
        <BetMemeModal modalView={modalView} onCloseModal={() => setModalView(false)} />
      </div>
    </Wrapper>
  );
}
