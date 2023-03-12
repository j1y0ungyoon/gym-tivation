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
  userPhoto,
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
          <UserImageWrapper>
            <UserImage src={userPhoto}></UserImage>
          </UserImageWrapper>
          <InfoContentWrapper>
            <ItemContentContainer>
              <CateogryWrapper>
                <ItemCategory>{category}</ItemCategory>
              </CateogryWrapper>
              <ItemTitleWrapper>
                <ItemTitle>{title}</ItemTitle>
                <CommentCount>[{commentCount}]</CommentCount>
              </ItemTitleWrapper>
            </ItemContentContainer>
            <InformationWrapper>
              <ItemNickName>{nickName}</ItemNickName>
              <ItemCreatedAt>{String(createdAt)}</ItemCreatedAt>
              <LikeWrapper>
                <Image alt="like" src={smallLike} />
                <ItemLike>{like?.length}</ItemLike>
              </LikeWrapper>
            </InformationWrapper>
          </InfoContentWrapper>
        </ItemContentWrapper>
      </BoardPostContainer>
    </BoardPostWrapper>
  );
};

const InfoContentWrapper = styled.div``;
const BoardPostWrapper = styled.div`
  display: flex;
  flex-direction: row;
  border: 1px solid black;
  margin: 4px;
  background-color: white;
  border-radius: ${({ theme }) => theme.borderRadius.radius50};
  height: 88px;
  width: 90%;
  padding: 0.5rem;
  box-shadow: -2px 2px 0px 1px #000000;
  cursor: pointer;
  :hover {
    background-color: ${({ theme }) => theme.color.brandColor50};
    cursor: pointer;
    transform: scale(1.03, 1.03);
    transition: 0.3s;
  }
`;
const CommentCount = styled.div`
  display: flex;
  font-size: ${({ theme }) => theme.font.font10};
  margin: 10px;
`;
const BoardPostContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;
const ItemContentWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  width: 100%;
  height: 100%;
`;
const UserImage = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 40px;
`;
const UserImageWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 4%;
  height: 100%;
  margin-left: 10px;
`;
const ItemContentContainer = styled.div`
  height: 50%;
  display: flex;
  flex-direction: row;
`;
const ItemCategory = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 80%;
  border-radius: 1rem;
  background-color: #d9d9d9;
  font-size: 14px;
  margin: 1rem;
  padding: 10px;
  border: 1px solid black;
`;
const InformationWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  width: 100%;
  height: 50%;
  flex-direction: row;
  justify-content: flex-start;

  padding-left: 1.5rem;
`;
const ItemNickName = styled.div`
  margin-right: 10px;
`;
const ItemCreatedAt = styled.span``;
const CateogryWrapper = styled.div`
  display: flex;
  align-items: center;
`;
const LikeWrapper = styled.div`
  margin-left: 5px;
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
  font-size: ${({ theme }) => theme.font.font50};
  width: 100%;
`;
const ItemLike = styled.div`
  margin-left: 5px;
`;
export default BoardPost;
