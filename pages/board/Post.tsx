import { authService, database, dbService, storage } from '@/firebase';
import {
  addDoc,
  collection,
  doc,
  updateDoc,
  getDoc,
  Firestore,
} from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { getDownloadURL, ref, uploadString } from 'firebase/storage';
import { useRouter } from 'next/router';
import BoardCategory from '@/components/BoardCategory';
import { count } from 'console';

import { runTransaction } from 'firebase/firestore';

const Post = () => {
  const [boardTitle, setBoardTitle] = useState('');
  const [boardContent, setBoardContent] = useState('');
  const [category, setCategory] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageUpload, setImageUpload] = useState(null);
  const [boardPhoto, setBoardPhoto] = useState('');

  const router = useRouter();

  const onChangeBoardTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBoardTitle(event.target.value);
  };

  const onChangeBoardContent = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setBoardContent(event.target.value);
  };

  useEffect(() => {
    uploadBoardImage();
  }, [boardPhoto]);
  //image upload
  const uploadBoardImage = () => {
    //@ts-ignore
    const imageRef = ref(storage, `images/${imageUpload?.name}`);
    const imageDataUrl = localStorage.getItem('imageDataUrl');

    if (imageDataUrl) {
      uploadString(imageRef, imageDataUrl, 'data_url')
        .then((response) => {
          getDownloadURL(response.ref).then((response) => {
            setImageUrl(response);
          });
        })
        .catch((error) => {
          console.log('error', error);
        });
    }
  };
  //input에 바뀌는 이미지  보여주기
  const onChangeImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    //@ts-ignore
    const file = event.target.files[0];
    const reader = new FileReader();

    if (file !== null) {
      //@ts-ignore
      setImageUpload(file);
      reader.readAsDataURL(file);
    }
    reader.onloadend = (finishedEvent: any) => {
      const imageDataUrl = finishedEvent.currentTarget.result;
      localStorage.setItem('imageDataUrl', imageDataUrl);
      //@ts-ignore
      document.getElementById('image').src = imageDataUrl;
      setBoardPhoto(imageDataUrl);
    };
  };
  //Board로 이동
  const goToBoard = () => {
    router.push({
      pathname: `/board`,
    });
  };

  // Create Post
  const onSubmitBoard = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const newPost = {
      title: boardTitle,
      content: boardContent,
      category: category,
      createdAt: Date.now(),
      userId: authService.currentUser?.uid,
      nickName: authService.currentUser?.displayName,
      photo: imageUrl,
      like: [],
      userPhoto: authService.currentUser?.photoURL,
    };

    await addDoc(collection(dbService, 'posts'), newPost)
      .then(() => console.log('post'))
      .catch((error) => {
        console.log('에러 발생!', error);
      });
    //lv 추가 및 lvName 추가
    const id = String(authService.currentUser?.uid);
    try {
      await runTransaction(dbService, async (transaction) => {
        const sfDocRef = doc(dbService, 'profile', id);
        const sfDoc = await transaction.get(sfDocRef);
        console.log('sfdoc', sfDoc);
        if (!sfDoc.exists()) {
          throw '데이터가 없습니다.';
        }
        const newwLvName = sfDoc.data().lvName;
        const newLv = sfDoc.data().lv + 1;
        transaction.update(sfDocRef, { lv: newLv });
        console.log('랩', newLv);
        if (newwLvName === '일반인' && newLv > 4) {
          transaction.update(sfDocRef, { lvName: '헬애기' });
          transaction.update(sfDocRef, { lv: 1 });
        } else if (newwLvName === '헬애기' && newLv > 14) {
          transaction.update(sfDocRef, { lvName: '헬린이' });
          transaction.update(sfDocRef, { lv: 1 });
        } else if (newwLvName === '헬린이' && newLv > 29) {
          transaction.update(sfDocRef, { lvName: '헬른이' });
          transaction.update(sfDocRef, { lv: 1 });
        } else if (newwLvName === '헬른이' && newLv > 59) {
          transaction.update(sfDocRef, { lvName: '헬애비' });
          transaction.update(sfDocRef, { lv: 1 });
        }
      });
    } catch (error: any) {
      alert(error.message);
    }

    uploadBoardImage();
    goToBoard();
  };

  return (
    <>
      <PostWrapper>
        <PostContent onSubmit={onSubmitBoard}>
          <TitleContainer>
            제목:
            <PostTitle onChange={onChangeBoardTitle} value={boardTitle} />
          </TitleContainer>
          <BoardCategory setCategory={setCategory} />
          <ContentContainer>
            <PostImageWrapper>
              <ImageInput
                type="file"
                accept="image/*"
                onChange={onChangeImage}
              />
              <ImagePreview id="image" />
            </PostImageWrapper>
            <ContentInput
              onChange={onChangeBoardContent}
              value={boardContent}
            />
          </ContentContainer>
          <PostButtonWrapper>
            <PostButton type="submit">게시하기</PostButton>
          </PostButtonWrapper>
        </PostContent>
      </PostWrapper>
    </>
  );
};
const PostWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 95vh;
  background-color: white;
  border-radius: 2rem;
`;
const PostContent = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 97%;
  height: 95%;
  background-color: #f2f2f2;
  border-radius: 2rem;
`;
const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 1rem;
  width: 100%;
  font-size: 2rem;
`;
const PostTitle = styled.input`
  width: 80%;
  height: 3rem;
  border-radius: 1rem;
  border: none;
  margin: 1rem;
`;
const ContentContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 80%;
  padding: 2rem;
`;
const ContentInput = styled.textarea`
  display: flex;
  padding: 1rem;
  width: 50%;
  height: 90%;
  border-radius: 2rem;
  font-size: 1.5rem;
  margin: 1rem;
  resize: none;
  border: none;
`;
const PostButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 100%;
  height: 20%;
  padding: 2rem;
`;
const PostButton = styled.button`
  width: 10rem;
  height: 2rem;
  border-radius: 1rem;
  background-color: #d9d9d9;
  margin: 1rem;
  border: none;
`;
const ImageInput = styled.input`
  width: 100%;
  height: 2rem;
`;
const ImagePreview = styled.img`
  margin-top: 1rem;
  width: 100%;
  height: 100%;
  border-radius: 2rem;
`;
const PostImageWrapper = styled.div`
  display: flex;
  width: 50%;
  height: 90%;
  flex-direction: column;
  margin: 1rem;
`;

export default Post;
