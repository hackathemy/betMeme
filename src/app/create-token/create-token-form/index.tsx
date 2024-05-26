import { useCurrentAccount, useSignTransactionBlock } from '@mysten/dapp-kit';
import { TransactionBlock } from '@mysten/sui.js/transactions';
import { normalizeSuiAddress } from '@mysten/sui.js/utils';
import { getFullnodeUrl, SuiClient } from '@mysten/sui.js/client';
import { useMemo, useState } from 'react';

import initMoveByteCodeTemplate from './move-bytecode-template';
import { getBytecode } from './template';
import styles from './index.module.scss';
import InputBox from '@/components/InputBox';
import { isEmpty } from 'ramda';
import Button from '@/components/Button';

const CreateTokenForm = () => {
  const client = new SuiClient({
    url: getFullnodeUrl('testnet'),
  });
  const currentAccount = useCurrentAccount();
  const signTransactionBlock = useSignTransactionBlock();

  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [symbol, setSymbol] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [decimals, setDecimals] = useState('9');
  const [totalSupply, setTotalSupply] = useState('10000');
  const [txResult, setTxResult] = useState('');

  const newCoin = useMemo(() => {
    return {
      decimals,
      description,
      fixedSupply: true,
      imageUrl,
      name,
      symbol,
      totalSupply,
    };
  }, [name, symbol, description, imageUrl, decimals, totalSupply]);

  const createToken = async () => {
    try {
      setLoading(true);

      if (!currentAccount) return;

      await initMoveByteCodeTemplate('/move_bytecode_template_bg.wasm');

      const txb = new TransactionBlock();

      const [upgradeCap] = txb.publish({
        modules: [
          [
            ...getBytecode({
              ...newCoin,
              recipient: currentAccount.address,
            }),
          ],
        ],
        dependencies: [normalizeSuiAddress('0x1'), normalizeSuiAddress('0x2')],
      });

      txb.transferObjects([upgradeCap], txb.pure(currentAccount.address));

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
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async () => {
    try {
      await createToken();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <form className={styles.container}>
      <h1>Coin Generator</h1>
      <div className={styles.inputContainer}>
        <InputBox
          title="Name"
          placeholder="Coin name"
          value={name || ''}
          onChange={(val) => setName(val.target.value || '')}
          required={true}
        />
        <InputBox
          title="Coin Symbol"
          placeholder="Coin symbol"
          value={symbol || ''}
          onChange={(val) => setSymbol(val.target.value || '')}
          required={true}
        />
        <InputBox
          title="Description"
          placeholder="Description about the coin"
          value={description || ''}
          onChange={(val) => setDescription(val.target.value || '')}
          required={true}
        />
        <InputBox
          title="Coin Image URL"
          placeholder="https://sui.com/images/logo.png"
          value={imageUrl || ''}
          onChange={(val) => setImageUrl(val.target.value || '')}
          required={true}
        />
        <InputBox
          title="Coin Decimals"
          placeholder="Coin Decimals"
          value={decimals || ''}
          onChange={(val) => setDecimals(val.target.value || '')}
          required={true}
          type="number"
        />
        <InputBox
          title="Total Supply"
          placeholder="Coin total supply"
          value={totalSupply || ''}
          onChange={(val) => setTotalSupply(val.target.value || '')}
          required={true}
          type="number"
        />
        <Button name="Create coin" onClick={onSubmit} disabled={!currentAccount || loading} />
      </div>
      {!isEmpty(txResult) && (
        <a target="_blank" href={txResult} className={styles.explorerLink}>
          Go to explorer {`->`}
        </a>
      )}
    </form>
  );
};

export default CreateTokenForm;
