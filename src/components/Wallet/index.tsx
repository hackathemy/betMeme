import '@mysten/dapp-kit/dist/index.css';

import { ConnectModal, useCurrentAccount, useDisconnectWallet } from '@mysten/dapp-kit';
import { useState } from 'react';
import { not } from 'ramda';
import styles from './index.module.scss';

const ConnectWallet: React.FC = () => {
  const currentAccount = useCurrentAccount();
  const { mutate: disconnect } = useDisconnectWallet();

  const [open, setOpen] = useState(false);

  return (
    <div>
      {currentAccount ? (
        <button className={styles.disconnectWalletBtn} onClick={() => disconnect()}>
          <div className={styles.disconnectWallet}>{currentAccount?.address}</div>
        </button>
      ) : (
        <ConnectModal
          trigger={
            <button disabled={!!currentAccount} onClick={() => setOpen(not)}>
              Connect
            </button>
          }
          open={open}
          onOpenChange={(isOpen) => setOpen(isOpen)}
        />
      )}
    </div>
  );
};

export default ConnectWallet;
