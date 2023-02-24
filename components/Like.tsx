import { authService, dbService } from '@/firebase';

import { doc, updateDoc } from 'firebase/firestore';
import { useState } from 'react';
import styled from 'styled-components';

const Like = ({ detailPost }: any) => {
  // const [likes, setLikes] = useState(false);
  const likeCount = detailPost?.like?.length;
  const user: any = String(authService.currentUser?.uid);

  // const likeClick=()=>{
  //     if(likee)
  // }
  const likeChecked = detailPost?.like?.includes(user);
  const likeCounter = async () => {
    if (authService.currentUser) {
      if (!likeChecked) {
        await updateDoc(doc(dbService, 'posts', detailPost.id), {
          like: [...detailPost.like, user],
        });
      }
      if (likeChecked) {
        await updateDoc(doc(dbService, 'posts', detailPost.id), {
          like: detailPost?.like.filter((prev: any) => prev !== user),
        });
      }
    }
  };

  return (
    <LikeWrapper>
      <LikeButton onClick={likeCounter}>좋아요 누르기</LikeButton>
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
