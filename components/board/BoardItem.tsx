import styled from 'styled-components';
import BoardPost from './BoardPost';
import type { BoardPostType } from '@/type';
import { useEffect, useState } from 'react';
import { nanoid } from 'nanoid';

interface BoardItemProps {
  category?: string;
  nickName?: string;
  data?: any;
  searchText?: string;
  searchCategory?: string;
}

const BoardItem = ({
  data,
  category,
  searchCategory,
  searchText,
}: BoardItemProps) => {
  const [searchedPosts, setSearchedPosts] = useState<BoardPostType[]>([]);

  const filteredCategory = data?.filter(
    (item: any) => item.category === category,
  );

  const getSearchedPosts = () => {
    if (searchCategory === '전체' || searchText === '') {
      setSearchedPosts(filteredCategory);
      return;
    }

    if (!searchText) return;

    if (searchCategory === '내용') {
      const result = filteredCategory.filter((item: BoardPostType) => {
        return (
          item.content?.toLowerCase().includes(searchText?.toLowerCase()) ||
          item.title?.toLowerCase().includes(searchText?.toLowerCase())
        );
      });

      setSearchedPosts(result);
      return;
    }

    if (searchCategory === '닉네임') {
      const result = filteredCategory.filter((item: BoardPostType) => {
        return item.nickName?.toLowerCase().includes(searchText?.toLowerCase());
      });

      setSearchedPosts(result);
      return;
    }
  };

  useEffect(() => {
    getSearchedPosts();
  }, [searchText, searchCategory, category]);

  return (
    <>
      {searchedPosts?.map((boardPost: any) => {
        return (
          <BoardList key={nanoid()}>
            <BoardPost
              key={boardPost.id}
              item={boardPost.item}
              title={boardPost.title}
              id={boardPost.id}
              userId={boardPost.userId}
              nickName={boardPost.nickName}
              category={boardPost.category}
              // photo={boardPost.photo}
              like={boardPost.like}
              createdAt={boardPost.createdAt}
            />
          </BoardList>
        );
      })}
    </>
  );
};

const BoardList = styled.div`
  width: 100%;
  height: 100%;
  overflow: auto;
`;

export default BoardItem;
