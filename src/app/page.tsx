'use client';

import BetMemeList from '@/components/BetMemeList';
import Wrapper from '@/components/Wrapper';
import styles from './index.module.scss';
import clsx from 'clsx';
import Bet1JPEG from '@/assets/icons/main/bet1.jpeg';
import Bet2JPEG from '@/assets/icons/main/bet2.jpeg';
import Bet3JPEG from '@/assets/icons/main/bet3.jpeg';
import Bet4JPEG from '@/assets/icons/main/bet4.jpeg';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  return (
    <Wrapper>
      <div>
        <div className={styles.container}>
          <h1>Join the BetMeme powered by Web3</h1>
          <div className={styles.subTitle}>On this platform, you can bet on the value of meme tokens</div>
          <button className={clsx(styles.btnHover, styles.color8)} onClick={() => router.push('/#memeList')}>
            Let's Bet!
          </button>
          <div className={styles.imgContainer}>
            <img src={Bet1JPEG.src} />
            <img src={Bet2JPEG.src} />
            <img src={Bet3JPEG.src} />
            <img src={Bet4JPEG.src} />
          </div>
        </div>
        <BetMemeList />
      </div>
    </Wrapper>
  );
}
