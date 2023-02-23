import { useRouter } from 'next/router';
import styled from 'styled-components';
import type { BoardPostType } from '@/pages/type';

const BoardPost = ({
  photo,
  category,
  title,
  id,
  nickName,
  like,
}: BoardPostType) => {
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
      <ItemPhotoContainer>
        <ItemPhoto src={photo}></ItemPhoto>
      </ItemPhotoContainer>
      <BoardPostContainer>
        <ItemContentWrapper>
          <ItemContentContainer>
            <CateogryWrapper>
              <ItemCategory>{category}</ItemCategory>
            </CateogryWrapper>
            <ItemTitleWrapper>
              <ItemTitle>{title}</ItemTitle>
            </ItemTitleWrapper>
          </ItemContentContainer>
        </ItemContentWrapper>
        <InformationWrapper>
          <ItemNickName>{nickName}</ItemNickName>
          <ItemLike>{like?.length}</ItemLike>
        </InformationWrapper>
      </BoardPostContainer>
    </BoardPostWrapper>
  );
};

const BoardPostWrapper = styled.div`
  display: flex;
  flex-direction: row;
  border: 1px solid black;
  margin: 1rem;
  background-color: white;
  border-radius: 1.5rem;
  height: 9rem;
  padding: 0.5rem;
`;
const BoardPostContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;
const ItemContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  width: 100%;
  height: 50%;
`;
const ItemContentContainer = styled.div`
  display: flex;
  flex-direction: row;
`;
const ItemPhotoContainer = styled.div`
  width: 10rem;
`;
const ItemPhoto = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 1rem;
  object-fit: cover;
`;
const ItemCategory = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 6rem;
  height: 2rem;
  border-radius: 1rem;
  background-color: #d9d9d9;
  margin: 1rem;
  border: none;
`;
const InformationWrapper = styled.div`
  display: flex;
  /* align-items: center; */
  width: 100%;
  height: 50%;
  flex-direction: row;
  justify-content: flex-start;
  padding-left: 1.5rem;
`;
const ItemNickName = styled.div`
  margin-right: 2rem;
`;
const CateogryWrapper = styled.div`
  display: flex;
  align-items: center;
`;
const ItemTitleWrapper = styled.div`
  display: flex;
  align-items: center;
  text-overflow: hidden;
`;
const ItemTitle = styled.div`
  display: flex;
  font-size: 1.5rem;
  width: 100%;
`;
const ItemLike = styled.div`
  margin-right: 1rem;
`;
export default BoardPost;
