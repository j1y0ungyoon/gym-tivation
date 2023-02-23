import { useState, useEffect } from 'react';
import {
  query,
  collection,
  getDocs,
  where,
  onSnapshot,
  updateDoc,
} from 'firebase/firestore';
import { dbService, authService } from '@/firebase';
import Follow from '@/components/Follow';
import styled from 'styled-components';

export type Follows = {
  id: string;
  area?: string;
  introduction?: string;
  instagram?: string;
  displayName?: string;
  email?: string;
  photoURL?: string;
  loginState?: boolean;
  follower?: string;
  following?: string;
  uid?: string;
};

const FollowTest = () => {
  const [followInformation, setFollowInformation] = useState<Follows[]>([]);
  const [following, setFollowing] = useState([] as any);

  const userUid: any = String(authService.currentUser?.uid);
  const follwoingInformation = String(following);

  const followGetDoc = () => {
    const q = query(
      collection(dbService, 'profile'),
      where('uid', '==', userUid),
    );
    onSnapshot(q, (snapshot) => {
      snapshot.docs.map((doc) => {
        setFollowing((prev: any) => [...prev, doc.data().following]);
      });
    });
  };

  const users = () => {
    const q = query(collection(dbService, 'profile'));
    onSnapshot(q, (snapshot) => {
      const newfollows = snapshot.docs.map((doc) => {
        const newfollow = {
          id: doc.id,
          ...doc.data(),
        };
        return newfollow;
      });
      setFollowInformation(newfollows);
    });
  };
  useEffect(() => {
    users();
    followGetDoc();
    return () => {
      users();
      followGetDoc();
    };
  }, [authService.currentUser]);

  return (
    <Test>
      {followInformation
        .filter((item) => item.id !== userUid)
        .map((item) => {
          return (
            <Follow
              setFollowing={setFollowing}
              following={following}
              key={item.id}
              item={item}
              userUid={userUid}
              follwoingInformation={follwoingInformation}
            />
          );
        })}
    </Test>
  );
};

export default FollowTest;

const Test = styled.div``;
