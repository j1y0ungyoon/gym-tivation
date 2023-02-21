import { authService, dbService, database } from '@/firebase';
import { ref, set } from 'firebase/database';
import { useState } from 'react';
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

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassWord] = useState('');
  // const [photoURL, setPhotoURL] = useState<string>('');
  // const [nickName, setNickName] = useState<string>('');

  //유효성 검사
  const [isValidEmail, setIsValiEmail] = useState(false);
  const [isValidPassword, setIsValidPassword] = useState(false);

  //비밀번호 확인
  const [showPasword, setShowPassword] = useState(false);

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

  //로그인
  const onClicksignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const { user } = await signInWithEmailAndPassword(
        authService,
        email,
        password,
      );
      // if (authService.currentUser?.emailVerified === true) {
      await updateDoc(doc(dbService, 'profile', user.uid), {
        loginState: true,
      });
      alert('로그인 완료');
      router.push('/');
      // } else {
      //   authService.signOut();
      //   alert('이메일 인증을 완료해주세요.');
      // //}
    } catch (error: any) {
      alert(error.message);
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
          introduction: '자기소개를 적어주세요.',
          area: '지역',
          instagram: '인스타그램',
          loginState: true,
        });
      }
      alert('로그인 완료');
      router.push('/');
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <SignInWrapper>
      <SignInContainer onSubmit={onClicksignIn}>
        <HeaderText>GYMTIVATION</HeaderText>
        <InputText>이메일</InputText>
        <SignInInput
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (email_validation.test(e.target.value)) {
              setIsValiEmail(true);
            } else {
              setIsValiEmail(false);
            }
          }}
          placeholder="이메일"
        />
        {isValidEmail === false ? (
          <>
            <IconValidation>
              <AiFillCheckCircle color="red" />
              <TextValidation>이메일 형식을 확인해주세요.</TextValidation>
            </IconValidation>
          </>
        ) : (
          <IconValidation>
            <AiFillCheckCircle color="green" />
          </IconValidation>
        )}
        <InputText>비밀번호</InputText>
        <PasswordShow>
          <SignInInput
            type={showPasword ? 'text' : 'password'}
            value={password}
            onChange={(e) => {
              setPassWord(e.target.value);
              if (password_validation.test(e.target.value)) {
                setIsValidPassword(true);
              } else {
                setIsValidPassword(false);
              }
            }}
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
        {isValidPassword === false ? (
          <IconValidation>
            <AiFillCheckCircle color="red" />
            <TextValidation>
              대문자, 소문자, 특수문자 포함 8글자 이상 15글자 이하로 적어주세요.
            </TextValidation>
          </IconValidation>
        ) : (
          <IconValidation>
            <AiFillCheckCircle color="green" />
          </IconValidation>
        )}
        <GuideBox>
          <GuideText onClick={() => router.push('/signUp')}>
            이메일 가입
          </GuideText>
          <GuideText onClick={onClickGoogleSignIn}>구글 로그인</GuideText>
          <GuideText onClick={onClickOpenModal}>비밀번호 찾기</GuideText>
        </GuideBox>
        <SignInButton
          disabled={(isValidEmail && isValidPassword) === false}
          type="submit"
        >
          완료
        </SignInButton>
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
  display: flex;
  justify-content: center;
`;
const SignInContainer = styled.form`
  margin-top: 5vh;
`;
const HeaderText = styled.h2`
  margin-top: 10vh;
  margin-bottom: 10vh;
  font-size: 28px;
  font-weight: bold;
  text-align: center;
`;
const SignInInput = styled.input`
  width: 24vw;
  height: 5vh;
  margin-right: 1vw;
  border-radius: 20px;
  border: none;
  padding-left: 16px;
  background-color: #e9ecef;
  font-size: 16px;
`;

const SignInButton = styled.button`
  margin-top: 4vh;
  width: 25vw;
  height: 8vh;
  color: black;
  background-color: #e9ecef;
  border: none;
  font-size: 16px;
  border-radius: 30px;
  :hover {
    cursor: pointer;
    background-color: #dee2e6;
  }
`;

const InputText = styled.p`
  font-weight: bold;
`;

const IconValidation = styled.div`
  margin-top: 1vh;
`;
const TextValidation = styled.span`
  color: red;
  margin-left: 1vw;
  font-size: 12px;
`;
const PasswordShow = styled.div`
  :hover {
    cursor: pointer;
  }
`;
const GuideText = styled.span`
  color: #495057;
  font-size: 12px;
  margin-right: auto;
  :hover {
    cursor: pointer;
    color: black;
  }
`;
const GuideBox = styled.div`
  padding-left: 2vw;
  display: flex;
  margin-top: 8vh;
`;
