import { useRouter } from 'next/router';
import styled from 'styled-components';
import type { BoardPostType } from '@/type';

const BoardPost = ({ title, id, content }: BoardPostType) => {
  const router = useRouter();

  const goToDetailPost = (id: any) => {
    router.push({
      pathname: `/boardDetail/${id}`,
      query: {
        id,
      },
    });
  };
  return (
    <BoardPostWrapper key={id} onClick={() => goToDetailPost(id)}>
      <ItemTitle>{title}</ItemTitle>
      <ItemContent>{content}</ItemContent>
    </BoardPostWrapper>
  );
};

const BoardPostWrapper = styled.div`
  border: 1px solid black;
`;
const ItemTitle = styled.p`
  font-size: 2rem;
  border: 1px solid black;
`;
const ItemContent = styled.p`
  font-size: 1rem;
  border: 1px solid black;
`;

export default BoardPost;
