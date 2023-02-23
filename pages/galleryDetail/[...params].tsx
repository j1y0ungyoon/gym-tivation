import { dbService, storage } from '@/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadString,
} from 'firebase/storage';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { deleteGalleryPost, editGalleryBoard } from '../api/api';

interface GalleryDetailProps {
  id?: string;
  photo?: string;
  content?: string;
  title?: string;
  createdAt?: string;
  item?: any;
  like?: string[];
}
const GalleryDetail = ({ params }: any) => {
  const [detailGalleryPost, setDetailGalleryPost] =
    useState<GalleryDetailProps>();
  const [changeGalleryPost, setChangeGalleryPost] = useState(false);
  const [editGalleryTitle, setEditGalleryTitle] = useState<string | undefined>(
    '',
  );
  const [editGalleryPhoto, setEditGalleryPhoto] = useState<string | any>('');
  const [prevPhotoUrl, setPrevPhotoUrl] = useState('');
  const [editGalleryContent, setEditGalleryContent] = useState<string | any>(
    '',
  );
  const [editImageUpload, setEditImageUpload] = useState('');
  const [editImageUrl, setEditImageUrl] = useState('');

  const [id] = params;
  const router = useRouter();

  const onClickDeleteGalleryPost = async () => {
    try {
      deleteGalleryPost({ id: id, photo: detailGalleryPost?.photo });
      router.push('/gallery');
    } catch (error) {
      console.log('다시 확인해주세요', error);
    }
  };
  const getEditPost = () => {
    const unsubscribe = onSnapshot(doc(dbService, 'gallery', id), (doc) => {
      const data = doc.data();

      const getGalleryPost: any = {
        id: doc.id,
        title: data?.title,
        content: data?.content,
        createdAt: data?.createdAt,
        photo: data?.photo,
        like: data?.like,
      };

      setDetailGalleryPost(getGalleryPost);
      setPrevPhotoUrl(data?.photo);
    });
    return () => {
      unsubscribe();
    };
  };
  useEffect(() => {
    const unsubscribe = getEditPost();

    return () => {
      unsubscribe();
    };
  }, []);
  const onChangeEditGalleryTitle = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setEditGalleryTitle(event.target.value);
  };

  const onChangeEditGalleryContent = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setEditGalleryContent(event.target.value);
  };
  //갤러리 수정 업데이트
  const onSubmitEditGallery = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const editGalleryPost = {
      title: editGalleryTitle,
      content: editGalleryContent,
      photo: editImageUrl,
    };

    editGalleryBoard({ id, editGalleryPost });
    deleteObject(ref(storage, prevPhotoUrl));
    uploadEditedGalleryImage();
    setChangeGalleryPost(false);
  };
  //image onchange
  const onChangeGalleryImage = (event: any) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    if (file !== null) {
      setEditImageUpload(file);
      reader.readAsDataURL(file);
    }
    reader.onloadend = (finishedEvent: any) => {
      const imageDataUrl = finishedEvent.currentTarget.result;
      localStorage.setItem('imageDataUrl', imageDataUrl);
      //@ts-ignore
      document.getElementById('image').src = imageDataUrl;
      setEditGalleryPhoto(imageDataUrl);
    };
  };
  //image upload
  const uploadEditedGalleryImage = () => {
    //@ts-ignore
    const imageRef = ref(storage, `gallery/${editImageUpload?.name}`);
    const imageDataUrl = localStorage.getItem('imageDataUrl');

    if (imageDataUrl) {
      uploadString(imageRef, imageDataUrl, 'data_url')
        .then((response) => {
          getDownloadURL(response.ref).then((response) => {
            setEditImageUrl(response);
          });
        })
        .catch((error) => {
          console.log('error', error);
        });
    }
  };
  // image upload 불러오기
  useEffect(() => {
    uploadEditedGalleryImage();
  }, [editImageUpload]);
  const onClickChangeGalleryDetail = () => {
    setChangeGalleryPost(!changeGalleryPost);
    //@ts-ignore
    setEditGalleryTitle(detailGalleryPost?.title);
    //@ts-ignore

    setEditGalleryContent(detailGalleryPost?.content);
    //@ts-ignore
    setEditGalleryPhoto(detailGalleryPost?.photo);
  };
  console.log(detailGalleryPost);
  return (
    <>
      {changeGalleryPost ? (
        <GalleryPostWrapper>
          <GalleryPostContent onSubmit={onSubmitEditGallery}>
            <GalleryTitleContainer>
              제목:
              <GalleryPostTitle
                onChange={onChangeEditGalleryTitle}
                defaultValue={detailGalleryPost?.title}
              />
            </GalleryTitleContainer>

            <GalleryContentContainer>
              <GalleryImageWarpper>
                {' '}
                <GalleryImageInput
                  type="file"
                  accept="image/*"
                  onChange={onChangeGalleryImage}
                />
                <GalleryImagePreview
                  id="image"
                  src={prevPhotoUrl}
                ></GalleryImagePreview>
              </GalleryImageWarpper>
              <GalleryContentInput
                onChange={onChangeEditGalleryContent}
                defaultValue={detailGalleryPost?.content}
              />
            </GalleryContentContainer>
            <GalleryButtonWrapper>
              <GalleryPostButton onClick={onClickChangeGalleryDetail}>
                취소
              </GalleryPostButton>
              <GalleryPostButton type="submit">수정완료</GalleryPostButton>
            </GalleryButtonWrapper>
          </GalleryPostContent>
        </GalleryPostWrapper>
      ) : (
        <GalleryPostWrapper>
          <GalleryContent>
            <GalleryTitleContainer>
              제목:
              <DetailGalleryTitle>
                {detailGalleryPost?.title}
              </DetailGalleryTitle>
            </GalleryTitleContainer>
            <GalleryContentContainer>
              <GalleryImageWarpper>
                <GalleryImagePreview id="image" src={prevPhotoUrl} />
              </GalleryImageWarpper>
              <DetailGalleryContent>
                {detailGalleryPost?.content}
              </DetailGalleryContent>
            </GalleryContentContainer>
            <GalleryButtonWrapper>
              <GalleryPostButton onClick={onClickChangeGalleryDetail}>
                수정
              </GalleryPostButton>
              <GalleryPostButton onClick={onClickDeleteGalleryPost}>
                삭제
              </GalleryPostButton>
            </GalleryButtonWrapper>
          </GalleryContent>
        </GalleryPostWrapper>
      )}
    </>
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

const GalleryContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 97%;
  height: 95%;
  background-color: #f2f2f2;
  border-radius: 2rem;
`;
const DetailGalleryContent = styled.div`
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
const DetailGalleryTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 1rem;

  font-size: 2rem;
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
  border-radius: 2rem;
`;
export function getServerSideProps({ params: { params } }: any) {
  return {
    props: {
      params,
    },
  };
}
export default GalleryDetail;
