import styled from 'styled-components';
import { authService, dbService } from '@/firebase';
import { useState, useEffect } from 'react';
import { collection, query, onSnapshot } from 'firebase/firestore';
import ProfileEdit from '@/components/ProfileEdit';
import MyPageCalendar from '@/components/MyPageCalendar';

export type ProfileItem = {
  id: string;
  area?: string;
  introduction?: string;
  instagram?: string;
};
// next.js = 랜더의 주체가 node 서버에서 랜더를 하고 뿌림 마운팅 node가 마운팅 후에 핸들링 브라우저
//
const MyPage = () => {
  //불러오기
  const [isLoadCalendar, setIsLoadCalendar] = useState<boolean>(false);
  const [profileInformation, setProfileInformation] = useState<ProfileItem[]>(
    [],
  );
  //Calendar 업로드 시간 설정
  setTimeout(() => setIsLoadCalendar(true), 800);
  useEffect(() => {
    const q = query(
      collection(dbService, 'profile'),
      //   where('id', '==', authService.currentUser?.uid),
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newprofiles = snapshot.docs.map((doc) => {
        const newprofile = {
          id: doc.id,
          ...doc.data(),
        };
        return newprofile;
      });
      setProfileInformation(newprofiles);
    });
    return () => {
      unsubscribe();
    };
  }, []);
  console.log(profileInformation.length);
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
          <InformationBox> 북마크 </InformationBox>
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
          <InformationBox> 최근 교류</InformationBox>
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
