import { useRouter } from 'next/router';
import styled from 'styled-components';
import type { BoardPostType } from '@/type';
import smallLike from '../../public/assets/icons/smallLike.png';
import Image from 'next/image';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { dbService } from '@/firebase';
import { useEffect } from 'react';
import { useState } from 'react';

const BoardPost = ({
  category,
  title,
  id,
  nickName,
  like,
  createdAt,
}: BoardPostType) => {
  const router = useRouter();
  const [commentCount, setCommentCount] = useState<number>();
  const goToDetailPost = (id: any) => {
    router.push({
      pathname: `/boardDetail/${id}`,
      query: {
        id,
      },
    });
  };

  const getComments = async () => {
    if (!id) return;
    const q = query(
      collection(dbService, 'comments'),
      where('postId', '==', id),
    );
    const docsData = await getDocs(q);
    const commentList = docsData.docs.length;
    setCommentCount(commentList);
  };
  useEffect(() => {
    getComments();
  }, []);

  return (
    <BoardPostWrapper key={id} onClick={() => goToDetailPost(id)}>
      {/* <ItemPhotoContainer>
        <ItemPhoto src={photo}></ItemPhoto>
      </ItemPhotoContainer> */}
      <BoardPostContainer>
        <ItemContentWrapper>
          <ItemContentContainer>
            <CateogryWrapper>
              <ItemCategory>{category}</ItemCategory>
            </CateogryWrapper>
            <ItemTitleWrapper>
              <ItemTitle>{title}</ItemTitle>
              <CommentCount>[{commentCount}]</CommentCount>
            </ItemTitleWrapper>
          </ItemContentContainer>
        </ItemContentWrapper>
        <InformationWrapper>
          <ItemNickName>{nickName}</ItemNickName>
          <ItemCreatedAt>{String(createdAt).slice(0, -3)}</ItemCreatedAt>
          <LikeWrapper>
            <Image alt="like" src={smallLike} />
            <ItemLike>{like?.length}</ItemLike>
          </LikeWrapper>
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
  border-radius: ${({ theme }) => theme.borderRadius.radius50};
  height: 9rem;
  padding: 0.5rem;
  cursor: pointer;
`;
const CommentCount = styled.div`
  display: flex;
  font-size: ${({ theme }) => theme.font.font50};
  margin: 10px;
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
  align-items: center;
  width: 100%;
  height: 50%;
  flex-direction: row;
  justify-content: flex-start;
  padding-left: 1.5rem;
`;
const ItemNickName = styled.div`
  margin-right: 2rem;
`;
const ItemCreatedAt = styled.span``;
const CateogryWrapper = styled.div`
  display: flex;
  align-items: center;
`;
const LikeWrapper = styled.div`
  margin: 10px;
  display: flex;
  flex-direction: row;
  align-items: center;
`;
const ItemTitleWrapper = styled.div`
  display: flex;
  align-items: center;
  text-overflow: hidden;
`;
const ItemTitle = styled.div`
  display: flex;
  font-size: ${({ theme }) => theme.font.font70};
  width: 100%;
`;
const ItemLike = styled.div`
  margin-left: 5px;
`;
export default BoardPost;
