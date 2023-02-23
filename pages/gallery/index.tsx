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
    <>
      <GalleryBoardWrapper>
        <PostButton onClick={onClickGalleryPostButton}>
          오운완 업로드
        </PostButton>
        <GalleryBoardMain>
          <GalleryBoardContent>
            <GalleryItem galleryPhotos={galleryPhotos} />
          </GalleryBoardContent>
          <PostButtonContainer></PostButtonContainer>
        </GalleryBoardMain>
      </GalleryBoardWrapper>
    </>
  );
};
const GalleryBoardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
  width: 100vw;
  height: 95vh;
  background-color: white;
  border-radius: 2rem;
`;
const GalleryBoardMain = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 95%;
  height: 90%;
  background-color: #d9d9d9;
  border-radius: 2rem;
`;
const GalleryBoardContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow: scroll;
`;
const PostButtonContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
`;
const PostButton = styled.button`
  width: 10rem;
  height: 2rem;
  border-radius: 1rem;
  background-color: #d9d9d9;
  margin: 1rem;
  border: none;
`;

export default Gallery;
