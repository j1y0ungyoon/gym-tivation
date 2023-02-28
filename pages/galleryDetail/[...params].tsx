import GalleryCommentList from '@/components/GalleryCommentList';
import Like from '@/components/Like';
import { authService, dbService, storage } from '@/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
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
  userId?: string;
  detailGalleryPosts?: any;
}

const GalleryDetail = ({ params }: any) => {
  const [detailGalleryPost, setDetailGalleryPost] =
    useState<GalleryDetailProps>();
  const [changeGalleryPost, setChangeGalleryPost] = useState(false);
  const [editGalleryTitle, setEditGalleryTitle] = useState<string | undefined>(
    '',
  );
  const [editGalleryPhoto, setEditGalleryPhoto] = useState<string>('');
  const [prevPhoto, setPrevPhoto] = useState('');
  const [editGalleryContent, setEditGalleryContent] = useState<string | any>(
    '',
  );
  const [editImageUpload, setEditImageUpload] = useState<any>('');

  const [id] = params;
  const router = useRouter();
  const user = authService.currentUser?.uid;

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
        userId: data?.userId,
        nickName: data?.nickName,
        userPhoto: data?.userPhoto,
        content: data?.content,
        createdAt: data?.createdAt,
        photo: data?.photo,
        like: data?.like,
      };

      setDetailGalleryPost(getGalleryPost);
      setPrevPhoto(data?.photo);
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

  const toGallery = () => {
    router.push({
      pathname: `/gallery`,
    });
  };

  //갤러리 수정 업데이트
  const onSubmitEditGallery = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    //photo값이 없을 때는 prev로 조건 걸어주기

    const editGalleryPost = {
      title: editGalleryTitle,
      content: editGalleryContent,
      photo: editGalleryPhoto,
    };
    //수정할 때 사진을 넣지 않고 올리면 업로드에 photo가 빈값으로 업데이트 되어야 함

    editGalleryBoard({ id, editGalleryPost });
    deleteObject(ref(storage, prevPhoto));
    setChangeGalleryPost(false);
    setEditGalleryPhoto('');
    toGallery();
  };
  //image onchange
  //
  const onChangeUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditImageUpload(event.target.files?.[0]);
  };

  // image upload 불러오기
  useEffect(() => {
    const imageRef = ref(storage, `gallery/${editImageUpload.name}`);

    if (!editImageUpload) return;
    uploadBytes(imageRef, editImageUpload).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {
        setEditGalleryPhoto(url);
      });
    });
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
                <GalleryImageInput
                  type="file"
                  accept="image/*"
                  onChange={onChangeUpload}
                />
                <GalleryImagePreview
                  src={editGalleryPhoto}
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
            <Like detailGalleryPost={detailGalleryPost} />
            <GalleryTitleContainer>
              제목:
              <DetailGalleryTitle>
                {detailGalleryPost?.title}
              </DetailGalleryTitle>
            </GalleryTitleContainer>
            <GalleryContentContainer>
              <GalleryImageWarpper>
                <GalleryImagePreview id="image" src={prevPhoto} />
              </GalleryImageWarpper>
              <DetailGalleryContent>
                {detailGalleryPost?.content}
              </DetailGalleryContent>
            </GalleryContentContainer>
            <BottomWrapper>
              <CommentWrapper>
                <GalleryCommentList id={id} />
              </CommentWrapper>
            </BottomWrapper>
          </GalleryContent>
          {user === detailGalleryPost?.userId ? (
            <GalleryButtonWrapper>
              <GalleryPostButton onClick={onClickChangeGalleryDetail}>
                수정
              </GalleryPostButton>
              <GalleryPostButton onClick={onClickDeleteGalleryPost}>
                삭제
              </GalleryPostButton>
            </GalleryButtonWrapper>
          ) : null}
        </GalleryPostWrapper>
      )}
    </>
  );
};

const GalleryPostWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 95vh;
  background-color: white;
  border-radius: 2rem;
`;
const CommentWrapper = styled.div`
  display: flex;

  flex-direction: column; ;
`;
const BottomWrapper = styled.div`
  display: flex;
`;
const GalleryContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 97%;
  height: 95%;
  background-color: #f2f2f2;
  border-radius: 2rem;
  overflow: auto;
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
  height: 2.5rem;
  border-radius: 2rem;
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
  height: 90%;
  border-radius: 2rem;
  object-fit: cover;
`;
export function getServerSideProps({ params: { params } }: any) {
  return {
    props: {
      params,
    },
  };
}
export default GalleryDetail;
