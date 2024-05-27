import styles from './index.module.scss';
import { clsx } from 'clsx';

interface ButtonProps {
  name: string;
  onClick?: any;
  disabled?: boolean;
  styled?: string;
}

const Button: React.FC<ButtonProps> = ({ name, onClick, disabled, styled }) => {
  return (
    <button className={clsx(styles.createBtn, styled)} onClick={onClick} disabled={disabled}>
      {name}
    </button>
  );
};

export default Button;
