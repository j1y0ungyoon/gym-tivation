import styled from 'styled-components';

import GalleryPost from './GalleryPost';
import { GalleryBoardPostType } from '@/type';
interface GalleryItemProps {
  galleryPhotos: GalleryBoardPostType[];
  data?: any;
}
const GalleryItem = ({ data }: GalleryItemProps) => {
  return (
    <GalleryList>
      {data?.map((galleryPhotos: any) => {
        return (
          <GalleryPost
            key={galleryPhotos.id}
            id={galleryPhotos.id}
            photo={galleryPhotos.photo}
          />
        );
      })}
    </GalleryList>
  );
};

const GalleryList = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  height: 100%;
  border-radius: 0.5rem;
  overflow-y: auto;
  justify-content: center;
  align-content: flex-start;
`;

export default GalleryItem;
