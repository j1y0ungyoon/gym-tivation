import { useRouter } from 'next/router';
import styled from 'styled-components';
interface BoardPostProps {
  item: any;
  id?: string;
  title: string;
  photo?: any;
  content?: string;
  createdAt: number;
}

const BoardPost = ({ item }: BoardPostProps) => {
  const router = useRouter();

  const goToDetailPost = (item: BoardPostProps) => {
    router.push({
      pathname: `/boardDetail/${item.id}`,
      query: {
        id: item.id,
      },
    });
  };
  return (
    <BoardPostWrapper key={item.id} onClick={() => goToDetailPost(item)}>
      <ItemTitle>{item.title}</ItemTitle>
      <ItemContent>{item.content}</ItemContent>
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
