import { authService, dbService } from '@/firebase';
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
};

const MyPageRecruit = ({ paramsId }: { paramsId: string }) => {
  const [getComment, setGetComment] = useState([] as any);
  const [getRecruit, setGetRecruit] = useState([] as any);
  const router = useRouter();
  const goToRecruitDetailDetailPost = (id: any) => {
    router.push({
      pathname: `/recruitDetail/${id}`,
      query: {
        id,
      },
    });
  };

  const getRecruitments = async () => {
    const q = query(
      collection(dbService, 'profile'),
      where('uid', '==', paramsId),
    );
    const data = await getDocs(q);
    data.docs.map((doc) => {
      setGetRecruit(() => [doc.data().userParticipation]);
    });
  };

  const getCommentNumber = async () => {
    const q = query(collection(dbService, 'comments'));
    const data = await getDocs(q);
    data.docs.map((doc) => {
      setGetComment((prev: any) => [...prev, doc.data().postId]);
    });
  };
  useEffect(() => {
    getRecruitments();
    getCommentNumber();
    return () => {
      getRecruitments();
      getCommentNumber();
    };
  }, [paramsId]);

  return (
    <MyPageBoardWrapper>
      {getRecruit.map((items: []) => {
        return items.map((item: Board) => {
          return (
            <MyPageBoardContainer
              onClick={() => {
                goToRecruitDetailDetailPost(item.id);
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
                  <RecruitComment>
                    [
                    {
                      getComment.filter((element: any) => item.id === element)
                        .length
                    }
                    ]
                  </RecruitComment>
                </TitleBox>
                <NickNameBox>
                  <TimeText> {item.selectedDays} </TimeText>
                  <TimeText>
                    {item.startTime} ~ {item.endTime}
                  </TimeText>
                  <RecruitLength>
                    {item.participation.length}명 참여중
                  </RecruitLength>
                </NickNameBox>
              </TitleNickNameBox>
            </MyPageBoardContainer>
          );
        });
      })}

      {/* // <MyPageBoardContainer
          //   key={nanoid()}
          //   // onClick={() => goToBoardDetailPost(item.id)}
          // > */}
    </MyPageBoardWrapper>
  );
};

export default MyPageRecruit;
const MyPageBoardWrapper = styled.div`
  width: 100%;
  height: 61%;
  overflow: auto;
  flex-wrap: wrap;
  padding-bottom: 1vh;
  padding-left: 1.5vw;
  padding-right: 1.5vw;
  overflow: auto;
  ::-webkit-scrollbar {
    display: none;
  }
`;

const MyPageBoardContainer = styled.div`
  display: flex;
  margin-top: 1vh;
  width: 97%;
  padding: 2vh;
  height: 15vh;
  background-color: white;
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

const PhotoBox = styled.div`
  width: 12%;
  height: 100%;
`;
const ProfilePhoto = styled.div`
  width: 6rem;
  height: 6rem;
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
  margin-right: 0.5vw;
  margin-top: 1vh;
  font-weight: bold;
`;

const BoardTitleText = styled.span`
  font-size: 1.2rem;
  color: black;
  font-weight: bolder;
  margin-top: 0.8vh;
`;
const TimeText = styled.button`
  height: 4vh;
  font-size: 1.3rem;
  font-weight: bold;
  background-color: white;
  border-radius: 2rem;
  margin-right: 1vw;
`;

const TitleBox = styled.div`
  display: flex;
  width: 80%;
  height: 50%;
`;
const NickNameBox = styled.div`
  display: flex;
  width: 60%;
  height: 30%;
`;
const TitleNickNameBox = styled.div`
  width: 100%;
  height: 100%;
`;
const RecruitComment = styled.span`
  font-size: 1.2rem;
  color: gray;
  font-weight: bolder;
  margin-left: 0.5vw;
  margin-top: 0.8vh;
`;
