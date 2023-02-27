import { authService, dbService } from '@/firebase';
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
} from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';

import { useState, useCallback } from 'react';
import { tou, pi, lb } from '@/components/TermsOfUse';
import styled from 'styled-components';
import {
  AiOutlineCheckCircle,
  AiFillCheckCircle,
  AiFillEye,
  AiFillEyeInvisible,
} from 'react-icons/ai';
import UploadImage from '@/components/ProfileUpLoad';
import { useRouter } from 'next/router';

const SignUp = () => {
  //회원가입
  const [email, setEmail] = useState('');
  const [password, setPassWord] = useState('');
  const [passwordCheck, setPassWordCheck] = useState('');
  const [nickName, setNickName] = useState('');

  //이용약관>프로필 토글버튼
  const [change, setChange] = useState(false);

  //프로필 사진
  const [imageURL, setImageURL] = useState<string>(
    'https://blog.kakaocdn.net/dn/c3vWTf/btqUuNfnDsf/VQMbJlQW4ywjeI8cUE91OK/img.jpg',
  );

  //이용약관
  const [touCheck, setTOUCheck] = useState(false);
  const [piCheck, setPICheck] = useState(false);
  const [lbCheck, setLBCheck] = useState(false);
  const [allCheck, setAllCheck] = useState(false);

  //비밀번호 확인
  const [showPasword, setShowPassword] = useState(false);
  const [showPaswordCheck, setShowPasswordCheck] = useState(false);

  //유효성 검사
  const [emailMessage, setEmailMessage] = useState<string>('');
  const [isValidEmail, setIsValiEmail] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState<string>('');
  const [isValidPassword, setIsValidPassword] = useState(false);
  const [nickNameMessage, setNickNameMessage] = useState<string>('');
  const [isValidNickName, setIsValidNickName] = useState(false);
  const [isValidPasswordCheck, setIsValidPasswordCheck] = useState(false);
  const [passwordConfirmMessage, setPasswordConfirmMessage] =
    useState<string>('');

  const router = useRouter();

  //유효헝 검사

  const nickName_validation = new RegExp(
    /^(?=.*[a-z0-9가-힣])[a-z0-9가-힣]{2,8}$/,
  );

  const signUpdisabled =
    isValidEmail && isValidPassword && isValidNickName && isValidPasswordCheck;

  const onChangeEmail = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const emailRegex =
        /([\w-.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
      const emailCurrent = e.target.value;
      setEmail(emailCurrent);
      if (!emailRegex.test(emailCurrent)) {
        setEmailMessage('이메일 형식을 확인해주세요');
        setIsValiEmail(false);
      } else {
        setEmailMessage('');
        setIsValiEmail(true);
      }
    },
    [],
  );
  const onChangeName = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const nickName_validation = new RegExp(
      /^(?=.*[a-z0-9가-힣])[a-z0-9가-힣]{2,8}$/,
    );
    const nickNameCurrent = e.target.value;
    setNickName(nickNameCurrent);
    if (nickName_validation.test(nickNameCurrent)) {
      setNickNameMessage('');
      setIsValidNickName(true);
    } else {
      setNickNameMessage('2글자 이상 8글자 이하로 입력해주세요.');
      setIsValidNickName(false);
    }
  }, []);

  const onChangePassword = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const passwordRegex =
        /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,15}$/;
      const passwordCurrent = e.target.value;
      setPassWord(passwordCurrent);

      if (!passwordRegex.test(passwordCurrent)) {
        setPasswordMessage(
          '대문자, 소문자, 특수문자 포함 8글자 이상 15글자 이하로 적어주세요',
        );
        setIsValidPassword(false);
      } else {
        setPasswordMessage('');
        setIsValidPassword(true);
      }
    },
    [],
  );

  const onChangePasswordConfirm = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const passwordConfirmCurrent = e.target.value;
      setPassWordCheck(passwordConfirmCurrent);

      if (password === passwordConfirmCurrent) {
        setPasswordConfirmMessage('');
        setIsValidPasswordCheck(true);
      } else {
        setPasswordConfirmMessage('비밀번호를 확인해주세요');
        setIsValidPasswordCheck(false);
      }
    },
    [password],
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
  const passwordCheckIcon =
    isValidPasswordCheck === true ? (
      <AiFillCheckCircle color="green" />
    ) : (
      <AiFillCheckCircle color="red" />
    );
  const nickNameIcon =
    isValidNickName === true ? (
      <AiFillCheckCircle color="green" />
    ) : (
      <AiFillCheckCircle color="red" />
    );

  //이용약관 이동 버튼
  const onClicktermsOfUse = () => {
    if (touCheck && piCheck && lbCheck === true) {
      setChange(true);
    }
  };

  // 모두 동의
  const onClickAllCheckBtn = () => {
    setAllCheck(true);
    setTOUCheck(true);
    setPICheck(true);
    setLBCheck(true);
  };
  const onClickCancelCheckBtn = () => {
    setAllCheck(false);
    setTOUCheck(false);
    setPICheck(false);
    setLBCheck(false);
  };

  //회원가입
  const onClickSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const { user } = await createUserWithEmailAndPassword(
        authService,
        email,
        password,
      );
      await updateProfile(user, {
        displayName: nickName,
        photoURL: imageURL,
      });
      await sendEmailVerification(user);
      await setDoc(doc(dbService, 'profile', user.uid), {
        introduction: '자기소개를 적어주세요.',
        area: '지역',
        instagram: '인스타그램',
        displayName: nickName,
        photoURL: imageURL,
        email: user.email,
        uid: user.uid,
        following: '',
        follower: '',
        // 운동 참여 버튼 테스트를 위해 가입시 필드 추가
        userParticipation: [],
      });
      alert('인증 메일 확인 후 로그인 해주세요.');
      authService.signOut();
      router.push('/signIn');
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <SignUpWrapper>
      {change !== false ? (
        <SignUpContainer onSubmit={onClickSignUp}>
          <ImageBox>
            <UploadImage imageURL={imageURL} setImageURL={setImageURL} />
          </ImageBox>
          <InputBox>
            <InputText>이메일</InputText>
            <SignUpInput
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
          <InputBox>
            <InputText>닉네임</InputText>
            <SignUpInput
              id="nickNameInput"
              value={nickName}
              onChange={onChangeName}
              placeholder="닉네임을 입력해주세요."
              maxLength={8}
            />
            {nickName.length > 0 && (
              <IconValidation>
                {nickNameIcon}
                <TextValidation
                  className={`message ${isValidNickName ? 'success' : 'error'}`}
                >
                  {nickNameMessage}
                </TextValidation>
              </IconValidation>
            )}
          </InputBox>

          <InputBox>
            <InputText>비밀번호</InputText>
            <PasswordShow>
              <SignUpInput
                type={showPasword ? 'text' : 'password'}
                value={password}
                onChange={onChangePassword}
                placeholder="비밀번호"
                maxLength={15}
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
          </InputBox>
          <InputBox>
            <InputText>비밀번호 확인</InputText>
            <PasswordShow>
              <SignUpInput
                id="passwordCheckInput"
                type={showPaswordCheck ? 'text' : 'password'}
                value={passwordCheck}
                onChange={onChangePasswordConfirm}
                placeholder="비밀번호를 확인해주세요."
                maxLength={15}
              />
              {showPaswordCheck === false ? (
                <AiFillEyeInvisible
                  fontSize={'20px'}
                  onClick={() => {
                    setShowPasswordCheck(true);
                  }}
                />
              ) : (
                <AiFillEye
                  fontSize={'20px'}
                  onClick={() => {
                    setShowPasswordCheck(false);
                  }}
                />
              )}
            </PasswordShow>

            {passwordCheck.length > 0 && (
              <IconValidation>
                {passwordCheckIcon}
                <TextValidation
                  className={`message ${
                    isValidPasswordCheck ? 'success' : 'error'
                  }`}
                >
                  {passwordConfirmMessage}
                </TextValidation>
              </IconValidation>
            )}
          </InputBox>
          <SignUpButton disabled={signUpdisabled === false} type="submit">
            확인
          </SignUpButton>
        </SignUpContainer>
      ) : (
        <TOUContainer>
          <TOUHeaderText>GYMTIVATION 이용약관</TOUHeaderText>
          <TouCheckBox>
            {allCheck === false ? (
              <AiOutlineCheckCircle onClick={onClickAllCheckBtn} />
            ) : (
              <AiFillCheckCircle onClick={onClickCancelCheckBtn} />
            )}
            <TOUText>모두 동의하기</TOUText>
          </TouCheckBox>
          <TouCheckBox>
            {touCheck === false ? (
              <AiOutlineCheckCircle
                onClick={() => {
                  setTOUCheck(true);
                }}
              />
            ) : (
              <AiFillCheckCircle
                onClick={() => {
                  setTOUCheck(false);
                }}
              />
            )}

            <TOUText>이용약관 동의(필수)</TOUText>
            {!touCheck && (
              <TextValidation> 이용약관 동의를 해주세요.</TextValidation>
            )}
          </TouCheckBox>
          <TOU>{tou}</TOU>
          <TouCheckBox>
            {piCheck === false ? (
              <AiOutlineCheckCircle
                onClick={() => {
                  setPICheck(true);
                }}
              />
            ) : (
              <AiFillCheckCircle
                onClick={() => {
                  setPICheck(false);
                }}
              />
            )}
            <TOUText>개인정보 동의(필수)</TOUText>
            {!piCheck && (
              <TextValidation> 개인정보 동의를 해주세요.</TextValidation>
            )}
          </TouCheckBox>
          <TOU>{pi}</TOU>
          <TouCheckBox>
            {lbCheck === false ? (
              <AiOutlineCheckCircle
                onClick={() => {
                  setLBCheck(true);
                }}
              />
            ) : (
              <AiFillCheckCircle
                onClick={() => {
                  setLBCheck(false);
                }}
              />
            )}
            <TOUText>위치정보 동의(필수)</TOUText>
            {!lbCheck && (
              <TextValidation> 위치정보 동의를 해주세요.</TextValidation>
            )}
          </TouCheckBox>
          <TOU>{lb}</TOU>
          <SignUpButton onClick={onClicktermsOfUse}>
            동의하고 가입하기
          </SignUpButton>
        </TOUContainer>
      )}
    </SignUpWrapper>
  );
};

export default SignUp;

const SignUpWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin: auto;
`;

const SignUpContainer = styled.form`
  margin-top: 2vh;
`;
const PasswordShow = styled.div`
  :hover {
    cursor: pointer;
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
const SignUpButton = styled.button`
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

const TOUContainer = styled.div``;
const TouCheckBox = styled.div`
  display: flex;
  margin-top: 4vh;
  font-size: 20px;
  :hover {
    cursor: pointer;
  }
`;
const TOUHeaderText = styled.div`
  font-size: 28px;
  font-weight: bold;
  text-align: center;
  margin-top: 4vh;
  margin-bottom: 10vh;
`;
const TOU = styled.div`
  margin-top: 2vh;
  width: 24vw;
  height: 12vh;
  overflow: auto;
`;
const TOUText = styled.div`
  margin-left: 1vw;
`;
const ImageBox = styled.div`
  text-align: center;
`;
const InputBox = styled.div`
  height: 15vh;
`;
const SignUpInput = styled.input`
  width: 24vw;
  height: 5vh;
  margin-right: 1vw;
  border-radius: 20px;
  border: none;
  padding-left: 16px;
  background-color: #e9ecef;
  font-size: 16px;
`;
