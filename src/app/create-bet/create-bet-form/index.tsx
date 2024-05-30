import { useCurrentAccount, useSignTransactionBlock, useSuiClientQuery } from '@mysten/dapp-kit';
import { getFullnodeUrl, SuiClient } from '@mysten/sui.js/client';
import { useEffect, useState } from 'react';
import pb from '@/api/pocketbase';

import { Option, Select } from '@mui/joy';
import styles from './index.module.scss';
import InputBox from '@/components/Common/InputBox';
import Button from '@/components/Common/Button';
import { TransactionBlock } from '@mysten/sui.js/transactions';
import { isEmpty } from 'lodash';
import useMakeObjects from '@/hooks/useMakeObjects';
import useGetTransactionBlock from '@/hooks/useGetTransactionBlock';

const CreateBetForm = () => {
  const client = new SuiClient({
    url: getFullnodeUrl('testnet'),
  });
  const signTransactionBlock = useSignTransactionBlock();
  const currentAccount = useCurrentAccount();
  const objects = useMakeObjects(currentAccount?.address || '');

  const [loading, setLoading] = useState(false);
  const [txDigest, setTxDigest] = useState('');
  const [coinId, setCoinId] = useState('');
  const [duration, setDuration] = useState('3600');
  const [txResult, setTxResult] = useState('');

  const { data: betObject, refetch } = useGetTransactionBlock(txDigest);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (txDigest) {
        refetch();
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [txDigest, refetch]);

  useEffect(() => {
    if (betObject) {
      saveBetObjectToDB(betObject);
    }
  }, [betObject]);

  const saveBetObjectToDB = async (betObject: any) => {
    try {
      const collection = {
        title: 'Fud the Pug',
        object: betObject,
        denom: 'FUD',
      };

      await pb.collection('betmemes').create(collection);

      setTxDigest('');
    } catch (error) {
      console.error('Error saving betObject to DB:', error);
    }
  };

  const createBet = async () => {
    try {
      setLoading(true);

      if (!currentAccount) return;

      const txb = new TransactionBlock();
      const [coin] = txb.splitCoins(txb.object(coinId), [txb.pure(10 * 1000000000)]);
      txb.setGasBudget(10000000);
      txb.moveCall({
        target: `0xcaa782e6d3bb6bfa9819a57312292d4558900f96f8fe46062f4059d4d9673ecd::betmeme::create`,
        typeArguments: ['0xfef07a737803d73c50a3c8fc61b88fa2f8893801a51f7b49c6d203b207906231::fud::FUD'],
        arguments: [txb.pure(10), txb.pure(duration), txb.pure(1000), txb.pure('0x6'), coin],
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

      setTxDigest(tx.digest);
      const explorerLink = `https://testnet.suivision.xyz/txblock/${tx.digest}`;
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
              const type = match?.[2] || '';

              return (
                <Option key={v.data.objectId} value={v.data.objectId}>
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
