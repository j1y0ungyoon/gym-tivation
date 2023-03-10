import { authService } from '@/firebase';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import {
  deleteBoardPost,
  editBoardPost,
  getFetchedBoardDetail,
  getProfile,
} from '../api/api';
import Like from '@/components/common/Like';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';
import DOMPurify from 'dompurify';
import BoardCategory from '@/components/board/BoardCategory';
import CommentList from '@/components/comment/CommentList';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import useModal from '@/hooks/useModal';
import { GLOBAL_MODAL_TYPES } from '@/recoil/modalState';
import Loading from '@/components/common/globalModal/Loading';
import DmButton from '@/components/DmButton';
import FollowButton from '@/components/FollowButton';

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
interface DetailProps {
  id?: string;
  title?: string;
  content?: string;
  createdAt?: number;
  category?: string;
  photo?: string;
  like?: string[];
  userId: string;
  nickName: string;
  userPhoto: string;
  userLv: number;
  userLvName: string;
}
const Detail = ({ params }: any) => {
  const queryClient = useQueryClient();
  // const [detailPost, setDetailPost] = useState<any>();
  const [changeDetailPost, setChangeDetailPost] = useState(false);
  const [editDetailTitle, setEditDetailTitle] = useState<string | undefined>(
    '',
  );
  const [editDetailCategory, setEditDetailCategory] = useState('운동정보');
  // const [editDetailPhoto, setEditDetailPhoto] = useState<string>('');
  // const [prevPhotoUrl, setPrevPhotoUrl] = useState('');
  const [editDetailContent, setEditDetailContent] = useState<string | any>('');
  // const [editImageUpload, setEditImageUpload] = useState<any>('');

  const { showModal } = useModal();

  const [id] = params;

  const { data: detailPost, isLoading } = useQuery(
    ['post', id],
    getFetchedBoardDetail,
  );
  const { data } = useQuery(['profile'], getProfile);
  const { mutate, isLoading: isEditing } = useMutation(editBoardPost);

  const { mutate: removeBoardPost, isLoading: isDeleting } =
    useMutation(deleteBoardPost);

  const router = useRouter();
  const user = authService.currentUser?.uid;
  // 게시글, 저장된 이미지 파일 delete
  const onClickDeleteBoardPost = () => {
    const onDeleteFunction = () => {
      try {
        removeBoardPost(
          { id: id, photo: detailPost?.data()?.photo },
          {
            onSuccess: () => {
              queryClient.invalidateQueries('getPostData', {
                refetchActive: true,
              });
            },
          },
        );
        router.push('/board');
      } catch (error) {
        console.log('다시 확인해주세요', error);
      }
    };

    showModal({
      modalType: GLOBAL_MODAL_TYPES.ConfirmModal,
      modalProps: {
        contentText: '정말 삭제하시겠습니까?',
        handleConfirm: onDeleteFunction,
      },
    });
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

    mutate(
      { id, editDetailPost },
      {
        onSuccess: () => {
          queryClient.invalidateQueries('getPostData', {
            refetchActive: true,
          });
        },
      },
    );
    // editBoardPost({ id, editDetailPost });
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
  const goToMyPage = (id: any) => {
    router.push({
      pathname: `/myPage/${id}`,
      query: {
        id,
      },
    });
  };

  //게시글 수정 토글 버튼
  const onClickChangeDetail = () => {
    setChangeDetailPost(!changeDetailPost);
    setEditDetailTitle(detailPost?.data()?.title);
    setEditDetailCategory(detailPost?.data()?.category);
    setEditDetailContent(detailPost?.data()?.content);
    // setEditDetailPhoto(detailPost?.photo);
  };
  //기존 게시글 read
  if (isLoading) {
    return <Loading />;
  }

  if (isDeleting) {
    return <Loading />;
  }

  if (isEditing) {
    return <Loading />;
  }
  const followInformation: any = data?.filter(
    (item) => item.id === detailPost?.data()?.userId,
  )[0];
  return (
    <>
      {changeDetailPost ? (
        <PostEditWrapper>
          <PostEditContainer>
            <PostEditForm onSubmit={onSubmitEditDetail}>
              <PostUpperWrapper>
                <TitleEditContainer>
                  <TitleEditBox>
                    <Title>제목</Title>
                    <InputDiv>
                      <PostTitle
                        onChange={onChangeEditTitle}
                        defaultValue={detailPost?.data()?.title}
                      />
                    </InputDiv>
                  </TitleEditBox>
                </TitleEditContainer>
                <CategoryContainer>
                  <BoardCategory
                    setEditDetailCategory={setEditDetailCategory}
                  />
                </CategoryContainer>
              </PostUpperWrapper>
              <ContentEditContainer>
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
                  defaultValue={detailPost?.data()?.content}
                  modules={modules}
                  formats={formats}
                />
                <DetailEditButtonWrapper>
                  <DetailEditButton onClick={onClickChangeDetail}>
                    취소
                  </DetailEditButton>
                  <DetailEditButton type="submit">수정완료</DetailEditButton>
                </DetailEditButtonWrapper>
              </ContentEditContainer>
            </PostEditForm>
          </PostEditContainer>
        </PostEditWrapper>
      ) : (
        <PostWrapper>
          <PostContainer>
            <DetailContent>
              <DetailTitleContainer>
                <InfoWrapper>
                  <TitleUpperWrapper>
                    <CategoryWrapper>
                      <CategoryText>
                        {detailPost?.data()?.category}
                      </CategoryText>
                    </CategoryWrapper>
                    <TitleBox>
                      <DetailPostTitle>
                        {detailPost?.data()?.title}
                      </DetailPostTitle>

                      <DetailPostDate>
                        {detailPost?.data()?.date}
                      </DetailPostDate>
                    </TitleBox>
                  </TitleUpperWrapper>
                  <TitleBottomWrapper>
                    <UserImage
                      src={detailPost?.data()?.userPhoto}
                      onClick={() => {
                        goToMyPage(detailPost?.data()?.userId);
                      }}
                    />

                    <LevelWrapper>
                      <NicknameWrapper>
                        {detailPost?.data()?.nickName}
                      </NicknameWrapper>
                      <LevelContainer>
                        LV{detailPost?.data()?.userLv}{' '}
                        {detailPost?.data()?.userLvName}
                      </LevelContainer>
                    </LevelWrapper>
                    <FollowButton
                      item={followInformation}
                      Id={followInformation?.id}
                    />
                    <DmButton id={followInformation?.id} />
                  </TitleBottomWrapper>
                </InfoWrapper>
                <EditWrapper>
                  {user === detailPost?.data()?.userId ? (
                    <DetailButtonWrapper>
                      <DetailPostButton onClick={onClickChangeDetail}>
                        수정
                      </DetailPostButton>
                      <DetailPostButton onClick={onClickDeleteBoardPost}>
                        삭제
                      </DetailPostButton>
                    </DetailButtonWrapper>
                  ) : null}
                </EditWrapper>
              </DetailTitleContainer>
              <ContentContainer>
                {/* <div>created At{detailPost?.createdAt}</div> */}
                <ContentBox>
                  {/* <DetailImageWrapper>
                    <DetailPostPhoto src={detailPost?.photo} />
                  </DetailImageWrapper> */}
                  <HTMLParser
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(detailPost?.data()?.content),
                    }}
                  />
                </ContentBox>
                <LikeContainer>
                  <Like detailPost={detailPost?.data()} id={id} />
                </LikeContainer>
                <BottomWrapper>
                  <CommentWrapper>
                    <CommentContainer>
                      <CommentList category="게시판" id={id} />
                    </CommentContainer>
                  </CommentWrapper>
                </BottomWrapper>
              </ContentContainer>
            </DetailContent>
          </PostContainer>
        </PostWrapper>
      )}
    </>
  );
};
const DetailBox = styled.div`
  width: 100%;
  height: 100%;
`;

const PostEditWrapper = styled.div`
  ${({ theme }) => theme.mainLayout.wrapper};
  align-items: center;
  justify-content: center;
`;
const PostWrapper = styled.div`
  ${({ theme }) => theme.mainLayout.wrapper};
  flex-direction: column;
  align-items: center;
`;
const PostEditContainer = styled.div`
  ${({ theme }) => theme.mainLayout.container};
  height: calc(100% - 40px);
  border-radius: ${({ theme }) => theme.borderRadius.radius100};
  display: flex;
  flex-direction: column;
  background-color: white;
  border: 1px solid black;
  box-shadow: -2px 2px 0px 1px #000000;
`;
const PostEditForm = styled.form`
  flex-direction: column;
  align-items: center;
  height: 100%;
  border-radius: ${({ theme }) => theme.borderRadius.radius100};
  margin: 20px;
`;
const PostContainer = styled.div`
  ${({ theme }) => theme.mainLayout.container};
  height: calc(100% - 40px);
`;
const ContentEditContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 80%;
  padding: 10px;
`;
const PostUpperWrapper = styled.div`
  display: center;
  align-items: center;
  justify-content: center;
  margin: 10px;
  height: 15%;
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
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
`;
const CommentContainer = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
`;
const BottomWrapper = styled.div`
  display: flex;
  width: 100%;
  height: 40%;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Editor = styled(ReactQuill)`
  width: 100%;
  height: 80%;
  border: 1px solid black;
  margin: 10px 0;
  box-shadow: -2px 2px 0px 1px #000000;

  border-radius: ${({ theme }) => theme.borderRadius.radius10};
  .ql-toolbar.ql-snow + .ql-container.ql-snow {
    border: none;
    border-top: 1px solid black;
  }
  .ql-toolbar.ql-snow {
    border: none;
  }
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
  margin: 20px 0;
`;
const TitleBottomWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 20px 0;
`;

const DetailContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: white;
  border: 1px solid black;
  border-radius: ${({ theme }) => theme.borderRadius.radius100};
  box-shadow: -2px 2px 0px 1px #000000;
  width: 100%;
  height: 100%;
  overflow: hidden;
`;
const UserImage = styled.img`
  height: 50px;
  width: 50px;
  border-radius: 40px;
  :hover {
    cursor: pointer;
    transform: scale(1.1, 1.1);
  }
`;

const DetailTitleContainer = styled.div`
  display: flex;
  padding: 10px;
  flex-direction: row;
  width: 100%;
  height: 29%;
  border-radius: 50px 50px 0 0;
  background-color: ${({ theme }) => theme.color.backgroundColor};
  border-bottom: 3px solid black;
  padding: 40px 74px;
`;
const CategoryContainer = styled.div`
  height: 50%;
`;
const TitleEditContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row;
  height: 50%;
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
  box-shadow: -2px 2px 0px 1px #000000;

  background-color: white;
  margin: 10px 0;
  margin-left: 62px;
  width: 80%;
  border: 1px solid black;
`;
const EditInputDiv = styled.div`
  ${({ theme }) => theme.inputDiv};
  box-shadow: -2px 2px 0px 1px #000000;
`;
const TitleEditBox = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
`;
const TitleBox = styled.div`
  display: flex;
  height: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin: 0 10px;
`;
const ContentBox = styled.div`
  display: flex;
  flex-direction: row;
  border-radius: ${({ theme }) => theme.borderRadius.radius50};
  border: 1px solid black;
  box-shadow: -2px 2px 0px 1px #000000;
  min-height: 40%;
  width: 100%;

  overflow-y: auto;
  /* height: 40%; */
`;
const LikeContainer = styled.div`
  border: 1px solid black;
  margin: 15px;
  width: 120px;
  border-radius: ${({ theme }) => theme.borderRadius.radius50};
  box-shadow: -2px 2px 0px 1px #000000;
  :hover {
    cursor: pointer;
    transform: scale(1.05, 1.05);
    transition: 0.3s;

    background-color: ${({ theme }) => theme.color.brandColor50};
  }
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
  height: 80%;
  width: calc(100% - 150px);
  border-bottom: none;

  align-items: center;
  justify-content: center;
  margin: 20px;
`;

const DetailPostButton = styled.button`
  ${({ theme }) => theme.btn.btn30}
  min-width:58px;
  background-color: white;
  color: black;
  border: 1px solid black;
  margin: 5px;
  box-shadow: -2px 2px 0px 1px #000000;
  :hover {
    cursor: pointer;
    transform: scale(1.05, 1.05);
    transition: 0.3s;
    background-color: ${({ theme }) => theme.color.brandColor50};
  }
`;
const DetailPostDate = styled.span`
  display: flex;
  align-items: flex-end;
  justify-content: center;
  margin: 0 10px;
  font-size: ${({ theme }) => theme.font.font10};
  color: gray;
  height: 100%;
`;
const DetailPostTitle = styled.p`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ theme }) => theme.font.font70};
  height: 100%;
  font-weight: 600;
  margin: 0px;
`;

const InfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 80%;
`;
const DetailEditButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;

  width: 100%;
`;

const DetailEditButton = styled.button`
  ${({ theme }) => theme.btn.btn50}
  min-width:80px;
  border: 1px solid black;
  box-shadow: -2px 2px 0px 1px #000000;
  margin: 0 10px;

  background-color: ${({ theme }) => theme.color.brandColor100};
  :hover {
    cursor: pointer;
    transform: scale(1.05, 1.05);
    transition: 0.3s;

    background-color: black;
    color: white;
  }
`;
const DetailButtonWrapper = styled.div`
  display: flex;
  height: 100%;
`;

const EditWrapper = styled.div`
  display: flex;
  width: 50%;
  height: 100%;
  flex-direction: column;
  align-items: flex-end;
`;
const CategoryWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  /* padding: 5px; */
`;

const CategoryTextWrapper = styled.div``;
const CategoryText = styled.span`
  font-size: 18px;
  width: 120px;
  height: 30px;
  background: white;
  border-radius: 50px;
  border: none;
  display: flex;
  justify-content: center;
  align-items: center;
  color: black;
  border: 1px solid black;
  box-shadow: -2px 2px 0px 1px #000000;
`;
// const ImageInput = styled.input`
//   width: 100%;
//   height: 2rem;
// `;
// const ImagePreview = styled.img`
//   margin-top: 1rem;
//   width: 100%;
//   height: 90%;
//   object-fit: cover;
//   border-radius: 2rem;
// `;
// const DetailPostPhoto = styled.img`
//   margin-top: 1rem;
//   width: 100%;
//   height: 90%;
//   border-radius: 2rem;
//   object-fit: cover;
// `;
// const DetailPostContent = styled.div`
//   display: flex;
//   padding: 1rem;
//   width: 50%;
//   height: 90%;
//   border-radius: 2rem;
//   /* font-size: 1.5rem; */
//   margin: 1rem;
//   border: 1px solid #777;
//   overflow-y: auto;
// `;
// const DetailImageWrapper = styled.div`
//   display: flex;
//   width: 50%;
//   height: 90%;
//   flex-direction: column;
//   margin: 1rem;
// `;
// const ContentInput = styled.textarea`
//   display: flex;
//   padding: 1rem;
//   width: 50%;
//   height: 90%;
//   border-radius: 2rem;
//   font-size: 1.5rem;
//   margin: 1rem;
//   resize: none;
//   border: none;
// `;
export function getServerSideProps({ params: { params } }: any) {
  return {
    props: {
      params,
    },
  };
}

export default Detail;
