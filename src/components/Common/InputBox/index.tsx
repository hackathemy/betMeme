import { ChangeEventHandler } from 'react';
import styles from './index.module.scss';

interface InputBoxProps {
  title: string;
  placeholder: string;
  value: string | number;
  onChange: ChangeEventHandler<HTMLInputElement>;
  required?: boolean;
  type?: string;
  readonly?: boolean;
}

const InputBox: React.FC<InputBoxProps> = ({ title, placeholder, value, onChange, required, type, readonly }) => {
  return (
    <div className={styles.container}>
      <div className={styles.title}>{title}</div>
      <input
        className={styles.input}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        type={type}
        readOnly={readonly}
      />
    </div>
  );
};

export default InputBox;
