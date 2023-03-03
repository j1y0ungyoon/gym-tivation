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
              <PhotoDate>{item.createdAt}</PhotoDate>
            </GalleryContainer>
          );
        })}
    </MyPageGalleyWrapper>
  );
};

export default MyPageGalley;
const MyPageGalleyWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  padding-top: 20px;
  padding-left: 20px;
  gap: 10px;
  width: 96.8%;
  height: 100%;
  overflow: auto;
  ::-webkit-scrollbar {
    display: none;
  }
`;

const GalleryContainer = styled.div`
  width: 23%;
  height: 100%;
  min-width: 150px;
  min-height: 150px;
  max-width: 180px;
  max-height: 180px;
  position: relative;
`;

const GalleryPhoto = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 1rem;
  object-fit: cover;
  :hover {
    cursor: pointer;
    transform: scale(1.1, 1.1); /* 가로2배 새로 1.2배 로 커짐 */
    transition: 0.3s;
  }
`;
const PhotoDate = styled.p`
  position: absolute;
  top: 2%;
  left: 6%;
  color: white;
  font-size: 14px;
  font-weight: 400;
`;
