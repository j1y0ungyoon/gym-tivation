import styled from 'styled-components';
import { authService, dbService } from '@/firebase';
import { useState, useEffect } from 'react';
import UploadImage from '@/components/ProfileUpLoad';
import { updateProfile } from 'firebase/auth';
import { doc, setDoc, updateDoc } from 'firebase/firestore';
import { ProfileItem } from '@/pages/myPage/[...params]';

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
  const [nickName, setNickName] = useState('');
  const [introduction, setIntroduction] = useState(item.introduction);
  const [area, setArea] = useState(item.area);
  const [instagram, setInstagram] = useState(item.instagram);

  const nickName_validation = new RegExp(
    /^(?=.*[a-z0-9가-힣])[a-z0-9가-힣]{2,8}$/,
  );

  //프로필 수정
  const onClickProfileEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (nickName_validation.test(nickName)) {
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
    } else {
      alert('닉네임은 특수문자 제외 2글자 이상 8글자 이하로 적어주세요.');
    }
  };

  //사진 주소, 닉네임 불러오기
  useEffect(() => {
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
                <LevelText>헬린이</LevelText>
                <LevelTextNumber>LV20 </LevelTextNumber>
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
                      프로필 수정
                    </EditButton>
                  )}
                </NameBox>
                <InstagramBox>
                  <a href={`https://www.instagram.com/${instagram}/`}>
                    {instagram}
                  </a>
                  <InstagramImage src="https://t1.daumcdn.net/cfile/tistory/99B6AB485D09F2132A" />
                </InstagramBox>
              </NickNameAreaBox>
              <FollowBox
                onClick={() => {
                  setFollowModal(true);
                }}
              >
                <FollowText>팔로워 </FollowText>
                <FollowNumberText>
                  {follower === undefined ? '0' : follower.length}
                </FollowNumberText>
                <FollowText>팔로잉</FollowText>
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
                  <LevelText>헬린이</LevelText>
                  <LevelTextNumber>LV20 </LevelTextNumber>
                </LevelBox>
              </EditPhotoBox>
              <EditNickNameBox>
                <NickNameAreaBox>
                  <NameBox>
                    <TextInput
                      spellCheck="false"
                      value={nickName}
                      onChange={(e) => {
                        setNickName(e.target.value);
                      }}
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
                    <EditButton type="submit">완료하기</EditButton>
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
                  <FollowText>팔로워 </FollowText>
                  <FollowNumberText>{following.length}</FollowNumberText>
                  <FollowText>팔로잉</FollowText>
                  <FollowNumberText> {follower.length}</FollowNumberText>
                </FollowBox>
                <IntroductionText
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
  width: 25vw;
  height: 50vh;
  float: left;
  text-align: left;
`;
const NameBox = styled.div`
  height: 67%;
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
  margin-top: 2vh;
`;
const LevelText = styled.span`
  font-weight: bold;
  font-size: 0.9rem;
  color: black;
`;
const LevelTextNumber = styled.span`
  margin-left: 0.2vw;
  font-size: 1.2rem;
  font-weight: bolder;
  color: green;
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
  margin-top: 4vh;
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

const EditButton = styled.button`
  background-color: #eeeeee;
  border-radius: 2rem;
  border: none;
  width: 6vw;
  height: 4.5vh;
  margin-left: 1vw;
  :hover {
    cursor: pointer;
    background-color: gray;
    color: white;
  }
`;

const TextInput = styled.input`
  width: 8vw;
  border: none;
  font-size: 1.2rem;
  font-weight: bold;
  text-align: left;
  :focus {
    outline: none;
  }
`;

const Select = styled.select`
  width: 4vw;
  font-size: 1rem;
  margin-right: 2vw;
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
  }
`;

const FollowText = styled.span`
  font-weight: bold;
  font-size: 1.2rem;
`;
const FollowNumberText = styled.span`
  font-weight: bolder;
  font-size: 1.2rem;
  margin-right: 1vw;
`;
