import { GalleryBoardPostType } from '@/pages/type';
import { useRouter } from 'next/router';
import styled from 'styled-components';

const GalleryPost = ({ id, photo }: GalleryBoardPostType) => {
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
    <GalleryPostWrapper key={id} onClick={() => goToGalleryDetailPost(id)}>
      <GalleryImage src={photo}></GalleryImage>
    </GalleryPostWrapper>
  );
};
const GalleryPostWrapper = styled.div`
  margin: 1rem;
  width: 14rem;
  height: 14rem;
  display: flex;
  flex-direction: row;
`;
const GalleryImage = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 1rem;
  object-fit: cover;
`;
export default GalleryPost;
