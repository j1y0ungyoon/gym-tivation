import { authService, dbService } from '@/firebase';

import { collection, orderBy, getDocs, query } from 'firebase/firestore';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

type Gallery = {
  id: string;
  photo: string;
  userId: string;
};

const MyPageGalley = ({ paramsId }: { paramsId: string }) => {
  const [galleryInformation, setGalleryInFormation] = useState<Gallery[]>([]);
  const router = useRouter();
  const goToGalleryDetailPost = (id: any) => {
    router.push({
      pathname: `/galleryDetail/${id}`,
      query: {
        id,
      },
    });
  };

  const getGalleryPost = async () => {
    const q = query(
      collection(dbService, 'gallery'),
      orderBy('createdAt', 'desc'),
    );
    const data = await getDocs(q);
    const getGalleryData = data.docs.map((doc: any) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setGalleryInFormation(getGalleryData);
  };

  useEffect(() => {
    getGalleryPost();

    return () => {
      getGalleryPost();
    };
  }, [authService.currentUser?.uid]);

  console.log(galleryInformation);
  return (
    <LoginStateWrapper>
      {galleryInformation
        .filter((item) => item.userId === paramsId)
        .map((item) => {
          return (
            <GalleryContainer
              key={item.id}
              onClick={() => goToGalleryDetailPost(item.id)}
            >
              <GalleryPhoto src={item.photo} />
            </GalleryContainer>
          );
        })}
    </LoginStateWrapper>
  );
};

export default MyPageGalley;
const LoginStateWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  overflow: auto;
  flex-wrap: wrap;

  padding-bottom: 1vh;
  padding-left: 1.5vw;
  padding-right: 1.5vw;
`;

const GalleryContainer = styled.div`
  margin: 1vh;
`;

const GalleryPhoto = styled.img`
  width: 10vw;
  height: 18vh;
  :hover {
    cursor: pointer;
  }
`;
const Photo = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;
const FollowText = styled.span`
  font-size: 16px;
  text-align: center;
  font-weight: bolder;
`;
const OnLineState = styled.li`
  font-size: 12px;
  ::marker {
    color: green;
    font-size: 16px;
  }
`;
const OFFLineState = styled.li`
  font-size: 12px;
  ::marker {
    font-size: 16px;
  }
`;
const TextBox = styled.div`
  margin-top: 2vh;
  text-align: left;
  width: 20vw;
`;
const StateBox = styled.div`
  margin-top: 3vh;
  text-align: right;
  width: 20vw; ;
`;
