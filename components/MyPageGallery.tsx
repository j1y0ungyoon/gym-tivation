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
  width: 14vw;
  height: 18vh;

  :hover {
    cursor: pointer;
  }
`;
