import { useCurrentAccount, useSignTransactionBlock } from '@mysten/dapp-kit';
import { getFullnodeUrl, SuiClient } from '@mysten/sui.js/client';
import { useState } from 'react';

import styles from './index.module.scss';
import InputBox from '@/components/Common/InputBox';
import Button from '@/components/Common/Button';
import { TransactionBlock } from '@mysten/sui.js/transactions';
import { isEmpty } from 'lodash';

const CreateBetForm = () => {
  const client = new SuiClient({
    url: getFullnodeUrl('testnet'),
  });
  const currentAccount = useCurrentAccount();
  const signTransactionBlock = useSignTransactionBlock();

  const [loading, setLoading] = useState(false);
  const [coinId, setCoinId] = useState('');
  const [duration, setDuration] = useState('');
  const [txResult, setTxResult] = useState('');

  const createBet = async () => {
    try {
      setLoading(true);

      if (!currentAccount) return;

      const txb = new TransactionBlock();

      txb.moveCall({
        target: `0xd294e0ea9798b19576a0ea0846150f7b69cb664c7e633157bee5b91694b9bdcf::betmeme::createGame`,
        arguments: [
          txb.pure('0x3887f72bdc610515aae42402722b71594239e037aec05938c1bded3a2f1c5f66'),
          txb.pure(10),
          txb.pure(duration),
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

      const explorerLink = `https://suiscan.xyz/testnet/tx/${tx.digest}`;
      setTxResult(explorerLink);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async () => {
    try {
      await createBet();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <form className={styles.container}>
      <h1>Create Bet</h1>
      <div className={styles.inputContainer}>
        <InputBox
          title="Coin"
          placeholder="Coin Object Id"
          value={coinId}
          onChange={(val) => setCoinId(val.target.value || '')}
          required={true}
        />
        <InputBox
          title="Duration"
          placeholder="Duration"
          value={duration}
          onChange={(val) => setDuration(val.target.value || '')}
          required={true}
        />
        <Button name="Create Bet" onClick={onSubmit} disabled={!currentAccount || loading} />
      </div>
      {!isEmpty(txResult) && (
        <a target="_blank" href={txResult} className={styles.explorerLink}>
          Go to explorer {`->`}
        </a>
      )}
    </form>
  );
};

export default CreateBetForm;
