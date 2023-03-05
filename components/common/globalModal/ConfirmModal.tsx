import { ModalPropsType } from '@/recoil/modalState';
import React from 'react';
import useModal from '@/hooks/useModal';
import styled from 'styled-components';

const ConfirmModal = (props: ModalPropsType) => {
  const { contentText, handleConfirm, parameters } = props;
  const { hiddenModal } = useModal();

  const onClcikYes = async () => {
    if (!handleConfirm) {
      hiddenModal();
      return;
    }
    if (handleConfirm) {
      await handleConfirm(parameters?.a, parameters?.b, parameters?.c);
      hiddenModal();
      return;
    }
  };

  const onClickNo = () => {
    hiddenModal();
  };

  return (
    <BackgroundContainer>
      <ModalContainer>
        <h3>{contentText}</h3>
        <ConfirmButtonBox>
          <ConfirmYesButton onClick={onClcikYes}>확인</ConfirmYesButton>
          <CofirmNoButton onClick={onClickNo}>취소</CofirmNoButton>
        </ConfirmButtonBox>
      </ModalContainer>
    </BackgroundContainer>
  );
};

export default ConfirmModal;

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

const ConfirmButtonBox = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 300px;
  height: 100px;
  gap: 1rem;
`;

const ConfirmYesButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100px;
  height: 50px;
  color: white;
  font-size: 20px;
  background-color: #0094ff;

  border-radius: 8px;
  border: 1px solid black;
  filter: drop-shadow(-2px 2px 0px #000000);
`;

const CofirmNoButton = styled.button`
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
