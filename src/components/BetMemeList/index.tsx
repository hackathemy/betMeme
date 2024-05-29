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
            return (
              <BetCard key={v.id} betValue={v} />
              // <div key={v.id} className={styles.betCard}>
              //   <div>
              //     <div className={styles.cardHeader}>
              //       <div className={styles.cardBasic}>
              //         <div className={styles.blackContainer}>
              //           <div className={styles.live}>LIVE</div>00:00:00:00
              //         </div>
              //         <div className={styles.blackContainer}>Game 1</div>
              //       </div>
              //       <img src={InfoIconSVG.src} />
              //     </div>
              //     <div className={styles.cardContent}>
              //       <img
              //         src="https://assets.coingecko.com/coins/images/33610/standard/pug-head.png"
              //         alt="fud the pug"
              //         className={styles.tokenImg}
              //       />
              //       <div className={styles.cardInfo}>
              //         <div className={styles.cardList}>
              //           {v.title}
              //           <div>price</div>
              //         </div>
              //         <div className={styles.cardList}>
              //           Total Locked<div>{lockedAmount} FUD</div>
              //         </div>
              //         <div className={styles.cardList}>
              //           Up<div>{v.upAmount} FUD</div>
              //         </div>
              //         <div className={styles.cardList}>
              //           Down<div>{v.downAmount} FUD</div>
              //         </div>
              //       </div>
              //     </div>
              //   </div>
              //   {v.isEnd && <Button name="Game is over 🤭" />}
              //   {v.isActive && !v.isEnd && (
              //     <div>
              //       <Button
              //         styled={styles.button}
              //         name={`Pray for 🔺 UP`}
              //         disabled={v.isEnd}
              //         onClick={() => testBet()}
              //       />
              //       <Button
              //         styled={styles.button}
              //         name={`Pray for 🔻 DOWN`}
              //         disabled={v.isEnd}
              //         onClick={() => setModalView(true)}
              //       />
              //     </div>
              //   )}
              // </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default BetMemeList;
