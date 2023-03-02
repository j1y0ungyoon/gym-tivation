import styled from 'styled-components';
import { authService, dbService } from '@/firebase';
import { useState, useEffect, useCallback, useId } from 'react';
import UploadImage from '@/components/ProfileUpLoad';
import { updateProfile } from 'firebase/auth';
import {
  doc,
  updateDoc,
  query,
  collection,
  getDocs,
  where,
  arrayRemove,
  arrayUnion,
} from 'firebase/firestore';
import { ProfileItem } from '@/pages/myPage/[...params]';
import { AiFillCheckCircle } from 'react-icons/ai';

type ProfileEditProps = {
  item: ProfileItem;
  paramsId: string;
  setFollowModal: (p: boolean) => void;
  setToggle: (p: boolean) => void;
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
  // follower,
  // following,
  setFollowModal,
  setToggle,
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
  const [PostNumber, setPostNumber] = useState([] as any);

  const nickNameCheck = nickNameInformation.includes(nickName);
  const user = String(authService.currentUser?.uid);

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
    } else if (item.lvName === '헬애비') {
      setMessage(`최고 타이틀까지 도달하셨습니다!`);
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
    } catch (error: any) {
      alert(error.message);
    }
  };
  //팔로우, 팔로잉
  const FollowOnClick = async () => {
    if (user !== null) {
      await updateDoc(doc(dbService, 'profile', user), {
        following: arrayUnion(paramsId),
      });
      await updateDoc(doc(dbService, 'profile', item.id), {
        follower: arrayUnion(user),
      });
    }
  };

  const FollowReMoveOnClick = async () => {
    if (user !== null) {
      await updateDoc(doc(dbService, 'profile', user), {
        following: arrayRemove(paramsId),
      });
      await updateDoc(doc(dbService, 'profile', item.id), {
        follower: arrayRemove(user),
      });
    }
  };
  const getBoardNumber = async () => {
    const q = query(
      collection(dbService, 'posts'),
      where('userId', '==', paramsId),
    );
    const data = await getDocs(q);
    data.docs.map((doc) => {
      setPostNumber((prev: any) => [...prev, doc.data().title]);
    });
  };
  const getGallery = async () => {
    const q = query(
      collection(dbService, 'gallery'),
      where('userId', '==', paramsId),
    );
    const data = await getDocs(q);
    data.docs.map((doc) => {
      setPostNumber((prev: any) => [...prev, doc.data().title]);
    });
  };

  //사진 주소, 닉네임 불러오기
  useEffect(() => {
    EmailNickNameGetDoc();
    helpLevel();
    getBoardNumber();
    getGallery();
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
    return () => {
      getBoardNumber();
      getGallery();
      EmailNickNameGetDoc();
      helpLevel();
    };
  }, [paramsId]);

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
                {item.lvName === '일반인' && (
                  <LevelIcon src="https://cdn-icons-png.flaticon.com/512/8712/8712070.png" />
                )}
                {item.lvName === '헬애기' && (
                  <LevelIcon src="https://cdn-icons-png.flaticon.com/512/4700/4700514.png" />
                )}
                {item.lvName === '헬린이' && (
                  <LevelIcon src="https://cdn-icons-png.flaticon.com/128/1845/1845861.png" />
                )}
                {item.lvName === '헬른이' && (
                  <LevelIcon src="https://cdn-icons-png.flaticon.com/128/2548/2548532.png" />
                )}
                {item.lvName === '헬애비' && (
                  <LevelIcon src="https://cdn-icons-png.flaticon.com/512/2376/2376399.png" />
                )}
                <LevelTextNumber>Lv{Math.floor(Level)}</LevelTextNumber>
                <LevelText>{item.lvName}</LevelText>

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

                  {authService.currentUser?.uid === paramsId ? (
                    <EditButton
                      onClick={() => {
                        setIsProfileEdit(true);
                      }}
                    >
                      수정
                    </EditButton>
                  ) : item.follower?.includes(user) ? (
                    <EditButton
                      style={{ backgroundColor: 'black', color: 'white' }}
                      onClick={FollowReMoveOnClick}
                    >
                      팔로잉
                    </EditButton>
                  ) : (
                    <EditButton onClick={FollowOnClick}>팔로우</EditButton>
                  )}
                </NameBox>
                <InstagramBox>
                  <a
                    href={`https://www.instagram.com/${instagram}/`}
                    target="_blank"
                  >
                    {item.instagram}
                  </a>
                  <InstagramImage src="https://t1.daumcdn.net/cfile/tistory/99B6AB485D09F2132A" />
                </InstagramBox>
              </NickNameAreaBox>
              <FollowBox>
                <PostNumberText>게시글</PostNumberText>
                <FollowNumberText>
                  {PostNumber === undefined ? '0' : PostNumber.length}
                </FollowNumberText>
                <FollowText
                  onClick={() => {
                    setFollowModal(true);
                    setToggle(true);
                  }}
                >
                  팔로워
                </FollowText>
                <FollowNumberText>
                  {item.follower === undefined ? '0' : item.follower.length}
                </FollowNumberText>
                <FollowText
                  onClick={() => {
                    setFollowModal(true);
                    setToggle(false);
                  }}
                >
                  팔로잉
                </FollowText>
                <FollowNumberText>
                  {item.following === undefined ? '0' : item.following.length}
                </FollowNumberText>
              </FollowBox>

              <IntroductionText
                readOnly
                value={item.introduction}
                placeholder="자기소개를 적어주세요."
                maxLength={50}
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
                  {item.lvName === '일반인' && (
                    <LevelIcon src="https://cdn-icons-png.flaticon.com/512/8712/8712070.png" />
                  )}
                  {item.lvName === '헬애기' && (
                    <LevelIcon src="https://cdn-icons-png.flaticon.com/512/4700/4700514.png" />
                  )}
                  {item.lvName === '헬린이' && (
                    <LevelIcon src="https://cdn-icons-png.flaticon.com/128/1845/1845861.png" />
                  )}
                  {item.lvName === '헬른이' && (
                    <LevelIcon src="https://cdn-icons-png.flaticon.com/128/2548/2548532.png" />
                  )}
                  {item.lvName === '헬애비' && (
                    <LevelIcon src="https://cdn-icons-png.flaticon.com/512/2376/2376399.png" />
                  )}
                  <LevelTextNumber>Lv{Math.floor(Level)}</LevelTextNumber>
                  <LevelText>{item.lvName}</LevelText>
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
                      placeholder="인스타그램"
                      maxLength={20}
                    />
                    <InstagramImage src="https://t1.daumcdn.net/cfile/tistory/99B6AB485D09F2132A" />
                  </InstagramBox>
                </NickNameAreaBox>
                <FollowBox>
                  <PostNumberText>게시글</PostNumberText>
                  <FollowNumberText>
                    {PostNumber === undefined ? '0' : PostNumber.length}
                  </FollowNumberText>
                  <FollowText
                    onClick={() => {
                      setFollowModal(true);
                      setToggle(true);
                    }}
                  >
                    팔로워
                  </FollowText>
                  <FollowNumberText>
                    {item.follower === undefined ? '0' : item.follower.length}
                  </FollowNumberText>
                  <FollowText
                    onClick={() => {
                      setFollowModal(true);
                      setToggle(false);
                    }}
                  >
                    팔로잉
                  </FollowText>
                  <FollowNumberText>
                    {item.following === undefined ? '0' : item.following.length}
                  </FollowNumberText>
                </FollowBox>
                <IntroductionEditText
                  spellCheck="false"
                  value={introduction}
                  onChange={(e) => {
                    setIntroduction(e.target.value);
                  }}
                  maxLength={50}
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
  width: 900px;
  height: 280px;
  padding-top: 10px;
  overflow: hidden;
`;
const EditPhotoBox = styled.div`
  padding-top: 10px;
  width: 250px;
  height: 250px;
  float: left;
`;

const EditNickNameBox = styled.div`
  width: 600px;
  padding-top: 10px;
  height: 250px;
  float: left;
  text-align: left;
`;
const NameBox = styled.div`
  height: 40px;
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
  margin-top: 8px;
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
  top: 39%;
  left: 30%;
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
const LevelText = styled.div`
  font-weight: bolder;
  font-size: 1.2rem;
  color: green;
`;
const LevelTextNumber = styled.span`
  margin-left: 0.2vw;
  font-size: 1.2rem;
  font-weight: bolder;
  color: red;
`;
const NickNameAreaBox = styled.div`
  margin-top: 10px;
  height: 70px;
`;
const NickNameText = styled.span`
  font-size: 1.2rem;
  font-weight: bold;
  margin-right: 20px;
`;
const AreaText = styled.span`
  font-size: 1rem;
  font-weight: bold;
  color: black;
`;
const IntroductionText = styled.textarea`
  margin-top: 16px;
  font-size: 16px;
  border: none;
  width: 300px;
  height: 72px;
  text-align: left;
  resize: none;
  overflow: auto;
  background-color: #fffcf3;
  overflow: auto;
  :focus {
    outline: none;
  }
  ::-webkit-scrollbar {
    display: none;
  }
`;
const IntroductionEditText = styled.textarea`
  margin-top: 16px;
  font-size: 16px;
  border: none;
  width: 300px;
  height: 72px;
  text-align: left;
  resize: none;
  overflow: auto;
  background-color: #fffcf3;
  border-bottom-color: black;
  border-bottom-style: solid;
  border-bottom-width: 0.1rem;
  :focus {
    outline: none;
  }
  ::-webkit-scrollbar {
    display: none;
  }
`;

const EditButton = styled.button`
  border-radius: 2rem;
  background-color: white;
  width: 60px;
  margin-left: 20px;
  :hover {
    cursor: pointer;
    background-color: black;
    color: white;
  }
`;

const TextInput = styled.input`
  width: 160px;
  height: 26px;
  border: none;
  font-size: 1.2rem;
  font-weight: bold;
  text-align: left;
  background-color: #fffcf3;
  border-bottom-color: black;
  border-bottom-style: solid;
  border-bottom-width: 0.1rem;
  :focus {
    outline: none;
  }
`;

const Select = styled.select`
  width: 60px;
  font-size: 1rem;
  background-color: #fffcf3;
  margin-left: 10px;
  border: none;
  :focus {
    outline: none;
  }
`;
const InstagramInput = styled.input`
  width: 160px;
  height: 25px;
  border: none;
  font-size: 16px;
  color: black;
  font-weight: 700;
  text-align: left;
  background-color: #fffcf3;
  border-bottom-color: black;
  border-bottom-style: solid;
  border-bottom-width: 0.1rem;
  :focus {
    outline: none;
  }
`;
const InstagramImage = styled.img`
  width: 1.5rem;
  margin-left: 8px;
`;
const InstagramBox = styled.div`
  margin-top: 10px;
  color: black;
  font-size: 16px;
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
  margin-top: 36px; ;
`;

const FollowText = styled.span`
  font-weight: bold;
  font-size: 1.2rem;
  margin-right: 8px;
  :hover {
    cursor: pointer;
    color: gray;
  }
`;
const PostNumberText = styled.span`
  font-weight: bold;
  font-size: 1.2rem;
  margin-right: 8px;
`;
const FollowNumberText = styled.span`
  font-weight: bolder;
  font-size: 1.2rem;
  margin-right: 8px;
`;

const TextValidation = styled.span`
  color: red;
  margin-left: 1vw;
  font-size: 12px;
`;
const InputBox = styled.div``;

const HelpLvText = styled.span`
  font-size: 1.2rem;
  font-weight: bolder;
  color: red;
`;
const LevelIcon = styled.img`
  width: 2.5rem;
  height: 2.5rem;
  margin-right: 8px;
  margin-bottom: 6px;
  border-radius: 50%;
`;
