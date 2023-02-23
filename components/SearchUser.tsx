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

const SearchUser = ({
  setSearchOpen,
  searchName,
}: {
  setSearchOpen: (p: boolean) => void;
  searchName: string;
}) => {
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
    <>
      <UserWrapper>
        <UserClose
          onClick={() => {
            setSearchOpen(false);
          }}
        ></UserClose>
        <UserClose2
          onClick={() => {
            setSearchOpen(false);
          }}
        ></UserClose2>
        {searchName.length > 0
          ? followInformation
              .filter(
                (item) =>
                  item.displayName?.match(searchName) &&
                  authService.currentUser?.uid !== item.id,
              )
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
              })
          : followInformation
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
      </UserWrapper>
    </>
  );
};

export default SearchUser;

const UserWrapper = styled.div`
  position: absolute;
  overflow: auto;
  width: 27vw;
  height: 50vh;
  margin-top: 58vh;
  left: 67vw;
  background-color: white;
  background-color: rgba(255, 255, 255, 0.7);
`;

const UserClose = styled.div`
  z-index: 1500;
  width: 66vw;
  display: block;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;
const UserClose2 = styled.div`
  z-index: 1500;
  display: block;
  width: 100vw;
  position: fixed;
  top: 62vh;
  left: 0;
  right: 0;
  bottom: 0;
`;
