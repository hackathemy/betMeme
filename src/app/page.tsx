'use client';

import Wrapper from '@/components/Wrapper';
import styles from './index.module.scss';
import useBetMemeList from '@/hooks/useBetMemeList';
import Loading from '@/components/Common/Loading';
import Button from '@/components/Button';
import BetMemeModal from '@/components/BetMemeModal';
import { useState } from 'react';

export default function Home() {
  const { isLoading, data: betMemes } = useBetMemeList();

  const [modalView, setModalView] = useState(false);

  return (
    <Wrapper>
      <div>
        {isLoading && <Loading />}
        {!isLoading && (
          <div className={styles.products}>
            {betMemes?.map((v) => {
              const lockedPrice = (v.denom1Amount + v.denom2Amount).toFixed(6);

              return (
                <>
                  <div key={v.id} className={styles.betCard}>
                    <div>
                      {v.title}
                      <div>
                        Locked Price: <div>{lockedPrice}</div>
                      </div>
                    </div>
                    <Button name={`Let' Bet!!`} onClick={() => setModalView(!modalView)} />
                    <BetMemeModal modalView={modalView} onCloseModal={setModalView} />
                  </div>
                </>
              );
            })}
          </div>
        )}
      </div>
    </Wrapper>
  );
}
