import useBetMemeList from '@/hooks/useBetMemeList';
import Loading from '../Common/Loading';
import styles from './index.module.scss';
import BetCard from '../BetCard';
import { useEffect, useState } from 'react';
import { getRandomBetween, pudMaxValue, pudMinValue } from '@/utils/makePrice';

const BetMemeList = () => {
  const { isLoading, data: betMemes } = useBetMemeList();
  const [price, setPrice] = useState('0.0000002688');

  useEffect(() => {
    const intervalId = setInterval(() => {
      const randomValue = getRandomBetween(pudMinValue, pudMaxValue);
      setPrice(randomValue);
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div id="memeList">
      {isLoading && <Loading />}
      {!isLoading && (
        <div className={styles.products}>
          {betMemes?.map((v) => {
            return <BetCard key={v.id} betValue={v} price={price} />;
          })}
        </div>
      )}
    </div>
  );
};

export default BetMemeList;
