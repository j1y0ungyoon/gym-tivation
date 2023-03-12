import { authService, dbService, database } from '@/firebase';
import { ref, set } from 'firebase/database';
import { useState, useCallback } from 'react';
import {
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from 'firebase/auth';
import {
  setDoc,
  doc,
  getDoc,
  updateDoc,
  addDoc,
  collection,
} from 'firebase/firestore';
import { useRouter } from 'next/router';
import {
  AiFillCheckCircle,
  AiFillEye,
  AiFillEyeInvisible,
} from 'react-icons/ai';
import styled from 'styled-components';
import SignInModal from '@/components/mypage/SignInModal';
import { toast } from 'react-toastify';
import useModal from '@/hooks/useModal';
import { GLOBAL_MODAL_TYPES } from '@/recoil/modalState';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassWord] = useState('');

  //모달
  const [releaseModal, setReleaseModal] = useState<boolean>(false);

  const onClickOpenModal = () => {
    setReleaseModal(true);
    document.body.style.overflow = 'hidden';
  };

  const onClickCloseModal = () => {
    setReleaseModal(false);
    document.body.style.overflow = 'unset';
  };

  const email_validation = new RegExp(
    /^([0-9a-zA-Z_\.-]+)@([0-9a-zA-Z_-]+)(\.[0-9a-zA-Z_-]+){1,2}$/,
  );
  const password_validation = new RegExp(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,15}$/,
  );

  const router = useRouter();

  //유효성
  const [emailMessage, setEmailMessage] = useState<string>('');
  const [isValidEmail, setIsValiEmail] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState<string>('');
  const [isValidPassword, setIsValidPassword] = useState(false);
  const [showPasword, setShowPassword] = useState(false);
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

  const onChangePassword = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const passwordRegex =
        /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,15}$/;
      const passwordCurrent = e.target.value;
      setPassWord(passwordCurrent);

      if (!passwordRegex.test(passwordCurrent)) {
        setPasswordMessage(
          '대문자, 소문자, 특수문자 포함 8글자 이상 15글자 이하로 적어주세요.',
        );
        setIsValidPassword(false);
      } else {
        setPasswordMessage('');
        setIsValidPassword(true);
      }
    },
    [],
  );

  const emailIcon =
    isValidEmail === true ? (
      <AiFillCheckCircle color="#0094FF" />
    ) : (
      <AiFillCheckCircle color="red" />
    );
  const passwordIcon =
    isValidPassword === true ? (
      <AiFillCheckCircle color="#0094FF" />
    ) : (
      <AiFillCheckCircle color="red" />
    );

  //로그인
  const onClicksignIn = async () => {
    try {
      const { user } = await signInWithEmailAndPassword(
        authService,
        email,
        password,
      );
      if (authService.currentUser?.emailVerified === true) {
        await updateDoc(doc(dbService, 'profile', user.uid), {
          loginState: true,
        });
        // showModal({
        //   modalType: GLOBAL_MODAL_TYPES.LoginRequiredModal,
        //   modalProps: { contentText: '로그인이 완료되었습니다!' },
        // });
        router.push('/');
      } else {
        authService.signOut();
        // toast.warn('이메일 인증을 완료해주세요');
        showModal({
          modalType: GLOBAL_MODAL_TYPES.AlertModal,
          modalProps: { contentText: '이메일 인증을 완료해주세요!' },
        });
      }
    } catch (error: any) {
      if (error.code == 'auth/invalid-email') {
        // toast.error('이메일 형식이 틀렸습니다');
        showModal({
          modalType: GLOBAL_MODAL_TYPES.AlertModal,
          modalProps: { contentText: '이메일 형식이 아닙니다!' },
        });
      }
      if (error.code == 'auth/user-not-found') {
        // toast.error('이메일이 없습니다');
        showModal({
          modalType: GLOBAL_MODAL_TYPES.AlertModal,
          modalProps: { contentText: '이메일이 없습니다!' },
        });
      }
      if (error.code == 'auth/wrong-password') {
        // toast.error('비밀번호를 다시 확인해주세요');
        showModal({
          modalType: GLOBAL_MODAL_TYPES.AlertModal,
          modalProps: { contentText: '비밀번호를 다시 확인해주세요!' },
        });
      }
      if (error.code == 'auth/too-many-requests') {
        // toast.error('잠시후 다시 시도해 주세요');
        showModal({
          modalType: GLOBAL_MODAL_TYPES.AlertModal,
          modalProps: { contentText: '잠시 후 시도해주세요!' },
        });
      }
    }
  };

  //구글 로그인
  const onClickGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const { user } = await signInWithPopup(authService, provider);
      const docRef = doc(dbService, 'profile', user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.data() !== undefined) {
        await updateDoc(doc(dbService, 'profile', user.uid), {
          loginState: true,
        });
      } else {
        await setDoc(doc(dbService, 'profile', user.uid), {
          introduction: '',
          area: '지역',
          instagram: '',
          displayName: authService.currentUser?.displayName,
          photoURL: authService.currentUser?.photoURL,
          email: authService.currentUser?.email,
          uid: user.uid,
          following: '',
          follower: '',
          // 운동 참여 버튼 테스트를 위해 가입시 필드 추가
          userParticipation: [],
          lv: 1,
          lvName: 'Yellow',
          loginState: true,
        });
        await addDoc(collection(dbService, 'dms'), {
          id: user?.uid,
          enterUser: [user?.uid, '나와의채팅'],
          chatLog: [],
        });
      }
      // showModal({
      //   modalType: GLOBAL_MODAL_TYPES.LoginRequiredModal,
      //   modalProps: { contentText: '로그인이 완료되었습니다!' },
      // });
      router.push('/');
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <SignInWrapper>
      <SignInContainer>
        <SignInBox>
          <IconImg src="/assets/icons/myPage/gymtivation_logo_miniicon.svg" />
          <HeaderText>GYMTIVATION</HeaderText>
          <InputBox>
            <InputText>이메일</InputText>
            <SignInInput
              type="email"
              value={email}
              onChange={onChangeEmail}
              placeholder="이메일"
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
          <PasswordInputBox>
            <InputText>비밀번호</InputText>
            <PasswordShow>
              <PasswordInput
                type={showPasword ? 'text' : 'password'}
                value={password}
                onChange={onChangePassword}
                placeholder="비밀번호"
              />
              {showPasword === false ? (
                <AiFillEyeInvisible
                  fontSize={'20px'}
                  onClick={() => {
                    setShowPassword(true);
                  }}
                />
              ) : (
                <AiFillEye
                  fontSize={'20px'}
                  onClick={() => {
                    setShowPassword(false);
                  }}
                />
              )}
            </PasswordShow>
            {password.length > 0 && (
              <IconValidation>
                {passwordIcon}
                <TextValidation
                  className={`message ${isValidPassword ? 'success' : 'error'}`}
                >
                  {passwordMessage}
                </TextValidation>
              </IconValidation>
            )}
          </PasswordInputBox>

          {isValidEmail && isValidPassword === true ? (
            <SignUpButton2 onClick={onClicksignIn}>로그인 하기</SignUpButton2>
          ) : (
            <SignUpButton
              disabled={(isValidEmail && isValidPassword) === false}
            >
              로그인 하기
            </SignUpButton>
          )}

          <GuideBox>
            <GuideText onClick={() => router.push('/signUp')}>
              이메일 가입
            </GuideText>
            <GuideText2 onClick={onClickOpenModal}>비밀번호 찾기</GuideText2>
          </GuideBox>
          <GoogleSignInButton onClick={onClickGoogleSignIn}>
            <GoogleIconImg src="/assets/icons/myPage/google.svg" />
            구글로 간편 로그인하기
          </GoogleSignInButton>
        </SignInBox>
      </SignInContainer>

      {releaseModal && (
        <SignInModal
          onClickCloseModal={onClickCloseModal}
          email_validation={email_validation}
        />
      )}
    </SignInWrapper>
  );
};

export default SignIn;

const SignInWrapper = styled.div`
  ${({ theme }) => theme.mainLayout.wrapper}
`;
const SignInContainer = styled.div`
  ${({ theme }) => theme.mainLayout.container}
  display:flex;
  align-items: center;
  height: calc(100% - 40px);
  text-align: center;
`;
const SignInBox = styled.div`
  width: 100%;
  height: 80%;
`;
const IconImg = styled.img`
  width: 60px;
  height: 64px;
`;
const HeaderText = styled.h2`
  font-size: 24px;
  font-weight: bold;
  margin-top: 1vh;
  margin-bottom: 60px;
`;

const InputBox = styled.div`
  width: 100%;
  height: 110px;
`;

const PasswordInputBox = styled.div`
  width: 100%;
  height: 90px;
  margin-bottom: 40px;
`;
const SignInInput = styled.input`
  width: 400px;
  height: 48px;
  border-radius: 30px;
  padding-left: 16px;
  font-size: 16px;
  :focus {
    outline: none;
  }
  box-shadow: -2px 2px 0px 0px #000000;
`;

const GoogleSignInButton = styled.button`
  margin-top: 70px;
  border-radius: 2rem;
  width: 400px;
  height: 48px;
  color: black;
  background-color: white;
  border-style: solid;
  border-width: 0.1rem;
  font-size: 16px;
  box-shadow: -2px 2px 0px 0px #000000;
  :hover {
    cursor: pointer;
    color: white;
    background-color: black;
  }
`;

const InputText = styled.p`
  font-weight: bold;
  width: 400px;
  margin: auto;
  text-align: left;
  margin-bottom: 8px;
`;

const IconValidation = styled.div`
  margin-top: 10px;
  width: 400px;
  margin: auto;
  text-align: left;
`;
const TextValidation = styled.span`
  color: red;
  margin-top: 6px;
  margin-left: 8px;
  font-size: 12px;
`;
const PasswordShow = styled.div`
  :hover {
    cursor: pointer;
  }
`;
const GuideText = styled.span`
  width: 200px;
  margin: auto;
  font-weight: 600;
  font-size: 14px;
  text-align: center;
  padding-left: 60px;
  :hover {
    cursor: pointer;
    color: gray;
  }
`;
const GuideText2 = styled.span`
  width: 200px;
  margin: auto;
  font-weight: 600;
  font-size: 14px;
  text-align: center;
  padding-right: 50px;
  :hover {
    cursor: pointer;
    color: gray;
  }
`;

const GuideBox = styled.div`
  display: flex;
  width: 400px;
  height: 4%;
  margin: auto;
`;
const PasswordInput = styled.input`
  width: 400px;
  height: 48px;
  margin-left: 28px;
  margin-right: 12px;
  border-radius: 30px;
  padding-left: 16px;
  font-size: 16px;
  :focus {
    outline: none;
  }
  box-shadow: -2px 2px 0px 0px #000000;
`;
const SignUpButton = styled.button`
  margin-bottom: 20px;
  border-radius: 2rem;
  width: 400px;
  height: 48px;
  background-color: #d9d9d9;
  color: #797979;
  border-style: solid;
  border-width: 0.1rem;
  font-size: 16px;
  border: none;
`;
const SignUpButton2 = styled.button`
  margin-bottom: 20px;
  border-radius: 2rem;
  width: 400px;
  height: 48px;
  background-color: #ff4800;
  color: white;
  border-style: solid;
  border-width: 0.1rem;
  font-size: 16px;
  box-shadow: -2px 2px 0px 0px #000000;
`;
const GoogleIconImg = styled.img`
  width: 1.5rem;
  height: 1.5rem;
  margin-right: 5px;
  margin-bottom: 2px;
`;
