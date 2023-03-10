import BoardItem from '@/components/board/BoardItem';
import Loading from '@/components/common/globalModal/Loading';
import SearchDropDown from '@/components/common/globalModal/SearchDropDown';
import { authService } from '@/firebase';
import { BoardPostType } from '@/type';
import { DocumentData, DocumentSnapshot } from 'firebase/firestore';
import { useRouter } from 'next/router';
import { ChangeEvent, useEffect, useState } from 'react';
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
  const { data, isLoading } = useQuery(['getPostData'], getBoardPosts);
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

  useEffect(() => {}, [authService.currentUser]);
  if (isLoading) {
    return <Loading />;
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
              <PostButton onClick={onClickPostButton}>
                게시글 업로드
                <PostIcon src="/assets/icons/writingIcon.svg" />
              </PostButton>
            </PostButtonContainer>
          </ButtonWrapper>

          <ContentWrapper>
            <SearchBox>
              <SearchInputBox>
                <SearchInput
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
              </SearchInputBox>
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
  height: calc(100% - 40px);
`;
const ContentWrapper = styled.div`
  background-color: white;
  border: 1px solid black;
  border-radius: ${({ theme }) => theme.borderRadius.radius100};
  width: 100%;
  height: 100%;
  box-shadow: -2px 2px 0px 1px #000000;
  overflow-y: auto;
  ::-webkit-scrollbar {
    width: 8px;
  }
  ::-webkit-scrollbar-thumb {
    background-color: #000;
    border-radius: 10px;
  }
  ::-webkit-scrollbar-track {
    background-color: transparent;
    border-radius: 10px;
    margin: 40px 0;
  }
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
  box-shadow: -2px 2px 0px 1px #000000;
`;
const PostIcon = styled.img`
  margin-left: 10px;
`;

const CategoryContainter = styled.div`
  display: flex;
`;

const CategoryButton = styled.button<boardCategoryProps>`
  ${({ theme }) => theme.btn.category}
  box-shadow: -2px 2px 0px 1px #000000;
  width: 150px;
  margin: 10px;
`;

const SearchBox = styled.div`
  margin-top: 20px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 100%;
`;
const SearchInputBox = styled.div`
  ${({ theme }) => theme.inputDiv}
  width: 320px;
  border: 1px solid black;
  margin-right: 10px;
`;
const SearchInput = styled.input`
  ${({ theme }) => theme.input}
`;
export default Board;
