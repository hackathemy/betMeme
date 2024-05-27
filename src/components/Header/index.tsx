'use client';

import Link from 'next/link';
import styles from './index.module.scss';
import ConnectWallet from '../Wallet';
import { useRouter } from 'next/navigation';

const Header = () => {
  const router = useRouter();
  console.log(router);
  // const matchRoot =
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.content}>
          <Link className={styles.headerContent} href="/">
            BetMeme
          </Link>
          <Link className={styles.headerContent} href="/claim">
            Claim
          </Link>
          <Link className={styles.headerContent} href="/create-bet">
            Create Bet
          </Link>
          <Link className={styles.headerContent} href="/create-token">
            Create Token
          </Link>
        </div>
        <ConnectWallet />
      </div>
    </div>
  );
};

export default Header;
