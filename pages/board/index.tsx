import BoardItem from '@/components/BoardItem';
import { dbService } from '@/firebase';
import { query } from 'firebase/database';
import {
  collection,
  DocumentData,
  DocumentSnapshot,
  onSnapshot,
  orderBy,
} from 'firebase/firestore';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

interface BoardProps {
  // category?: any;
  snapshot: DocumentSnapshot<DocumentData>;
}
const Board = () => {
  const [category, setCategory] = useState('운동정보');
  const [boardPosts, setBoardPost] = useState([]);
  const router = useRouter();

  const onClickCategoryButton = async (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    setCategory(event?.currentTarget.id);
    console.log(category);
  };

  const onClickPostButton = () => {
    router.push({
      pathname: `/board/Post`,
    });
  };
  const getPost = () => {
    const q = query(
      //@ts-ignore
      collection(dbService, 'posts'),
      orderBy('createdAt', 'desc'),
    );
    //@ts-ignore
    const unsubscribe = onSnapshot(q, (snapshot: any) => {
      const newPosts = snapshot.docs.map((doc: any) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBoardPost(newPosts);
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
          <SearchContainer>
            <Search placeholder="검색하기" />
          </SearchContainer>
          <CategoryTitle>카테고리</CategoryTitle>
          <CategoryContainter>
            <CategoryButton id="운동정보" onClick={onClickCategoryButton}>
              운동정보
            </CategoryButton>
            <CategoryButton onClick={onClickCategoryButton} id="헬스장정보">
              헬스장정보
            </CategoryButton>
            <CategoryButton onClick={onClickCategoryButton} id="헬스용품추천">
              헬스용품추천
            </CategoryButton>
          </CategoryContainter>
          <BoardContent>
            <BoardItem category={category} boardPosts={boardPosts} />
          </BoardContent>
          <PostButtonContainer>
            <PostButton onClick={onClickPostButton}>글쓰기</PostButton>
          </PostButtonContainer>
        </BoardMain>
      </BoardWrapper>
    </>
  );
};
const BoardWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 95vh;
  border: 1px solid black;
  background-color: white;
  border-radius: 2rem;
`;
const BoardMain = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 97%;
  height: 95%;
  background-color: pink;
  border-radius: 2rem;
`;
const BoardContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  width: 100%;
  height: 70%;
  border: 1px solid black;
`;
const PostButtonContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
`;
const PostButton = styled.button``;

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin: 1rem;
  width: 100%;
  height: 10%;
  border: 1px solid black;
`;
const Search = styled.input`
  width: 7rem;
  height: 1.5rem;
  border: 1px solid black;
  border-radius: 1rem;
  margin: 1rem;
`;
const CategoryContainter = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  width: 100%;

  height: 10%;
  border: 1px solid black;
`;
const CategoryTitle = styled.p`
  font-size: 1rem;
  padding: 0;
  margin: 0;
`;
const CategoryButton = styled.button`
  height: 1.5rem;
  border-radius: 2rem;
  border: none;
  margin: 0.2rem;
  cursor: pointer;
`;
export default Board;
