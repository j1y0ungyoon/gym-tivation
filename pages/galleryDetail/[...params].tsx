import CommentList from '@/components/comment/CommentList';
import Like from '@/components/Like';
import { authService, storage } from '@/firebase';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { nanoid } from 'nanoid';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import {
  deleteGalleryPost,
  editGalleryBoard,
  getFetchedGalleryDetail,
} from '../api/api';
import imageCompression from 'browser-image-compression';
import { useMutation, useQuery, useQueryClient } from 'react-query';

const GalleryDetail = ({ params }: any) => {
  const queryClient = useQueryClient();
  // const [detailGalleryPost, setDetailGalleryPost] = useState<
  //   GalleryBoardPostType | undefined
  // >();
  const [changeGalleryPost, setChangeGalleryPost] = useState(false);
  const [editGalleryTitle, setEditGalleryTitle] = useState<string>('');
  const [editGalleryPhoto, setEditGalleryPhoto] = useState<string>('');
  const [prevPhoto, setPrevPhoto] = useState('');
  const [editGalleryContent, setEditGalleryContent] = useState<string>('');
  const [editImageUpload, setEditImageUpload] = useState<File | undefined>();

  const [id] = params;
  const router = useRouter();
  const { data: detailGalleryPost, isLoading } = useQuery(
    ['gallery', id],
    getFetchedGalleryDetail,
  );
  const { mutate: editGallery } = useMutation(editGalleryBoard);
  const { mutate: removeGalleryPost } = useMutation(deleteGalleryPost);
  const user = authService.currentUser?.uid;

  const onChangeEditGalleryTitle = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setEditGalleryTitle(event.target.value);
  };

  // const onChangeEditGalleryContent = (
  //   event: React.ChangeEvent<HTMLTextAreaElement>,
  // ) => {
  //   setEditGalleryContent(event.target.value);
  // };

  const toGallery = () => {
    router.push({
      pathname: `/gallery`,
    });
  };
  // 수정 useMutation
  // const { isLoading: isEditting, mutate: editGalleryBoardPost } = useMutation(
  //   ['editGalleryBoard', id],
  //   (body: GalleryParameterType) => editGalleryBoard(body),
  //   {
  //     onSuccess: () => {
  //       console.log('수정성공');
  //     },
  //     onError: (error) => {
  //       console.log('수정 실패:', error);
  //     },
  //   },
  // );

  //삭제 useMutation

  // const { isLoading: isDeleting, mutate: removeGalleryPost } = useMutation(
  //   [deleteGalleryPost, id],
  //   (body: any) => deleteGalleryPost(body),
  //   {
  //     onSuccess: () => {
  //       console.log('삭제성공');
  //     },
  //     onError: (err) => {
  //       console.log('삭제 실패:', err);
  //     },
  //   },
  // );

  const onClickDeleteGalleryPost = async () => {
    const answer = confirm('정말 삭제하시겠습니까?');
    if (answer) {
      try {
        removeGalleryPost(
          { id: id, photo: detailGalleryPost?.data()?.photo },
          {
            onSuccess: () => {
              queryClient.invalidateQueries('getGalleryData', {
                refetchActive: true,
              });
            },
          },
        );
        router.push('/gallery');
      } catch (error) {
        console.log('다시 확인해주세요', error);
      }
    }
  };

  //갤러리 수정 업데이트
  const onSubmitEditGallery = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const editGalleryPost = {
      title: editGalleryTitle,
      content: editGalleryContent,
      photo: editGalleryPhoto,
    };
    editGallery(
      { id, editGalleryPost },
      {
        onSuccess: () => {
          queryClient.invalidateQueries('getGalleryData');
        },
      },
    );
    // editGalleryBoardPost({ id, editGalleryPost });
    setChangeGalleryPost(false);
    setEditGalleryPhoto('');
    toGallery();
  };

  //image 압축
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
  //image onchange

  const onChangeUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const originalImage = event.target.files?.[0];
    console.log('original size', originalImage?.size);
    if (!originalImage) return;
    const compressedImage = await imageCompress(originalImage);
    setEditImageUpload(compressedImage);
  };

  // image upload 불러오기
  useEffect(() => {
    const imageRef = ref(storage, `gallery/${nanoid()}`);
    if (!editImageUpload) return;
    uploadBytes(imageRef, editImageUpload).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {
        setEditGalleryPhoto(url);
      });
    });
  }, [editImageUpload]);
  const onClickChangeGalleryDetail = () => {
    setChangeGalleryPost(!changeGalleryPost);
    setEditGalleryTitle(detailGalleryPost?.data()?.title);
    setEditGalleryContent(detailGalleryPost?.data()?.content);
    setEditGalleryPhoto(detailGalleryPost?.data()?.photo);
  };

  return (
    <>
      {changeGalleryPost ? (
        <GalleryEditWrapper>
          <GalleryEditContainer>
            <GalleryContent>
              <GalleryPostForm onSubmit={onSubmitEditGallery}>
                <EditTitleContainer>
                  <Title>제목 </Title>

                  <InputDiv>
                    <GalleryPostTitle
                      onChange={onChangeEditGalleryTitle}
                      defaultValue={detailGalleryPost?.data()?.title}
                    />
                  </InputDiv>
                </EditTitleContainer>

                <GalleryContentContainer>
                  <GalleryImageLabel>
                    <GalleryEditPreview src={editGalleryPhoto} />
                    <GalleryImageInput
                      id="input-file"
                      type="file"
                      accept="image/*"
                      onChange={onChangeUpload}
                    />
                  </GalleryImageLabel>
                  {/* <GalleryContentInput
            placeholder="글을 입력해주세요"
            onChange={onChangeGalleryContent}
            value={galleryContent}
          /> */}
                </GalleryContentContainer>
                <GalleryButtonWrapper>
                  <GalleryPostButton onClick={onClickChangeGalleryDetail}>
                    취소
                  </GalleryPostButton>
                  <GalleryPostButton type="submit">수정완료</GalleryPostButton>
                </GalleryButtonWrapper>
              </GalleryPostForm>
            </GalleryContent>
          </GalleryEditContainer>
        </GalleryEditWrapper>
      ) : (
        <GalleryPostWrapper>
          <GalleryPostContainer>
            <GalleryContent>
              <GalleryTitleContainer>
                <InfoWrapper>
                  <TitleUpperWrapper>
                    <DetailGalleryTitle>
                      {detailGalleryPost?.data()?.title}
                    </DetailGalleryTitle>
                  </TitleUpperWrapper>
                  <BottomWrapper>
                    <UserImage src={detailGalleryPost?.data()?.userPhoto} />
                    <LevelWrapper>
                      <NicknameWrapper>
                        {detailGalleryPost?.data()?.nickName}
                      </NicknameWrapper>
                      <LevelContainer>
                        Lv{detailGalleryPost?.data()?.userLv}
                        {detailGalleryPost?.data()?.userLvName}
                      </LevelContainer>
                    </LevelWrapper>
                  </BottomWrapper>
                </InfoWrapper>
                <EditWrapper>
                  <LikeContainer>
                    <Like
                      detailGalleryPost={detailGalleryPost?.data()}
                      id={id}
                    />
                  </LikeContainer>
                  {user === detailGalleryPost?.data()?.userId ? (
                    <GalleryButtonWrapper>
                      <GalleryPostButton onClick={onClickChangeGalleryDetail}>
                        수정
                      </GalleryPostButton>
                      <GalleryPostButton onClick={onClickDeleteGalleryPost}>
                        삭제
                      </GalleryPostButton>
                    </GalleryButtonWrapper>
                  ) : null}
                </EditWrapper>
              </GalleryTitleContainer>
              <GalleryContentContainer>
                <GalleryImageWrapper>
                  <GalleryImagePreview src={detailGalleryPost?.data()?.photo} />
                </GalleryImageWrapper>
                {/* <DetailGalleryContent>
                  {detailGalleryPost?.content}
                </DetailGalleryContent> */}

                <CommentWrapper>
                  <CommentContainer>
                    <CommentList category="갤러리" id={id} />
                  </CommentContainer>
                </CommentWrapper>
              </GalleryContentContainer>
            </GalleryContent>
          </GalleryPostContainer>
        </GalleryPostWrapper>
      )}
    </>
  );
};
const GalleryImageWrapper = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
  border-right: 1px solid black;
`;
const GalleryPostWrapper = styled.div`
  ${({ theme }) => theme.mainLayout.wrapper};
  min-height: 980px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
const GalleryPostContainer = styled.div`
  ${({ theme }) => theme.mainLayout.container};
  border-radius: ${({ theme }) => theme.borderRadius.radius100};
  display: flex;
  flex-direction: column;
  min-height: 900px;
`;
const CommentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  padding-bottom: 20px;
  width: 60%;
  height: 100%;
`;
const CommentContainer = styled.div`
  padding: 20px auto;
  display: flex;
  width: 90%;
  height: 100%;
  overflow: auto;
`;
const LikeContainer = styled.div`
  border: 1px solid black;
  width: 30%;
  border-radius: ${({ theme }) => theme.borderRadius.radius50};
`;
const BottomWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-left: 10px;
`;

const InfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 50%;
`;
const EditWrapper = styled.div`
  display: flex;
  width: 50%;
  min-height: 100%;
  flex-direction: column;
  align-items: flex-end;
`;

const UserImage = styled.img`
  height: 50px;
  border-radius: 40px;
  margin-left: 10px;
`;
const LevelWrapper = styled.span`
  display: flex;
  flex-direction: column;
  margin-left: 20px;
`;
const LevelContainer = styled.div``;
const NicknameWrapper = styled.span`
  font-weight: 600;
`;
const GalleryContent = styled.div`
  background-color: white;
  border-radius: ${({ theme }) => theme.borderRadius.radius100};
  width: 95%;
  height: 95%;
  border: 1px solid black;
  margin: 20px 20px;
`;

const DetailGalleryTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 1rem;
  font-size: 2rem;
`;
const GalleryEditWrapper = styled.div`
  ${({ theme }) => theme.mainLayout.wrapper};

  align-items: center;
  justify-content: center;
`;
const GalleryEditContainer = styled.div`
  ${({ theme }) => theme.mainLayout.container};
  border-radius: ${({ theme }) => theme.borderRadius.radius100};
  display: flex;
  flex-direction: column;
`;

const GalleryPostForm = styled.form`
  flex-direction: column;
  border-radius: ${({ theme }) => theme.borderRadius.radius100};
  align-items: center;
  height: 90%;
  margin: 20px;
`;
const EditTitleContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row;
  margin-left: 50px;
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
  padding: 10px;
  flex-direction: row;
  width: 100%;
  height: 20%;
  min-height: 180px;

  border-radius: 50px 50px 0 0;
  background-color: ${({ theme }) => theme.color.backgroundColor};
  border-bottom: 1px solid black;
`;
const TitleUpperWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 10px;
`;

const GalleryPostTitle = styled.input`
  ${({ theme }) => theme.input}
  background-color:white;
`;
const GalleryContentContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: row;
  width: 100%;
  height: 80%;
  /* min-height: 720px; */
`;

const GalleryEditBox = styled.div`
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
  margin: 10px auto;
`;
const GalleryPostButton = styled.button`
  ${({ theme }) => theme.btn.btn30}
  border:1px solid black;
  margin-left: 10px;
`;
const GalleryImageInput = styled.input`
  display: none;
`;

const GalleryImageLabel = styled.label`
  display: flex;
  width: 100%;
  flex-direction: column;
`;
const GalleryEditPreview = styled.img`
  margin-top: 1rem;
  width: 100%;
  height: 100%;
  border-radius: ${({ theme }) => theme.borderRadius.radius50};
  border: 1px solid black;
  overflow: hidden;
  object-fit: cover;
`;

const GalleryImagePreview = styled.img`
  width: 100%;
  height: 100%;
  padding: 10px;
  object-fit: cover;
`;
const EditImagePreview = styled.img`
  margin-top: 1rem;
  width: 100%;
  height: 100%;
  overflow: hidden;
  object-fit: scale-down;
`;

export function getServerSideProps({ params: { params } }: any) {
  return {
    props: {
      params,
    },
  };
}
export default GalleryDetail;
