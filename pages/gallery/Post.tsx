import { authService, dbService, storage } from '@/firebase';
import { runTransaction, doc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { nanoid } from 'nanoid';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import mouseClick from '../../public/assets/icons/mouseClick.png';
import imageCompression from 'browser-image-compression';
import { useMutation, useQueryClient } from 'react-query';
import { addGalleryPost } from '../api/api';
import useModal from '@/hooks/useModal';
import { GLOBAL_MODAL_TYPES } from '@/recoil/modalState';
const Post = () => {
  const queryClient = useQueryClient();
  const [imageUpload, setImageUpload] = useState<File | undefined>();
  const [galleryTitle, setGalleryTitle] = useState('');
  const [galleryContent, setGalleryContent] = useState('');
  const [galleryPhoto, setGalleryPhoto] = useState('');
  const router = useRouter();
  const { mutate, isLoading } = useMutation(addGalleryPost);
  const today = new Date().toLocaleString('ko-KR').slice(0, 20);

  const { showModal } = useModal();
  // const displayName = authService.currentUser?.displayName;
  //image upload

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
  const imageCompress = async (image: File) => {
    const options = {
      maxSizeMB: 1,
      maxwidthOrHeight: 1920,
      useWebWorker: true,
    };
    try {
      const compressedFile = await imageCompression(image, options);
      console.log(
        'compressedFile instanceof Blob',
        compressedFile instanceof Blob,
      ); // true
      console.log(
        `compressedFile size ${compressedFile.size / 1024 / 1024} MB`,
      ); // smaller than maxSizeMB

      return compressedFile;
    } catch (error) {
      console.log(error);
    }
  };

  const onChangeUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const originalImage = event.target.files?.[0];
    console.log('original size', originalImage?.size);
    if (!originalImage) return;
    const compressedImage = await imageCompress(originalImage);
    setImageUpload(compressedImage);
  };

  useEffect(() => {
    const imageRef = ref(storage, `gallery/${nanoid()}}`);
    if (!imageUpload) return;
    uploadBytes(imageRef, imageUpload).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {
        setGalleryPhoto(url);
      });
    });
  }, [imageUpload]);

  useEffect(() => {
    if (!authService.currentUser) {
      // toast.info('로그인을 먼저 해주세요!');
      showModal({
        modalType: GLOBAL_MODAL_TYPES.LoginRequiredModal,
        modalProps: { contentText: '로그인을 먼저 해주세요!' },
      });
      router.push('/gallery');
    }
  }, []);
  if (!authService.currentUser) {
    return <div>로그인이 필요합니다.</div>;
  }

  //Create
  const onSubmitGallery = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!galleryTitle) {
      // toast.warn('제목을 입력해주세요');
      showModal({
        modalType: GLOBAL_MODAL_TYPES.AlertModal,
        modalProps: { contentText: '제목을 입력해주세요!' },
      });
      return;
    }
    // if (!galleryContent) {
    //   toast.warn('내용을 입력해주세요');
    //   return;
    // }
    if (!galleryPhoto) {
      // toast.warn('사진을 선택해주세요');
      showModal({
        modalType: GLOBAL_MODAL_TYPES.AlertModal,
        modalProps: { contentText: '사진을 선택해주세요!' },
      });
      return;
    }

    const newGalleryPost = {
      title: galleryTitle,
      content: galleryContent,
      createdAt: today,
      userId: authService.currentUser?.uid,
      nickName: authService.currentUser?.displayName,
      photo: galleryPhoto,
      like: [],
      userPhoto: authService.currentUser?.photoURL,
      comment: 0,
    };
    mutate(newGalleryPost, {
      onSuccess: () => {
        queryClient.invalidateQueries('getGalleryData', {
          refetchActive: true,
        });
      },
    });
    if (isLoading) {
      return <div>로딩중입니다</div>;
    }

    //lv 추가 및 lvName 추가
    const id = String(authService.currentUser?.uid);
    try {
      await runTransaction(dbService, async (transaction) => {
        const sfDocRef = doc(dbService, 'profile', id);
        const sfDoc = await transaction.get(sfDocRef);

        if (!sfDoc.exists()) {
          throw '데이터가 없습니다.';
        }
        const newwLvName = sfDoc.data().lvName;
        const newLv = sfDoc.data().lv + 1;
        transaction.update(sfDocRef, { lv: newLv });
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

    goToGallery();
    setGalleryPhoto('');
  };

  return (
    <GalleryPostWrapper>
      <GalleryPostContainer>
        <GalleryContent>
          <GalleryPostContent onSubmit={onSubmitGallery}>
            <GalleryTitleContainer>
              <Title>제목 </Title>

              <InputDiv>
                <GalleryPostTitle
                  onChange={onChangeGalleryTitle}
                  value={galleryTitle}
                />
              </InputDiv>
            </GalleryTitleContainer>

            <GalleryContentContainer>
              <GalleryImageWarpper htmlFor="input-file">
                <GalleryImagePreview src={galleryPhoto} />
                <GalleryImageInput
                  id="input-file"
                  type="file"
                  accept="image/*"
                  onChange={onChangeUpload}
                />
                {/* <Dropzone
                  selectedImages={selectedImages}
                  setSelectedImages={setSelectedImages}
                /> */}
              </GalleryImageWarpper>
              {/* <GalleryContentInput
            placeholder="글을 입력해주세요"
            onChange={onChangeGalleryContent}
            value={galleryContent}
          /> */}
            </GalleryContentContainer>
            <GalleryButtonWrapper>
              <GalleryPostButton type="submit">게시하기</GalleryPostButton>
            </GalleryButtonWrapper>
          </GalleryPostContent>
        </GalleryContent>
      </GalleryPostContainer>
    </GalleryPostWrapper>
  );
};

const GalleryPostWrapper = styled.div`
  ${({ theme }) => theme.mainLayout.wrapper};
  align-items: center;
  justify-content: center;
`;
const GalleryContent = styled.div`
  background-color: white;
  border-radius: ${({ theme }) => theme.borderRadius.radius100};
  width: 95%;
  height: 95%;
  border: 1px solid black;
  margin: 20px 20px;
`;
const GalleryPostContainer = styled.div`
  ${({ theme }) => theme.mainLayout.container};
  border-radius: ${({ theme }) => theme.borderRadius.radius100};
  display: flex;
  flex-direction: column;
`;
const GalleryPostContent = styled.form`
  flex-direction: column;
  border-radius: ${({ theme }) => theme.borderRadius.radius100};
  align-items: center;
  height: 90%;
  margin: 20px;
`;
const Title = styled.span`
  display: flex;
  flex-direction: column;
  font-size: ${({ theme }) => theme.font.font70};
`;
const InputDiv = styled.div`
  ${({ theme }) => theme.inputDiv};
  background-color: white;
  margin: 10px 0;
  margin-left: 62px;
  width: 85%;
  border: 1px solid black;
`;
const GalleryTitleContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row;
  margin-left: 50px;
`;
const GalleryPostTitle = styled.input`
  ${({ theme }) => theme.input}
  background-color:white;
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
  ${({ theme }) => theme.btn.btn50}
  border:1px solid black;
`;
const GalleryImageInput = styled.input`
  display: none;
`;
const GalleryImageWarpper = styled.label`
  display: flex;
  width: 100%;
  height: 90%;
  flex-direction: column;
  margin: 1rem;
  &:hover {
    background-image: url('/assets/icons/mouseClick.png');
    background-repeat: no-repeat;
    background-position: center center;
  }
`;

const GalleryImagePreview = styled.img`
  margin-top: 1rem;
  width: 100%;
  height: 100%;
  border-radius: ${({ theme }) => theme.borderRadius.radius50};
  border: 1px solid black;
  overflow: hidden;
  object-fit: scale-down;
`;

export default Post;
