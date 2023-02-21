import styled from 'styled-components';
import { authService, dbService } from '@/firebase';
import { useState, useEffect } from 'react';
import { collection, query, onSnapshot, where } from 'firebase/firestore';
import ProfileEdit from '@/components/ProfileEdit';
import MyPageCalendar from '@/components/MyPageCalendar';
import LoginState from '@/components/LoginState';
import Test from '@/components/Test';
import { getDocs } from 'firebase/firestore';

export type ProfileItem = {
  id: string;
  area?: string;
  introduction?: string;
  instagram?: string;
  displayName?: string;
  email?: string;
  photoURL?: string;
  loginState?: boolean;
  follow?: string;
  uid?: string;
};
// next.js = 랜더의 주체가 node 서버에서 랜더를 하고 뿌림 마운팅 node가 마운팅 후에 핸들링 브라우저
const MyPage = () => {
  //불러오기
  //캘린더
  const [isLoadCalendar, setIsLoadCalendar] = useState<boolean>(false);
  //로그인 상태
  const [isLoginState, setIsLoginState] = useState<boolean>(false);
  const [profileInformation, setProfileInformation] = useState<ProfileItem[]>(
    [],
  );
  const [toggle, setToggle] = useState(false);
  //Calendar 업로드 시간 설정
  setTimeout(() => setIsLoadCalendar(true), 800);
  setTimeout(() => setIsLoginState(true), 800);

  const myPageonSnapShot = () => {
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

  useEffect(() => {
    myPageonSnapShot;

    return () => {
      myPageonSnapShot();
    };
  }, []);

  return (
    <MyPageWrapper>
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
          <InformationBox>
            {profileInformation
              .filter((item) => item.id !== authService.currentUser?.uid)
              .map((item) => {
                return <Test key={item.id} item={item} />;
              })}
          </InformationBox>
        </MypageBox>
        <MypageBox>
          <MyPageHeader>
            <HeaderText>오운완 갤러리</HeaderText>
            <ClickText>전체보기</ClickText>
          </MyPageHeader>
          <InformationBox> 오원완 갤러리</InformationBox>
          <MyPageHeader>
            <HeaderText>최근 교류</HeaderText>
            <ClickText>전체보기</ClickText>
          </MyPageHeader>
          <InformationBox>
            <ToggleButtonBox>
              <ToggleButton onClick={() => setToggle(false)}>
                팔로잉
              </ToggleButton>
              <ToggleButton onClick={() => setToggle(true)}>
                팔로워
              </ToggleButton>
            </ToggleButtonBox>
            {profileInformation
              .filter((item) => item.id !== authService.currentUser?.uid)
              .map((item) => {
                return (
                  isLoginState && (
                    <LoginState key={item.id} item={item} toggle={toggle} />
                  )
                );
              })}
          </InformationBox>
        </MypageBox>
        <MypageBox>
          <Schedule>
            {isLoadCalendar && (
              <MyPageCalendar setIsLoadCalendar={setIsLoadCalendar} />
            )}
          </Schedule>
        </MypageBox>
      </MyPageContainer>
    </MyPageWrapper>
  );
};

export default MyPage;

const MyPageWrapper = styled.div`
  display: flex;
  text-align: center;
`;
const MyPageContainer = styled.div`
  margin-left: 14vw;
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
  width: 22vw;
  height: 101vh;
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
    background-color: gray;
    color: white;
  }
`;
