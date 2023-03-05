import { authService, dbService, database } from '@/firebase';
import { ref, set } from 'firebase/database';
import { useState, useCallback } from 'react';
import {
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from 'firebase/auth';
import { setDoc, doc, getDoc, updateDoc } from 'firebase/firestore';
import { useRouter } from 'next/router';
import {
  AiFillCheckCircle,
  AiFillEye,
  AiFillEyeInvisible,
} from 'react-icons/ai';
import styled from 'styled-components';
import SignInModal from '@/components/SignInModal';
import { toast } from 'react-toastify';

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
      <AiFillCheckCircle color="green" />
    ) : (
      <AiFillCheckCircle color="red" />
    );
  const passwordIcon =
    isValidPassword === true ? (
      <AiFillCheckCircle color="green" />
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
        toast.success('로그인 완료');
        router.push('/');
      } else {
        authService.signOut();
        toast.warn('이메일 인증을 완료해주세요');
      }
    } catch (error: any) {
      toast.error(error.message);
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
          lvName: '일반인',
          loginState: true,
        });
      }
      toast.success('로그인 완료');
      router.push('/');
    } catch (error: any) {
      console.log('구글 로그인 에러', error.message);
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
          <SignInButton
            disabled={(isValidEmail && isValidPassword) === false}
            onClick={onClicksignIn}
          >
            로그인하기
          </SignInButton>
          <GuideBox>
            <GuideText onClick={() => router.push('/signUp')}>
              이메일 가입
            </GuideText>
            <GuideText2 onClick={onClickOpenModal}>비밀번호 찾기</GuideText2>
          </GuideBox>
          <GoogleSignInButton onClick={onClickGoogleSignIn}>
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
  /* height: 100%; */
`;
const IconImg = styled.img`
  width: 5rem;
  height: 5rem;
`;
const HeaderText = styled.h2`
  font-size: 30px;
  font-weight: bold;
  margin-top: 1vh;
  margin-bottom: 80px;
`;

const InputBox = styled.div`
  width: 100%;
  height: 15%;
`;

const PasswordInputBox = styled.div`
  width: 100%;
  height: 15%;
  margin-bottom: 20px;
`;
const SignInInput = styled.input`
  width: 40%;
  height: 48px;
  border-radius: 20px;
  padding-left: 16px;
  font-size: 16px;
`;

const SignInButton = styled.button`
  margin-bottom: 20px;
  border-radius: 2rem;
  width: 40%;
  height: 48px;
  color: white;
  background-color: black;
  border-style: solid;
  border-width: 0.1rem;
  font-size: 16px;
  :hover {
    cursor: pointer;
    color: black;
    background-color: white;
  }
`;

const GoogleSignInButton = styled.button`
  margin-top: 60px;
  border-radius: 2rem;
  width: 40%;
  height: 48px;
  color: black;
  background-color: white;
  border-style: solid;
  border-width: 0.1rem;
  font-size: 16px;
  :hover {
    cursor: pointer;
    color: white;
    background-color: black;
  }
`;

const InputText = styled.p`
  font-weight: bold;
  width: 40%;
  margin: auto;
  text-align: left;
  margin-bottom: 8px;
`;

const IconValidation = styled.div`
  margin-top: 10px;
  width: 40%;
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
  width: 30%;
  margin: auto;
  font-weight: 600;
  font-size: 14px;
  text-align: right;
  :hover {
    cursor: pointer;
    color: gray;
  }
`;
const GuideText2 = styled.span`
  width: 30%;
  margin: auto;
  font-weight: 600;
  font-size: 14px;
  text-align: left;
  :hover {
    cursor: pointer;
    color: gray;
  }
`;

const GuideBox = styled.div`
  display: flex;
  width: 40%;
  height: 4%;
  margin: auto;
`;
const PasswordInput = styled.input`
  width: 40%;
  height: 48px;
  margin-left: 28px;
  margin-right: 12px;
  border-radius: 20px;
  padding-left: 16px;
  font-size: 16px;
`;
