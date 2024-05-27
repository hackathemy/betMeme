import styles from './index.module.scss';

interface IModalHeaderProps {
  children: JSX.Element;
}

const ModalHeader: React.FC<IModalHeaderProps> = ({ children }) => {
  return <div className={styles.container}>{children}</div>;
};

export default ModalHeader;
