import useModal from '@/hooks/useModal';
import { ModalPropsType } from '@/recoil/modalState';
import styled from 'styled-components';

const AlertModal = (props: ModalPropsType) => {
  const { hiddenModal } = useModal();
  const { contentText, handleConfirm } = props;

  const closeModal = async () => {
    if (!handleConfirm) {
      hiddenModal();
      return;
    }

    if (handleConfirm) {
      await handleConfirm();
      hiddenModal();
      return;
    }
  };

  return (
    <BackgroundContainer>
      <ModalContainer>
        <h3>{contentText}</h3>
        <AlertButton onClick={closeModal}>확인</AlertButton>
      </ModalContainer>
    </BackgroundContainer>
  );
};

export default AlertModal;

const BackgroundContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-width: 75%;
  height: 100%;
  min-height: 75%;
  z-index: 999;
  background-color: rgba(0, 0, 0, 0.7);
`;

const ModalContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  border-radius: 2rem;
  align-items: center;
  justify-content: center;
  width: 400px;
  min-width: 250px;
  height: 250px;
  min-height: 400px;
  background-color: white;
  z-index: 1000;
`;

const AlertModalContent = styled.span``;

const AlertButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100px;
  height: 50px;
  color: white;
  font-size: 20px;
  background-color: #ff4800;
  border-radius: 8px;
  border: 1px solid black;
  filter: drop-shadow(-2px 2px 0px #000000);
`;
