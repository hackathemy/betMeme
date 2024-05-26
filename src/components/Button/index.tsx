import styles from './index.module.scss';

interface ButtonProps {
  name: string;
  onClick?: () => {};
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ name, onClick, disabled }) => {
  return (
    <button className={styles.createBtn} onClick={onClick} disabled={disabled}>
      {name}
    </button>
  );
};

export default Button;
