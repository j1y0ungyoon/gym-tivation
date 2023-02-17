import styled from 'styled-components';
import { authService, dbService } from '@/firebase';
import { useState, useEffect } from 'react';
import UploadImage from '@/components/ProfileUpLoad';
import { updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { ProfileItem } from '@/pages/myPage';

type ProfileEditProps = {
  item: ProfileItem;
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

const ProfileEdit = ({ item }: ProfileEditProps) => {
  const [isProfileEdit, setIsProfileEdit] = useState(false);
  //닉네임, 사진 불러오기
  const [photoURL, setPhotoURL] = useState(DEFAULT_PHOTO_URL);

  //프로필 변경
  const [nickName, setNickName] = useState('');
  const [introduction, setIntroduction] = useState(item.introduction);
  const [area, setArea] = useState(item.area);
  const [instagram, setInstagram] = useState(item.instagram);

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
        await setDoc(doc(dbService, 'profile', user.uid), {
          introduction: introduction,
          area: area,
          instagram: instagram,
        });
      }
      alert('변경완료');
    } catch (error: any) {
      alert(error.message);
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

  console.log('로그인', authService.currentUser);
  return (
    <>
      {!isProfileEdit ? (
        <>
          <MyPageHeader>
            <HeaderText>프로필</HeaderText>
            <ClickText
              onClick={() => {
                setIsProfileEdit(true);
              }}
            >
              수정하기
            </ClickText>
          </MyPageHeader>
          <InformationBox>
            <EditPhotoBox>
              <ProfilePhoto>
                {authService.currentUser?.photoURL === null ? (
                  <Photo src="https://blog.kakaocdn.net/dn/c3vWTf/btqUuNfnDsf/VQMbJlQW4ywjeI8cUE91OK/img.jpg" />
                ) : (
                  <Photo src={photoURL} />
                )}
              </ProfilePhoto>
            </EditPhotoBox>
            <EditNickNameBox>
              <NickNameAreaBox>
                <NickNameText>{nickName}</NickNameText>
                <AreaText>{area}</AreaText>
              </NickNameAreaBox>
              <p>1일째 운동중</p>
              <InstagramImage src="https://t1.daumcdn.net/cfile/tistory/99B6AB485D09F2132A" />
              <InstagramBox>
                <a href={`https://www.instagram.com/${instagram}/`}>
                  {instagram}
                </a>
              </InstagramBox>
            </EditNickNameBox>
            <IntroductionText
              readOnly
              value={item.introduction}
              placeholder="자기소개를 적어주세요."
            />
          </InformationBox>
        </>
      ) : (
        <>
          <form onSubmit={onClickProfileEdit}>
            <MyPageHeader>
              <HeaderText>프로필</HeaderText>
              <ClickText type="submit">완료하기</ClickText>
            </MyPageHeader>
            <InformationBox>
              <EditPhotoBox>
                <ProfilePhoto>
                  <UploadImage imageURL={photoURL} setImageURL={setPhotoURL} />
                </ProfilePhoto>
              </EditPhotoBox>
              <EditNickNameBox>
                <TextInput
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
                <p>1일째 운동중</p>
                <InstagramImage src="https://t1.daumcdn.net/cfile/tistory/99B6AB485D09F2132A" />
                <InstagramBox>
                  <InstagramInput
                    value={instagram}
                    onChange={(e) => {
                      setInstagram(e.target.value);
                    }}
                    placeholder="아이디"
                    maxLength={20}
                  />
                </InstagramBox>
              </EditNickNameBox>
              <IntroductionText
                value={introduction}
                onChange={(e) => {
                  setIntroduction(e.target.value);
                }}
                maxLength={104}
                placeholder="자기소개를 입력해주세요."
              />
            </InformationBox>
          </form>
        </>
      )}
    </>
  );
};

export default ProfileEdit;

const InformationBox = styled.div`
  background-color: #e9ecef;
  width: 26vw;
  height: 42vh;
  border-radius: 16px;
  margin-bottom: 4vh;
  padding-top: 1vh;
`;

const ProfilePhoto = styled.div`
  width: 150px;
  height: 150px;
  margin-bottom: 2vh;
  margin: auto;
  border-radius: 70%;
  overflow: hidden;
`;
const Photo = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;
const NickNameAreaBox = styled.div`
  margin-top: 3vh;
`;
const NickNameText = styled.span`
  font-size: 18px;
  font-weight: bold;
  margin-right: 1vw;
`;
const AreaText = styled.span`
  font-size: 16px;
`;
const IntroductionText = styled.textarea`
  margin: 1vw;
  font-size: 16px;
  width: 22vw;
  float: left;
  height: 14vh;
  border-radius: 16px;
  background-color: white;
  text-align: left;
  padding: 1vw;
  border: none;
  resize: none;
  overflow: hidden;
  :focus {
    outline: none;
  }
`;
const MyPageHeader = styled.div`
  display: flex;
  margin-bottom: 2vh;
  color: #495057;
`;
const HeaderText = styled.span`
  margin-right: auto;
  font-size: 20px;
  :hover {
    cursor: pointer;
    color: black;
  }
`;
const ClickText = styled.button`
  background-color: white;
  border: none;
  font-size: 16px;
  :hover {
    cursor: pointer;
    color: black;
  }
`;

const TextInput = styled.input`
  width: 8vw;
  margin-top: 3vh;
  border: none;
  background-color: #e9ecef;
  font-size: 18px;
  font-weight: bold;
  text-align: center;
  :focus {
    outline: none;
  }
`;
const EditPhotoBox = styled.div`
  padding-left: 2vw;
  width: 20vh;
  float: left;
`;

const EditNickNameBox = styled.div`
  padding-right: 1vw;
  width: 29vh;
  float: right;
`;

const Select = styled.select`
  width: 4vw;
  font-size: 16px;
  background-color: #e9ecef;
  border: none;
  border-radius: 30px;
  :focus {
    outline: none;
  }
`;
const InstagramInput = styled.input`
  width: 9vw;
  height: 2vh;
  border: none;
  background-color: #e9ecef;
  font-size: 15px;
  color: black;
  font-weight: 700;
  text-align: center;
  :focus {
    outline: none;
  }
`;
const InstagramImage = styled.img`
  width: 30px;
`;
const InstagramBox = styled.div`
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
