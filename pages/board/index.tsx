import BoardItem from '@/components/BoardItem';
// import Search from '@/components/Search';
import { dbService } from '@/firebase';
import { BoardPostType } from '@/type';
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
          <PostButtonContainer>
            <PostButton onClick={onClickPostButton}>게시글 업로드</PostButton>
          </PostButtonContainer>
        </CategoryContainter>

        <BoardMain>
          {/* <Search /> */}
          <BoardContent>
            <BoardItem category={category} boardPosts={boardPosts} />
          </BoardContent>
        </BoardMain>
      </BoardWrapper>
    </>
  );
};
const BoardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: calc(100vw - 160px);
  height: calc(100vh - 80px);

  border-radius: 2rem;
`;
const BoardMain = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: #f2f2f2;

  border-radius: 2rem;
`;
const BoardContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  width: 100%;
  overflow: auto;
`;
const PostButtonContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
`;
const PostButton = styled.button`
  height: 1.5rem;
  border-radius: 2rem;
  border: none;
  margin: 0.2rem;
  cursor: pointer;
  width: 10rem;
  height: 3rem;
`;

const CategoryContainter = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: flex-start;
  width: 95%;
  margin: 0.5rem;
`;

const CategoryButton = styled.button<boardCategoryProps>`
  background-color: ${(props) =>
    props.id === props.category ? 'black' : ' #D9D9D9'};
  color: ${(props) => (props.id === props.category ? 'white' : 'black')};
  height: 1.5rem;
  border-radius: 2rem;
  border: none;
  margin: 0.2rem;
  cursor: pointer;
  width: 10rem;
  height: 3rem;
`;
export default Board;
