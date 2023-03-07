import { authService, dbService } from '@/firebase';
import { getDocs, query, collection, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';

interface DmListUserNameProps {
  enterUser: string;
}
const DmListUserName = ({ enterUser }: DmListUserNameProps) => {
  const [name, setName] = useState('');

  const enterUserNameGetDoc = async () => {
    const nameDoc = await getDocs(
      query(collection(dbService, 'profile'), where('uid', '==', enterUser)),
    );

    const name = nameDoc?.docs[0]?.data().displayName;
    if (!name) {
      setName('나와의채팅');
    } else {
      setName(name);
    }
  };

  useEffect(() => {
    if (enterUser) {
      enterUserNameGetDoc();
    }
  }, [enterUser]);

  return <>{name}</>;
};

export default DmListUserName;
