import { authService, dbService, storage } from '@/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadString,
} from 'firebase/storage';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { deleteBoardPost, editBoardPost } from '../api/api';
import Like from '@/components/Like';
// import BoardComment from '@/components/BoardComment';

interface DetailProps {
  id?: string;
  title?: string;
  content?: string;
  createdAt?: number;
  photo?: string;
  item?: any;
  category?: string;
  detailPost?: any;
  like?: string[];
  uid?: string | undefined;
}

const Detail = ({ params }: any) => {
  const [detailPost, setDetailPost] = useState<DetailProps>();
  const [changeDetailPost, setChangeDetailPost] = useState(false);
  const [editDetailTitle, setEditDetailTitle] = useState<string | undefined>(
    '',
  );
  const [editDetailCategory, setEditDetailCategory] = useState(
    detailPost?.category,
  );
  const [editDetailPhoto, setEditDetailPhoto] = useState<string | any>('');
  const [prevPhotoUrl, setPrevPhotoUrl] = useState('');
  const [editDetailContent, setEditDetailContent] = useState<string | any>('');
  const [editImageUpload, setEditImageUpload] = useState('');
  const [editImageUrl, setEditImageUrl] = useState('');

  const [id] = params;
  const router = useRouter();
  const uid = authService.currentUser?.uid;
  // 게시글, 저장된 이미지 파일 delete
  const onClickDeleteBoardPost = async () => {
    console.log('photo', detailPost?.photo);
    try {
      deleteBoardPost({ id: id, photo: detailPost?.photo });
      router.push('/board');
    } catch (error) {
      console.log('다시 확인해주세요', error);
    }
  };

  const onChangeEditTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditDetailTitle(event.target.value);
  };

  const onChangeEditContent = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setEditDetailContent(event.target.value);
  };

  const onChangeBoardCategory = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setEditDetailCategory(event.target.value);
  };

  //image upload
  const uploadEditedImage = () => {
    //@ts-ignore
    const imageRef = ref(storage, `images/${editImageUpload?.name}`);
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

  //게시글 수정 업데이트
  const onSubmitEditDetail = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const editDetailPost = {
      title: editDetailTitle,
      content: editDetailContent,
      photo: editImageUrl,
      category: editDetailCategory,
    };

    editBoardPost({ id, editDetailPost });
    deleteObject(ref(storage, prevPhotoUrl));
    uploadEditedImage();
    setChangeDetailPost(false);
  };

  //image onchange
  const onChangeImage = (event: any) => {
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
      setEditDetailPhoto(imageDataUrl);
    };
  };
  // image upload 불러오기
  useEffect(() => {
    uploadEditedImage();
  }, [editImageUpload]);

  const getEditPost = () => {
    const unsubscribe = onSnapshot(doc(dbService, 'posts', id), (doc) => {
      const data = doc.data();

      const getDetailPost: any = {
        id: doc.id,
        title: data?.title,
        content: data?.content,
        createdAt: data?.createdAt,
        category: data?.category,
        photo: data?.photo,
        like: data?.like,
      };

      setDetailPost(getDetailPost);
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
  //image upload

  //게시글 수정 토글 버튼
  const onClickChangeDetail = () => {
    setChangeDetailPost(!changeDetailPost);
    //@ts-ignore
    setEditDetailTitle(detailPost?.title);
    //@ts-ignore
    setEditDetailCategory(detailPost?.category);
    //@ts-ignore

    setEditDetailContent(detailPost?.content);
    //@ts-ignore
    setEditDetailPhoto(detailPost?.photo);
  };
  //기존 게시글 read

  return (
    <>
      {changeDetailPost ? (
        <PostWrapper>
          <PostContent onSubmit={onSubmitEditDetail}>
            <TitleContainer>
              제목:
              <PostTitle
                onChange={onChangeEditTitle}
                defaultValue={detailPost?.title}
              />
            </TitleContainer>
            <ContentContainer>
              {/* <BoardCategory category={category} setCategory={setCategory} /> */}
              <CategoryWrapper>
                <CategoryLabel>
                  <CategorySelect
                    type="radio"
                    name="category"
                    value="운동정보"
                    onChange={onChangeBoardCategory}
                  />
                  <CategoryText>운동정보</CategoryText>
                </CategoryLabel>
                <CategoryLabel>
                  <CategorySelect
                    type="radio"
                    name="category"
                    value="헬스장정보"
                    onChange={onChangeBoardCategory}
                  />
                  <CategoryText>헬스장정보</CategoryText>
                </CategoryLabel>
                <CategoryLabel>
                  <CategorySelect
                    type="radio"
                    name="category"
                    value="헬스용품추천"
                    onChange={onChangeBoardCategory}
                  />
                  <CategoryText>헬스용품추천</CategoryText>
                </CategoryLabel>
              </CategoryWrapper>
              <ContentBox>
                <DetailImageWrapper>
                  <ImageInput
                    type="file"
                    accept="image/*"
                    onChange={onChangeImage}
                  />
                  <ImagePreview id="image" src={prevPhotoUrl}></ImagePreview>
                </DetailImageWrapper>
                <ContentInput
                  onChange={onChangeEditContent}
                  defaultValue={detailPost?.content}
                />
              </ContentBox>
            </ContentContainer>
            <DetailButtonWrapper>
              <DetailPostButton onClick={onClickChangeDetail}>
                취소
              </DetailPostButton>
              <DetailPostButton type="submit">수정완료</DetailPostButton>
            </DetailButtonWrapper>
          </PostContent>
        </PostWrapper>
      ) : (
        <PostWrapper>
          <DetailContent>
            <Like detailPost={detailPost} />
            <TitleContainer>
              제목:
              <DetailPostTitle>{detailPost?.title}</DetailPostTitle>
            </TitleContainer>
            <ContentContainer>
              <CategoryWrapper>
                <CategoryText>{detailPost?.category}</CategoryText>
              </CategoryWrapper>
              {/* <div>created At{detailPost?.createdAt}</div> */}
              <ContentBox>
                <DetailImageWrapper>
                  <DetailPostPhoto src={detailPost?.photo} />
                </DetailImageWrapper>
                <DetailPostContent>{detailPost?.content}</DetailPostContent>
              </ContentBox>
            </ContentContainer>

            <DetailButtonWrapper>
              {/* <BoardComment /> */}
              <DetailPostButton onClick={onClickChangeDetail}>
                수정
              </DetailPostButton>
              <DetailPostButton onClick={onClickDeleteBoardPost}>
                삭제
              </DetailPostButton>
            </DetailButtonWrapper>
          </DetailContent>
        </PostWrapper>
      )}
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
const DetailContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 97%;
  height: 95%;
  background-color: #f2f2f2;
  border-radius: 2rem;
`;
const DetailImageWrapper = styled.div`
  display: flex;
  width: 50%;
  height: 90%;
  flex-direction: column;
  margin: 1rem;
`;
const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 1rem;
  width: 100%;
  font-size: 2rem;
`;
const ContentBox = styled.div`
  display: flex;
  flex-direction: row;
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
  flex-direction: column;
  width: 100%;
  height: 80%;
  padding: 2rem;
`;

const ContentInput = styled.textarea`
  display: flex;
  padding: 1rem;
  width: 50%;
  height: 50%;
  border-radius: 2rem;
  font-size: 1.5rem;
  margin: 1rem;
  resize: none;
  border: none;
`;
const DetailPostButton = styled.button`
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
  height: 50%;
  object-fit: cover;
  border-radius: 2rem;
`;
const DetailPostTitle = styled.p`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 1rem;
  font-size: 2rem;
`;
const DetailPostContent = styled.div`
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

const DetailPostPhoto = styled.img`
  margin-top: 1rem;
  width: 100%;
  height: 50%;
  border-radius: 2rem;
  object-fit: cover;
`;
const DetailButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 100%;
  height: 20%;
  padding: 2rem;
`;
const CategoryWrapper = styled.div`
  display: flex;
  flex-direction: row;
`;
const CategoryLabel = styled.label``;
const CategoryText = styled.span`
  font-size: 18px;
  width: 110px;
  height: 35px;
  background: #e6e6e6;
  border-radius: 50px;
  border: none;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  color: #777; ;
`;
const CategorySelect = styled.input.attrs({ type: 'radio' })`
  &:checked {
    display: inline-block;
    background: none;
    padding: 0px 10px;
    text-align: center;
    height: 35px;
    line-height: 33px;
    font-weight: 500;
    display: none;
  }
  &:checked + ${CategoryText} {
    background: #000;
    color: #fff;
  }
  display: none;
`;
export function getServerSideProps({ params: { params } }: any) {
  return {
    props: {
      params,
    },
  };
}

export default Detail;
