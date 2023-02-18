import { dbService, storage } from '@/firebase';

import { addDoc, collection } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { getDownloadURL, ref, uploadString } from 'firebase/storage';
import { useRouter } from 'next/router';
import BoardCategory from '@/components/BoardCategory';

// interface Postporps {
//   boardTitle: string;
//   boardContent: string;
//   userId?: string;
//   comment?: string;
//   creatAt?: number;
//   nickName?: string;
//   category: string;
//   setCategory: React.Dispatch<React.SetStateAction<string>>;
// }

const Post = () => {
  const [boardTitle, setBoardTitle] = useState('');
  const [boardContent, setBoardContent] = useState('');
  const [category, setCategory] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageUpload, setImageUpload] = useState(null);
  const [imageCheck, setImageCheck] = useState('');

  const router = useRouter();

  //   const userid = authService.currentUser?.uid;
  //   const displayName = authService.currentUser?.displayName;

  const onChangeBoardTitle = (event) => {
    setBoardTitle(event.target.value);
  };

  const onChangeBoardContent = (event) => {
    setBoardContent(event.target.value);
  };

  useEffect(() => {
    uploadBoardImage();
    console.log('test가 업데이트 되었습니다.');
  }, [imageCheck]);

  const uploadBoardImage = () => {
    const imageRef = ref(storage, `images/${imageUpload?.name}`);
    const imageDataUrl = localStorage.getItem('imageDataUrl');

    if (imageDataUrl) {
      uploadString(imageRef, imageDataUrl, 'data_url')
        .then((response) => {
          getDownloadURL(response.ref).then((response) => {
            setImageUrl(response);
            console.log('URL : ', response);
          });
        })
        .catch((error) => {
          console.log('error', error);
        });
    }
  };
  const onChangeImage = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    if (file !== null) {
      setImageUpload(file);
      reader.readAsDataURL(file);
    }
    reader.onloadend = (finishedEvent) => {
      const imageDataUrl = finishedEvent.currentTarget.result;
      localStorage.setItem('imageDataUrl', imageDataUrl);
      document.getElementById('image').src = imageDataUrl;
      setImageCheck(imageDataUrl);
    };
  };

  const goToBoard = () => {
    router.push({
      pathname: `/board`,
    });
  };

  // Create
  const onSubmitBoard = async (event) => {
    event.preventDefault();
    const newPost = {
      title: boardTitle,
      content: boardContent,
      category: category,
      createdAt: Date.now(),
      // userId: uid,
      //   nickName: displayName,
      photoUrl: imageUrl,
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
          <BoardCategory category={category} setCategory={setCategory} />
          <ContentContainer>
            <ImageInput type="file" onChange={onChangeImage} />
            <ImagePreview id="image"></ImagePreview>
            <ContentInput
              onChange={onChangeBoardContent}
              value={boardContent}
            />
          </ContentContainer>

          <PostButton type="submit">게시하기</PostButton>
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
  border: 1px solid black;
  background-color: white;
  border-radius: 2rem;
`;
const PostContent = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 97%;
  height: 95%;
  background-color: pink;
  border-radius: 2rem;
`;
const TitleContainer = styled.div``;
const PostTitle = styled.input`
  width: 30rem;
`;
const ContentContainer = styled.div``;
const ContentInput = styled.textarea``;
const PostButton = styled.button``;
const ImageInput = styled.input``;
const ImagePreview = styled.img`
  width: 150px;
  height: 150px;
`;

export default Post;
