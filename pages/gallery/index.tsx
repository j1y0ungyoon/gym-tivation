import GalleryItem from '@/components/GalleryItem';
import { dbService } from '@/firebase';
import { query } from 'firebase/database';
import { collection, onSnapshot, orderBy } from 'firebase/firestore';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const Gallery = () => {
  const [galleryPhotos, setGalleryPhotos] = useState([]);
  const router = useRouter();

  const onClickGalleryPostButton = () => {
    router.push({
      pathname: `/gallery/Post`,
    });
  };
  const getGalleryPost = () => {
    const q = query(
      //@ts-ignore
      collection(dbService, 'gallery'),
      orderBy('createdAt', 'desc'),
    );
    //@ts-ignore
    const unsubscribe = onSnapshot(q, (snapshot: any) => {
      const newGalleryPosts = snapshot.docs.map((doc: any) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setGalleryPhotos(newGalleryPosts);
    });
    return unsubscribe;
  };

  useEffect(() => {
    const unsubscribe = getGalleryPost();

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <GalleryBoardWrapper>
      <GalleryBoardContainer>
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
              <GalleryItem galleryPhotos={galleryPhotos} />
            </GalleryBoardContent>
          </GalleryContentWrapper>
        </GalleryBoardMain>
      </GalleryBoardContainer>
    </GalleryBoardWrapper>
  );
};
const GalleryBoardWrapper = styled.div`
  ${({ theme }) => theme.mainLayout.wrapper};
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
const GalleryContentWrapper = styled.div`
  border-radius: ${({ theme }) => theme.borderRadius.radius100};
  flex-direction: column;
  border: 1px solid black;
  display: flex;
  min-height: 90%;
  background-color: white;
`;
const GalleryBoardContainer = styled.div`
  ${({ theme }) => theme.mainLayout.container};
  overflow: auto;
`;
const GalleryBoardMain = styled.main`
  width: 95%;
`;
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
