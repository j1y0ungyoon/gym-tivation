import { ProfileItem } from '@/pages/myPage';
import { setDoc, doc, updateDoc } from 'firebase/firestore';
import { authService, dbService } from '@/firebase';
import { useState, useEffect } from 'react';
import { collection, query, getDocs, where } from 'firebase/firestore';
import { push } from 'firebase/database';

type ProfileEditProps = {
  item: ProfileItem;
};
const Test = ({ item }: ProfileEditProps) => {
  const [tests, setTests] = useState([] as any);
  const [testss, setTestss] = useState([] as any);
  const user = authService.currentUser;
  const test = async () => {
    if (user !== null) {
      await updateDoc(doc(dbService, 'profile', user.uid), {
        following: [item.id],
      });
      await updateDoc(doc(dbService, 'profile', item.id), {
        follower: [user.uid],
      });
      alert('팔로우 완료');
    }
  };

  console.log(tests);

  return (
    <div>
      <h2>{item.displayName}</h2>
      <button onClick={test}>팔로우</button>
    </div>
  );
};

export default Test;
