import styled from 'styled-components';
import { authService, dbService } from '@/firebase';
import { useState, useEffect, useCallback } from 'react';
import UploadImage from '@/components/ProfileUpLoad';
import { updateProfile } from 'firebase/auth';
import {
  doc,
  setDoc,
  updateDoc,
  query,
  collection,
  getDocs,
  where,
} from 'firebase/firestore';
import { ProfileItem } from '@/pages/myPage/[...params]';
import { AiFillCheckCircle } from 'react-icons/ai';

type ProfileEditProps = {
  item: ProfileItem;
  paramsId: string;
  follower: [];
  following: [];
  setFollowModal: (p: boolean) => void;
};

const OPTIONS = [
  { area: '서울', name: '서울' },
  { area: '경기', name: '경기' },
  { area: '인천', name: '인천' },
  { area: '강원', name: '강원' },
  { area: '제주', name: '제주' },
  { area: '부산', name: '부산' },
  { area: '충북', name: '충북' },
  { area: '충남', name: '충남' },
];

//기본이미지
const DEFAULT_PHOTO_URL =
  'https://blog.kakaocdn.net/dn/c3vWTf/btqUuNfnDsf/VQMbJlQW4ywjeI8cUE91OK/img.jpg';

const ProfileEdit = ({
  item,
  paramsId,
  follower,
  following,
  setFollowModal,
}: ProfileEditProps) => {
  const [isProfileEdit, setIsProfileEdit] = useState(false);
  //닉네임, 사진 불러오기
  const [photoURL, setPhotoURL] = useState(DEFAULT_PHOTO_URL);

  //프로필 변경
  const [nickName, setNickName] = useState(item.displayName);
  const [introduction, setIntroduction] = useState(item.introduction);
  const [area, setArea] = useState(item.area);
  const [instagram, setInstagram] = useState(item.instagram);
  const [nickNameMessage, setNickNameMessage] = useState<string>('');
  const [isValidNickName, setIsValidNickName] = useState(true);
  const [nickNameInformation, setNickNameInformation] = useState([] as any);

  const nickNameCheck = nickNameInformation.includes(nickName);
  const user = String(authService.currentUser?.uid);
  console.log(isValidNickName);
  //닉네임 중복 검사
  const EmailNickNameGetDoc = async () => {
    const q = query(collection(dbService, 'profile'), where('uid', '!=', user));
    const data = await getDocs(q);
    data.docs.map((doc) => {
      setNickNameInformation((prev: any) => [...prev, doc.data().displayName]);
    });
  };
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

  const nickNameIcon =
    isValidNickName && !nickNameCheck ? (
      <AiFillCheckCircle color="green" />
    ) : (
      <AiFillCheckCircle color="red" />
    );
  const [message, setMessage] = useState('');
  //Level 메시지
  const Level = Number(item.lv);
  const helpLevel = () => {
    if (item.lvName === '일반인' && Level < 5) {
      setMessage(`헬애기까지 Lv${5 - Level} 남았습니다. `);
    } else if (item.lvName === '헬애기' && Level < 15) {
      setMessage(`헬린이까지 Lv${15 - Level} 남았습니다.`);
    } else if (item.lvName === '헬린이' && Level < 30) {
      setMessage(`헬른이까지 Lv${30 - Level} 남았습니다.`);
    } else if (item.lvName === '헬른이' && Level < 60) {
      setMessage(`헬애비까지 Lv${60 - Level} 남았습니다.`);
    }
  };

  //프로필 수정
  const onClickProfileEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const user = authService.currentUser;
      if (user !== null) {
        await updateProfile(user, {
          displayName: nickName,
          photoURL,
        });
        setIsProfileEdit(false);
        await updateDoc(doc(dbService, 'profile', user.uid), {
          introduction: introduction,
          area: area,
          instagram: instagram,
          displayName: nickName,
          photoURL: photoURL,
          email: user.email,
          uid: user.uid,
        });
      }
      alert('변경완료');
    } catch (error: any) {
      alert(error.message);
    }
  };

  //사진 주소, 닉네임 불러오기
  useEffect(() => {
    EmailNickNameGetDoc();
    helpLevel();
    authService.onAuthStateChanged((user) => {
      if (user !== null) {
        if (user.displayName !== null) {
          const authDisplayName = user.displayName;
          setNickName(authDisplayName);
        }
        if (user.photoURL !== null) {
          const authPhotoURL = user.photoURL;
          setPhotoURL(authPhotoURL);
        }
      }
    });
  }, []);

  return (
    <>
      {!isProfileEdit ? (
        <>
          <InformationBox>
            <EditPhotoBox>
              <ProfilePhoto>
                {item.photoURL === null ? (
                  <Photo src="https://blog.kakaocdn.net/dn/c3vWTf/btqUuNfnDsf/VQMbJlQW4ywjeI8cUE91OK/img.jpg" />
                ) : (
                  <Photo src={item.photoURL} />
                )}
              </ProfilePhoto>
              <LevelBox>
                <LevelText>{item.lvName}</LevelText>
                <LevelTextNumber>Lv{Math.floor(Level)}</LevelTextNumber>
                <LevelHelpBox className="levelHelpBox">
                  <LevelHelpTextBox>
                    <HelpLvText>Lv이란?</HelpLvText>
                    <LevelHelpText>
                      게시판 및 오운완 갤러리 글 작성시 Lv이 증가하며, 일정 Lv
                      달성시 타이틀을 획득할 수 있습니다.
                    </LevelHelpText>
                    <LevelHelpTextBox>
                      <LevelMessage>{message}</LevelMessage>
                    </LevelHelpTextBox>
                  </LevelHelpTextBox>
                </LevelHelpBox>
              </LevelBox>
            </EditPhotoBox>
            <EditNickNameBox>
              <NickNameAreaBox>
                <NameBox>
                  <NickNameText>{item.displayName}</NickNameText>
                  <AreaText>{item.area}</AreaText>
                  {authService.currentUser?.uid === paramsId && (
                    <EditButton
                      onClick={() => {
                        setIsProfileEdit(true);
                      }}
                    >
                      수정
                    </EditButton>
                  )}
                </NameBox>
                <InstagramBox>
                  <a href={`https://www.instagram.com/${instagram}/`}>
                    {item.instagram}
                  </a>
                  <InstagramImage src="https://t1.daumcdn.net/cfile/tistory/99B6AB485D09F2132A" />
                </InstagramBox>
              </NickNameAreaBox>
              <FollowBox
                onClick={() => {
                  setFollowModal(true);
                }}
              >
                <FollowText> 팔로워 </FollowText>
                <FollowNumberText>
                  {follower === undefined ? '0' : follower.length}
                </FollowNumberText>
                <FollowText> 팔로잉 </FollowText>
                <FollowNumberText>
                  {following === undefined ? '0' : following.length}
                </FollowNumberText>
              </FollowBox>

              <IntroductionText
                readOnly
                value={item.introduction}
                placeholder="자기소개를 적어주세요."
              />
            </EditNickNameBox>
          </InformationBox>
        </>
      ) : (
        <>
          <form onSubmit={onClickProfileEdit}>
            <InformationBox>
              <EditPhotoBox>
                <ProfilePhoto>
                  <UploadImage imageURL={photoURL} setImageURL={setPhotoURL} />
                </ProfilePhoto>
                <LevelBox>
                  <LevelText>{item.lvName}</LevelText>
                  <LevelTextNumber>Lv{Math.floor(Level)}</LevelTextNumber>
                  <LevelHelpBox className="levelHelpBox">
                    <LevelHelpTextBox>
                      <HelpLvText>Lv이란?</HelpLvText>
                      <LevelHelpText>
                        게시판 및 오운완 갤러리 글 작성시 Lv이 증가하며, 일정 Lv
                        달성시 타이틀을 획득할 수 있습니다.
                      </LevelHelpText>
                      <LevelHelpTextBox>
                        <LevelMessage>{message}</LevelMessage>
                      </LevelHelpTextBox>
                    </LevelHelpTextBox>
                  </LevelHelpBox>
                </LevelBox>
              </EditPhotoBox>
              <EditNickNameBox>
                <NickNameAreaBox>
                  <NameBox>
                    <TextInput
                      spellCheck="false"
                      value={nickName}
                      onChange={onChangeName}
                      placeholder="닉네임"
                      maxLength={8}
                    />
                    <Select
                      onChange={(e) => {
                        setArea(e.target.value);
                      }}
                      defaultValue={area}
                    >
                      {OPTIONS.map((option) => (
                        <option key={option.area} value={option.area}>
                          {option.name}
                        </option>
                      ))}
                    </Select>
                    <EditButton
                      onClick={() => {
                        setIsProfileEdit(false);
                        setNickName(item.displayName);
                        setInstagram(item.instagram);
                        setIntroduction(item.introduction);
                      }}
                    >
                      취소
                    </EditButton>
                    <EditButton
                      type="submit"
                      disabled={isValidNickName === nickNameCheck}
                    >
                      완료
                    </EditButton>
                    <InputBox>
                      {nickName !== item.displayName && (
                        <>
                          {nickNameIcon}
                          <TextValidation
                            className={`message ${
                              isValidNickName ? 'success' : 'error'
                            }`}
                          >
                            {nickNameCheck ? '중복된 닉네임입니다' : ''}
                            {nickNameMessage}
                          </TextValidation>
                        </>
                      )}
                    </InputBox>
                  </NameBox>
                  <InstagramBox>
                    <InstagramInput
                      spellCheck="false"
                      value={instagram}
                      onChange={(e) => {
                        setInstagram(e.target.value);
                      }}
                      placeholder="아이디"
                      maxLength={20}
                    />
                    <InstagramImage src="https://t1.daumcdn.net/cfile/tistory/99B6AB485D09F2132A" />
                  </InstagramBox>
                </NickNameAreaBox>
                <FollowBox>
                  <FollowText> 팔로워 </FollowText>
                  <FollowNumberText>
                    {follower === undefined ? '0' : follower.length}{' '}
                  </FollowNumberText>
                  <FollowText> 팔로잉 </FollowText>
                  <FollowNumberText>
                    {following === undefined ? '0' : following.length}{' '}
                  </FollowNumberText>
                </FollowBox>
                <IntroductionEditText
                  spellCheck="false"
                  value={introduction}
                  onChange={(e) => {
                    setIntroduction(e.target.value);
                  }}
                  maxLength={104}
                  placeholder="자기소개를 입력해주세요."
                />
              </EditNickNameBox>
            </InformationBox>
          </form>
        </>
      )}
    </>
  );
};

export default ProfileEdit;

const InformationBox = styled.div`
  width: 100%;
  height: 100%;
  padding-top: 1vh;
  overflow: hidden;
`;
const EditPhotoBox = styled.div`
  padding-top: 1vh;
  width: 14vw;
  height: 50vh;
  float: left;
`;

const EditNickNameBox = styled.div`
  width: 30vw;
  height: 50vh;
  float: left;
  text-align: left;
`;
const NameBox = styled.div`
  height: 80%;
`;
const ProfilePhoto = styled.div`
  width: 150px;
  height: 150px;
  margin: auto;
  border-radius: 70%;
  overflow: hidden;
`;
const Photo = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;
const LevelBox = styled.div`
  position: relative;
  margin-top: 2vh;
  :hover {
    cursor: help;
    .levelHelpBox {
      display: flex;
    }
  }
`;
const LevelHelpBox = styled.div`
  display: none;
  z-index: 2000;
  width: 20%;
  height: 15%;
  top: 42%;
  left: 18%;
  position: fixed;
  border-radius: 15px;
  background-color: white;
  transform: translate(-50%, -50%) !important;
  padding: 0.9rem;
  border-style: solid;
  border-width: 1px;
  border-color: gray;
  overflow: auto;
  ::-webkit-scrollbar {
    display: none;
  }
`;
const LevelMessage = styled.div`
  margin-top: 1.5rem;
  font-size: 1.2rem;
  color: green;
  font-weight: bolder;
`;
const LevelHelpTextBox = styled.div`
  text-align: left;
`;
const LevelHelpText = styled.span`
  margin-left: 0.5rem;
  font-size: 0.9rem;
`;
const LevelText = styled.span`
  font-weight: bolder;
  font-size: 1.2rem;
  color: green;
`;
const LevelTextNumber = styled.span`
  margin-left: 0.2vw;
  font-size: 1rem;
  font-weight: bolder;
  color: red;
`;
const NickNameAreaBox = styled.div`
  margin-top: 1vh;
  height: 15%;
`;
const NickNameText = styled.span`
  font-size: 1.2rem;
  font-weight: bold;
  margin-right: 1vw;
`;
const AreaText = styled.span`
  font-size: 1rem;
  font-weight: bold;
  color: black;
`;
const IntroductionText = styled.textarea`
  margin-top: 3vh;
  font-size: 16px;
  border: none;
  width: 24vw;
  height: 8vh;
  text-align: left;
  resize: none;
  overflow: hidden;
  :focus {
    outline: none;
  }
`;
const IntroductionEditText = styled.textarea`
  margin-top: 3vh;
  font-size: 16px;
  border: none;
  width: 24vw;
  height: 8vh;
  text-align: left;
  resize: none;
  overflow: hidden;
  border-bottom-color: black;
  border-bottom-style: solid;
  border-width: 0.1rem;
  :focus {
    outline: none;
  }
`;

const EditButton = styled.button`
  background-color: #eeeeee;
  border-radius: 2rem;
  border: none;
  width: 4vw;
  height: 3.9vh;
  margin-left: 1vw;
  :hover {
    cursor: pointer;
    background-color: gray;
    color: white;
  }
`;

const TextInput = styled.input`
  width: 8vw;
  height: 2.6vh;
  border: none;
  font-size: 1.2rem;
  font-weight: bold;
  text-align: left;
  border-bottom-color: black;
  border-bottom-style: solid;
  border-bottom-width: 0.1rem;
  :focus {
    outline: none;
  }
`;

const Select = styled.select`
  width: 4vw;
  font-size: 1rem;
  margin-left: 1vw;
  border: none;
  :focus {
    outline: none;
  }
`;
const InstagramInput = styled.input`
  width: 8vw;
  height: 2vh;
  border: none;
  font-size: 15px;
  color: black;
  font-weight: 700;
  text-align: left;
  border-bottom-color: black;
  border-bottom-style: solid;
  border-bottom-width: 0.1rem;
  :focus {
    outline: none;
  }
`;
const InstagramImage = styled.img`
  width: 1.5rem;
  margin-left: 1vh;
`;
const InstagramBox = styled.div`
  margin-top: 1vh;
  color: black;
  font-weight: 700;
  a:link {
    color: black;
    text-decoration: none;
  }
  a:visited {
    color: black;
    text-decoration: none;
  }
  a:hover {
    color: lightgray;
  }
`;
const FollowBox = styled.div`
  margin-top: 4vh;
  :hover {
    cursor: pointer;
    color: gray;
  }
`;

const FollowText = styled.span`
  font-weight: bold;
  font-size: 1.2rem;
`;
const FollowNumberText = styled.span`
  font-weight: bolder;
  font-size: 1.2rem;
`;

const TextValidation = styled.span`
  color: red;
  margin-left: 1vw;
  font-size: 12px;
`;
const InputBox = styled.div`
  height: 15vh;
`;

const HelpLvText = styled.span`
  font-size: 1.2rem;
  font-weight: bolder;
  color: red;
`;
