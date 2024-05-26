import { ChangeEventHandler } from 'react';
import styles from './index.module.scss';

interface InputBoxProps {
  title: string;
  placeholder: string;
  value: string | number;
  onChange: ChangeEventHandler<HTMLInputElement>;
  required?: boolean;
  type?: string;
}

const InputBox: React.FC<InputBoxProps> = ({ title, placeholder, value, onChange, required, type }) => {
  return (
    <div className={styles.container}>
      <div>{title}</div>
      <input placeholder={placeholder} value={value} onChange={onChange} required={required} type={type} />
    </div>
  );
};

export default InputBox;
