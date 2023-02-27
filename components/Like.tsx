import { authService, dbService } from '@/firebase';
import { arrayRemove, arrayUnion, doc, updateDoc } from 'firebase/firestore';
import Image from 'next/image';
import { useState } from 'react';
import styled from 'styled-components';
import like from '../public/assets/images/like.png';
import checkedLike from '../public/assets/images/checkedLike.png';
const Like = ({ detailPost }: any) => {
  const likeCount = detailPost?.like?.length;
  const user: any = String(authService.currentUser?.uid);

  const likeChecked = detailPost?.like?.includes(user);
  const likeCounter = async () => {
    if (authService.currentUser) {
      if (!likeChecked) {
        await updateDoc(doc(dbService, 'posts', detailPost.id), {
          like: [...detailPost.like, user],
        });
        await updateDoc(doc(dbService, 'profile', user), {
          postLike: arrayUnion(detailPost.id),
        });
      }
      if (likeChecked) {
        await updateDoc(doc(dbService, 'posts', detailPost.id), {
          like: detailPost?.like.filter((prev: any) => prev !== user),
        });
        await updateDoc(doc(dbService, 'profile', user), {
          postLike: arrayRemove(detailPost.id),
        });
      }
    }
  };

  return (
    <LikeWrapper>
      <Image
        src={likeChecked ? checkedLike : like}
        onClick={likeCounter}
        alt="좋아요"
        width={50}
        height={50}
      />

      <LikeCount>{likeCount}</LikeCount>
    </LikeWrapper>
  );
};

const LikeWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const LikeCount = styled.div``;
export default Like;
