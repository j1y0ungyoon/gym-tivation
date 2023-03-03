import CommentList from '@/components/CommentList';
import Like from '@/components/Like';
import { authService, dbService, storage } from '@/firebase';
import { GalleryBoardPostType } from '@/type';
import { doc, onSnapshot } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { nanoid } from 'nanoid';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { deleteGalleryPost, editGalleryBoard } from '../api/api';

const GalleryDetail = ({ params }: any) => {
  const [detailGalleryPost, setDetailGalleryPost] =
    useState<GalleryBoardPostType>();
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
        userPohto: data?.userPhoto,
        userLv: data?.userLv,
        userLvName: data?.userLvName,
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

    const editGalleryPost = {
      title: editGalleryTitle,
      content: editGalleryContent,
      photo: editGalleryPhoto,
    };

    editGalleryBoard({ id, editGalleryPost });
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
        <GalleryEditWrapper>
          <GalleryEditContainer>
            <GalleryContent>
              <GalleryPostForm onSubmit={onSubmitEditGallery}>
                <EditTitleContainer>
                  <Title>제목 </Title>

                  <InputDiv>
                    <GalleryPostTitle
                      onChange={onChangeEditGalleryTitle}
                      defaultValue={detailGalleryPost?.title}
                    />
                  </InputDiv>
                </EditTitleContainer>

                <GalleryContentContainer>
                  <GalleryImageWarpper>
                    <GalleryImagePreview src={editGalleryPhoto} />
                    <GalleryImageInput
                      id="input-file"
                      type="file"
                      accept="image/*"
                      onChange={onChangeUpload}
                    />
                  </GalleryImageWarpper>
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
                      {detailGalleryPost?.title}
                    </DetailGalleryTitle>
                  </TitleUpperWrapper>
                  <BottomWrapper>
                    <UserImage src={detailGalleryPost?.userPhoto} />
                    <LevelWrapper>
                      <NicknameWrapper>
                        {detailGalleryPost?.nickName}
                      </NicknameWrapper>
                      <LevelContainer>
                        Lv{detailGalleryPost?.userLv}
                        {detailGalleryPost?.userLvName}
                      </LevelContainer>
                    </LevelWrapper>
                  </BottomWrapper>
                </InfoWrapper>
                <EditWrapper>
                  <LikeContainer>
                    <Like detailGalleryPost={detailGalleryPost} />
                  </LikeContainer>
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
                </EditWrapper>
              </GalleryTitleContainer>
              <GalleryContentContainer>
                <GalleryImageWarpper>
                  <GalleryImagePreview src={prevPhoto} />
                </GalleryImageWarpper>
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

const GalleryPostWrapper = styled.div`
  ${({ theme }) => theme.mainLayout.wrapper};

  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
const GalleryPostContainer = styled.div`
  ${({ theme }) => theme.mainLayout.container};
  border-radius: ${({ theme }) => theme.borderRadius.radius100};
  display: flex;
  flex-direction: column;
`;
const CommentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  width: 35%;
`;
const CommentContainer = styled.div`
  display: flex;
  width: 90%;
  overflow: auto;
`;
const LikeContainer = styled.div`
  border: 1px solid black;
  width: 30%;
  margin: 10px;
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
const GalleryEditWrapper = styled.div`
  ${({ theme }) => theme.mainLayout.wrapper};

  flex-direction: column;
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
  align-items: center;
  width: 100%;
  height: 90%;
  border-radius: 2rem;
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
  flex-direction: row;
  width: 100%;
  height: 90%;
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
`;
const GalleryPostButton = styled.button`
  ${({ theme }) => theme.btn.btn30}
  border:1px solid black;
  margin: 10px;
`;
const GalleryImageInput = styled.input`
  display: none;
`;

const GalleryImageWarpper = styled.label`
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
  margin: 1rem;
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
export function getServerSideProps({ params: { params } }: any) {
  return {
    props: {
      params,
    },
  };
}
export default GalleryDetail;
