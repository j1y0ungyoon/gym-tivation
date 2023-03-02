import { authService, dbService } from '@/firebase';
import { arrayRemove, arrayUnion, doc, updateDoc } from 'firebase/firestore';
import Image from 'next/image';

import styled from 'styled-components';
import like from '../public/assets/images/like.png';
import checkedLike from '../public/assets/images/checkedLike.png';
import { useRouter } from 'next/router';
const Like = ({ detailPost, detailGalleryPost }: any) => {
  const router = useRouter();
  const boardLikeCount = detailPost?.like?.length;
  const galleryLikeCount = detailGalleryPost?.like?.length;
  const user: any = String(authService.currentUser?.uid);
  const boardLikeChecked = detailPost?.like?.includes(user);
  const galleryLikeChecked = detailGalleryPost?.like?.includes(user);
  const board = router.pathname === '/boardDetail/[...params]';
  const gallery = router.pathname === '/galleryDetail/[...params]';

  const likeCounter = async () => {
    if (authService.currentUser) {
      if (board) {
        if (!boardLikeChecked) {
          await updateDoc(doc(dbService, 'posts', detailPost.id), {
            like: [...detailPost.like, user],
          });
          await updateDoc(doc(dbService, 'profile', user), {
            postLike: arrayUnion(detailPost.id),
          });
        } else {
          await updateDoc(doc(dbService, 'posts', detailPost.id), {
            like: detailPost?.like.filter((prev: any) => prev !== user),
          });
          await updateDoc(doc(dbService, 'profile', user), {
            postLike: arrayRemove(detailPost.id),
          });
        }
      }
      if (gallery) {
        if (!galleryLikeChecked) {
          await updateDoc(doc(dbService, 'gallery', detailGalleryPost.id), {
            like: [...detailGalleryPost.like, user],
          });
          await updateDoc(doc(dbService, 'profile', user), {
            postLike: arrayUnion(detailGalleryPost.id),
          });
        } else {
          await updateDoc(doc(dbService, 'gallery', detailGalleryPost.id), {
            like: detailGalleryPost?.like.filter((prev: any) => prev !== user),
          });
          await updateDoc(doc(dbService, 'profile', user), {
            postLike: arrayRemove(detailGalleryPost.id),
          });
        }
      }
    }
  };

  return (
    <LikeWrapper>
      {board ? (
        <>
          <LikeContainer>
            좋아요
            <LikeCount>{boardLikeCount}</LikeCount>
            <Image
              src={boardLikeChecked ? checkedLike : like}
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
              src={galleryLikeChecked ? checkedLike : like}
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
  width: 15%;
  border-radius: ${({ theme }) => theme.borderRadius.radius50};
  border: 1px solid black;
  margin: 20px;
  padding: 10px;
`;

const LikeCount = styled.span`
  display: flex;
  /* justify-content: center; */
`;
export default Like;
