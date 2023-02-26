import { authService, dbService } from '@/firebase';

import { collection, orderBy, getDocs, query } from 'firebase/firestore';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

type Board = {
  id: string;
  photo: string;
  userId: string;
};

const MyPageBoard = ({ paramsId }: { paramsId: string }) => {
  const [boardInformation, setBoardInFormation] = useState<Board[]>([]);
  const router = useRouter();
  const goToBoardDetailPost = (id: any) => {
    router.push({
      pathname: `/boardDetail/${id}`,
      query: {
        id,
      },
    });
  };

  const getBoardPost = async () => {
    const q = query(
      collection(dbService, 'posts'),
      orderBy('createdAt', 'desc'),
    );
    const data = await getDocs(q);
    const getBoardData = data.docs.map((doc: any) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setBoardInFormation(getBoardData);
  };

  useEffect(() => {
    getBoardPost();
    return () => {
      getBoardPost();
    };
  }, [authService.currentUser?.uid]);

  console.log('데이터', boardInformation);

  return (
    <MyPageBoardWrapper>
      {boardInformation
        .filter((item) => item.userId === paramsId)
        .map((item) => {
          return (
            <MyPageBoardContainer
              key={item.id}
              onClick={() => goToBoardDetailPost(item.id)}
            >
              <BoardPhoto src={item.photo} />
            </MyPageBoardContainer>
          );
        })}
    </MyPageBoardWrapper>
  );
};

export default MyPageBoard;
const MyPageBoardWrapper = styled.div`
  width: 100%;
  height: 61%;
  display: flex;
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
  margin: 1vh;
`;

const BoardPhoto = styled.img`
  width: 14vw;
  height: 18vh;

  :hover {
    cursor: pointer;
    transform: scale(1.2, 1.2);
  }
`;
