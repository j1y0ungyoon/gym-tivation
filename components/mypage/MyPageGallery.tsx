// import { Gallery } from '@/pages/myPage/[...params]';
import { useRouter } from 'next/router';
import React from 'react';
import styled from 'styled-components';

type GalleryGet = {
  paramsId: string;
  gallery: Gallery[];
};

const MyPageGalley = ({ paramsId, gallery }: GalleryGet) => {
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
      {gallery
        .filter((item) => item.userId === paramsId)
        .map((item) => {
          return (
            <GalleryContainer
              key={item.id}
              onClick={() => goToGalleryDetailPost(item.id)}
            >
              <GalleryPhoto src={item.photo} />

              <PhotoDate>{String(item.date)}</PhotoDate>
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
  padding-left: 40px;
  gap: 10px;
  width: 100%;
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
  max-width: 190px;
  max-height: 190px;
  position: relative;
  :hover {
    cursor: pointer;
    transform: scale(1.1, 1.1); /* 가로2배 새로 1.2배 로 커짐 */
    transition: 0.3s;
  }
`;

const GalleryPhoto = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 1rem;
  object-fit: cover;
`;
const PhotoDate = styled.button`
  position: absolute;
  bottom: 2%;
  right: 2%;
  color: white;
  font-size: 12px;
  font-weight: 400;
  background-color: black;
  border-radius: 12px;
`;
