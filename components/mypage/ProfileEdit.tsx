import styled from 'styled-components';
import { authService, dbService } from '@/firebase';
import { useState, useEffect, useCallback, useId } from 'react';
import UploadImage from '@/components/mypage/ProfileUpLoad';
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
// import { ProfileItem } from '@/pages/myPage/[...params]';
import { AiFillCheckCircle } from 'react-icons/ai';
import DmButton from '../DmButton';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import FollowButton from '../FollowButton';

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
  const [photoURL, setPhotoURL] = useState(item.photoURL);

  //프로필 변경
  const [nickName, setNickName] = useState(item.displayName);
  const [introduction, setIntroduction] = useState(item.introduction);
  const [area, setArea] = useState(item.area);
  const [instagram, setInstagram] = useState(item.instagram);
  const [nickNameMessage, setNickNameMessage] = useState<string>('');
  const [isValidNickName, setIsValidNickName] = useState(true);

  const user = String(authService.currentUser?.uid);
  const queryClient = useQueryClient();
  //닉네임 중복 검사
  const EmailNickNameGetDoc = async () => {
    const q = query(collection(dbService, 'profile'), where('uid', '!=', user));
    const data = await getDocs(q);
    return data.docs.map((doc) => doc.data().displayName);
  };

  const { isLoading: nickNameLoading, data: nickNameGetCheck } = useQuery(
    'nickNameGetCheck',
    EmailNickNameGetDoc,
    {
      onSuccess: () => {},
      onError: (error) => {
        console.log('error : ', error);
      },
    },
  );
  const nickNameCheck = nickNameGetCheck?.includes(nickName);
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
      <AiFillCheckCircle color="#0094FF" />
    ) : (
      <AiFillCheckCircle color="red" />
    );
  const [message, setMessage] = useState('');
  //Level 메시지
  const Level = Number(item.lv);
  const helpLevel = () => {
    if (Level < 30) {
      setMessage(`까지 LV${30 - Level} 남았습니다. `);
    } else if (29 < Level && Level < 60) {
      setMessage(`까지 LV${60 - Level} 남았습니다.`);
    } else if (59 < Level && Level < 90) {
      setMessage(`까지 LV${90 - Level} 남았습니다.`);
    }
  };
  const helpLevelText = (
    <LevelHelpText>
      게시판 및 오운완 갤러리에 사진을 올릴시에 &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;
      &nbsp;레벨이 오르고, 일정 레벨 달성시에 &nbsp; &nbsp; &nbsp;&nbsp; &nbsp;
      타이틀을 획득할 수 있습니다
    </LevelHelpText>
  );
  // 프로필 수정
  const ProfileEdit = async (e: React.FormEvent<HTMLFormElement>) => {
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

  const { mutate: onProfileEdit } = useMutation(['profileEdit'], ProfileEdit, {
    onSuccess: async () => {
      await queryClient.invalidateQueries('profile');
    },
    onError: (error) => {
      console.log('error : ', error);
    },
  });

  //게시판 + 갤러리
  const getBoardNumber = async () => {
    const q = query(
      collection(dbService, 'posts'),
      where('userId', '==', paramsId),
    );
    const data = await getDocs(q);

    return data.docs.map((doc) => doc.data().title);
  };

  const { isLoading: BoardNumberLoading, data: BoardNumber } = useQuery(
    'BoardNumber',
    getBoardNumber,
    {
      onSuccess: () => {},
      onError: (error) => {
        console.log('error : ', error);
      },
    },
  );

  const getGalleryNumber = async () => {
    const q = query(
      collection(dbService, 'gallery'),
      where('userId', '==', paramsId),
    );
    const data = await getDocs(q);
    return data.docs.map((doc) => doc.data().title);
  };
  const { isLoading: galleryNumberLoading, data: galleryNumber } = useQuery(
    'galleryNumber',
    getGalleryNumber,
    {
      onSuccess: () => {},
      onError: (error) => {
        console.log('error : ', error);
      },
    },
  );
  //사진 주소, 닉네임 불러오기
  useEffect(() => {
    helpLevel();
  }, [item.lv]);

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
                {item.lvName === 'Yellow' && (
                  <LevelIcon src="/assets/icons/myPage/Yellow.svg" />
                )}
                {item.lvName === 'green' && (
                  <LevelIcon src="/assets/icons/myPage/Green.svg" />
                )}
                {item.lvName === 'blue' && (
                  <LevelIcon src="/assets/icons/myPage/Blue.svg" />
                )}
                {item.lvName === 'red' && (
                  <LevelIcon src="/assets/icons/myPage/Red.svg" />
                )}
                <LevelTextNumber>LV{Math.floor(Level)}</LevelTextNumber>
                <LevelHelpBox className="levelHelpBox">
                  <LevelHelpTextBox>
                    <IconBox>
                      {item.lvName === 'Yellow' && (
                        <>
                          <LevelIcons src="/assets/icons/myPage/Yellow.svg" />
                          <LevelText>
                            현재 나의 레벨은
                            <span style={{ color: 'yellow' }}> Yellow </span>
                            입니다!
                          </LevelText>
                          {helpLevelText}
                          <LevelMessage>
                            <span style={{ color: '#219C04' }}>Green</span>
                            {message}
                          </LevelMessage>
                        </>
                      )}
                      {item.lvName === 'green' && (
                        <>
                          <LevelIcons src="/assets/icons/myPage/Green.svg" />
                          <LevelText>
                            현재 나의 레벨은
                            <span style={{ color: 'green' }}> Green </span>
                            입니다!
                          </LevelText>
                          {helpLevelText}
                          <LevelMessage>
                            <span style={{ color: '#0400DB' }}>Blue</span>
                            {message}
                          </LevelMessage>
                        </>
                      )}
                      {item.lvName === 'blue' && (
                        <>
                          <LevelIcons src="/assets/icons/myPage/Blue.svg" />
                          <LevelText>
                            현재 나의 레벨은
                            <span style={{ color: 'blue' }}> Blue </span>
                            입니다!
                          </LevelText>
                          {helpLevelText}
                          <LevelMessage>
                            <span style={{ color: '#CB0000' }}>Red</span>
                            {message}
                          </LevelMessage>
                        </>
                      )}
                      {item.lvName === 'red' && (
                        <>
                          <LevelIcons src="/assets/icons/myPage/Red.svg" />
                          <LevelText>
                            현재 나의 레벨은
                            <span style={{ color: 'red' }}> Red </span>
                            입니다!
                          </LevelText>
                          <LevelHelpText>
                            축하드립니다! 짐티베이션 최고 레벨을 달성하셨습니다!
                            앞으로도 꾸준한 활동을 해주세요!
                          </LevelHelpText>
                        </>
                      )}
                    </IconBox>
                  </LevelHelpTextBox>
                </LevelHelpBox>
              </LevelBox>
            </EditPhotoBox>
            <EditNickNameBox>
              <NickNameAreaBox>
                <NameBox>
                  {instagram === '' ? null : (
                    <InstagramText
                      href={`https://www.instagram.com/${instagram}/`}
                      target="_blank"
                    >
                      {item.instagram}
                    </InstagramText>
                  )}

                  <InstagramImage src="/assets/icons/myPage/Ins.svg" />

                  {authService.currentUser?.uid === paramsId ? (
                    <EditButton
                      onClick={() => {
                        setIsProfileEdit(true);
                      }}
                    >
                      프로필 수정
                    </EditButton>
                  ) : (
                    <>
                      <FollowButton item={item} Id={paramsId} />
                      <DmButton id={paramsId} />
                    </>
                  )}
                </NameBox>
                <InstagramBox>
                  <NickNameText>{item.displayName}</NickNameText>
                  <AreaImage src="/assets/icons/myPage/Area.svg" />
                  <AreaText>{item.area}</AreaText>
                </InstagramBox>
              </NickNameAreaBox>
              <FollowBox>
                <PostNumberText>게시글</PostNumberText>
                <FollowNumberText>
                  {galleryNumber && BoardNumber
                    ? galleryNumber?.length + BoardNumber?.length
                    : 0}
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
          <form onSubmit={onProfileEdit}>
            <InformationBox>
              <EditPhotoBox>
                <ProfilePhoto>
                  {photoURL && (
                    <UploadImage
                      imageURL={photoURL}
                      setImageURL={setPhotoURL}
                    />
                  )}
                </ProfilePhoto>
                <LevelBox>
                  {item.lvName === 'Yellow' && (
                    <LevelIcon src="/assets/icons/myPage/Yellow.svg" />
                  )}
                  {item.lvName === 'green' && (
                    <LevelIcon src="/assets/icons/myPage/Green.svg" />
                  )}
                  {item.lvName === 'blue' && (
                    <LevelIcon src="/assets/icons/myPage/Blue.svg" />
                  )}
                  {item.lvName === 'red' && (
                    <LevelIcon src="/assets/icons/myPage/Red.svg" />
                  )}
                  <LevelTextNumber>LV{Math.floor(Level)}</LevelTextNumber>
                  <LevelHelpBox className="levelHelpBox">
                    <LevelHelpTextBox>
                      <IconBox>
                        {item.lvName === 'Yellow' && (
                          <>
                            <LevelIcons src="/assets/icons/myPage/Yellow.svg" />
                            <LevelText>
                              현재 나의 레벨은
                              <span style={{ color: 'yellow' }}> Yellow </span>
                              입니다!
                            </LevelText>
                            {helpLevelText}
                            <LevelMessage>
                              <span style={{ color: '#219C04' }}>Green</span>
                              {message}
                            </LevelMessage>
                          </>
                        )}
                        {item.lvName === 'green' && (
                          <>
                            <LevelIcons src="/assets/icons/myPage/Green.svg" />
                            <LevelText>
                              현재 나의 레벨은
                              <span style={{ color: 'green' }}> Green </span>
                              입니다!
                            </LevelText>
                            {helpLevelText}
                            <LevelMessage>
                              <span style={{ color: '#0400DB' }}>Blue</span>
                              {message}
                            </LevelMessage>
                          </>
                        )}
                        {item.lvName === 'blue' && (
                          <>
                            <LevelIcons src="/assets/icons/myPage/Blue.svg" />
                            <LevelText>
                              현재 나의 레벨은
                              <span style={{ color: 'blue' }}> Blue </span>
                              입니다!
                            </LevelText>
                            {helpLevelText}
                            <LevelMessage>
                              <span style={{ color: '#CB0000' }}>Red</span>
                              {message}
                            </LevelMessage>
                          </>
                        )}
                        {item.lvName === 'red' && (
                          <>
                            <LevelIcons src="/assets/icons/myPage/Red.svg" />
                            <LevelText>
                              현재 나의 레벨은
                              <span style={{ color: 'red' }}> Red </span>
                              입니다!
                            </LevelText>
                            <LevelHelpText>
                              축하드립니다! 짐티베이션 최고 레벨을
                              달성하셨습니다!! 앞으로도 꾸준한 활동을 해주세요
                            </LevelHelpText>
                          </>
                        )}
                      </IconBox>
                    </LevelHelpTextBox>
                  </LevelHelpBox>
                </LevelBox>
              </EditPhotoBox>
              <EditNickNameBox>
                <NickNameAreaBox>
                  <NameBox>
                    <InstagramInput
                      spellCheck="false"
                      value={instagram}
                      onChange={(e) => {
                        setInstagram(e.target.value);
                      }}
                      placeholder="instagram"
                      maxLength={20}
                    />
                    <InstagramImage src="/assets/icons/myPage/Ins.svg" />
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
                  </NameBox>
                  <InstagramBox>
                    <TextInput
                      spellCheck="false"
                      value={nickName}
                      onChange={onChangeName}
                      placeholder="닉네임"
                      maxLength={8}
                    />
                    <AreaImage src="/assets/icons/myPage/Area.svg" />
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
                  </InstagramBox>
                </NickNameAreaBox>
                <FollowBox>
                  <PostNumberText>게시글</PostNumberText>
                  <FollowNumberText>
                    {galleryNumber && BoardNumber
                      ? galleryNumber?.length + BoardNumber?.length
                      : 0}
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
  padding-top: 0.5vh;
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
  font-size: 24px;
  font-weight: 600;

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
  margin-top: 14px;
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
  width: 340px;
  height: 260px;
  margin-top: 130px;
  margin-left: 120px;
  position: fixed;
  border-radius: 15px;
  background-color: white;
  transform: translate(-50%, -50%) !important;
  padding: 0.9rem;
  border-style: solid;
  border-width: 1px;
  border-color: black;
  box-shadow: -2px 2px 0px #000000;
  overflow: auto;
  ::-webkit-scrollbar {
    display: none;
  }
`;
const LevelMessage = styled.div`
  margin-top: 8px;
  font-size: 18px;
  font-weight: bolder;
`;
const LevelHelpTextBox = styled.div`
  text-align: center;
`;
const LevelHelpText = styled.span`
  font-size: 0.9rem;
`;
const LevelTextNumber = styled.span`
  margin-left: 0.2vw;
  font-size: 20px;
  font-weight: bolder;
`;
const NickNameAreaBox = styled.div`
  margin-top: 10px;
  height: 70px;
`;
const NickNameText = styled.span`
  font-size: 18px;
  font-weight: 600;
`;
const AreaText = styled.span`
  font-size: 1rem;
  font-weight: bold;
`;
const IntroductionText = styled.textarea`
  margin-top: 20px;
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
  margin-top: 20px;
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
  margin-left: 20px;
  ${({ theme }) => theme.btn.btn50}
  :hover {
    cursor: pointer;
  }
`;

const TextInput = styled.input`
  width: 160px;
  height: 26px;
  border: none;
  font-size: 18px;
  font-weight: 600;
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
  margin-left: 2px;
  border: none;
  :focus {
    outline: none;
  }
`;
const InstagramInput = styled.input`
  width: 160px;
  height: 33px;
  border: none;
  font-size: 24px;
  color: black;
  font-weight: 600;
  text-align: left;
  background-color: #fffcf3;
  border-bottom-color: black;
  border-bottom-style: solid;
  border-bottom-width: 0.1rem;
  :focus {
    outline: none;
  }
`;
const InstagramText = styled.a`
  margin-right: 20px;
`;
const InstagramImage = styled.img`
  width: 30px;
  height: 30px;
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
  font-size: 18px;
  margin-right: 12px;
  :hover {
    cursor: pointer;
    color: gray;
  }
`;
const PostNumberText = styled.span`
  font-size: 18px;
  margin-right: 12px;
`;
const FollowNumberText = styled.span`
  font-weight: bold;
  font-size: 18px;
  margin-right: 12px;
`;

const TextValidation = styled.span`
  color: red;
  margin-left: 8px;
  font-size: 12px;
`;
const InputBox = styled.div``;

const HelpLvText = styled.span`
  font-size: 1.2rem;
  font-weight: bolder;
  color: red;
`;
const LevelIcon = styled.img`
  width: 30px;
  height: 30px;
  margin-right: 8px;
  margin-bottom: 6px;
  border-radius: 50%;
`;
const LevelIcons = styled.img`
  padding-top: 8px;
  width: 60px;
  height: 60px;
  margin-bottom: 16px;
`;

const AreaImage = styled.img`
  width: 30px;
  height: 30px;
  margin-left: 20px;
`;
const IconBox = styled.div`
  text-align: center;
  margin-bottom: 8px;
`;
const LevelText = styled.div`
  font-weight: bolder;
  font-size: 20px;
  margin-bottom: 8px;
`;
