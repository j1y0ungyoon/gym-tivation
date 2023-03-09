import { authService, dbService } from '@/firebase';
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
} from 'firebase/auth';
import { setDoc, doc, addDoc } from 'firebase/firestore';

import { useState, useCallback, useEffect } from 'react';
import { tou, pi, lb } from '@/components/TermsOfUse';
import styled from 'styled-components';
import {
  AiOutlineCheckCircle,
  AiFillCheckCircle,
  AiFillEye,
  AiFillEyeInvisible,
} from 'react-icons/ai';
import UploadImage from '@/components/mypage/ProfileUpLoad';
import { useRouter } from 'next/router';
import { getDocs, collection, query } from 'firebase/firestore';
import { toast } from 'react-toastify';
import useModal from '@/hooks/useModal';
import { GLOBAL_MODAL_TYPES } from '@/recoil/modalState';

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

  //이메일, 닉네임 중복 체크
  const [nickNameInformation, setNickNameInformation] = useState([] as any);
  const [emailInformation, setEmailInformation] = useState([] as any);

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
  const { showModal } = useModal();

  //이메일, 닉네임 중복 체크
  const emailCheck = emailInformation.includes(email);
  const nickNameCheck = nickNameInformation.includes(nickName);

  const EmailNickNameGetDoc = async () => {
    const q = query(collection(dbService, 'profile'));
    const data = await getDocs(q);
    data.docs.map((doc) => {
      setNickNameInformation((prev: any) => [...prev, doc.data().displayName]);
      setEmailInformation((prev: any) => [...prev, doc.data().email]);
    });
  };

  //유효헝 검사

  const signUpdisabled =
    isValidEmail &&
    isValidPassword &&
    isValidNickName &&
    isValidPasswordCheck &&
    !emailCheck &&
    !nickNameCheck;
  const onChangeEmail = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const emailRegex =
        /([\w-.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
      const emailCurrent = e.target.value;
      setEmail(emailCurrent);
      // if (emailInformation.includes(emailCurrent)) {
      //   setEmailMessage('중복된 메일입니다.');
      //   setIsValiEmail(false);
      // }
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
          '대문자, 숫자, 특수문자 포함 8글자 이상 15글자 이하로 적어주세요',
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
    isValidEmail && !emailCheck ? (
      <AiFillCheckCircle color="#0094FF" />
    ) : (
      <AiFillCheckCircle color="red" />
    );
  const passwordIcon = isValidPassword ? (
    <AiFillCheckCircle color="#0094FF" />
  ) : (
    <AiFillCheckCircle color="red" />
  );
  const passwordCheckIcon = isValidPasswordCheck ? (
    <AiFillCheckCircle color="#0094FF" />
  ) : (
    <AiFillCheckCircle color="red" />
  );
  const nickNameIcon =
    isValidNickName && !nickNameCheck ? (
      <AiFillCheckCircle color="#0094FF" />
    ) : (
      <AiFillCheckCircle color="red" />
    );

  //이용약관 이동 버튼
  const onClicktermsOfUse = () => {
    setChange(true);
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
      await authService.signOut();
      await updateProfile(user, {
        displayName: nickName,
        photoURL: imageURL,
      });

      await sendEmailVerification(user);
      await setDoc(doc(dbService, 'profile', user.uid), {
        introduction: '',
        area: '지역',
        instagram: '',
        displayName: nickName,
        photoURL: imageURL,
        email: user.email,
        uid: user.uid,
        following: '',
        follower: '',
        // 운동 참여 버튼 테스트를 위해 가입시 필드 추가
        userParticipation: [],
        lv: 1,
        lvName: 'Yellow',
      });
      await addDoc(collection(dbService, 'dms'), {
        id: user?.uid,
        enterUser: [user?.uid, '나와의채팅'],
        chatLog: [],
      });
      showModal({
        modalType: GLOBAL_MODAL_TYPES.AlertModal,
        modalProps: { contentText: '인증 메일을 확인해주세요!' },
      });
      router.push('/signIn');
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    EmailNickNameGetDoc();

    return () => {
      EmailNickNameGetDoc();
    };
  }, [email]);

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
                  {emailCheck ? '중복된 이메일입니다' : ''}
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
                  {nickNameCheck ? '중복된 닉네임입니다' : ''}
                  {nickNameMessage}
                </TextValidation>
              </IconValidation>
            )}
          </InputBox>

          <InputBox>
            <InputText>비밀번호</InputText>
            <PasswordShow>
              <PasswordInput
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
              <PasswordInput
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
            가입하기
          </SignUpButton>
        </SignUpContainer>
      ) : (
        <TOUContainer>
          <IconImg src="/assets/icons/myPage/gymtivation_logo_miniicon.svg" />
          <TOUHeaderText>GYMTIVATION 이용약관</TOUHeaderText>

          <TouAllCheckBox>
            {allCheck === false ? (
              <>
                <AiOutlineCheckCircle
                  onClick={onClickAllCheckBtn}
                  style={{ marginTop: '3px' }}
                />
                <TOUText onClick={onClickAllCheckBtn}>모두 동의하기</TOUText>
              </>
            ) : (
              <>
                <AiFillCheckCircle
                  onClick={onClickCancelCheckBtn}
                  style={{ color: '#0094FF', marginTop: '3px' }}
                />
                <TOUText
                  onClick={onClickCancelCheckBtn}
                  style={{ color: '#0094FF' }}
                >
                  모두 동의하기
                </TOUText>
              </>
            )}
          </TouAllCheckBox>
          <TouAllCheckBox>
            {touCheck === false ? (
              <>
                <AiOutlineCheckCircle
                  onClick={() => {
                    setTOUCheck(true);
                  }}
                  style={{ marginTop: '3px' }}
                />
                <TOUText
                  onClick={() => {
                    setTOUCheck(true);
                  }}
                >
                  이용약관 동의(필수)
                </TOUText>
              </>
            ) : (
              <>
                <AiFillCheckCircle
                  style={{ color: '#0094FF', marginTop: '3px' }}
                  onClick={() => {
                    setTOUCheck(false);
                  }}
                />
                <TOUText
                  style={{ color: '#0094FF' }}
                  onClick={() => {
                    setTOUCheck(false);
                  }}
                >
                  이용약관 동의(필수)
                </TOUText>
              </>
            )}

            {!touCheck && (
              <TextValidation> 이용약관 동의를 해주세요.</TextValidation>
            )}
          </TouAllCheckBox>
          <TOU>{tou}</TOU>
          <TouCheckBox>
            {piCheck === false ? (
              <>
                <AiOutlineCheckCircle
                  onClick={() => {
                    setPICheck(true);
                  }}
                  style={{ marginTop: '3px' }}
                />
                <TOUText
                  onClick={() => {
                    setPICheck(true);
                  }}
                >
                  개인정보 동의(필수)
                </TOUText>
              </>
            ) : (
              <>
                <AiFillCheckCircle
                  style={{ color: '#0094FF', marginTop: '3px' }}
                  onClick={() => {
                    setPICheck(false);
                  }}
                />
                <TOUText
                  style={{ color: '#0094FF' }}
                  onClick={() => {
                    setPICheck(false);
                  }}
                >
                  개인정보 동의(필수)
                </TOUText>
              </>
            )}
            {!piCheck && (
              <TextValidation> 개인정보 동의를 해주세요.</TextValidation>
            )}
          </TouCheckBox>
          <TOU>{pi}</TOU>
          <TouCheckBox>
            {lbCheck === false ? (
              <>
                <AiOutlineCheckCircle
                  onClick={() => {
                    setLBCheck(true);
                  }}
                  style={{ marginTop: '3px' }}
                />
                <TOUText>위치정보 동의(필수)</TOUText>
              </>
            ) : (
              <>
                <AiFillCheckCircle
                  style={{ color: '#0094FF', marginTop: '3px' }}
                  onClick={() => {
                    setLBCheck(false);
                  }}
                />
                <TOUText
                  style={{ color: '#0094FF' }}
                  onClick={() => {
                    setLBCheck(false);
                  }}
                >
                  위치정보 동의(필수)
                </TOUText>
              </>
            )}
            {!lbCheck && (
              <TextValidation> 위치정보 동의를 해주세요.</TextValidation>
            )}
          </TouCheckBox>
          <TOU>
            <span>{lb}</span>
          </TOU>
          <SignUpButton
            onClick={onClicktermsOfUse}
            disabled={(!touCheck === !piCheck) === !lbCheck}
          >
            동의하고 가입하기
          </SignUpButton>
        </TOUContainer>
      )}
    </SignUpWrapper>
  );
};

export default SignUp;

const SignUpWrapper = styled.div`
  ${({ theme }) => theme.mainLayout.wrapper}
`;
const SignUpContainer = styled.form`
  ${({ theme }) => theme.mainLayout.container}
  height : calc(100% - 40px);
  text-align: center;
`;
const PasswordShow = styled.div`
  width: 100%;
  margin: auto;
  :hover {
    cursor: pointer;
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
const SignUpButton = styled.button`
  margin-top: 4vh;
  border-radius: 2rem;
  width: 40%;
  height: 48px;
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

const TOUContainer = styled.div`
  ${({ theme }) => theme.mainLayout.container}
  justify-content: center;
  text-align: center;
  height: calc(100% - 40px);
`;
const TouCheckBox = styled.div`
  display: flex;
  height: 5%;
  width: 40%;
  margin: auto;
  text-align: left;
  margin-top: 34px;
  font-size: 20px;
  :hover {
    cursor: pointer;
  }
`;
const TouAllCheckBox = styled.div`
  display: flex;
  height: 5%;
  width: 40%;
  margin: auto;
  text-align: left;
  font-size: 20px;
  :hover {
    cursor: pointer;
  }
`;

const TOUHeaderText = styled.div`
  font-size: 30px;
  font-weight: bold;
  margin-top: 1vh;
  margin-bottom: 4vh;
`;
const TOU = styled.div`
  margin-top: 2vh;
  height: 13%;
  width: 40%;
  margin: auto;
  overflow: auto;
  background-color: white;
  /* ::-webkit-scrollbar {
    display: none;
  } */
`;
const TOUText = styled.div`
  margin-left: 12px;
`;
const ImageBox = styled.div`
  text-align: center;
  margin-bottom: 30px;
`;
const InputBox = styled.div`
  width: 100%;
  height: 15%;
`;
const SignUpInput = styled.input`
  width: 40%;
  height: 48px;
  border-radius: 20px;
  padding-left: 16px;
  font-size: 16px;
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
const IconImg = styled.img`
  width: 5rem;
  height: 5rem;
  margin-right: 5px;
`;
