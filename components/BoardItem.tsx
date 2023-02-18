import styled from 'styled-components';

const BoardItem = () => {
  return (
    <BoardList>
      <ItemTitle></ItemTitle>
    </BoardList>
  );
};

const BoardList = styled.div`
  width: 95%;
  height: 20%;
  border: 1px solid black;
  margin: 0.5rem;
  background-color: white;
  border-radius: 0.5rem;
`;

const ItemTitle = styled.p`
  font-size: 1rem;
`;
export default BoardItem;
