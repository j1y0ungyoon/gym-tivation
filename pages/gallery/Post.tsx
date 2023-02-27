import { authService, dbService, storage } from '@/firebase';
import { addDoc, collection, runTransaction, doc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadString } from 'firebase/storage';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import styled from 'styled-components';

const Post = () => {
  const [imageUrl, setImageUrl] = useState('');
  const [imageUpload, setImageUpload] = useState(null);
  const [galleryTitle, setGalleryTitle] = useState('');
  const [galleryContent, setGalleryContent] = useState('');
  const [galleryPhoto, setGalleryPhoto] = useState('');
  const router = useRouter();
  const today = new Date().toLocaleString('ko-KR').slice(0, 20);
  // const displayName = authService.currentUser?.displayName;
  //image upload
  const uploadBoardImage = () => {
    //@ts-ignore
    const imageRef = ref(storage, `gallery/${imageUpload?.name}`);
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

  useEffect(() => {
    uploadBoardImage();
  }, [galleryPhoto]);

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
      setGalleryPhoto(imageDataUrl);
    };
  };
  const onChangeGalleryTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGalleryTitle(event.target.value);
  };
  const onChangeGalleryContent = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setGalleryContent(event.target.value);
  };

  const goToGallery = () => {
    router.push({
      pathname: `/gallery`,
    });
  };

  //Create
  const onSubmitGallery = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!galleryContent) {
      toast.warn('제목을 입력해주세요');
      return;
    }
    if (!galleryContent) {
      toast.warn('내용을 입력해주세요');
      return;
    }
    if (!galleryPhoto) {
      toast.warn('사진을 선택해주세요');
      return;
    }
    const newGalleryPost = {
      title: galleryTitle,
      content: galleryContent,
      createdAt: today,
      userId: authService.currentUser?.uid,
      nickName: authService.currentUser?.displayName,
      photo: imageUrl,
      like: [],
      userPhoto: authService.currentUser?.photoURL,
    };

    await addDoc(collection(dbService, 'gallery'), newGalleryPost)
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
    goToGallery();
  };

  return (
    <GalleryPostWrapper>
      <GalleryPostContent onSubmit={onSubmitGallery}>
        <GalleryTitleContainer>
          제목:
          <GalleryPostTitle
            onChange={onChangeGalleryTitle}
            value={galleryTitle}
          />
        </GalleryTitleContainer>
        <GalleryContentContainer>
          <GalleryImageWarpper>
            <GalleryImageInput
              type="file"
              accept="image/*"
              onChange={onChangeImage}
            />

            <GalleryImagePreview id="image" />
          </GalleryImageWarpper>
          <GalleryContentInput
            placeholder="글을 입력해주세요"
            onChange={onChangeGalleryContent}
            value={galleryContent}
          />
        </GalleryContentContainer>
        <GalleryButtonWrapper>
          <GalleryPostButton type="submit">게시하기</GalleryPostButton>
        </GalleryButtonWrapper>
      </GalleryPostContent>
    </GalleryPostWrapper>
  );
};

const GalleryPostWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 95vh;
  background-color: white;
  border-radius: 2rem;
`;
const GalleryPostContent = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 97%;
  height: 95%;
  background-color: #f2f2f2;
  border-radius: 2rem;
`;
const GalleryTitleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 1rem;
  width: 100%;
  font-size: 2rem;
`;
const GalleryPostTitle = styled.input`
  width: 80%;
  height: 3rem;
  border-radius: 1rem;
  border: none;
  margin: 1rem;
`;
const GalleryContentContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 80%;
  padding: 2rem;
`;
const GalleryContentInput = styled.textarea`
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
const GalleryButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 100%;
  height: 20%;
  padding: 2rem;
`;
const GalleryPostButton = styled.button`
  width: 10rem;
  height: 2rem;
  border-radius: 1rem;
  background-color: #d9d9d9;
  margin: 1rem;
  border: none;
`;
const GalleryImageInput = styled.input`
  width: 100%;
  height: 2rem;
`;
const GalleryImageWarpper = styled.div`
  display: flex;
  width: 50%;
  height: 90%;
  flex-direction: column;
  margin: 1rem;
`;

const GalleryImagePreview = styled.img`
  margin-top: 1rem;
  width: 100%;
  height: 100%;
  border-radius: 2rem;
`;

export default Post;
