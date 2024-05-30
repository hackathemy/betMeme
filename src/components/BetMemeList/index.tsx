import useBetMemeList from '@/hooks/useBetMemeList';
import Loading from '../Common/Loading';
import styles from './index.module.scss';
import BetCard from '../BetCard';

const BetMemeList = () => {
  const { isLoading, data: betMemes } = useBetMemeList();

  return (
    <div id="memeList">
      {isLoading && <Loading />}
      {!isLoading && (
        <div className={styles.products}>
          {betMemes?.map((v) => {
            return <BetCard key={v.id} betValue={v} />;
          })}
        </div>
      )}
    </div>
  );
};

export default BetMemeList;
