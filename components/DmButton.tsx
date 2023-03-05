import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { apponentState, dmListsState, roomState } from '@/recoil/dmData';
import { useRecoilState } from 'recoil';
import Router from 'next/router';

import { addDoc, collection, onSnapshot, query } from 'firebase/firestore';
import { authService, dbService } from '@/firebase';

interface DmButtonProps {
  id: string;
}

const DmButton = ({ id }: DmButtonProps) => {
  const [apponentId, setApponentId] = useRecoilState(apponentState);
  const [dmLists, setDmLists] = useRecoilState<any>(dmListsState);
  const [roomNum, setRoomNum] = useRecoilState(roomState);

  const user = authService.currentUser;

  useEffect(() => {
    onSnapshot(query(collection(dbService, 'dms')), (snapshot: any) => {
      const dms = snapshot.docs.map((doc: any) => ({
        id: doc.id,
        ...doc.data(),
      }));
      const myDms = dms.filter((dm: any) => {
        if (dm.enterUser) {
          if (dm.enterUser[0] || dm.enterUser[1] === user?.uid) {
            return dm;
          }
        }
      });
      setDmLists(myDms);
    });
  }, [user]);

  const onClickDm = async () => {
    setApponentId(id);

    for (let i = 0; i < dmLists.length; i++) {
      const dmList = dmLists[i];
      const regex = new RegExp(
        `^(${user?.uid}|${apponentId})(${apponentId}|${user?.uid})$`,
      );
      if (regex.test(dmList.id)) {
        setRoomNum(dmList.id);
        Router.push('/chat');
        break;
      } else {
        addDoc(collection(dbService, 'dms'), {
          id: user?.uid + apponentId,
          enterUser: [user?.uid, apponentId],
          chatLog: [],
        });
        setRoomNum(user?.uid + apponentId);
        Router.push('/chat');
        break;
      }
    }
  };

  return (
    <DmButtonWrapper onClick={() => onClickDm()}>
      <IconImg src="/assets/icons/myPage/DM.svg" />
      메시지
    </DmButtonWrapper>
  );
};

export default DmButton;

const DmButtonWrapper = styled.button`
  margin-left: 20px;
  ${({ theme }) => theme.btn.btn50}
  background-color: white;
  border: black;
  border-style: solid;
  border-width: 0.1rem;
  :hover {
    cursor: pointer;
    background-color: black;
    color: white;
  }
`;

const IconImg = styled.img`
  width: 1.5rem;
  height: 1.5rem;
  margin-right: 5px;
  margin-bottom: 2px;
`;
