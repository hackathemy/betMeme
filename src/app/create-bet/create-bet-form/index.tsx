import { useCurrentAccount, useSignTransactionBlock } from '@mysten/dapp-kit';
import { getFullnodeUrl, SuiClient } from '@mysten/sui.js/client';
import { useMemo, useState } from 'react';

import styles from './index.module.scss';
import InputBox from '@/components/Common/InputBox';
import Button from '@/components/Common/Button';

const CreateBetForm = () => {
  const client = new SuiClient({
    url: getFullnodeUrl('testnet'),
  });
  const currentAccount = useCurrentAccount();
  const signTransactionBlock = useSignTransactionBlock();

  const [loading, setLoading] = useState(false);
  const [coinId, setCoinId] = useState('');
  const [duration, setDuration] = useState('');

  const newBet = useMemo(() => {
    return {
      coinId,
      duration,
    };
  }, [coinId, duration]);

  const createBet = async () => {
    try {
      setLoading(true);

      if (!currentAccount) return;
    } catch (e) {
      console.error(e);
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
    </form>
  );
};

export default CreateBetForm;
