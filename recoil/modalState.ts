import { atom } from 'recoil';

// 실수 방지
export const GLOBAL_MODAL_TYPES = {
  ConfirmModal: 'ConfirmModal',
  AlertModal: 'AlertModal',
  LoginRequiredModal: 'LoginRequiredModal',
};

export type handleConfirmType = (arg1?: any, arg2?: any, arg3?: any) => any;

export interface ParmetersType {
  a?: any;
  b?: any;
  c?: any;
}

export interface ModalPropsType {
  contentText?: string;
  // handleClose?: (...arg: any[]) => any;
  // handleConfirm?: (...arg: any[]) => any;
  handleConfirm?: handleConfirmType;
  parameters?: ParmetersType;
}

export interface ConfirmModalType {
  modalType: string;
  modalProps: ModalPropsType;
}

export interface AlertModalType {
  modalType: string;
  modalProps: ModalPropsType;
}

export interface LoginRequiredModalType {
  modalType: string;
  modalProps: ModalPropsType;
}

export type ModalType =
  | ConfirmModalType
  | AlertModalType
  | LoginRequiredModalType;

// 이제 modalState는 다른 컴포넌트에서 호출될 때 ConfirmModalType | AlertModalType | null이다.
// 이제 globalModalState는 open 했을 때 ConfirmModal 또는 AlertModal을 보여주는 선택자 역할을 한다.
export const globalModalState = atom<ModalType | null>({
  key: 'globalModalStateKey',
  default: null,
});
