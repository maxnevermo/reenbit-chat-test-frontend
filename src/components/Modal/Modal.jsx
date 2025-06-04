import styles from "./Modal.module.css";
import { forwardRef, useEffect } from "react";

const Modal = forwardRef(({ onConfirm, onCancel }, ref) => {
  useEffect(() => {
    if (ref?.current) {
      ref.current.showModal();
    }
  }, [ref]);

  return (
    <dialog ref={ref} className={styles.dialog}>
      <div className={styles.backdrop} onClick={onCancel}></div>
      <div className={styles.modalContent}>
        <h2>Warning</h2>
        <p>You really want to delete the chat?</p>
        <div className={styles.buttons}>
          <button className={styles.confirmButton} onClick={onConfirm}>
            Confirm
          </button>
          <button className={styles.cancelButton} onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </dialog>
  );
});

export default Modal;
