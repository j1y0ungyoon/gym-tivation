import CommentList from '@/components/comment/CommentList';
import Like from '@/components/common/Like';
import { authService, storage } from '@/firebase';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { nanoid } from 'nanoid';
import { useRouter } from 'next/router';
import { useState } from 'react';
import styled from 'styled-components';
import {
  deleteGalleryPost,
  editGalleryBoard,
  getFetchedGalleryDetail,
  getProfile,
} from '../api/api';
import imageCompression from 'browser-image-compression';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import Loading from '@/components/common/globalModal/Loading';
import DmButton from '@/components/DmButton';
import FollowButton from '@/components/FollowButton';
import Image from 'next/image';
import useModal from '@/hooks/useModal';
import { GLOBAL_MODAL_TYPES } from '@/recoil/modalState';

const GalleryDetail = ({ params }: any) => {
  const queryClient = useQueryClient();
  const { showModal } = useModal();

  const [changeGalleryPost, setChangeGalleryPost] = useState(false);
  const [editGalleryTitle, setEditGalleryTitle] = useState<string>('');
  const [editGalleryPhoto, setEditGalleryPhoto] = useState<string>('');
  const [editGalleryContent, setEditGalleryContent] = useState<string>('');
  const [editImageUpload, setEditImageUpload] = useState<File | undefined>();
  const [progressPercent, setProgressPercent] = useState(0);
  const [modalClick, setModalClick] = useState(false);
  const [id] = params;
  const router = useRouter();
  const { data: detailGalleryPost, isLoading } = useQuery(
    ['gallery', id],
    getFetchedGalleryDetail,
  );
  const { data } = useQuery(['profile'], getProfile);
  const { mutate: editGallery, isLoading: isEditing } =
    useMutation(editGalleryBoard);
  const { mutate: removeGalleryPost, isLoading: isDeleting } =
    useMutation(deleteGalleryPost);
  const user = authService.currentUser?.uid;

  const onChangeGalleryContent = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setEditGalleryContent(event.target.value);
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

  const goToMyPage = (id: any) => {
    router.push({
      pathname: `/myPage/${id}`,
      query: {
        id,
      },
    });
  };

  const onClickDeleteGalleryPost = async () => {
    const onDeleteGallery = () => {
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
    };

    showModal({
      modalType: GLOBAL_MODAL_TYPES.ConfirmModal,
      modalProps: {
        contentText: '정말 삭제하시겠습니까?',
        handleConfirm: onDeleteGallery,
      },
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
    editGallery(
      { id, editGalleryPost },
      {
        onSuccess: () => {
          queryClient.invalidateQueries('getGalleryData');
        },
      },
    );
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
          setEditGalleryPhoto(downloadURL);
        });
      },
    );
    console.log('original size', file?.size);
    console.log(`compressedFile size ${compressionFile.size / 1024 / 1024} MB`);
  };

  const onClickChangeGalleryDetail = () => {
    setChangeGalleryPost(!changeGalleryPost);
    setEditGalleryTitle(detailGalleryPost?.data()?.title);
    setEditGalleryContent(detailGalleryPost?.data()?.content);
    setEditGalleryPhoto(detailGalleryPost?.data()?.photo);
  };
  if (isLoading) {
    return <Loading />;
  }
  if (isDeleting) {
    return <Loading />;
  }
  if (isEditing) {
    return <Loading />;
  }
  // if (data !== null) return;
  const userInformation: any = data?.filter(
    (item) => item.id === authService.currentUser?.uid,
  );

  const followInformation: any = data?.filter(
    (item) => item.id === detailGalleryPost?.data()?.userId,
  )[0];

  return (
    <>
      {changeGalleryPost ? (
        <GalleryEditWrapper>
          <GalleryEditContainer>
            <GalleryPostForm onSubmit={onSubmitEditGallery}>
              <UpperWrapper>
                <GalleryButtonWrapper>
                  <GalleryPostButton
                    style={{ backgroundColor: 'white', color: 'black' }}
                    onClick={onClickChangeGalleryDetail}
                  >
                    취소
                  </GalleryPostButton>
                  {/* <EditButtonModal>버튼</EditButtonModal> */}
                  <GalleryPostButton type="submit">수정완료</GalleryPostButton>
                </GalleryButtonWrapper>
              </UpperWrapper>
              <GalleryContentContainer>
                <GalleryImageLabel>
                  <GalleryEditPreview>
                    <Image
                      layout="fill"
                      objectFit="cover"
                      objectPosition="center"
                      alt="수정 전 이미지"
                      src={editGalleryPhoto}
                    />
                  </GalleryEditPreview>
                  {progressPercent > 1 && 99 > progressPercent ? (
                    <ProgressPercent>
                      <div>
                        <div>업로드중..</div>
                        <div>{progressPercent}</div>
                      </div>
                    </ProgressPercent>
                  ) : null}
                  <GalleryImageInput
                    id="input-file"
                    type="file"
                    accept="image/*"
                    onChange={onChangeUpload}
                  />
                </GalleryImageLabel>
                <ContentWrapper>
                  <UserInfo>
                    <UserPhoto>
                      <Image
                        layout="fill"
                        objectFit="cover"
                        objectPosition="center"
                        alt="유저 이미지"
                        src={detailGalleryPost?.data()?.userPhoto}
                      ></Image>
                    </UserPhoto>
                    <UserNameInfo>
                      <UserName>{detailGalleryPost?.data()?.nickName}</UserName>
                      <div>
                        <UserLv>
                          Lv {userInformation.map((item: any) => item.lv)}
                        </UserLv>
                        <UserLvName>
                          {userInformation.map((item: any) => item.lvName)}
                        </UserLvName>
                      </div>
                    </UserNameInfo>
                  </UserInfo>
                  <GalleryInputWrapper>
                    <GalleryContentInput
                      placeholder="글을 입력해주세요"
                      onChange={onChangeGalleryContent}
                      defaultValue={detailGalleryPost?.data()?.content}
                    />
                  </GalleryInputWrapper>
                </ContentWrapper>
              </GalleryContentContainer>
            </GalleryPostForm>
          </GalleryEditContainer>
        </GalleryEditWrapper>
      ) : (
        <GalleryPostWrapper>
          <GalleryPostContainer>
            <GalleryContent>
              <DetailContentContainer>
                <GalleryImageWrapper>
                  <GalleryImagePreview>
                    <Image
                      layout="fill"
                      objectFit="cover"
                      objectPosition="center"
                      alt="업로드 이미지"
                      src={detailGalleryPost?.data()?.photo}
                    />
                  </GalleryImagePreview>
                </GalleryImageWrapper>
                <DetailContent>
                  <GalleryTitleContainer>
                    <InfoWrapper>
                      <BottomWrapper>
                        <UserImage>
                          <Image
                            width={50}
                            height={50}
                            alt="유저 이미지"
                            src={detailGalleryPost?.data()?.userPhoto}
                            onClick={() =>
                              goToMyPage(detailGalleryPost?.data()?.userId)
                            }
                          />
                        </UserImage>
                        <LevelWrapper>
                          <NicknameWrapper>
                            {detailGalleryPost?.data()?.nickName}
                          </NicknameWrapper>
                          <LevelContainer>
                            Lv
                            <UserLv>
                              {userInformation?.map((item: any) => item.lv)}
                            </UserLv>
                            <UserLvName>
                              {userInformation?.map((item: any) => item.lvName)}
                            </UserLvName>
                          </LevelContainer>
                        </LevelWrapper>
                        <FollowButton
                          item={followInformation}
                          Id={followInformation?.id}
                          propDisplay="none"
                          propWidth="40px"
                          propHeight="40px"
                          propPadding="0px"
                          propMinWidth="40px"
                          propBorderRadius="50%"
                        />
                        <DMWrapper>
                          <DmButton
                            propWidth="40px"
                            propHeight="40px"
                            propBorderRadius="50%"
                            propDisplay="none"
                            propMinWidth="40px"
                            propPadding="0px"
                            propMarginLeft="8px"
                            id={followInformation?.id}
                          />
                        </DMWrapper>
                        {user === detailGalleryPost?.data()?.userId ? (
                          <DropDownWrapper
                            onClick={() => setModalClick(!modalClick)}
                          >
                            <EditDropDown
                              modalClick={modalClick}
                              className="DropDownBox"
                            >
                              <EditButton
                                style={{ borderBottom: '1px solid #d9d9d9' }}
                                onClick={onClickChangeGalleryDetail}
                              >
                                수정
                              </EditButton>
                              <EditButton onClick={onClickDeleteGalleryPost}>
                                삭제
                              </EditButton>
                            </EditDropDown>
                          </DropDownWrapper>
                        ) : null}
                      </BottomWrapper>
                    </InfoWrapper>
                    <LikeContainer>
                      <Like
                        detailGalleryPost={detailGalleryPost?.data()}
                        id={id}
                      />
                    </LikeContainer>
                    <DetailGalleryContent>
                      <DetailContentWrapper>
                        {detailGalleryPost?.data()?.content}
                      </DetailContentWrapper>
                    </DetailGalleryContent>
                  </GalleryTitleContainer>
                  <CommentWrapper>
                    <CommentContainer>
                      <CommentList category="갤러리" id={id} />
                    </CommentContainer>
                  </CommentWrapper>
                </DetailContent>
              </DetailContentContainer>
            </GalleryContent>
          </GalleryPostContainer>
        </GalleryPostWrapper>
      )}
    </>
  );
};
const DetailContent = styled.div`
  display: flex;
  flex-direction: column;
  width: 35%;
  height: 100%;
  font-size: ${({ theme }) => theme.font.font10};
  background-color: ${({ theme }) => theme.color.backgroundColor};
  outline: none;
  resize: none;
  border: none;
  border-radius: 0 40px 40px 0;
`;
const DetailContentWrapper = styled.div`
  margin: 20px;
  width: 100%;
`;
const DetailGalleryContent = styled.div`
  display: flex;
  width: 100%;
  height: 50%;
  font-size: ${({ theme }) => theme.font.font10};
  background-color: ${({ theme }) => theme.color.backgrounColor};
  border: none;
  overflow-y: auto;
`;
const GalleryImageWrapper = styled.div`
  display: flex;
  width: 65%;
  height: 100%;
  flex-direction: column;
  border-right: 1px solid black;
  border-radius: 40px 0 0 40px;
`;
const GalleryPostWrapper = styled.div`
  ${({ theme }) => theme.mainLayout.wrapper};
  align-items: center;
  justify-content: center;
`;
const GalleryPostContainer = styled.div`
  ${({ theme }) => theme.mainLayout.container};
  height: calc(100% - 40px);
`;
const CommentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  padding-bottom: 20px;
  width: 100%;
  height: 60%;
  border-radius: 0 0 40px 0;
  background-color: white;
`;
const CommentContainer = styled.div`
  padding: 20px auto;
  display: flex;
  width: 95%;
  height: 100%;
  overflow: auto;
  background-color: white;
`;
const LikeContainer = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  width: 100%;
  height: 20%;
  padding: 0 20px;
  :hover {
    cursor: pointer;
    transform: scale(1.05, 1.05);
    transition: 0.3s;
  }
`;
const BottomWrapper = styled.div`
  display: flex;
  align-items: center;
  margin: 20px;
`;

const InfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 30%;
`;

const UserImage = styled.div`
  position: relative;
  min-height: 50px;
  min-width: 50px;
  width: 50px;
  height: 50px;
  border-radius: 50px;
  overflow: hidden;
  :hover {
    cursor: pointer;
    transform: scale(1.1, 1.1);
  }
`;
const LevelWrapper = styled.span`
  display: flex;
  flex-direction: column;
  width: 80%;
  margin-left: 20px;
  width: 80%;
`;
const DMWrapper = styled.div``;
const LevelContainer = styled.div`
  display: flex;
  flex-direction: row;
`;
const NicknameWrapper = styled.span`
  font-weight: 600;
`;
const GalleryContent = styled.div`
  border-radius: ${({ theme }) => theme.borderRadius.radius100};
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: white;
  border: 1px solid black;
  box-shadow: -2px 2px 0px 1px #000000;
`;
const UpperWrapper = styled.div`
  background-color: ${({ theme }) => theme.color.backgroundColor};
  border-radius: 40px 40px 0 0;
  display: flex;
  justify-content: flex-end;
  width: 100%;
  height: 8%;
  border-bottom: 1px solid black;
  border-bottom: 3px solid black;
`;

const GalleryEditWrapper = styled.div`
  ${({ theme }) => theme.mainLayout.wrapper};
  align-items: center;
  justify-content: center;
`;
const GalleryEditContainer = styled.div`
  ${({ theme }) => theme.mainLayout.container};
  height: calc(100% - 40px);
`;

const GalleryPostForm = styled.form`
  border-radius: ${({ theme }) => theme.borderRadius.radius100};
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: white;
  border: 1px solid black;
  box-shadow: -2px 2px 0px 1px #000000;
  overflow: hidden;
`;

const GalleryTitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 40%;
  min-height: 180px;
  border-radius: 0 40px 0 0;
  border-bottom: 1px solid black;
  background-color: ${({ theme }) => theme.color.backgroundColor};
`;
const DropDownWrapper = styled.div`
  display: inline-block;
  position: relative;
  width: 50px;
  height: 50px;
  background-image: url('/assets/icons/dotButton.svg');
  background-repeat: no-repeat;
  background-position: center;
  cursor: pointer;
`;

const EditDropDown = styled.div<any>`
  display: ${(props) => (props.modalClick ? 'block' : 'none')};
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  position: absolute;
  border-radius: 10px;
  border: 1px solid black;
  box-shadow: -2px 2px 0px 1px #000000;
  z-index: 1;
  top: 40px;
  left: -22px;
  overflow: hidden;
  margin-right: 20px;
`;
const EditButton = styled.button`
  border: none;
  width: 100%;
  height: 50%;
  background-color: white;
  &:hover {
    background-color: ${({ theme }) => theme.color.brandColor50};
  }
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

const GalleryContentContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 92%;
`;
const DetailContentContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100%;
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
  ${({ theme }) => theme.btn.btn30}
  background-color:${({ theme }) => theme.color.brandColor100};
  border: 1px solid black;
  margin-left: 10px;
  box-shadow: -2px 2px 0px 1px #000000;
`;
const GalleryImageInput = styled.input`
  display: none;
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
const GalleryImageLabel = styled.label`
  display: flex;
  width: 65%;
  height: 100%;
  flex-direction: column;
  border-right: 1px solid black;
  border-radius: 0 0 0 40px;
`;
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
const UserPhoto = styled.div`
  position: relative;
  max-width: 50px;
  max-height: 50px;
  width: 50px;
  height: 50px;
  border-radius: 50px;
  margin-right: 10px;
  object-fit: cover;
  overflow: hidden;
`;
const UserLv = styled.span`
  margin-right: 5px;
  font-size: ${({ theme }) => theme.font.font10};
`;
const UserLvName = styled.span`
  font-size: ${({ theme }) => theme.font.font10};
`;
const GalleryEditPreview = styled.div`
  position: relative;
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

const GalleryImagePreview = styled.div`
  position: relative;
  border: none;
  width: 100%;
  height: 100%;
  overflow: hidden;
  object-fit: cover;
  border-radius: 40px 0 0 40px;
`;
export function getServerSideProps({ params: { params } }: any) {
  return {
    props: {
      params,
    },
  };
}
export default GalleryDetail;
