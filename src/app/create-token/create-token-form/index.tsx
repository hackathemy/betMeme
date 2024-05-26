import { useCurrentAccount, useSignTransactionBlock } from '@mysten/dapp-kit';
import { TransactionBlock } from '@mysten/sui.js/transactions';
import { normalizeSuiAddress } from '@mysten/sui.js/utils';
import { getFullnodeUrl, SuiClient } from '@mysten/sui.js/client';
import { useMemo, useState } from 'react';

import initMoveByteCodeTemplate from './move-bytecode-template';
import { getBytecode } from './template';

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
      console.log(explorerLink);
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
    <form>
      <h1>Coin Generator</h1>
      <div>
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
          onChange={(val) => setDecimals(val.target.value || '9')}
          required
        />
        Coin Decimals:{' '}
        <input
          type="number"
          placeholder="Your total coin supply"
          value={totalSupply}
          onChange={(val) => setTotalSupply(val.target.value || '10000')}
          required
        />
        <div>
          <button onClick={onSubmit} disabled={!currentAccount || loading}>
            Create coin
          </button>
        </div>
      </div>
    </form>
  );
};

export default CreateTokenForm;
