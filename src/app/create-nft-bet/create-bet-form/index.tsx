import { useCurrentAccount, useSignTransactionBlock } from '@mysten/dapp-kit';
import { getFullnodeUrl, SuiClient } from '@mysten/sui.js/client';
import { useState } from 'react';
import pb from '@/api/pocketbase';

import { Option, Select } from '@mui/joy';
import styles from './index.module.scss';
import InputBox from '@/components/Common/InputBox';
import Button from '@/components/Common/Button';
import { TransactionBlock } from '@mysten/sui.js/transactions';
import { isEmpty } from 'lodash';
import useMakeObjects from '@/hooks/useMakeObjects';
import { DECIMAL_UNIT, GAS_BUDGET } from '@/constant';

const CreateBetForm = () => {
  const client = new SuiClient({
    url: getFullnodeUrl('testnet'),
  });
  const signTransactionBlock = useSignTransactionBlock();
  const currentAccount = useCurrentAccount();
  const objects = useMakeObjects(currentAccount?.address || '');

  const [loading, setLoading] = useState(false);
  const [coinId, setCoinId] = useState('');
  const [coinType, setCoinType] = useState('');
  const [duration, setDuration] = useState<number>();
  const [minAmount, setMinAmount] = useState<number>();
  const [markedPrice, setMarkedPrice] = useState<number>(1);
  const [basePrize, setBasePrize] = useState<number>();
  const [txResult, setTxResult] = useState('');

  const createBet = async () => {
    try {
      setLoading(true);

      console.log(coinType, coinId);
      if (!basePrize || !duration || !minAmount) {
        return;
      }

      if (!currentAccount) return;

      const txb = new TransactionBlock();
      const [coin] = txb.splitCoins(txb.object(coinId), [txb.pure(basePrize * DECIMAL_UNIT)]);
      txb.setGasBudget(GAS_BUDGET);
      txb.moveCall({
        target: `${process.env.NEXT_PUBLIC_PACKAGE_ID}::betmeme::create`,
        typeArguments: [coinType],
        arguments: [
          txb.pure(markedPrice),
          txb.pure(duration * 1000),
          txb.pure(minAmount * DECIMAL_UNIT),
          txb.pure('0x6'),
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
        options: {
          showEffects: true,
          showObjectChanges: true,
        },
      });

      const objectId = tx.objectChanges?.filter((v) => v.type === 'created').map((v: any) => v.objectId)[0];
      const collection = {
        title: 'Fud the Pug',
        object: objectId,
        denom: 'FUD',
      };

      await pb.collection('betmemes').create(collection);
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

  const handleChange = (event: React.SyntheticEvent | null, value: any | null) => {
    event?.preventDefault();

    if (value) {
      setCoinId(value.objectId);
      const regex = /0x2::coin::Coin<([^>]+)>/;
      const match = value.content.type.match(regex);
      const type = match?.[1] || '';
      setCoinType(type);
    }
  };

  return (
    <form className={styles.container}>
      <h1>Create NFT Bet</h1>
      <div className={styles.subTitle}>Bet NFT Price UP or DOWN</div>
      <div className={styles.inputContainer}>
        <div className={styles.selectContainer}>
          <div className={styles.selectTitle}>NFT</div>
          <Select
            className={styles.selectContent}
            placeholder="Choose NFT"
            size="md"
            variant="solid"
            onChange={handleChange}
          >
            {objects.map((v) => {
              const regex = /0x2::coin::Coin<([^:]+)::[^:]+::([^>]+)>/;
              const match = v.data.content.type.match(regex);
              const type = match?.[2] || '';

              return (
                <Option key={v.data.objectId} value={v.data}>
                  {type}
                </Option>
              );
            })}
          </Select>
        </div>
        <div className={styles.selectContainer}>
          <div className={styles.selectTitle}>Bet Coin</div>
          <Select
            className={styles.selectContent}
            placeholder="Choose bet coin"
            size="md"
            variant="solid"
            onChange={handleChange}
          >
            {objects.map((v) => {
              const regex = /0x2::coin::Coin<([^:]+)::[^:]+::([^>]+)>/;
              const match = v.data.content.type.match(regex);
              const type = match?.[2] || '';

              return (
                <Option key={v.data.objectId} value={v.data}>
                  {type}
                </Option>
              );
            })}
          </Select>
        </div>
        <InputBox
          title="Donate for Prize"
          placeholder="Donate for Prize"
          value={basePrize || ''}
          onChange={(val) => setBasePrize(Number(val.target.value) || 0)}
          required={true}
        />
        <InputBox
          title="Duration"
          placeholder="Duration"
          value={duration || ''}
          onChange={(val) => setDuration(Number(val.target.value) || 0)}
          required={true}
        />
        <InputBox
          title="Minimum Bet Amount"
          placeholder="Minimum Bet Amount"
          value={minAmount || ''}
          onChange={(val) => setMinAmount(Number(val.target.value) || 0)}
          required={true}
        />
        <InputBox
          title="Current Price"
          placeholder="Current Price"
          value={markedPrice || ''}
          onChange={(val) => setMarkedPrice(Number(val.target.value) || 0)}
          required={true}
          readonly={true}
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
