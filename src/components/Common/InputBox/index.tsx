import { ChangeEventHandler } from 'react';
import styles from './index.module.scss';
import clsx from 'clsx';

interface InputBoxProps {
  title: string;
  placeholder: string;
  value: string | number;
  onChange: ChangeEventHandler<HTMLInputElement>;
  required?: boolean;
  type?: string;
  readonly?: boolean;
  styled?: string;
}

const InputBox: React.FC<InputBoxProps> = ({
  title,
  placeholder,
  value,
  onChange,
  required,
  type,
  readonly,
  styled,
}) => {
  return (
    <div className={styles.container}>
      <div className={styles.title}>{title}</div>
      <input
        className={clsx(styles.input, styled)}
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
