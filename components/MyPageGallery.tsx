import { Gallery } from '@/pages/myPage/[...params]';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

type GalleryGet = {
  paramsId: string;
  galleryInformation: Gallery[];
};

const MyPageGalley = ({ paramsId, galleryInformation }: GalleryGet) => {
  // const [galleryInformation, setGalleryInFormation] = useState<Gallery[]>([]);
  const router = useRouter();
  const goToGalleryDetailPost = (id: any) => {
    router.push({
      pathname: `/galleryDetail/${id}`,
      query: {
        id,
      },
    });
  };

  return (
    <MyPageGalleyWrapper>
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
    </MyPageGalleyWrapper>
  );
};

export default MyPageGalley;
const MyPageGalleyWrapper = styled.div`
  width: 100%;
  height: 100%;
  padding-bottom: 1vh;
  padding-left: 1.5vw;
  padding-right: 1.5vw;
  overflow: auto;
  ::-webkit-scrollbar {
    display: none;
  }
`;

const GalleryContainer = styled.div`
  width: 22.5%;
  height: 25%;
  margin: 1vh;
  float: left;
`;

const GalleryPhoto = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 1rem;
  :hover {
    cursor: pointer;
    transform: scale(1.1, 1.1); /* 가로2배 새로 1.2배 로 커짐 */
    transition: 0.3s;
  }
`;
