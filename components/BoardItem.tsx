import styled from 'styled-components';
import BoardPost from './BoardPost';

import { useRouter } from 'next/router';

import type { BoardPostType } from '@/type';

interface BoardItemProps {
  boardPosts: BoardPostType[];
  category?: string;
  nickName?: string;
}

const BoardItem = ({ boardPosts, category }: BoardItemProps) => {
  const router = useRouter();
  //@ts-ignore
  // const itemSearch = decodeURI(router.query.q)?.toLowerCase() || '';
  // const searchedItem = itemSearch
  //   ? boardPosts.filter(
  //       (search: any) =>
  //         search.title.toLowerCase().includes(itemSearch) ||
  //         search.content.toLowerCase().includes(itemSearch),
  //     )
  //   : boardPosts;

  const filteredCategory = boardPosts?.filter(
    (item) => item.category === category,
  );
  return (
    <BoardList>
      {filteredCategory.map((boardPost) => {
        return (
          <BoardPost
            key={boardPost.id}
            item={boardPost.item}
            title={boardPost.title}
            id={boardPost.id}
            nickName={boardPost.nickName}
            category={boardPost.category}
            photo={boardPost.photo}
            like={boardPost.like}
          />
        );
      })}
    </BoardList>
  );
};

const BoardList = styled.div`
  width: 100%;
  height: 100%;
  margin: 0.5rem;
  border-radius: 1rem;
  overflow: scroll;
`;

export default BoardItem;
