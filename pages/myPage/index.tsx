import styled from 'styled-components';
import { authService, dbService } from '@/firebase';
import { useState, useEffect } from 'react';
import {
  collection,
  query,
  onSnapshot,
  where,
  getDocs,
} from 'firebase/firestore';
import ProfileEdit from '@/components/ProfileEdit';
import MyPageCalendar from '@/components/MyPageCalendar';
import LoginState from '@/components/LoginState';

export type ProfileItem = {
  id: string;
  area?: string;
  introduction?: string;
  instagram?: string;
  displayName?: string;
  email?: string;
  photoURL?: string;
  loginState?: boolean;
  following?: string;
  follower?: string;
  uid?: string;
};
// next.js = 랜더의 주체가 node 서버에서 랜더를 하고 뿌림 마운팅 node가 마운팅 후에 핸들링 브라우저
const MyPage = () => {
  //불러오기
  //캘린더
  const [isLoadCalendar, setIsLoadCalendar] = useState<boolean>(false);

  const [profileInformation, setProfileInformation] = useState<ProfileItem[]>(
    [],
  );

  const [following, setFollowing] = useState([] as any);
  const [follower, setFollower] = useState([] as any);
  const follwoingInformation = following.join();
  const followerInformation = follower.join();

  const userUid: any = String(authService.currentUser?.uid);

  const [toggle, setToggle] = useState(false);
  const onClickToggle = () => {
    setToggle(!toggle);
  };

  //Calendar 업로드 시간 설정

  const profileOnSnapShot = () => {
    setIsLoadCalendar(true);
    const q = query(collection(dbService, 'profile'));
    onSnapshot(q, (snapshot) => {
      const newprofiles = snapshot.docs.map((doc) => {
        const newprofile = {
          id: doc.id,
          ...doc.data(),
        };
        return newprofile;
      });
      setProfileInformation(newprofiles);
    });
  };

  const followGetDoc = async () => {
    const q = query(
      collection(dbService, 'profile'),
      where('uid', '==', userUid),
    );
    const data = await getDocs(q);
    data.docs.map((doc) => {
      setFollowing((prev: any) => [...prev, doc.data().following]);
      setFollower((prev: any) => [...prev, doc.data().follower]);
    });
  };

  useEffect(() => {
    profileOnSnapShot();
    followGetDoc();
    return () => {
      profileOnSnapShot();
      followGetDoc();
    };
  }, [authService.currentUser?.uid]);

  return (
    <MyPageWrapper>
      {profileInformation && (
        <MyPageContainer>
          <MypageBox>
            {profileInformation
              .filter((item) => item.id === authService.currentUser?.uid)
              .map((item) => {
                return <ProfileEdit key={item.id} item={item} />;
              })}
            <MyPageHeader>
              <HeaderText>북마크</HeaderText>
              <ClickText>전체보기</ClickText>
            </MyPageHeader>
            <InformationBox></InformationBox>
          </MypageBox>
          <MypageBox>
            <MyPageHeader>
              <HeaderText>오운완 갤러리</HeaderText>
              <ClickText>전체보기</ClickText>
            </MyPageHeader>
            <InformationBox>오운완 갤러리</InformationBox>
            <MyPageHeader>
              <HeaderText>최근 교류</HeaderText>
              <ClickText>전체보기</ClickText>
            </MyPageHeader>
            <InformationBox>
              <ToggleButtonBox>
                {toggle ? (
                  <>
                    <ToggleButton onClick={onClickToggle}>팔로잉</ToggleButton>
                    <FollowToggleButton onClick={onClickToggle}>
                      팔로워
                    </FollowToggleButton>
                  </>
                ) : (
                  <>
                    <FollowToggleButton onClick={onClickToggle}>
                      팔로잉
                    </FollowToggleButton>
                    <ToggleButton onClick={onClickToggle}>팔로워</ToggleButton>
                  </>
                )}
              </ToggleButtonBox>
              <LoginStateBox>
                {profileInformation.map((item) => {
                  return (
                    <LoginState
                      key={item.id}
                      item={item}
                      toggle={toggle}
                      followerInformation={followerInformation}
                      follwoingInformation={follwoingInformation}
                    />
                  );
                })}
              </LoginStateBox>
            </InformationBox>
          </MypageBox>
          <MypageBox>
            <Schedule>{isLoadCalendar && <MyPageCalendar />}</Schedule>
          </MypageBox>
        </MyPageContainer>
      )}
    </MyPageWrapper>
  );
};

export default MyPage;

const MyPageWrapper = styled.div`
  display: flex;
  text-align: center;
`;
const MyPageContainer = styled.div`
  margin-left: 6vw;
  margin-top: 2vh;
`;

const MypageBox = styled.div`
  float: left;
  margin-right: 3vw;
`;
const InformationBox = styled.div`
  background-color: #e9ecef;
  width: 26vw;
  height: 42vh;
  border-radius: 16px;
  margin-bottom: 4vh;
  padding-top: 1vh;
`;

const Schedule = styled.div`
  background-color: #e9ecef;
  width: 20vw;
  height: 100vh;
  border-radius: 16px;
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
const ToggleButtonBox = styled.div`
  background-color: white;
  width: 10vw;
  margin: auto;
  height: 5vh;
  margin-bottom: 2vh;
  border-radius: 30px;
`;
const ToggleButton = styled.button`
  width: 5vw;
  height: 5vh;
  background-color: white;
  border: none;
  border-radius: 30px;
  :hover {
    cursor: pointer;
    background-color: lightgray;
  }
  :focus {
    background-color: gray;
    color: white;
  }
`;

const FollowToggleButton = styled.button`
  width: 5vw;
  height: 5vh;
  background-color: gray;
  color: white;
  border: none;
  border-radius: 30px;
  :hover {
    cursor: pointer;
    background-color: lightgray;
  }
`;
const LoginStateBox = styled.div`
  height: 30vh;
  overflow: auto;
`;
