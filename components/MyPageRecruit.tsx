import { dbService } from '@/firebase';
import { collection, orderBy, getDocs, query, where } from 'firebase/firestore';

import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

type Board = {
  id: string;
  title: string;
  userId: string;
  nickName: string;
  userPhoto: string;
  participation: any;
  selectedDays: string;
  startTime: string;
  endTime: string;
  comment: number;
};

const MyPageRecruit = ({ paramsId }: { paramsId: string }) => {
  const [getRecruit, setGetRecruit] = useState<Board[]>([]);
  const router = useRouter();
  const goToRecruitDetailPost = (id: any) => {
    router.push({
      pathname: `/recruitDetail/${id}`,
      query: {
        id,
      },
    });
  };

  //테스트
  const getRecruitments = async () => {
    const q = query(
      collection(dbService, 'recruitments'),
      orderBy('createdAt', 'desc'),
    );
    const data = await getDocs(q);
    const getBoardData = data.docs.map((doc: any) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setGetRecruit(getBoardData);
  };

  useEffect(() => {
    getRecruitments();
    return () => {
      getRecruitments();
    };
  }, [paramsId]);

  return (
    <MyPageBoardWrapper>
      {getRecruit
        .filter(
          (item) =>
            item.participation
              .map((items: any) => {
                return items.userId;
              })
              .includes(paramsId) || item.userId === paramsId,
        )
        .map((item) => {
          return (
            <MyPageBoardContainer
              onClick={() => {
                goToRecruitDetailPost(item.id);
              }}
              key={item.id}
            >
              <PhotoBox>
                <ProfilePhoto>
                  <Photo src={item.userPhoto} />
                </ProfilePhoto>
              </PhotoBox>
              <TitleNickNameBox>
                <TitleBox>
                  <BoardTitleText>{item.title}</BoardTitleText>
                  <RecruitComment>[{item.comment}]</RecruitComment>
                </TitleBox>
                <NickNameBox>
                  <DayText>
                    <IconImg src="/assets/icons/myPage/Tear-off_calendar.svg" />
                    {item.selectedDays}
                  </DayText>
                  <TimeText>
                    <IconImg src="/assets/icons/myPage/One_oclock.svg" />
                    {item.startTime} ~ {item.endTime}
                  </TimeText>
                  <RecruitLength>
                    <IconImg src="/assets/icons/myPage/gymtivation_logo_miniicon.svg" />
                    {item.userId.split(',').length + item.participation.length}
                    명 참여중
                  </RecruitLength>
                </NickNameBox>
              </TitleNickNameBox>
            </MyPageBoardContainer>
          );
        })}
    </MyPageBoardWrapper>
  );
};

export default MyPageRecruit;

const PhotoBox = styled.div`
  width: 80px;
  height: 80px;
  margin: auto;
  margin-right: 0.5vw;
`;
const ProfilePhoto = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 70%;
  overflow: hidden;
`;
const Photo = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  :hover {
    cursor: pointer;
    transform: scale(1.2, 1.2);
  }
`;
const RecruitLength = styled.span`
  font-size: 1rem;
  margin-top: 5px;
  margin-right: 10px;
  font-weight: bold;
`;

const DayText = styled.button`
  height: 40px;
  padding-left: 10px;
  padding-right: 10px;
  font-size: 1rem;
  font-weight: bold;
  background-color: white;
  border-radius: 2rem;
  margin-right: 20px;
  max-width: 160px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
const TimeText = styled.button`
  height: 40px;
  padding-left: 12px;
  padding-right: 12px;
  font-size: 1rem;
  font-weight: bold;
  background-color: white;
  border-radius: 2rem;
  margin-right: 20px;
  max-width: 200px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const IconImg = styled.img`
  width: 1.5rem;
  height: 1.5rem;
  margin-right: 5px;
  margin-bottom: 2px;
`;

const MyPageBoardWrapper = styled.div`
  margin-left: 40px;
  width: 92%;
  height: 70%;
  flex-wrap: wrap;
`;

const MyPageBoardContainer = styled.div`
  margin-top: 1vh;
  display: flex;
  width: 100%;
  height: 40%;
  max-height: 105px;
  padding: 10px;
  background-color: white;
  border-color: black;
  border-style: solid;
  border-width: 0.1rem;
  border-radius: 15px;
  margin-bottom: 2vh;
  :hover {
    cursor: pointer;
    transform: scale(1.05, 1.05);
    transition: 0.3s;
  }
`;

const BoardTitleText = styled.span`
  font-size: 1.2rem;
  max-width: 260px;
  text-align: left;
  font-weight: bolder;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
const TitleBox = styled.div`
  display: flex;
  width: 100%;
  height: 40%;
  margin-bottom: 5px;
`;
const NickNameBox = styled.div`
  display: flex;
  width: 100%;
  height: 30%;
`;
const TitleNickNameBox = styled.div`
  width: 100%;
  height: 100%;
  padding-left: 10px;
`;
const RecruitComment = styled.span`
  font-size: 1.2rem;
  color: gray;
  font-weight: bolder;
  margin-left: 15px;
`;
