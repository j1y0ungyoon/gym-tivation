import { authService, dbService } from '@/firebase';

import { doc, updateDoc } from 'firebase/firestore';
import { useState } from 'react';

const Like = ({ detailPost }: any) => {
  const [likes, setLikes] = useState(false);
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

  return <button onClick={likeCounter}>Like{likeCount}</button>;
};

export default Like;
