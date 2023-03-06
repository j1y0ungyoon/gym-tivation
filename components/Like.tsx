import { authService, dbService } from '@/firebase';
import { arrayRemove, arrayUnion, doc, updateDoc } from 'firebase/firestore';
import Image from 'next/image';

import styled from 'styled-components';
import likeImg from '../public/assets/images/likeImg.png';
import checkedLike from '../public/assets/images/checkedLike.png';
import { useRouter } from 'next/router';
import { useMutation, useQueryClient } from 'react-query';
import {
  updateGalleryLike,
  updateGalleryUnLike,
  updatePorfilePostLike,
  updatePostLike,
  updatePostUnLike,
  updateProfileGalleryLike,
  updateProfileGalleryUnLike,
  updateProfilePostUnLike,
} from '@/pages/api/api';
import { query } from 'firebase/database';
const Like = ({ detailPost, detailGalleryPost, id }: any) => {
  const router = useRouter();
  const boardLikeCount = detailPost?.like?.length;
  const galleryLikeCount = detailGalleryPost?.like?.length;
  const user: any = String(authService.currentUser?.uid);
  const boardLikeChecked = detailPost?.like?.includes(user);
  const galleryLikeChecked = detailGalleryPost?.like?.includes(user);
  const board = router.pathname === '/boardDetail/[...params]';
  const gallery = router.pathname === '/galleryDetail/[...params]';
  const queryClient = useQueryClient();
  const { mutate: addPostLike } = useMutation(updatePostLike);
  const { mutate: deletePostLike } = useMutation(updatePostUnLike);

  //gallery
  const { mutate: addGalleryLike } = useMutation(updateGalleryLike);
  const { mutate: deleteGalleryUnLike } = useMutation(updateGalleryUnLike);

  const { mutate: addPostProfileLike } = useMutation(updatePorfilePostLike);
  const { mutate: deletePostProfileLike } = useMutation(
    updateProfilePostUnLike,
  );
  const { mutate: addGalleryProfileLike } = useMutation(
    updateProfileGalleryLike,
  );
  const { mutate: deleteGalleryProfileLike } = useMutation(
    updateProfileGalleryUnLike,
  );

  const likeCounter = async () => {
    if (authService.currentUser) {
      if (board) {
        if (!boardLikeChecked) {
          addPostLike(
            { id, user, detailPost },
            {
              onSuccess: () => {
                queryClient.invalidateQueries('like', {
                  refetchActive: true,
                });
              },
            },
          );
          addPostProfileLike(
            { id, user },
            {
              onSuccess: () => {
                queryClient.invalidateQueries('profilelike', {
                  refetchActive: true,
                });
              },
            },
          );
        } else {
          deletePostLike(
            {
              id,
              user,
              detailPost,
            },
            {
              onSuccess: () => {
                queryClient.invalidateQueries('unLike', {
                  refetchActive: true,
                });
              },
            },
          );
          deletePostProfileLike(
            { id, user },
            {
              onSuccess: () => {
                queryClient.invalidateQueries('profileUnLike', {
                  refetchActive: true,
                });
              },
            },
          );
        }
        // await updateDoc(doc(dbService, 'posts', id), {
        //   like: [...detailPost.like, user],
        // });
        // await updateDoc(doc(dbService, 'profile', user), {
        //   postLike: arrayUnion(id),
        // });
        // await updateDoc(doc(dbService, 'posts', id), {
        //   like: detailPost?.like.filter((prev: any) => prev !== user),
        // });
        // await updateDoc(doc(dbService, 'profile', user), {
        //   postLike: arrayRemove(id),
        // });
      }
      if (gallery) {
        if (!galleryLikeChecked) {
          addGalleryLike(
            {
              id,
              user,
              detailGalleryPost,
            },
            {
              onSuccess: () => {
                queryClient.invalidateQueries('like', {
                  refetchActive: true,
                });
              },
            },
          );
          addGalleryProfileLike(
            { id, user, detailGalleryPost },
            {
              onSuccess: () => {
                queryClient.invalidateQueries('profileLike', {
                  refetchActive: true,
                });
              },
            },
          );
        } else {
          deleteGalleryUnLike(
            {
              id,
              user,
            },
            {
              onSuccess: () => {
                queryClient.invalidateQueries('unLike', {
                  refetchActive: true,
                });
              },
            },
          );
          deleteGalleryProfileLike(
            { id, user },
            {
              onSuccess: () => {
                queryClient.invalidateQueries('profileUnLike', {
                  refetchActive: true,
                });
              },
            },
          );
        }
      }
    }
  };
  // await updateDoc(doc(dbService, 'gallery', detailGalleryPost.id), {
  //   like: [...detailGalleryPost.like, user],
  // });
  // await updateDoc(doc(dbService, 'profile', user), {
  //   postLike: arrayUnion(detailGalleryPost.id),
  // });
  // await updateDoc(doc(dbService, 'gallery', detailGalleryPost.id), {
  //   like: detailGalleryPost?.like.filter((prev: any) => prev !== user),
  // });
  // await updateDoc(doc(dbService, 'profile', user), {
  //   postLike: arrayRemove(detailGalleryPost.id),
  // });

  return (
    <LikeWrapper>
      {board ? (
        <>
          <LikeContainer>
            좋아요
            <LikeCount>{boardLikeCount}</LikeCount>
            <Image
              src={boardLikeChecked ? checkedLike : likeImg}
              onClick={likeCounter}
              alt="좋아요"
              width={50}
              height={50}
            />
          </LikeContainer>
        </>
      ) : (
        <>
          <LikeContainer>
            좋아요
            <LikeCount>{galleryLikeCount}</LikeCount>
            <Image
              src={galleryLikeChecked ? checkedLike : likeImg}
              onClick={likeCounter}
              alt="좋아요"
              width={50}
              height={50}
            />
          </LikeContainer>
        </>
      )}
    </LikeWrapper>
  );
};

const LikeWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
const LikeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
`;

const LikeCount = styled.span`
  display: flex;
`;
export default Like;
