import styled from 'styled-components';
import { useState, useCallback } from 'react';
import { AiFillCheckCircle } from 'react-icons/ai';
import { sendPasswordResetEmail } from 'firebase/auth';
import { authService } from '@/firebase';
import { toast } from 'react-toastify';
import useModal from '@/hooks/useModal';
import { GLOBAL_MODAL_TYPES } from '@/recoil/modalState';

type ModalProps = {
  onClickCloseModal: () => void;
  email_validation: any;
};

const SignInModal = ({ onClickCloseModal, email_validation }: ModalProps) => {
  const [email, setEmail] = useState('');
  const [isValidEmail, setIsValiEmail] = useState(false);
  const [emailMessage, setEmailMessage] = useState<string>('');
  const { showModal } = useModal();
  const onChangeEmail = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const emailRegex =
        /([\w-.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
      const emailCurrent = e.target.value;
      setEmail(emailCurrent);
      if (!emailRegex.test(emailCurrent)) {
        setEmailMessage('이메일 형식을 확인해주세요.');
        setIsValiEmail(false);
      } else {
        setEmailMessage('');
        setIsValiEmail(true);
      }
    },
    [],
  );
  const emailIcon =
    isValidEmail === true ? (
      <AiFillCheckCircle color="green" />
    ) : (
      <AiFillCheckCircle color="red" />
    );

  //패스워드 이메일 전송
  const onClickSendPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await sendPasswordResetEmail(authService, email);
      // toast.warn('이메일이 전송됐습니다.');
      showModal({
        modalType: GLOBAL_MODAL_TYPES.LoginRequiredModal,
        modalProps: { contentText: '이메일이 전송되었습니다!' },
      });
      onClickCloseModal();
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <>
      <ModalClose onClick={onClickCloseModal}></ModalClose>
      <ModalWrapper>
        <ModalContainer onSubmit={onClickSendPassword}>
          <HeaderText>비밀번호 찾기</HeaderText>
          <InputBox>
            <InputText>이메일</InputText>
            <SignInInput
              type="email"
              value={email}
              onChange={onChangeEmail}
              placeholder="비밀번호를 찾으실 이메일을 입력해주세요."
            />
            {email.length > 0 && (
              <IconValidation>
                {emailIcon}
                <TextValidation
                  className={`message ${isValidEmail ? 'success' : 'error'}`}
                >
                  {emailMessage}
                </TextValidation>
              </IconValidation>
            )}
          </InputBox>
          <SignInButton disabled={isValidEmail === false}>확인</SignInButton>
        </ModalContainer>
      </ModalWrapper>
    </>
  );
};

export default SignInModal;

const ModalWrapper = styled.div`
  display: flex;
  width: 520px;
  height: 360px;
  z-index: 2000;
  position: fixed;
  top: 50%;
  left: 50%;
  border-radius: 15px;
  background-color: #fffcf3;
  border-style: solid;
  border-width: 0.1rem;
  border-color: black;
  transform: translate(-50%, -50%) !important;
`;
const ModalClose = styled.div`
  z-index: 1500;
  display: block;
  background: rgba(0, 0, 0, 0.3);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;
const ModalContainer = styled.form`
  width: 80%;
  height: 100%;
  margin: auto;
`;
const HeaderText = styled.h2`
  margin-top: 36px;
  margin-bottom: 36px;
  font-size: 20px;
  font-weight: bold;
  text-align: center;
`;
const InputText = styled.p`
  font-weight: bold;
  width: 100%;
  margin: auto;
  text-align: left;
  margin-bottom: 8px;
`;

const SignInInput = styled.input`
  width: 100%;
  height: 48px;
  border-radius: 20px;
  padding-left: 16px;
  font-size: 16px;
`;
const IconValidation = styled.div`
  margin-top: 10px;
  width: 100%;
  height: 20%;
  margin: auto;
  text-align: left;
`;
const TextValidation = styled.span`
  color: red;
  margin-top: 6px;
  margin-left: 8px;
  font-size: 12px;
`;
const SignInButton = styled.button`
  border-radius: 2rem;
  width: 100%;
  height: 16%;
  background-color: white;
  border-style: solid;
  border-width: 0.1rem;
  font-size: 16px;
  :hover {
    cursor: pointer;
    background-color: black;
    color: white;
  }
`;
const InputBox = styled.div`
  margin: auto;
  width: 100%;
  height: 40%;
`;
