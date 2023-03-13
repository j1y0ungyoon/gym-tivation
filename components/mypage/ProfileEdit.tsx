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
} from 'firebase/firestore';
// import { ProfileItem } from '@/pages/myPage/[...params]';
import { GLOBAL_MODAL_TYPES } from '@/recoil/modalState';
import { AiFillCheckCircle } from 'react-icons/ai';
import DmButton from '../DmButton';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import FollowButton from '../FollowButton';
import useModal from '@/hooks/useModal';

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
  { area: '대구', name: '대구' },
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
  const { showModal } = useModal();
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
      /^(?=.*[A-Za-z0-9가-힣])[A-Za-z0-9가-힣]{2,8}$/,
    );
    const nickNameCurrent = e.target.value;
    setNickName(nickNameCurrent);
    if (nickName_validation.test(nickNameCurrent)) {
      setNickNameMessage('');
      setIsValidNickName(true);
    } else {
      setNickNameMessage(
        '특수문자 제외 2글자 이상 8글자 이하로 공백 없이 입력해주세요.',
      );
      setIsValidNickName(false);
    }
  }, []);

  const nickNameIcon =
    isValidNickName && !nickNameCheck ? (
      <AiFillCheckCircle color="#0094FF" style={{ marginLeft: '6px' }} />
    ) : (
      <AiFillCheckCircle color="red" style={{ marginLeft: '6px' }} />
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
      <span>게시판 및 오운완 갤러리에 사진을 올릴시에</span>
      <div>레벨이 오르고, 일정 레벨 달성시에</div>
      <span>타이틀을 획득할 수 있습니다</span>
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
                <ProfilePhotoBox>
                  {item.photoURL === null ? (
                    <Photo src="https://blog.kakaocdn.net/dn/c3vWTf/btqUuNfnDsf/VQMbJlQW4ywjeI8cUE91OK/img.jpg" />
                  ) : (
                    <Photo src={item.photoURL} />
                  )}
                </ProfilePhotoBox>
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
                            <span>축하드립니다!</span>
                            <div>짐티베이션 최고 레벨을 달성하셨습니다!</div>
                            <span>앞으로도 꾸준한 활동을 해주세요!</span>
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
                  <NickNameText>{item.displayName}</NickNameText>
                  <InstagramText
                    href={`https://www.instagram.com/${instagram}/`}
                    target="_blank"
                  >
                    <InstagramImage src="/assets/icons/myPage/Ins.svg" />
                  </InstagramText>
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
                    authService.currentUser === null
                      ? showModal({
                          modalType: GLOBAL_MODAL_TYPES.AlertModal,
                          modalProps: {
                            contentText: '로그인 후 이용해주세요!',
                          },
                        })
                      : setFollowModal(true);
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
                    authService.currentUser === null
                      ? showModal({
                          modalType: GLOBAL_MODAL_TYPES.AlertModal,
                          modalProps: {
                            contentText: '로그인 후 이용해주세요!',
                          },
                        })
                      : setFollowModal(true);
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
                              <span>축하드립니다!</span>
                              <div>짐티베이션 최고 레벨을 달성하셨습니다!</div>
                              <span>앞으로도 꾸준한 활동을 해주세요!</span>
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
                    <NickNameImage src="/assets/icons/myPage/profile_icon.svg" />
                    <TextInput
                      spellCheck="false"
                      value={nickName}
                      onChange={onChangeName}
                      placeholder="닉네임"
                      maxLength={8}
                    />

                    <EditCancelButton
                      onClick={() => {
                        setIsProfileEdit(false);
                        setNickName(item.displayName);
                        setInstagram(item.instagram);
                        setIntroduction(item.introduction);
                        setPhotoURL(item.photoURL);
                      }}
                    >
                      취소
                    </EditCancelButton>
                    <EditButton
                      type="submit"
                      disabled={isValidNickName === nickNameCheck}
                    >
                      저장하기
                    </EditButton>
                  </NameBox>
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
                  <EditInstagramBox>
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
                  </EditInstagramBox>
                </NickNameAreaBox>
                <FollowBox>
                  <EditInstaImage src="/assets/icons/myPage/Ins.svg" />
                  <Span>https://www.instagram.com/</Span>
                  <InstagramInput
                    spellCheck="false"
                    value={instagram}
                    onChange={(e) => {
                      setInstagram(e.target.value);
                    }}
                    placeholder=""
                    maxLength={20}
                  ></InstagramInput>
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
  width: 1000px;
  height: 280px;
  padding-top: 0.5vh;
  /* overflow: hidden; */
  z-index: 20000;
`;
const EditPhotoBox = styled.div`
  padding-top: 24px;
  margin-left: 20px;
  width: 200px;
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
  display: flex;
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
  width: 124px;
  height: 124px;
  margin: auto;
  overflow: hidden;
  padding-left: 3px;
`;
const ProfilePhotoBox = styled.div`
  width: 120px;
  height: 120px;
  overflow: hidden;
  border-radius: 70%;
  border-style: solid;
  border-width: 1px;
  box-shadow: -2px 2px 0px 0px #000000;
`;
const Photo = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;
const LevelBox = styled.div`
  margin-right: 12px;
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
  z-index: 20000;
  width: 340px;
  height: 260px;
  margin-top: 130px;
  margin-left: 90px;
  position: absolute;
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
  margin: auto;
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
  margin-top: 2px;
  margin-left: 4px;
  margin-right: 16px;
`;
const AreaText = styled.span`
  font-size: 1rem;
  font-weight: bold;
`;
const IntroductionText = styled.textarea`
  margin-top: 18px;
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
  margin-top: 8px;
  padding: 8px;
  font-size: 16px;
  font-weight: 400;
  border-width: 2px;
  width: 460px;
  height: 64px;
  border-radius: 10px;
  text-align: left;
  resize: none;
  overflow: auto;
  box-shadow: -2px 2px 0px 0px #000000;
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
  background-color: 
#FF4800;
  color: white;
  :hover {
    cursor: pointer;
    background-color: black;
    color: white;
  }
  box-shadow: -2px 2px 0px 0px #000000;
`;
const EditCancelButton = styled.button`
  margin-left: 20px;
  height: 40px;
  border-radius: 40px;
  border: 1px solid black;
  font-size: 16px;
  background-color: white;
  width: 80px;
  color: black;
  :hover {
    cursor: pointer;
    background-color: black;
    color: white;
  }
  box-shadow: -2px 2px 0px 0px #000000;
`;
const TextInput = styled.input`
  width: 170px;
  height: 26px;
  padding: 18px;
  font-size: 16px;
  font-weight: 400;
  text-align: left;
  border-radius: 30px;
  box-shadow: -2px 2px 0px 0px #000000;
  :focus {
    outline: none;
  }
`;

const Select = styled.select`
  width: 70px;
  padding: 6px;
  font-size: 16px;
  font-weight: 400;
  text-align: left;
  margin-left: 2px;
  box-shadow: -2px 2px 0px 0px #000000;
  border-radius: 30px;
  border-color: black;
  :focus {
    outline: none;
  }
`;
const InstagramInput = styled.input`
  width: 420px;
  height: 26px;
  padding: 18px;
  padding-left: 223px;
  border-radius: 30px;
  margin-bottom: 4px;
  font-size: 16px;
  font-weight: 400;
  color: black;
  text-align: left;
  margin-top: 20px;
  border-bottom-color: black;
  border-bottom-style: solid;
  border-bottom-width: 0.1rem;
  box-shadow: -2px 2px 0px 0px #000000;
  :focus {
    outline: none;
  }
`;
const InstagramText = styled.a``;
const InstagramImage = styled.img`
  width: 40px;
  height: 40px;
`;
const InstagramBox = styled.div`
  margin-top: 12px;
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
const EditInstagramBox = styled.div`
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
  position: relative;
  margin-top: 20px;
  width: 700px;
`;
const Span = styled.span`
  position: absolute;
  margin-top: 29px;
  margin-left: 20px;
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
const InputBox = styled.div`
  display: flex;
  margin-top: 4px;
  margin-bottom: 12px;
  height: 8px;
`;

const HelpLvText = styled.span`
  font-size: 1.2rem;
  font-weight: bolder;
  color: red;
`;
const LevelIcon = styled.img`
  width: 30px;
  height: 30px;
  margin-right: 4px;
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
  margin-right: 8px;
`;
const EditInstaImage = styled.img`
  width: 30px;
  height: 30px;
  margin-right: 8px;
  margin-bottom: 6px;
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
const NickNameImage = styled.img`
  width: 30px;
  height: 30px;
  margin-right: 8px;
  margin-top: 10px;
`;
