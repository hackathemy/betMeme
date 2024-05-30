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
      const [coin] = txb.splitCoins(txb.object('0x5ebcbb21d0fc805fd0cab535550e032e557285d498b3a55ac50416843966c5f7'), [
        txb.pure(10 * 1000000000),
      ]);
      txb.setGasBudget(10000000);
      txb.moveCall({
        target: `0x14832e50d21c6d6083995e85bb08be0dac26fa9f5ce2af3a0df1d1e9fe825361::betmeme::create`,
        typeArguments: ['0xfef07a737803d73c50a3c8fc61b88fa2f8893801a51f7b49c6d203b207906231::fud::FUD'],
        arguments: [txb.pure(10), txb.pure(duration), txb.pure('0x6'), coin],
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
