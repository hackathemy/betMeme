"use client";

import Header from "../Header";
import Loading from "../Common/Loading";
import styles from "./index.module.scss";
import { useRouter } from "next/navigation";

interface WrapperProps {
  children: JSX.Element;
  requireAdmin?: boolean;
}

const Wrapper: React.FC<WrapperProps> = ({ children, requireAdmin }) => {
  const router = useRouter();

  if (false) {
    return <Loading />;
  }

  if (false) {
    router.replace("/");
  }

  return (
    <div className={styles.container}>
      <Header />

      <div>
        <div className={styles.body}>
          {children}
          <div className={styles.footer}>Footer</div>
        </div>
      </div>
    </div>
  );
};

export default Wrapper;
