import Modal from '../Common/Modal';
import ModalHeader from '../Common/Modal/ModalHeader';

interface IBetMemeModalProps {
  modalView: boolean;
  onCloseModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const BetMemeModal: React.FC<IBetMemeModalProps> = ({ modalView, onCloseModal }) => {
  return (
    <Modal open={modalView} onClose={onCloseModal}>
      <>
        <ModalHeader>
          <div>header</div>
        </ModalHeader>
        <div>bet data..</div>
      </>
    </Modal>
  );
};

export default BetMemeModal;
