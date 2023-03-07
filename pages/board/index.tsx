import BoardItem from '@/components/board/BoardItem';
import SearchDropDown from '@/components/common/globalModal/SearchDropDown';
import { BoardPostType } from '@/type';
import { DocumentData, DocumentSnapshot } from 'firebase/firestore';
import { useRouter } from 'next/router';
import { ChangeEvent, useState } from 'react';
import { useQuery } from 'react-query';
import styled from 'styled-components';
import { getBoardPosts } from '../api/api';

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
  const router = useRouter();
  const { data, isLoading } = useQuery(['getPostsData'], getBoardPosts);

  const [searchCategory, setSearchCategory] = useState('전체');
  const [searchInput, setSearchInput] = useState('');
  const [searchText, setSearchText] = useState('');

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

  const onKeyPressSearch = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      setSearchText(searchInput);
    }
  };

  if (isLoading) {
    return <div>로딩중입니다</div>;
  }

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
            <SearchBox>
              <input
                placeholder={
                  searchText
                    ? `'${searchText}'의 검색 결과`
                    : '검색어를 입력하세요!'
                }
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setSearchInput(e.target.value)
                }
                onKeyPress={onKeyPressSearch}
                value={searchInput}
              />
              <SearchDropDown setSearchCategory={setSearchCategory}>
                {searchCategory}
              </SearchDropDown>
            </SearchBox>
            <BoardContent>
              <BoardItem
                category={category}
                data={data}
                searchText={searchText}
                searchCategory={searchCategory}
              />
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
  border-radius: ${({ theme }) => theme.borderRadius.radius100};
  width: 100%;
  height: 100%;
`;
const BoardContent = styled.div`
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

const SearchBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
`;
export default Board;
