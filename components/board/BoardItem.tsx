import styled from 'styled-components';
import BoardPost from './BoardPost';
import type { BoardPostType } from '@/type';

interface BoardItemProps {
  category?: string;
  nickName?: string;
  data?: any;
}

const BoardItem = ({ data, category }: BoardItemProps) => {
  const filteredCategory = data?.filter(
    (item: any) => item.category === category,
  );
  return (
    <BoardList>
      {filteredCategory?.map((boardPost: any) => {
        return (
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
            createdAt={boardPost.createdAt.slice(0, -3)}
          />
        );
      })}
    </BoardList>
  );
};

const BoardList = styled.div`
  width: 100%;
  height: 100%;
  overflow: auto;
`;

export default BoardItem;
