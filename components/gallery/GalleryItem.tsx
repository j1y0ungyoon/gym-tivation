import styled from 'styled-components';

import GalleryPost from './GalleryPost';
import { GalleryBoardPostType } from '@/type';
interface GalleryItemProps {
  galleryPhotos: GalleryBoardPostType[];
  data?: any;
}
const GalleryItem = ({ data }: any) => {
  return (
    <GalleryList>
      {data?.map((galleryPhotos: any) => {
        return (
          <GalleryPost
            key={galleryPhotos.id}
            id={galleryPhotos.id}
            photo={galleryPhotos.photo}
            userPhoto={galleryPhotos.userPhoto}
            nickName={galleryPhotos.nickName}
            content={galleryPhotos.content}
            userId={galleryPhotos.userId}
          />
        );
      })}
    </GalleryList>
  );
};

const GalleryList = styled.div`
  display: flex;
  flex-wrap: wrap;

  height: 100%;
  border-radius: 0.5rem;
  overflow-y: auto;
  overflow-x: hidden;

  justify-content: center;
  align-content: flex-start;
  gap: 16px;
  ::-webkit-scrollbar {
    width: 8px;
  }
  ::-webkit-scrollbar-thumb {
    background-color: #000;
    border-radius: 10px;
  }
  ::-webkit-scrollbar-track {
    background-color: transparent;
    border-radius: 10px;
    margin: 30px 0;
  }
`;

export default GalleryItem;
