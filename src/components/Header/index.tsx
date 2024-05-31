'use client';

import Link from 'next/link';
import styles from './index.module.scss';
import ConnectWallet from '../Wallet';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

const Header = () => {
  const router = usePathname();

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.content}>
          <Link className={clsx(styles.headerContent, router === '/' && styles.current)} href="/">
            🦇 BetMeme
          </Link>
          <Link className={clsx(styles.headerContent, router === '/create-bet' && styles.current)} href="/create-bet">
            Create MEME Bet
          </Link>
          <Link
            className={clsx(styles.headerContent, router === '/create-nft-bet' && styles.current)}
            href="/create-nft-bet"
          >
            Create NFT Bet
          </Link>
        </div>
        <div className={styles.content}>
          <Link className={clsx(styles.headerContent, router === '/claim' && styles.current)} href="/claim">
            My Bet
          </Link>
          <ConnectWallet />
        </div>
      </div>
    </div>
  );
};

export default Header;
