'use client';

import Link from 'next/link';
import styles from './index.module.scss';
import ConnectWallet from '../Wallet';

const Header = () => {
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <Link href={'/'}>BetMeme</Link>
        <div className={styles.content}>
          <Link className={styles.headerContent} href={`/swap`}>
            Swap
          </Link>
          <Link className={styles.headerContent} href={`/create-token`}>
            Create Token
          </Link>

          <ConnectWallet />
        </div>
      </div>
    </div>
  );
};

export default Header;
