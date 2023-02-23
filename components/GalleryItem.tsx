import styled from 'styled-components';

import GalleryPost from './GalleryPost';
import { GalleryBoardPostType } from '@/type';
interface GalleryItemProps {
  galleryPhotos: GalleryBoardPostType[];
}
const GalleryItem = ({ galleryPhotos }: GalleryItemProps) => {
  return (
    <GalleryList>
      {galleryPhotos.map((galleryPhotos) => {
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
  width: 95%;
  height: 100%;
  margin: 0.5rem;
  border-radius: 0.5rem;
  overflow: scroll;
  margin: 0px;
  flex-wrap: wrap;
`;

export default GalleryItem;
