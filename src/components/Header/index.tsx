'use client';

import Link from 'next/link';
import styles from './index.module.scss';

const Header = () => {
  //   const { data: cartData } = useQuery({
  //     queryKey: ['usersCart'],
  //     queryFn: () => getUserCartList(user?.uid || ''),
  //   });

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

          <button className={styles.loginBtn}>{false ? 'Disconnect' : 'Connect'}</button>
        </div>
      </div>
    </div>
  );
};

export default Header;