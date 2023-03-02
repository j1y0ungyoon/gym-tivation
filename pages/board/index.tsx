import BoardItem from '@/components/BoardItem';
// import Search from '@/components/Search';
import { dbService } from '@/firebase';
import { BoardPostType } from '@/type';

import {
  collection,
  DocumentData,
  DocumentSnapshot,
  onSnapshot,
  orderBy,
  query,
} from 'firebase/firestore';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

interface BoardProps {
  category?: any;
  snapshot: DocumentSnapshot<DocumentData>;
  item: BoardPostType;
  id?: number;
}
interface boardCategoryProps {
  category: string;
}
const Board = () => {
  const [category, setCategory] = useState('운동정보');
  const [boardPosts, setBoardPosts] = useState([]);
  const router = useRouter();

  const onClickCategoryButton = async (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    setCategory(event?.currentTarget.id);
  };

  const onClickPostButton = () => {
    router.push({
      pathname: `/board/Post`,
    });
  };

  const getPost = () => {
    const q = query(
      collection(dbService, 'posts'),
      orderBy('createdAt', 'desc'),
    );

    const unsubscribe = onSnapshot(q, (snapshot: any) => {
      const newPosts = snapshot.docs.map((doc: any) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBoardPosts(newPosts);
    });
    return unsubscribe;
  };

  useEffect(() => {
    const unsubscribe = getPost();

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <>
      <BoardWrapper>
        <BoardMain>
          <ButtonWrapper>
            <CategoryContainter>
              <CategoryButton
                category={category}
                id="운동정보"
                onClick={onClickCategoryButton}
              >
                운동정보
              </CategoryButton>
              <CategoryButton
                category={category}
                onClick={onClickCategoryButton}
                id="헬스장정보"
              >
                헬스장정보
              </CategoryButton>
              <CategoryButton
                category={category}
                onClick={onClickCategoryButton}
                id="헬스용품추천"
              >
                헬스용품추천
              </CategoryButton>
            </CategoryContainter>
            <PostButtonContainer>
              <PostButton onClick={onClickPostButton}>게시글 업로드</PostButton>
            </PostButtonContainer>
          </ButtonWrapper>

          <ContentWrapper>
            <BoardContent>
              <BoardItem category={category} boardPosts={boardPosts} />
            </BoardContent>
          </ContentWrapper>
        </BoardMain>
      </BoardWrapper>
    </>
  );
};
const BoardWrapper = styled.div`
  ${({ theme }) => theme.mainLayout.wrapper};
  flex-direction: column;
  align-items: center;
`;
const BoardMain = styled.main`
  ${({ theme }) => theme.mainLayout.container};
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: auto;
`;
const ContentWrapper = styled.div`
  background-color: white;
  border: 1px solid black;
  border-radius: 2rem;
  width: 100%;
  height: 100%;
`;
const BoardContent = styled.div`
  background-color: white;
  border-radius: ${({ theme }) => theme.borderRadius.radius100};
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  width: 100%;
`;
const ButtonWrapper = styled.div`
  display: flex;
  width: 100%;
  margin: 1rem;
`;
const PostButtonContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
`;
const PostButton = styled.button`
  ${({ theme }) => theme.btn.btn100}
`;

const CategoryContainter = styled.div`
  display: flex;
`;

const CategoryButton = styled.button<boardCategoryProps>`
  ${({ theme }) => theme.btn.category}
  width:140px;
  margin: 10px;
`;
export default Board;
