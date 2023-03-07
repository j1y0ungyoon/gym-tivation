import Loading from '@/components/common/globalModal/Loading';
import GalleryItem from '@/components/gallery/GalleryItem';
import { useRouter } from 'next/router';
import { useQuery } from 'react-query';
import styled from 'styled-components';
import { getGalleryPosts } from '../api/api';

const Gallery = () => {
  const router = useRouter();
  const { data, isLoading } = useQuery(['getGalleryData'], getGalleryPosts);

  const onClickGalleryPostButton = () => {
    router.push({
      pathname: `/gallery/Post`,
    });
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <GalleryBoardWrapper>
      {/* <GalleryBoardContainer> */}
      <GalleryBoardMain>
        <ButtonWrapper>
          <ButtonContainer>
            <PostButton onClick={onClickGalleryPostButton}>
              오운완 업로드
            </PostButton>
          </ButtonContainer>
        </ButtonWrapper>
        <GalleryContentWrapper>
          <GalleryBoardContent>
            <GalleryItem data={data} />
          </GalleryBoardContent>
        </GalleryContentWrapper>
      </GalleryBoardMain>
      {/* </GalleryBoardContainer> */}
    </GalleryBoardWrapper>
  );
};
const GalleryBoardWrapper = styled.div`
  ${({ theme }) => theme.mainLayout.wrapper};
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
const GalleryBoardMain = styled.main`
  ${({ theme }) => theme.mainLayout.container}
  display:flex;
  align-items: center;
  flex-direction: column;
  align-items: center;
`;
const GalleryContentWrapper = styled.div`
  border-radius: ${({ theme }) => theme.borderRadius.radius100};
  flex-direction: column;
  border: 1px solid black;
  display: flex;
  height: calc(100% - 120px);
  width: 100%;
  background-color: white;
`;
const GalleryBoardContainer = styled.div``;

const GalleryBoardContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding: 10px;
`;
const ButtonWrapper = styled.div`
  display: flex;
  width: 100%;
  margin: 1rem;
`;
const ButtonContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
`;
const PostButton = styled.button`
  ${({ theme }) => theme.btn.btn100}
`;

export default Gallery;
