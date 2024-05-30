import { SuiClient, getFullnodeUrl } from '@mysten/sui.js/client';
import Modal from '../Common/Modal';
import ModalHeader from '../Common/Modal/ModalHeader';
import { useCurrentAccount, useSignTransactionBlock, useSuiClientQuery } from '@mysten/dapp-kit';
import { TransactionBlock } from '@mysten/sui.js/transactions';
import styles from './index.module.scss';
import { IBetMemesProps } from '@/types/bet-memes';
import InputBox from '../Common/InputBox';
import { useState } from 'react';
import CloseIconSVG from '@/assets/icons/common/CloseIcon.svg';
import { DECIMAL_UNIT, GAS_BUDGET } from '@/constant';
import clsx from 'clsx';
import IncreaseIconPNG from '@/assets/icons/common/IncreaseIcon.png';
import DecreaseIconPNG from '@/assets/icons/common/DecreaseIcon.png';

interface IBetMemeModalProps {
  betValue: IBetMemesProps;
  betData: any;
  modalView: boolean;
  onCloseModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const BetMemeModal: React.FC<IBetMemeModalProps> = ({ betValue, betData, modalView, onCloseModal }) => {
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

  const coins = data?.data.filter((obj: any) => {
    return obj.data.type.indexOf(betValue.denom) >= 0;
  });

  const [betAmount, setBetAmount] = useState('');

  const betting = async (direction: boolean) => {
    try {
      if (!currentAccount || !coins || !coins.length) {
        return;
      }

      const txb = new TransactionBlock();
      const [coin] = txb.splitCoins(txb.object(coins[0].data?.objectId || ''), [
        txb.pure(Number(betAmount) * DECIMAL_UNIT),
      ]);
      txb.setGasBudget(GAS_BUDGET);
      txb.moveCall({
        target: `${process.env.NEXT_PUBLIC_PACKAGE_ID}::betmeme::bet`,
        typeArguments: [betValue.denom],
        arguments: [txb.pure(betValue.object), txb.pure('0x6'), txb.pure(direction), coin],
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

      const explorerLink = `https://testnet.suivision.xyz/txblock/${tx.digest}`;
      console.log(explorerLink);
      onCloseModal(false);
      setBetAmount('');
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
              Up<div className={styles.upAmount}>{betData.upAmount}</div>
            </div>
            <div className={styles.betStatus}>
              Down<div className={styles.downAmount}>{betData.downAmount}</div>
            </div>
            <div className={styles.amountInput}>
              <div className={styles.amountPrice}>Budget: {123}</div>
              <InputBox
                title="Bet Amount"
                placeholder="How much?"
                value={betAmount}
                onChange={(val) => setBetAmount(val.target.value || '')}
                styled={styles.inputBox}
              />
            </div>
          </div>
          <div className={styles.buttonContainer}>
            <button className={clsx(styles.button, styles.up)} onClick={() => betting(true)}>
              UP
              <div className={clsx(styles.cursor, styles.upImg)}>
                <img src={IncreaseIconPNG.src} />
              </div>
            </button>
            <button className={clsx(styles.button, styles.down)} onClick={() => betting(false)}>
              DOWN
              <div className={clsx(styles.cursor, styles.downImg)}>
                <img src={DecreaseIconPNG.src} />
              </div>
            </button>
          </div>
        </div>
      </>
    </Modal>
  );
};

export default BetMemeModal;
