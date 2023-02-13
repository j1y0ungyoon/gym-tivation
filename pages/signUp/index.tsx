import { authService } from '@/firebase';
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
} from 'firebase/auth';
import { useState } from 'react';
import { tou, pi, lb } from '@/components/termsOfUse';
import styled from 'styled-components';
import {
  AiOutlineCheckCircle,
  AiFillCheckCircle,
  AiFillEye,
  AiFillEyeInvisible,
} from 'react-icons/ai';
import UploadImage from '@/components/ProfileUpLoad';
import { Router, useRouter } from 'next/router';

const SignUp = () => {
  //회원가입
  const [email, setEmail] = useState('');
  const [password, setPassWord] = useState('');
  const [passwordCheck, setPassWordCheck] = useState('');
  const [nickName, setNickName] = useState('');

  //이용약관>프로필 토글버튼
  const [change, setChange] = useState(false);

  //프로필 사진
  const [imageURL, setImageURL] = useState<string>('');

  //이용약관
  const [touCheck, setTOUCheck] = useState(false);
  const [piCheck, setPICheck] = useState(false);
  const [lbCheck, setLBCheck] = useState(false);
  const [allCheck, setAllCheck] = useState(false);

  //비밀번호 확인
  const [showPasword, setShowPassword] = useState(false);
  const [showPaswordCheck, setShowPasswordCheck] = useState(false);

  //유효성 검사
  const [isValidEmail, setIsValiEmail] = useState(false);
  const [isValidPassword, setIsValidPassword] = useState(false);
  const [isValidNickName, setIsValidNickName] = useState(false);
  const [isValidPasswordCheck, setIsValidPasswordCheck] = useState(false);

  const router = useRouter();

  //유효헝 검사
  const email_validation = new RegExp(
    /^([0-9a-zA-Z_\.-]+)@([0-9a-zA-Z_-]+)(\.[0-9a-zA-Z_-]+){1,2}$/,
  );
  const password_validation = new RegExp(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,15}$/,
  );
  const nickName_validation = new RegExp(/^[\w\Wㄱ-ㅎㅏ-ㅣ가-힣]{2,8}$/);

  const signUpdisabled =
    isValidEmail && isValidPassword && isValidNickName && isValidPasswordCheck;

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
    try {
      e.preventDefault();
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
          <UploadImage imageURL={imageURL} setImageURL={setImageURL} />
          <InputText>이메일</InputText>
          <SignUpInput
            id="emailInput"
            type="text"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (email_validation.test(e.target.value)) {
                setIsValiEmail(true);
              } else {
                setIsValiEmail(false);
              }
            }}
            placeholder="이메일을 입력해주세요."
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
          <InputText>닉네임</InputText>
          <SignUpInput
            id="nickNameInput"
            value={nickName}
            onChange={(e) => {
              setNickName(e.target.value);
              if (nickName_validation.test(e.target.value)) {
                setIsValidNickName(true);
              } else {
                setIsValidNickName(false);
              }
            }}
            placeholder="닉네임을 입력해주세요."
            maxLength={8}
          />
          {isValidNickName === false ? (
            <IconValidation>
              <AiFillCheckCircle color="red" />
              <TextValidation>
                특수문자 제외 2글자 이상 8글자 이하로 적어주세요.
              </TextValidation>
            </IconValidation>
          ) : (
            <IconValidation>
              <AiFillCheckCircle color="green" />
            </IconValidation>
          )}
          <InputText>비밀번호</InputText>
          <PasswordShow>
            <SignUpInput
              id="passwordInput"
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
              placeholder="비밀번호를 입력해주세요."
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
          {isValidPassword === false ? (
            <IconValidation>
              <AiFillCheckCircle color="red" />
              <TextValidation>
                대문자, 소문자, 특수문자 포함 8글자 이상 15글자 이하로
                적어주세요.
              </TextValidation>
            </IconValidation>
          ) : (
            <IconValidation>
              <AiFillCheckCircle color="green" />
            </IconValidation>
          )}

          <InputText>비밀번호 확인</InputText>
          <PasswordShow>
            <SignUpInput
              id="passwordCheckInput"
              type={showPaswordCheck ? 'text' : 'password'}
              value={passwordCheck}
              onChange={(e) => {
                setPassWordCheck(e.target.value);
                if (password_validation.test(e.target.value)) {
                  setIsValidPasswordCheck(true);
                } else {
                  setIsValidPasswordCheck(false);
                }
              }}
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
          {isValidPasswordCheck === true && password === passwordCheck ? (
            <IconValidation>
              <AiFillCheckCircle color="green" />
            </IconValidation>
          ) : (
            <IconValidation>
              <AiFillCheckCircle color="red" />
              <TextValidation>비밀번호를 확인해주세요.</TextValidation>
            </IconValidation>
          )}
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
