import { useState, useEffect } from 'react';
import {
  query,
  collection,
  getDocs,
  where,
  onSnapshot,
} from 'firebase/firestore';
import { dbService, authService } from '@/firebase';
import Follow from '@/components/Follow';

type Follow = {
  id: string;
  area?: string;
  introduction?: string;
  instagram?: string;
  displayName?: string;
  email?: string;
  photoURL?: string;
  loginState?: boolean;
  follow?: string;
  uid?: string;
};

const Home = () => {
  const [followInformation, setFollowInformation] = useState<Follow[]>([]);

  const userUid: any = String(authService.currentUser?.uid);

  useEffect(() => {
    const q = query(
      collection(dbService, 'profile'),
      where('uid', '!=', userUid),
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newfollows = snapshot.docs.map((doc) => {
        const newfollow = {
          id: doc.id,
          ...doc.data(),
        };
        return newfollow;
      });
      setFollowInformation(newfollows);
    });

    return () => {
      unsubscribe();
    };
  }, [authService.currentUser]);

  return (
    <div>
      {followInformation.map((item) => {
        return <Follow key={item.id} item={item} userUid={userUid} />;
      })}
    </div>
  );
};

export default Home;
