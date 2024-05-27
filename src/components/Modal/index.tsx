import { first, isFunction } from 'lodash';
import styles from './index.module.scss';
import React, { useCallback, useEffect, useState } from 'react';

interface IModalProps {
  open: boolean;
  children: JSX.Element;
  onClose: React.Dispatch<React.SetStateAction<boolean>>;
}

const Modal: React.FC<IModalProps> = ({ open, children, onClose }) => {
  const [visibility, setVisibility] = useState(false);

  useEffect(() => {
    setVisibility(open);

    const body = first(document.getElementsByTagName('body'));

    if (open && body) {
      body.style.overflow = 'hidden';
    } else if (!open && body) {
      body.style.overflow = 'auto';
    }
  }, [open]);

  const closeModal = useCallback(
    (e: any) => {
      e.stopPropagation();
      setVisibility(false);
      if (isFunction(onClose)) {
        onClose(false);
      }
    },
    [setVisibility, onClose],
  );

  const preventClosing = useCallback((e: any) => {
    e.stopPropagation();
  }, []);

  return (
    <>
      {visibility && (
        <div className={styles.container} onClick={closeModal}>
          <div className={styles.content} onClick={preventClosing}>
            {children}
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;
