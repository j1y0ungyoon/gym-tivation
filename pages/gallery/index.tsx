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
      <PostButton onClick={onClickGalleryPostButton}>오운완 업로드</PostButton>

      <GalleryBoardMain>
        <GalleryBoardContent>
          <GalleryItem galleryPhotos={galleryPhotos} />
        </GalleryBoardContent>
      </GalleryBoardMain>
    </GalleryBoardWrapper>
  );
};
const GalleryBoardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
  width: calc(100vw - 180px);
  height: calc(100vh - 80px);
  background-color: white;
  border-radius: 2rem;
  padding: 0;
`;
const GalleryBoardMain = styled.main`
  margin: 20px;
  display: flex;
  flex-direction: column;
  width: calc(100% - 40px);
  height: calc(100% - 110px);
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
  overflow: auto;
  padding: 10px;
`;
const PostButton = styled.button`
  margin-right: 20px;
  width: 160px;
  height: 40px;
  padding: 0;
  border-radius: 50px;
  border: none;
  background-color: #d9d9d9;
  color: #000;
  :hover {
    background-color: #000;
    color: #fff;
  }
`;

export default Gallery;
