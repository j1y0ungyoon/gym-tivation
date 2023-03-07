import styled from 'styled-components';
import BoardPost from './BoardPost';
import type { BoardPostType } from '@/type';
import { useEffect, useState } from 'react';

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
    if (!searchText) return;

    if (searchCategory === '전체') {
      setSearchedPosts(filteredCategory);
    }

    if (searchCategory === '내용') {
      const result = filteredCategory.filter(
        (item: BoardPostType) =>
          item.content?.toLowerCase().includes(searchText?.toLowerCase()) ||
          item.title?.toLowerCase().includes(searchText?.toLowerCase()),
      );

      setSearchedPosts(result);
    }

    if (searchCategory === '닉네임') {
      const result = filteredCategory.filter((item: BoardPostType) =>
        item.nickName?.toLowerCase().includes(searchText?.toLowerCase()),
      );

      setSearchedPosts(result);
    }
  };

  useEffect(() => {
    getSearchedPosts();
  }, [searchText, searchCategory]);

  useEffect(() => {
    getSearchedPosts();
    setSearchedPosts(filteredCategory);
    console.log(searchedPosts);
  }, []);

  return (
    <>
      {searchedPosts?.map((boardPost: any) => {
        return (
          <BoardList>
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
