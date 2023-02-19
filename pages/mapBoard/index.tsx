import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { RecruitPostType } from '../type';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { dbService } from '@/firebase';
import RecruitPost from '@/components/RecrutPost';

const MapBoard = () => {
  const [recruitPosts, setRecruitPosts] = useState<RecruitPostType[]>();
  const router = useRouter();

  const goToWrite = () => {
    router.push('/mapBoard/WritingRecruitment');
  };

  const getRecruitPosts = () => {
    const recruitPostsRef = collection(dbService, 'recruitments');

    const q = query(recruitPostsRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newRecruitPosts = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRecruitPosts(newRecruitPosts);
    });

    return unsubscribe;
  };

  useEffect(() => {
    getRecruitPosts();
  }, []);

  return (
    <div>
      <h1>MapBoard</h1>
      {recruitPosts?.map((post) => {
        return <RecruitPost post={post} key={post.id} />;
      })}
      <h1>나의 운동 메이트를 구해보세요!</h1>
      <button onClick={goToWrite}>작성하기</button>
    </div>
  );
};

export default MapBoard;
