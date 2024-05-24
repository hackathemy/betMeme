'use client';

import Wrapper from '@/components/Wrapper';
import { MouseEvent, useState } from 'react';
import styles from './index.module.scss';
import { useCurrentAccount } from '@mysten/dapp-kit';
// import { TransactionBlock } from '@mysten/sui.js/transactions';

export default function CreateToken() {
  const [name, setName] = useState('');
  const [symbol, setSymbol] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [decimals, setDecimals] = useState(9);
  const [totalSupply, setTotalSupply] = useState(0);
  const [submitLoading, setSubmitLoading] = useState(false);

  const currentAccount = useCurrentAccount();

  const createToken = async () => {
    try {
      setSubmitLoading(true);

      if (!currentAccount) return;

      // const txb = new TransactionBlock();
      console.log('make transaction and install extra library');
    } finally {
      setSubmitLoading(false);
    }
  };

  const onSubmit = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    try {
      await createToken();
    } catch (e) {
      console.error('error: ', e);
    }
  };
  console.log(name, symbol, description, imageUrl, decimals, totalSupply);

  return (
    <Wrapper>
      <form className={styles.formContainer}>
        Name:{' '}
        <input placeholder="Eg. Sui" value={name || ''} onChange={(val) => setName(val.target.value || '')} required />
        Coin Symbol:{' '}
        <input
          placeholder="Eg. SUI"
          value={symbol || ''}
          onChange={(val) => setSymbol(val.target.value || '')}
          required
        />
        Description:{' '}
        <input
          placeholder="Eg. Some description about the coin"
          value={description || ''}
          onChange={(val) => setDescription(val.target.value || '')}
          required
        />
        Coin Image URL:{' '}
        <input
          placeholder="Eg. https://sui.com/images/logo.png"
          value={imageUrl || ''}
          onChange={(val) => setImageUrl(val.target.value || '')}
          required
        />
        Coin Decimals:{' '}
        <input
          type="number"
          placeholder="Coin Decimals"
          value={decimals}
          onChange={(val) => setDecimals(Number(val.target.value) || 9)}
          required
        />
        Coin Decimals:{' '}
        <input
          type="number"
          placeholder="Your total coin supply"
          value={totalSupply}
          onChange={(val) => setTotalSupply(Number(val.target.value) || 0)}
          required
        />
        <button onClick={onSubmit} disabled={submitLoading}>
          Create Coin
        </button>
      </form>
    </Wrapper>
  );
}
