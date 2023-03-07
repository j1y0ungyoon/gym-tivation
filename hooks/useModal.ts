import { globalModalState, ModalType } from '@/recoil/modalState';
import { useRecoilState } from 'recoil';

const useModal = () => {
  // modal state에 globalModalState 타입에 명시된 대로 modalType과 modalProps를 담아준다.
  const [modal, setModal] = useRecoilState(globalModalState);

  // 모달을 보여주는 함수. 파라미터로 modalType과 modalProps를 속성으로 가진 객체를 받는다.
  const showModal = ({ modalType, modalProps }: ModalType) => {
    setModal({ modalType, modalProps });
  };

  // 모달을 감추는 함수.
  const hiddenModal = () => {
    setModal(null);
  };

  return { modal, setModal, showModal, hiddenModal };
};

export default useModal;
