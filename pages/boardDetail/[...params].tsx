import { authService, dbService, storage } from '@/firebase';
import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  query,
  where,
} from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { deleteBoardPost, editBoardPost } from '../api/api';
import Like from '@/components/Like';
import BoardCommentList from '@/components/BoardCommentList';
import { nanoid } from 'nanoid';

import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';
import DOMPurify from 'dompurify';
import BoardCategory from '@/components/BoardCategory';
import CommentList from '@/components/CommentList';

const ReactQuill = dynamic(() => import('react-quill'), {
  ssr: false,
  loading: () => <p>Loading ...</p>,
});
const modules = {
  toolbar: [
    [{ font: [] }],
    [{ size: [] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{ color: [] }, { background: [] }],
    [
      { list: 'ordered' },
      { list: 'bullet' },
      { indent: '-1' },
      { indent: '+1' },
    ],
    ['link'],
    ['clean'],
  ],
  clipboard: {
    matchVisual: true,
  },
};

const formats = [
  'font',
  'size',
  'bold',
  'italic',
  'underline',
  'strike',
  'blockquote',
  'code-block',
  'color',
  'background',
  'list',
  'bullet',
  'indent',
  'link',
];
const Detail = ({ params }: any) => {
  const [detailPost, setDetailPost] = useState<any>();
  const [changeDetailPost, setChangeDetailPost] = useState(false);
  const [editDetailTitle, setEditDetailTitle] = useState<string | undefined>(
    '',
  );
  const [editDetailCategory, setEditDetailCategory] = useState(
    detailPost?.category,
  );
  // const [editDetailPhoto, setEditDetailPhoto] = useState<string>('');
  // const [prevPhotoUrl, setPrevPhotoUrl] = useState('');
  const [editDetailContent, setEditDetailContent] = useState<string | any>('');
  // const [editImageUpload, setEditImageUpload] = useState<any>('');
  const [profile, setProfile] = useState<any>('');
  const [lv, setLv] = useState<any>('');
  const [lvName, setLvName] = useState<any>([]);
  const [id] = params;
  const router = useRouter();
  const user = authService.currentUser?.uid;
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

  const onChangeEditContent = (value: any) => {
    setEditDetailContent(value);
  };

  //게시글 수정 업데이트
  const onSubmitEditDetail = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const editDetailPost = {
      title: editDetailTitle,
      content: editDetailContent,
      // photo: editDetailPhoto,
      category: editDetailCategory,
    };

    editBoardPost({ id, editDetailPost });
    // deleteObject(ref(storage, prevPhotoUrl));

    setChangeDetailPost(false);
    toBoard();
  };
  //이미지 업로드
  // const onChangeUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setEditImageUpload(event.target.files?.[0]);
  // };
  // useEffect(() => {
  //   const imageRef = ref(storage, `image/${nanoid()}`);
  //   if (!editImageUpload) return;
  //   uploadBytes(imageRef, editImageUpload).then((snapshot) => {
  //     getDownloadURL(snapshot.ref).then((url) => {
  //       setEditDetailPhoto(url);
  //     });
  //   });
  // }, [editImageUpload]);

  const toBoard = () => {
    router.push({
      pathname: `/board`,
    });
  };

  const getPost = () => {
    const getPost = onSnapshot(doc(dbService, 'posts', id), async (doc) => {
      const data = doc.data();

      // const profileData = await getDocs(
      //   query(
      //     collection(dbService, 'profile'),
      //     where('uid', '==', data?.userId),
      //   ),
      // );

      const getDetailPost: any = {
        id: doc.id,
        title: data?.title,
        content: data?.content,
        createdAt: data?.createdAt,
        category: data?.category,
        photo: data?.photo,
        like: data?.like,
        userId: data?.userId,
        nickName: data?.nickName,
        userPhoto: data?.userPhoto,
        userLv: data?.userLv,
        userLvName: data?.userLvName,
      };

      setDetailPost(getDetailPost);

      // setPrevPhotoUrl(data?.photo);
    });

    return () => {
      getPost();
    };
  };

  useEffect(() => {
    // const getProfile = onSnapshot(doc(dbService, 'profile', id), (doc) => {
    //   const data = doc.data();
    //   const getProfileData: any = {
    //     id: doc.id,
    //     lvName: data?.lvName,
    //     lv: data?.lv,
    //   };
    //   setProfile(getProfileData);
    // });
    const unsubscribe = getPost();

    return () => {
      unsubscribe();
    };
  }, []);
  //image upload

  //게시글 수정 토글 버튼
  const onClickChangeDetail = () => {
    setChangeDetailPost(!changeDetailPost);
    setEditDetailTitle(detailPost?.title);
    setEditDetailCategory(detailPost?.category);
    setEditDetailContent(detailPost?.content);
    setLv(profile?.lv);
    setLvName(profile?.lvName);

    // setEditDetailPhoto(detailPost?.photo);
  };
  //기존 게시글 read

  return (
    <>
      {changeDetailPost ? (
        <PostWrapper>
          <PostContainer>
            <PostContent onSubmit={onSubmitEditDetail}>
              <TitleContainer>
                <Title>제목</Title>
                <InputDiv>
                  <PostTitle
                    onChange={onChangeEditTitle}
                    defaultValue={detailPost?.title}
                  />
                </InputDiv>
              </TitleContainer>
              <CategoryWrapper>
                <BoardCategory setEditDetailCategory={setEditDetailCategory} />
              </CategoryWrapper>
              <ContentContainer>
                {/* <DetailImageWrapper>
                  <ImageInput
                    type="file"
                    accept="image/*"
                    onChange={onChangeUpload}
                  />
                  <ImagePreview src={editDetailPhoto}></ImagePreview>
                </DetailImageWrapper> */}

                <Editor
                  onChange={onChangeEditContent}
                  defaultValue={detailPost?.content}
                  modules={modules}
                  formats={formats}
                />
              </ContentContainer>

              <DetailButtonWrapper>
                <DetailPostButton onClick={onClickChangeDetail}>
                  취소
                </DetailPostButton>
                <DetailPostButton type="submit">수정완료</DetailPostButton>
              </DetailButtonWrapper>
            </PostContent>
          </PostContainer>
        </PostWrapper>
      ) : (
        <PostWrapper>
          <PostContainer>
            <DetailContent>
              <DetailTitleContainer>
                <TitleUpperWrapper>
                  <CategoryWrapper>
                    <CategoryText>{detailPost?.category}</CategoryText>
                  </CategoryWrapper>
                  <TitleBox>
                    <DetailPostTitle>{detailPost?.title}</DetailPostTitle>
                  </TitleBox>
                </TitleUpperWrapper>
                <BottomWrapper>
                  <UserImage src={detailPost?.userPhoto} />

                  <LevelWrapper>
                    <NicknameWrapper>{detailPost?.nickName}</NicknameWrapper>
                    <LevelContainer>
                      Lv.{detailPost?.userLv} {detailPost?.userLvName}
                    </LevelContainer>
                  </LevelWrapper>
                </BottomWrapper>
              </DetailTitleContainer>
              <ContentContainer>
                {/* <div>created At{detailPost?.createdAt}</div> */}
                <ContentBox>
                  {/* <DetailImageWrapper>
                    <DetailPostPhoto src={detailPost?.photo} />
                  </DetailImageWrapper> */}
                  <HTMLParser
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(detailPost?.content),
                    }}
                  />
                </ContentBox>
                <Like detailPost={detailPost} />
                <BottomWrapper>
                  <CommentWrapper>
                    <CommentList category="게시판" id={id} />
                  </CommentWrapper>
                </BottomWrapper>
              </ContentContainer>
              {user === detailPost?.userId ? (
                <DetailButtonWrapper>
                  <DetailPostButton onClick={onClickChangeDetail}>
                    수정
                  </DetailPostButton>
                  <DetailPostButton onClick={onClickDeleteBoardPost}>
                    삭제
                  </DetailPostButton>
                </DetailButtonWrapper>
              ) : null}
            </DetailContent>
          </PostContainer>
        </PostWrapper>
      )}
    </>
  );
};
const PostWrapper = styled.div`
  ${({ theme }) => theme.mainLayout.wrapper};
  flex-direction: column;
  align-items: center;
`;
const PostContainer = styled.div`
  ${({ theme }) => theme.mainLayout.container};
`;
const PostContent = styled.form`
  background-color: white;
  border: 1px solid black;
  border-radius: 2rem;
  width: 100%;
  height: 100%;
  padding: 20px;
`;
const CommentWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;
const BottomWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-left: 10px;
`;

const Editor = styled(ReactQuill)`
  width: 100%;
  height: 80%;
`;
const BottmWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;
const UserWrapper = styled.div`
  display: flex;
  align-items: row;
  margin-left: 10px;
`;
const NicknameWrapper = styled.span`
  font-weight: 600;
`;
const LevelWrapper = styled.span`
  display: flex;
  flex-direction: column;
  margin-left: 20px;
`;
const LevelContainer = styled.div``;
const TitleUpperWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 10px;
`;
const DetailContent = styled.div`
  background-color: white;
  border: 1px solid black;
  border-radius: ${({ theme }) => theme.borderRadius.radius100};
  width: 100%;
  height: 100%;
`;
const UserImage = styled.img`
  height: 50px;
  border-radius: 40px;
  margin-left: 10px;
`;

const DetailTitleContainer = styled.div`
  display: flex;
  padding: 10px;
  flex-direction: column;
  width: 100%;
  border-radius: 50px 50px 0 0;
  background-color: ${({ theme }) => theme.color.backgroundColor};
  border-bottom: 1px solid black;
`;

const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row;
`;
const Title = styled.span`
  display: flex;
  flex-direction: column;
  font-size: ${({ theme }) => theme.font.font70};
`;
const InputDiv = styled.div`
  ${({ theme }) => theme.inputDiv};
  background-color: white;
  margin: 10px;
  width: 85%;
  margin-left: 62px;
  border: 1px solid black;
`;
const TitleBox = styled.div`
  margin: 0 10px;
  /* width: 85%; */
`;
const ContentBox = styled.div`
  display: flex;
  flex-direction: row;
  border-radius: ${({ theme }) => theme.borderRadius.radius50};
  border: 1px solid black;
  width: 100%;
  height: 100%;
`;
const HTMLParser = styled.div`
  margin: 20px;
`;
const PostTitle = styled.input`
  ${({ theme }) => theme.input}
  background-color:white;
`;
const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 80%;
  padding: 2rem;
`;

const DetailPostButton = styled.button`
  ${({ theme }) => theme.btn.btn30}
  border:1px solid black;
  margin-right: 20px;
  margin-bottom: 10px;
`;

const DetailPostTitle = styled.p`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ theme }) => theme.font.font70};
  font-weight: 600;
  margin: 0px;
`;

const DetailButtonWrapper = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  width: 100%;
`;
const CategoryWrapper = styled.div`
  display: flex;
  flex-direction: row;
`;

const CategoryText = styled.span`
  font-size: 18px;
  width: 110px;
  height: 35px;
  background: white;
  border-radius: 50px;
  border: none;
  display: flex;
  justify-content: center;
  align-items: center;

  color: black;
  border: 1px solid black;
  margin-left: 10px;
`;
const ImageInput = styled.input`
  width: 100%;
  height: 2rem;
`;
const ImagePreview = styled.img`
  margin-top: 1rem;
  width: 100%;
  height: 90%;
  object-fit: cover;
  border-radius: 2rem;
`;
const DetailPostPhoto = styled.img`
  margin-top: 1rem;
  width: 100%;
  height: 90%;
  border-radius: 2rem;
  object-fit: cover;
`;
const DetailPostContent = styled.div`
  display: flex;
  padding: 1rem;
  width: 50%;
  height: 90%;
  border-radius: 2rem;
  /* font-size: 1.5rem; */
  margin: 1rem;
  border: 1px solid #777;
  overflow-y: auto;
`;
const DetailImageWrapper = styled.div`
  display: flex;
  width: 50%;
  height: 90%;
  flex-direction: column;
  margin: 1rem;
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
export function getServerSideProps({ params: { params } }: any) {
  return {
    props: {
      params,
    },
  };
}

export default Detail;
