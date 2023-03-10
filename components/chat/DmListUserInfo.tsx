import { authService, dbService } from '@/firebase';
import { getDocs, query, collection, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

interface DmListUserInfoProps {
  enterUser: string;
}

const DmListUserInfo = ({ enterUser }: DmListUserInfoProps) => {
  const [userName, setUserName] = useState('');
  const [userImg, setUserImg] = useState<string | undefined | null>('');

  const enterUserInfoGet = async () => {
    const userDoc = await getDocs(
      query(collection(dbService, 'profile'), where('uid', '==', enterUser)),
    );

    const name = userDoc?.docs[0]?.data().displayName;
    if (!name) {
      setUserName('나와의채팅');
    } else {
      setUserName(name);
    }
    setUserImg(userDoc?.docs[0]?.data().photoURL);
    if (!name) {
      setUserImg(authService.currentUser?.photoURL);
    }
  };

  useEffect(() => {
    if (enterUser) {
      enterUserInfoGet();
    }
  }, [enterUser]);

  return (
    <DmListUserNameContainer>
      <UserImg src={userImg} />
      <UserName>{userName}</UserName>
    </DmListUserNameContainer>
  );
};

const DmListUserNameContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const UserImg = styled.img<any>`
  width: 40px;
  height: 40px;
  border-radius: 40px;
`;
const UserName = styled.span``;

export const MemoizedDmListUserInfo = React.memo(DmListUserInfo);
export default DmListUserInfo;
