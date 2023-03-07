import React, { useEffect } from 'react';
import styled from 'styled-components';
import { apponentState, dmListsState, roomState } from '@/recoil/dmData';
import { useRecoilState } from 'recoil';
import Router, { useRouter } from 'next/router';

import {
  addDoc,
  collection,
  getDocs,
  onSnapshot,
  query,
} from 'firebase/firestore';
import { authService, dbService } from '@/firebase';

interface DmButtonProps {
  id: string;
}

const DmButton = ({ id }: DmButtonProps) => {
  const [apponentId, setApponentId] = useRecoilState(apponentState);
  const [dmLists, setDmLists] = useRecoilState<any>(dmListsState);
  const [roomNum, setRoomNum] = useRecoilState(roomState);

  const user = authService.currentUser;
  const router = useRouter();

  // const getDms = async () => {
  //   const q = query(collection(dbService, 'dms'));
  //   const getDmsDocs = await getDocs(q);

  //   setDmLists(() =>
  //     getDmsDocs.docs
  //       .map((doc) => doc.data())
  //       .filter((dm) => dm.enterUser.includes(user?.uid)),
  //   );
  // };

  useEffect(() => {
    // getDms();
    // console.log('@@@@@@@@@@', dmLists);

    onSnapshot(query(collection(dbService, 'dms')), (snapshot: any) => {
      const dms = snapshot.docs.map((doc: any) => ({
        id: doc.id,
        ...doc.data(),
      }));
      const myDms = dms.filter((dm: any) => {
        if ((dm.enterUser[0] || dm.enterUser[1]) === user?.uid) {
          return dm;
        }
      });
      setDmLists(myDms);
    });
  }, [user]);

  const onClickDm = async () => {
    setApponentId(id);
    if (!id) {
      return;
    }

    // if (!user?.uid || !id) {
    //   return console.log('뭔가 못받음');
    // }
    // console.log('dmLists 입니다', { dmLists, id });
    // for (const dmList of dmLists) {
    //   if (dmList.enterUser.includes(id)) {
    //     console.log('있는방');
    //     setRoomNum(user?.uid + id);
    //     break;
    //   } else {
    //     console.log('없는방');
    //     await addDoc(collection(dbService, 'dms'), {
    //       id: user?.uid + id,
    //       enterUser: [user?.uid, id],
    //       chatLog: [],
    //     });
    //     setRoomNum(user?.uid + id);
    //     getDms();
    //     break;
    //   }
    // }

    for (let i = 0; i < dmLists.length; i++) {
      const dmList = dmLists[i];
      const regex = new RegExp(
        `^(${user?.uid}|${apponentId})(${apponentId}|${user?.uid})$`,
      );

      if (regex.test(dmList.id)) {
        console.log('이미 있는 방임');
        setRoomNum(dmList.id);
        if (router.pathname !== '/chat') {
          console.log('채팅방 아니네? 채팅방 보내줌');
          router.push('/chat');
          break;
        }
        break;
      } else {
        console.log('없는 방이네? 추가함');
        addDoc(collection(dbService, 'dms'), {
          id: user?.uid + apponentId,
          enterUser: [user?.uid, apponentId],
          chatLog: [],
        });
        setRoomNum(user?.uid + apponentId);
        if (router.pathname !== '/chat') {
          console.log('채팅방 아니네? 채팅방 보내줌');
          router.push('/chat');
          break;
        }
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
