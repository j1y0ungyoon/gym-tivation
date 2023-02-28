import { authService, dbService } from '@/firebase';
import checkedLike from '../public/assets/images/checkedLike.png';
import Image from 'next/image';
import { collection, orderBy, getDocs, query, where } from 'firebase/firestore';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import GalleryComment from './GalleryComment';

type Board = {
  id: string;
  photo: string;
  userId: string;
  category: string;
  title: string;
  nickName: string;
  createdAt: number;
  like: string;
};

const MyPageLike = ({ paramsId }: { paramsId: string }) => {
  const [boardInformation, setBoardInFormation] = useState<Board[]>([]);
  const [galleyInformaiton, setGalleyInformaiton] = useState<Board[]>([]);
  const [likeInformation, setLikeInFormation] = useState<Board[]>([]);
  const [getPostComment, setGetPostComment] = useState([] as any);
  const [getGalleyComment, setGetGalleyComment] = useState([] as any);
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

  const combineData = boardInformation.concat(galleyInformaiton);
  const combineCommentData = getPostComment.concat(getGalleyComment);
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

  const getBoardPost = async () => {
    const q = query(
      collection(dbService, 'posts'),
      orderBy('createdAt', 'desc'),
    );
    const data = await getDocs(q);
    const getBoardData = data.docs.map((doc: any) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setBoardInFormation(getBoardData);
  };
  const getGalleryPost = async () => {
    const q = query(
      collection(dbService, 'gallery'),
      orderBy('createdAt', 'desc'),
    );
    const data = await getDocs(q);
    const getBoardData = data.docs.map((doc: any) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setGalleyInformaiton(getBoardData);
  };

  const getCommentNumber = async () => {
    const q = query(collection(dbService, 'boardComment'));
    const data = await getDocs(q);
    data.docs.map((doc) => {
      setGetPostComment((prev: any) => [...prev, doc.data().postId]);
    });
  };
  const getGalleyNumber = async () => {
    const q = query(collection(dbService, 'galleryComment'));
    const data = await getDocs(q);
    data.docs.map((doc) => {
      setGetGalleyComment((prev: any) => [...prev, doc.data().postId]);
    });
  };

  console.log('데이터', getGalleyComment);

  useEffect(() => {
    getPostLike();
    getBoardPost();
    getGalleryPost();
    getCommentNumber();
    getGalleyNumber();
    return () => {
      getPostLike();
      getBoardPost();
      getGalleryPost();
      getCommentNumber();
      getGalleyNumber();
    };
  }, [authService.currentUser?.uid]);

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
              <PhotoBox>
                <ProfilePhoto>
                  <Photo src={item.photo} />
                </ProfilePhoto>
              </PhotoBox>
              <TitleNickNameBox>
                <TitleBox>
                  <BoardCategory>
                    {item.category === undefined ? '오운완 갤러리' : '게시판'}
                  </BoardCategory>
                  <BoardTitleText>{item.title}</BoardTitleText>

                  <RecruitComment>
                    [
                    {
                      combineCommentData.filter(
                        (element: any) => item.id === element,
                      ).length
                    }
                    ]
                  </RecruitComment>
                </TitleBox>
                <NickNameBox>
                  <NickNameText>{item.nickName}</NickNameText>
                  <NickNameText>{item.createdAt}</NickNameText>
                  <Image
                    src={checkedLike}
                    alt="좋아요"
                    width={20}
                    height={20}
                    style={{ marginRight: '0.1vw', marginTop: '0.2vh' }}
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
  width: 100%;
  height: 100%;
  flex-wrap: wrap;
  padding-bottom: 1vh;
  padding-left: 1.5vw;
  padding-right: 1.5vw;
  overflow: auto;
  ::-webkit-scrollbar {
    display: none;
  }
`;

const MyPageBoardContainer = styled.div`
  display: flex;
  margin-top: 1vh;
  width: 97%;
  padding: 2vh;
  height: 15vh;
  background-color: white;
  border-color: black;
  border-style: solid;
  border-width: 0.1rem;
  border-radius: 15px;
  margin-bottom: 2vh;
  :hover {
    cursor: pointer;
    transform: scale(1.05, 1.05);
    transition: 0.3s;
  }
`;

const PhotoBox = styled.div`
  width: 20%;
  height: 100%;
`;
const ProfilePhoto = styled.div`
  width: 8vw;
  height: 11vh;
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
  width: 8vw;
  height: 4.5vh;
  font-size: 1.3rem;
  font-weight: bold;
  background-color: white;
  border-radius: 2rem;
  margin-right: 1vw;
`;

const BoardTitleText = styled.span`
  font-size: 1.2rem;
  font-weight: bolder;
  margin-top: 0.8vh;
`;
const NickNameText = styled.span`
  font-size: 1rem;
  margin-right: 0.5vw;
`;

const TitleBox = styled.div`
  display: flex;
  margin-top: 0.7vh;
  margin-bottom: 0.7vh;
  width: 80%;
  height: 50%;
`;
const NickNameBox = styled.div`
  display: flex;
  width: 60%;
  height: 30%;
`;
const TitleNickNameBox = styled.div`
  width: 100%;
  height: 100%;
`;
const RecruitComment = styled.span`
  font-size: 1.2rem;
  color: gray;
  font-weight: bolder;
  margin-left: 0.5vw;
  margin-top: 0.8vh;
`;
