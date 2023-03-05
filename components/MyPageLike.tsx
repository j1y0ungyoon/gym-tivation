import { authService, dbService } from '@/firebase';
import checkedLike from '../public/assets/images/checkedLike.png';
import Image from 'next/image';
import { collection, orderBy, getDocs, query, where } from 'firebase/firestore';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import GalleryComment from './GalleryComment';
import { Board, Gallery } from '@/pages/myPage/[...params]';

type Like = {
  id: string;
  photo: string;
  userId: string;
  category: string;
  title: string;
  nickName: string;
  createdAt: number;
  like: string;
};
type LikeGet = {
  paramsId: string;
  galleryInformation: Gallery[];
  boardInformation: Board[];
};

const MyPageLike = ({
  paramsId,
  galleryInformation,
  boardInformation,
}: LikeGet) => {
  const [likeInformation, setLikeInFormation] = useState<Like[]>([]);

  const router = useRouter();
  const goToBoardDetailPost = (id: any) => {
    router.push({
      pathname: `/boardDetail/${id}`,
      query: {
        id,
      },
    });
  };
  const goToGalleryDetailPost = (id: any) => {
    router.push({
      pathname: `/galleryDetail/${id}`,
      query: {
        id,
      },
    });
  };
  //배열 합치기
  const combineData = boardInformation.concat(galleryInformation);

  const getPostLike = async () => {
    const q = query(
      collection(dbService, 'profile'),
      where('uid', '==', paramsId),
    );
    const data = await getDocs(q);
    data.docs.map((doc) => {
      setLikeInFormation(doc.data().postLike);
    });
  };

  useEffect(() => {
    getPostLike();

    return () => {};
  }, [paramsId]);

  return (
    <MyPageBoardWrapper>
      {combineData
        .filter((item) => String(likeInformation).includes(item.id))
        .map((item) => {
          return (
            <MyPageBoardContainer
              key={item.id}
              onClick={() => {
                item.category === undefined
                  ? goToGalleryDetailPost(item.id)
                  : goToBoardDetailPost(item.id);
              }}
            >
              {item.photo ? (
                <PhotoBox>
                  <ProfilePhoto>
                    <Photo src={item.photo} />
                  </ProfilePhoto>
                </PhotoBox>
              ) : null}
              <TitleNickNameBox>
                <TitleBox>
                  <BoardCategory>
                    {item.category === undefined ? '오운완 갤러리' : '게시판'}
                  </BoardCategory>
                  <BoardTitleText>{item.title}</BoardTitleText>

                  {/* <RecruitComment>[{item.comment}]</RecruitComment> */}
                </TitleBox>
                <NickNameBox>
                  <NickNameText>{item.nickName}</NickNameText>
                  <NickNameText>{item.createdAt}</NickNameText>
                  <Image
                    src={checkedLike}
                    alt="좋아요"
                    width={20}
                    height={20}
                    style={{ marginRight: '4px', marginTop: '3px' }}
                  />
                  <NickNameText> {item.like.length}</NickNameText>
                </NickNameBox>
              </TitleNickNameBox>
            </MyPageBoardContainer>
          );
        })}
    </MyPageBoardWrapper>
  );
};

export default MyPageLike;
const MyPageBoardWrapper = styled.div`
  padding-top: 20px;
  margin-left: 40px;
  width: 92%;
  height: 70%;
  flex-wrap: wrap;
`;

const MyPageBoardContainer = styled.div`
  display: flex;
  width: 100%;
  height: 40%;
  max-height: 105px;
  padding: 10px;
  background-color: white;
  border-color: black;
  border-style: solid;
  border-width: 0.1rem;
  border-radius: 15px;
  margin-bottom: 16px;
  :hover {
    cursor: pointer;
    transform: scale(1.05, 1.05);
    transition: 0.3s;
  }
`;

const PhotoBox = styled.div`
  width: 28%;
  height: 100%;
`;
const ProfilePhoto = styled.div`
  width: 95%;
  height: 100%;
  border-radius: 1rem;
  overflow: hidden;
`;
const Photo = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  :hover {
    cursor: pointer;
    transform: scale(1.2, 1.2);
  }
`;
const BoardCategory = styled.button`
  width: 150px;
  height: 40px;
  font-size: 1.2rem;
  font-weight: bold;
  background-color: white;
  border-radius: 2rem;
  margin-right: 15px;
`;

const BoardTitleText = styled.span`
  font-size: 1.2rem;
  max-width: 260px;
  text-align: left;
  margin-top: 4px;
  font-weight: bolder;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
const NickNameText = styled.span`
  font-size: 1rem;
  margin-right: 10px;
`;

const TitleBox = styled.div`
  display: flex;
  margin-bottom: 5px;
  width: 100%;
  height: 50%;
`;
const NickNameBox = styled.div`
  display: flex;
  width: 80%;
  height: 30%;
`;
const TitleNickNameBox = styled.div`
  width: 100%;
  height: 100%;
  padding-left: 10px;
`;
const RecruitComment = styled.span`
  font-size: 1.2rem;
  margin-top: 2px;
  color: gray;
  font-weight: bolder;
  margin-left: 15px;
`;
