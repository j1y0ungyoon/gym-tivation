import { authService, dbService } from '@/firebase';
import { arrayRemove, arrayUnion, doc, updateDoc } from 'firebase/firestore';
import Image from 'next/image';
import { useState } from 'react';
import styled from 'styled-components';
import like from '../public/assets/images/like.png';
import checkedLike from '../public/assets/images/checkedLike.png';
const Like = ({ detailPost }: any) => {
  const [likes, setLikes] = useState(false);
  const likeCount = detailPost?.like?.length;
  const user: any = String(authService.currentUser?.uid);

  const likeChecked = detailPost?.like?.includes(user);
  const likeCounter = async () => {
    if (authService.currentUser) {
      if (!likeChecked) {
        await updateDoc(doc(dbService, 'posts', detailPost.id), {
          like: [...detailPost.like, user],
        });
        setLikes(true);
        await updateDoc(doc(dbService, 'profile', user), {
          postLike: arrayUnion(detailPost.id),
        });
      }
      if (likeChecked) {
        await updateDoc(doc(dbService, 'posts', detailPost.id), {
          like: detailPost?.like.filter((prev: any) => prev !== user),
        });
        setLikes(false);
        await updateDoc(doc(dbService, 'profile', user), {
          postLike: arrayRemove(detailPost.id),
        });
      }
    }
  };

  return (
    <LikeWrapper>
      <Image
        src={likes ? checkedLike : like}
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
const LikeButton = styled.button`
  width: 10rem;
  height: 2rem;
  border-radius: 1rem;
  background-color: #d9d9d9;
  margin: 1rem;
  border: none;
  cursor: pointer;
`;
const LikeCount = styled.div``;
export default Like;
