import { SuiClient, getFullnodeUrl } from '@mysten/sui.js/client';
import Modal from '../Common/Modal';
import ModalHeader from '../Common/Modal/ModalHeader';
import { useCurrentAccount, useSignTransactionBlock } from '@mysten/dapp-kit';
import { TransactionBlock } from '@mysten/sui.js/transactions';
import Button from '../Common/Button';
import styles from './index.module.scss';
import { IBetMemesProps } from '@/types/bet-memes';
import InputBox from '../Common/InputBox';
import { useState } from 'react';
import CloseIconSVG from '@/assets/icons/common/CloseIcon.svg';

interface IBetMemeModalProps {
  betValue: IBetMemesProps;
  modalView: boolean;
  onCloseModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const BetMemeModal: React.FC<IBetMemeModalProps> = ({ betValue, modalView, onCloseModal }) => {
  const client = new SuiClient({
    url: getFullnodeUrl('testnet'),
  });
  const currentAccount = useCurrentAccount();
  const signTransactionBlock = useSignTransactionBlock();

  const [betAmount, setBetAmount] = useState('');

  const betting = async (direction: string) => {
    try {
      if (!currentAccount) {
        return;
      }

      console.log(direction);

      const txb = new TransactionBlock();
      const [coin] = txb.splitCoins(txb.object('0x5ebcbb21d0fc805fd0cab535550e032e557285d498b3a55ac50416843966c5f7'), [
        txb.pure(Number(betAmount) * 1000000000),
      ]);
      txb.setGasBudget(10000000);
      txb.moveCall({
        target: `0x14832e50d21c6d6083995e85bb08be0dac26fa9f5ce2af3a0df1d1e9fe825361::betmeme::bet`,
        typeArguments: ['0xfef07a737803d73c50a3c8fc61b88fa2f8893801a51f7b49c6d203b207906231::fud::FUD'],
        arguments: [
          txb.pure('0x9ad0d5055aa29850d9b52a07ad7b5531bc3930403142708752434b74ef1ad1d2'),
          txb.pure('0x6'),
          txb.pure(true),
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
        requestType: 'WaitForEffectsCert',
      });

      const explorerLink = `https://suiscan.xyz/testnet/tx/${tx.digest}`;
      console.log(explorerLink);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Modal open={modalView} onClose={onCloseModal}>
      <>
        <ModalHeader>
          <img src={CloseIconSVG.src} onClick={() => onCloseModal(false)} className={styles.closeBtn} />
        </ModalHeader>
        <div className={styles.container}>
          <div>
            <div className={styles.betStatus}>
              Up: <div>{betValue.upAmount}</div>
            </div>
            <div className={styles.betStatus}>
              Down: <div>{betValue.downAmount}</div>
            </div>
            <div className={styles.amountInput}>
              <div>amount: 123</div>
              <InputBox
                title="Bet Amount"
                placeholder="How much?"
                value={betAmount}
                onChange={(val) => setBetAmount(val.target.value || '')}
              />
            </div>
          </div>
          <Button
            styled={styles.button}
            name={`Pray for 🔺 UP`}
            disabled={betValue.isEnd}
            onClick={() => betting('up')}
          />
          <Button
            styled={styles.button}
            name={`Pray for 🔻 Down`}
            disabled={betValue.isEnd}
            onClick={() => betting('down')}
          />
        </div>
      </>
    </Modal>
  );
};

export default BetMemeModal;
