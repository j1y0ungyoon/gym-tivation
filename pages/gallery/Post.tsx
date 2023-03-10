import { authService, dbService, storage } from '@/firebase';
import {
  runTransaction,
  doc,
  query,
  collection,
  getDocs,
} from 'firebase/firestore';
import {
  getDownloadURL,
  ref,
  uploadBytes,
  uploadBytesResumable,
} from 'firebase/storage';
import { nanoid } from 'nanoid';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import mouseClick from '../../public/assets/icons/mouseClick.png';
import imageCompression from 'browser-image-compression';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import {
  addGalleryPost,
  getFetchedGalleryDetail,
  getProfile,
} from '../api/api';
import useModal from '@/hooks/useModal';
import { GLOBAL_MODAL_TYPES } from '@/recoil/modalState';
import Loading from '@/components/common/globalModal/Loading';
import { Snapshot } from 'recoil';
import GlobalModal from '@/components/common/globalModal/GlobalModal';
import Image from 'next/image';
import { theme } from '@/styles/theme';
interface PostProps {
  item: any;
}
const Post = () => {
  const queryClient = useQueryClient();
  const [imageUpload, setImageUpload] = useState<File | undefined>();
  const [galleryTitle, setGalleryTitle] = useState('');
  const [galleryContent, setGalleryContent] = useState('');
  const [galleryPhoto, setGalleryPhoto] = useState('');
  const router = useRouter();
  const { mutate, isLoading } = useMutation(addGalleryPost);
  const today = new Date().toLocaleString('ko-KR').slice(0, -3);
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const { data } = useQuery(['profile'], getProfile);
  const user = authService.currentUser;

  const { showModal } = useModal();
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

  const onChangeUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    const file = event.target.files[0];
    const options = {
      maxSizeMB: 1,
      maxwidthOrHeight: 1920,
      useWebWorker: true,
    };
    const compressionFile = await imageCompression(file, options);
    if (!compressionFile) return null;
    const imageRef = ref(storage, `gallery/${nanoid()}}`);
    uploadBytesResumable(imageRef, compressionFile).on(
      'state_changed',
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
        );
        setProgressPercent(progress);
      },
      (error) => {
        switch (error.code) {
          case 'sotrage/canceled':
            alert('업로드 취소');
            break;
        }
      },
      () => {
        event.target.value = '';
        getDownloadURL(imageRef).then((downloadURL) => {
          setGalleryPhoto(downloadURL);
        });
      },
    );
    console.log('original size', file?.size);
    console.log(`compressedFile size ${compressionFile.size / 1024 / 1024} MB`);
  };

  useEffect(() => {
    if (!authService.currentUser) {
      showModal({
        modalType: GLOBAL_MODAL_TYPES.LoginRequiredModal,
        modalProps: { contentText: '로그인 후 이용해주세요!' },
      });
      router.push('/gallery');
    }
  }, [authService.currentUser]);
  if (!authService.currentUser) {
    return <div>로그인이 필요합니다.</div>;
  }

  //Create
  const onSubmitGallery = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!galleryContent) {
      showModal({
        modalType: GLOBAL_MODAL_TYPES.AlertModal,
        modalProps: { contentText: '내용을 입력해주세요!' },
      });
      return;
    }
    if (!galleryPhoto) {
      showModal({
        modalType: GLOBAL_MODAL_TYPES.AlertModal,
        modalProps: { contentText: '사진을 선택해주세요!' },
      });
      return;
    }

    const newGalleryPost = {
      title: galleryTitle,
      content: galleryContent,
      createdAt: Date.now(),
      userId: user?.uid,
      nickName: user?.displayName,
      photo: galleryPhoto,
      like: [],
      userPhoto: user?.photoURL,
      comment: 0,
      date: today,
    };
    mutate(newGalleryPost, {
      onSuccess: () => {
        queryClient.invalidateQueries('getGalleryData', {
          refetchActive: true,
        });
      },
    });
    if (isLoading) {
      return <Loading />;
    }

    //lv 추가 및 lvName 추가
    const id = String(user?.uid);
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
  //displayname, lv, lvname, photourl

  const userInformation: any = data?.filter((item) => item.id === user?.uid);

  return (
    <GalleryPostWrapper>
      <GalleryPostContainer>
        <GalleryPostContent onSubmit={onSubmitGallery}>
          <UpperWrapper>
            <GalleryButtonWrapper>
              <GalleryPostButton type="submit">업로드</GalleryPostButton>
            </GalleryButtonWrapper>
          </UpperWrapper>
          <GalleryContentContainer>
            <GalleryImageWarpper htmlFor="input-file">
              {galleryPhoto ? (
                <GalleryImagePreview src={galleryPhoto} />
              ) : (
                <GalleryDefaultImagePreview src="/assets/images/galleryUploadImage.svg" />
              )}
              {progressPercent > 1 && 99 > progressPercent ? (
                <>
                  <ProgressPercent>
                    <div>
                      <div>업로드중..</div>
                      <div>{progressPercent}</div>
                    </div>
                  </ProgressPercent>
                </>
              ) : null}
              <GalleryImageInput
                id="input-file"
                type="file"
                accept="image/*"
                onChange={onChangeUpload}
              />
            </GalleryImageWarpper>
            <ContentWrapper>
              <UserInfo>
                <UserPhoto src={user?.photoURL}></UserPhoto>
                <UserNameInfo>
                  <UserName>{authService.currentUser.displayName}</UserName>
                  <div>
                    <UserLv>
                      Lv {userInformation?.map((item: any) => item.lv)}
                    </UserLv>
                    <UserLvName>
                      {userInformation?.map((item: any) => item.lvName)}
                    </UserLvName>
                  </div>
                </UserNameInfo>
              </UserInfo>
              <GalleryInputWrapper>
                <GalleryContentInput
                  placeholder="글 입력하기"
                  onChange={onChangeGalleryContent}
                  value={galleryContent}
                />
              </GalleryInputWrapper>
            </ContentWrapper>
          </GalleryContentContainer>
        </GalleryPostContent>
        {/* </GalleryContent> */}
      </GalleryPostContainer>
    </GalleryPostWrapper>
  );
};
const UserInfo = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  height: 5%;
  padding: 20px 30px;
  margin: 20px 0;
`;
const UserNameInfo = styled.span`
  display: flex;
  flex-direction: column;
`;
const UserName = styled.span`
  margin-right: 20px;
`;
const UserPhoto = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50px;
  margin-right: 10px;
  object-fit: cover;
`;
const UserLv = styled.span`
  margin-right: 5px;
  font-size: ${({ theme }) => theme.font.font10};
`;
const UserLvName = styled.span`
  font-size: ${({ theme }) => theme.font.font10};
`;
const UpperWrapper = styled.div`
  background-color: ${({ theme }) => theme.color.backgroundColor};
  border-radius: 40px 40px 0 0;
  display: flex;
  justify-content: flex-end;
  width: 100%;
  height: 5%;
  border-bottom: 1px solid black;
`;
const BottomWrapper = styled.div``;

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
  height: calc(100% - 40px);
`;
const GalleryPostContent = styled.form`
  border-radius: ${({ theme }) => theme.borderRadius.radius100};
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  background-color: white;
  border: 1px solid black;
  box-shadow: -2px 2px 0px 1px #000000;
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
  height: 95%;
`;
const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 35%;
  background-color: ${({ theme }) => theme.color.backgroundColor};
  border-radius: 0 0 40px 0;
`;
const GalleryInputWrapper = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  height: 95%;

  font-size: ${({ theme }) => theme.font.font10};
  background-color: ${({ theme }) => theme.color.backgroundColor};
  border-radius: 0 0 40px 0;
`;
const GalleryContentInput = styled.textarea`
  display: flex;
  width: 90%;
  height: 70%;
  font-size: ${({ theme }) => theme.font.font10};
  background-color: white;
  border-radius: 20px;
  box-shadow: -2px 2px 0px 1px #000000;
  border: 1px solid black;
  padding: 20px;
  outline: none;
  resize: none;
`;
const GalleryButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 100%;
  height: 100%;
  margin: 0 20px;
`;
const GalleryPostButton = styled.button`
  border: none;
  background-color: transparent;
  cursor: pointer;
  color: ${({ theme }) => theme.color.brandColor100};
  font-weight: 600;
  :hover {
    color: #0094ff;
  }
`;
const GalleryImageInput = styled.input`
  display: none;
`;
const GalleryImageWarpper = styled.label`
  display: flex;
  width: 65%;
  height: 100%;
  flex-direction: column;
  border-right: 1px solid black;
  border-radius: 0 0 0 40px;
  /* position: relative; */
`;

const ProgressPercent = styled.div`
  display: flex;
  position: absolute;
  align-items: center;
  justify-content: center;
  background-color: #000000aa;
  color: white;
  z-index: 200;
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
`;
const GalleryDefaultImagePreview = styled.img`
  border: none;
  width: 100%;
  height: 100%;
  overflow: hidden;
  object-fit: scale-down;
  /* background-image: url('/assets/images/galleryUploadImage.svg');
  background-repeat: no-repeat;
  background-position: center center; */
  :hover {
    transform: scale(1.05s, 1.05);
    transition: 0.3s;
  }
`;
const GalleryImagePreview = styled.img`
  border: none;
  width: 100%;
  height: 100%;
  overflow: hidden;
  object-fit: cover;
  border-radius: 0 0 0 40px;
  /* background-image: url('/assets/images/galleryUploadImage.svg');
  background-repeat: no-repeat;
  background-position: center center; */
  :hover {
    transform: scale(0.99, 0.99);
    transition: 0.3s;
  }
`;

export default Post;
