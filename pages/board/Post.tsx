import { authService, dbService, storage } from '@/firebase';
import { addDoc, collection } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { getDownloadURL, ref, uploadString } from 'firebase/storage';
import { useRouter } from 'next/router';
import BoardCategory from '@/components/BoardCategory';

import { toast } from 'react-toastify';
const Post = () => {
  const [boardTitle, setBoardTitle] = useState('');
  const [boardContent, setBoardContent] = useState('');
  const [category, setCategory] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageUpload, setImageUpload] = useState(null);
  const [boardPhoto, setBoardPhoto] = useState('');

  const router = useRouter();
  const today = new Date().toLocaleString('ko-KR').slice(0, 20);
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

    if (!boardTitle) {
      toast.warn('제목을 입력해주세요!');
      return;
    }
    if (!boardContent) {
      toast.warn('내용을 입력해주세요!');
      return;
    }
    if (!category) {
      toast.warn('카테고리를 선택해주세요!');
      return;
    }
    const newPost = {
      title: boardTitle,
      content: boardContent,
      category: category,
      createdAt: today,
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
                multiple
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
