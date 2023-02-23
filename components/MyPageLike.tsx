import { getDocs, collection, orderBy, query } from 'firebase/firestore';
import { dbService, authService } from '@/firebase';
import { useEffect, useState } from 'react';

// type Like = {
//   id: string;
//   photo: string;
//   userId: string;
// };

const MyPageLike = () => {
  //   const [likeinformation, setLikeInForMation] = useState<Like[]>([]);
  //   const getLike = async () => {
  //     const q = query(
  //       collection(dbService, 'posts'),
  //       orderBy('createdAt', 'desc'),
  //     );
  //     const data = await getDocs(q);
  //     const getGalleryData = data.docs.map((doc: any) => ({
  //       id: doc.id,
  //       ...doc.data(),
  //     }));
  //     setLikeInForMation(getGalleryData);
  //   };

  //   useEffect(() => {
  //     getLike();

  //     return () => {
  //       getLike();
  //     };
  //   }, [authService.currentUser?.uid]);

  //   console.log(likeinformation);
  return <div>구현 예정</div>;
};
export default MyPageLike;
