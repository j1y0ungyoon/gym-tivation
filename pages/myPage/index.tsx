import styled from 'styled-components';
import { authService, dbService } from '@/firebase';
import { useState, useEffect } from 'react';
import { collection, query, onSnapshot } from 'firebase/firestore';
import ProfileEdit from '@/components/ProfileEdit';

export type ProfileItem = {
  id: string;
  area?: string;
  introduction?: string;
  instagram?: string;
};

const MyPage = () => {
  //불러오기
  const [profileInformation, setProfileInformation] = useState<ProfileItem[]>(
    [],
  );

  //불러오기
  useEffect(() => {
    const q = query(
      collection(dbService, 'profile'),
      //   where('id', '==', authService.currentUser?.uid),
    );
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
          <Schedule>스케줄입니다</Schedule>
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
  width: 24vw;
  height: 42vh;
  border-radius: 16px;
  margin-bottom: 4vh;
  padding-top: 1vh;
`;

const Schedule = styled.div`
  padding-top: 20px;
  background-color: #e9ecef;
  width: 25vw;
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
