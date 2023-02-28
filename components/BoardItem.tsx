import styled from 'styled-components';
import BoardPost from './BoardPost';
import type { BoardPostType } from '@/type';

interface BoardItemProps {
  boardPosts: BoardPostType[];
  category?: string;
  nickName?: string;
}

const BoardItem = ({ boardPosts, category }: BoardItemProps) => {
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
  border-radius: 1rem;
  overflow: auto;
`;

export default BoardItem;
