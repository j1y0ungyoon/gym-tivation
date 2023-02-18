import BoardItem from '@/components/BoardItem';
import { useRouter } from 'next/router';
import styled from 'styled-components';

const Board = () => {
  const router = useRouter();
  const onClickCategoryButton = () => {
    console.log('카테고리');
  };
  const onClickPostButton = () => {
    router.push({
      pathname: `/board/Post`,
    });
  };

  return (
    <>
      <BoardWrapper>
        <BoardMain>
          <SearchContainer>
            <Search placeholder="검색하기" />
          </SearchContainer>
          <CategoryTitle>카테고리</CategoryTitle>
          <CategoryContainter>
            <Category onClick={onClickCategoryButton}>운동정보</Category>
            <Category>운동정보</Category>
            <Category>운동정보</Category>
            <Category>운동정보</Category>
          </CategoryContainter>
          <BoardContent>
            <BoardItem />
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
const Category = styled.button`
  height: 1.5rem;
  border-radius: 2rem;
  border: none;
  margin: 0.2rem;
  cursor: pointer;
`;
export default Board;
