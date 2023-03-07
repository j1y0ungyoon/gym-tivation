import { globalModalState, GLOBAL_MODAL_TYPES } from '@/recoil/modalState';
import React from 'react';
import { useRecoilState } from 'recoil';
import AlertModal from './AlertModal';
import ConfirmModal from './ConfirmModal';
import LoginRequiredModal from './LoginRequiredModal';

const GlobalModal = () => {
  // globalModalState로부터 modalType과 modalProps 꺼내줌
  const { modalType, modalProps } = useRecoilState(globalModalState)[0] || {};

  // Alert, Cofirm, null 중 어떤 컴포넌트를 렌더링 할지 골라준다.
  const renderComponent = () => {
    if (!modalType) {
      return null;
    }

    if (modalType === GLOBAL_MODAL_TYPES.ConfirmModal) {
      return <ConfirmModal {...modalProps} />;
    }

    if (modalType === GLOBAL_MODAL_TYPES.AlertModal) {
      return <AlertModal {...modalProps} />;
    }

    if (modalType === GLOBAL_MODAL_TYPES.LoginRequiredModal) {
      return <LoginRequiredModal {...modalProps} />;
    }
  };

  // return으로 jsx 문법을 통해 renderComponent를 실행하면 Alert, Confrim, null 중 하나가 나온다.
  return <>{renderComponent()}</>;
};

export default GlobalModal;
