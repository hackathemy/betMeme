'use client';

import Header from '../Header';
import Loading from '../Common/Loading';
import styles from './index.module.scss';
import { useCurrentWallet } from '@mysten/dapp-kit';

interface WrapperProps {
  children: JSX.Element;
}

const Wrapper: React.FC<WrapperProps> = ({ children }) => {
  const { isConnecting } = useCurrentWallet();

  if (isConnecting) {
    return <Loading />;
  }

  return (
    <div className={styles.container}>
      <Header />

      <div>
        <div className={styles.body}>
          {children}
          <div className={styles.footer}>Betmeme</div>
        </div>
      </div>
    </div>
  );
};

export default Wrapper;
