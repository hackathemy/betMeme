import { useCurrentAccount, useSignTransactionBlock, useSuiClientQuery } from '@mysten/dapp-kit';
import { getFullnodeUrl, SuiClient } from '@mysten/sui.js/client';
import { useState } from 'react';

import { Option, Select } from '@mui/joy';
import styles from './index.module.scss';
import InputBox from '@/components/Common/InputBox';
import Button from '@/components/Common/Button';
import { TransactionBlock } from '@mysten/sui.js/transactions';
import { isEmpty } from 'lodash';
import useMakeObjects from '@/hooks/useMakeObjects';

const CreateBetForm = () => {
  const client = new SuiClient({
    url: getFullnodeUrl('testnet'),
  });
  const signTransactionBlock = useSignTransactionBlock();
  const currentAccount = useCurrentAccount();
  const objects = useMakeObjects(currentAccount?.address || '');

  const [loading, setLoading] = useState(false);
  const [coinId, setCoinId] = useState('');
  const [duration, setDuration] = useState('3600');
  const [txResult, setTxResult] = useState('');

  const createBet = async () => {
    try {
      setLoading(true);

      if (!currentAccount) return;

      const txb = new TransactionBlock();
      const [coin] = txb.splitCoins(txb.object(coinId), [txb.pure(10 * 1000000000)]);
      txb.setGasBudget(10000000);
      txb.moveCall({
        target: `0x14832e50d21c6d6083995e85bb08be0dac26fa9f5ce2af3a0df1d1e9fe825361::betmeme::create`,
        typeArguments: ['0x9b388609e04af010f9b35af93f4f4cb672774183bba254b95156fd8c9589b396::jun::JUN'],
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

      console.log(tx);
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

  const handleChange = (event: React.SyntheticEvent | null, value: string | null) => {
    event?.preventDefault();

    if (value) {
      setCoinId(value);
    }
  };

  return (
    <form className={styles.container}>
      <h1>Create Bet</h1>
      <div className={styles.inputContainer}>
        <div className={styles.selectContainer}>
          <div className={styles.selectTitle}>Coin</div>
          <Select
            className={styles.selectContent}
            placeholder="Choose coin"
            size="md"
            variant="solid"
            onChange={handleChange}
          >
            {objects.map((v) => {
              const regex = /0x2::coin::Coin<([^:]+)::[^:]+::([^>]+)>/;
              const match = v.data.content.type.match(regex);
              const hash = match?.[1] || '';
              const type = match?.[2] || '';

              return (
                <Option className={styles.selectOption} key={v.data.objectId} value={hash}>
                  {type}
                </Option>
              );
            })}
          </Select>
        </div>
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
