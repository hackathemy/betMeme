'use client';

import Wrapper from '@/components/Wrapper';
import { useCurrentAccount, useSignTransactionBlock, useSuiClientQuery } from '@mysten/dapp-kit';
import { SuiClient, getFullnodeUrl } from '@mysten/sui.js/client';
import { TransactionBlock } from '@mysten/sui.js/transactions';

export default function Claim() {
  const client = new SuiClient({
    url: getFullnodeUrl('testnet'),
  });
  const currentAccount = useCurrentAccount();
  const signTransactionBlock = useSignTransactionBlock();
  const { data, isPending, error } = useSuiClientQuery('getOwnedObjects', {
    owner: currentAccount?.address as string,
    options: {
      showType: true,
      showOwner: true,
      showPreviousTransaction: true,
      showDisplay: true,
      showContent: true,
    },
  });

  const claim = async (userBet: any) => {
    if (!currentAccount) {
      return;
    }

    const txb = new TransactionBlock();
    txb.setGasBudget(10000000);
    txb.moveCall({
      target: `0x14832e50d21c6d6083995e85bb08be0dac26fa9f5ce2af3a0df1d1e9fe825361::betmeme::claim`,
      typeArguments: ['0xfef07a737803d73c50a3c8fc61b88fa2f8893801a51f7b49c6d203b207906231::fud::FUD'],
      arguments: [txb.object(`${userBet.data.content.fields.gameId}`), txb.pure(`${userBet.data.objectId}`)],
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
        <div>claim page</div>
        {data?.data
          .filter((d) => d.data?.type?.includes('UserBet'))
          .map((d) => {
            return (
              <div>
                <pre>{JSON.stringify(d, null, 2)}</pre>
                <button onClick={() => claim(d)}>claim</button>
              </div>
            );
          })}
      </div>
    </Wrapper>
  );
}
