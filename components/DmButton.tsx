import React, { useEffect } from 'react';
import styled from 'styled-components';
import { dmListsState, roomState } from '@/recoil/dmData';
import { useRecoilState } from 'recoil';
import { useRouter } from 'next/router';

import { authService } from '@/firebase';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { addDm, getMyDms } from '@/pages/api/api';
import Loading from './common/globalModal/Loading';

interface DmButtonProps {
  id?: string;
}

const DmButton = ({ id }: DmButtonProps) => {
  const [dmLists, setDmLists] = useRecoilState<any>(dmListsState);
  const [roomNum, setRoomNum] = useRecoilState(roomState);

  const user = authService.currentUser;
  const userId = String(user?.uid);
  const router = useRouter();
  const ids = dmLists.map((dmList: any) => dmList.id);
  const queryClient = useQueryClient();

  // myDms 불러오는 함수
  const { data: myDms, isLoading: myDmsLoading } = useQuery(
    ['myDms', user?.uid],
    getMyDms,
  );

  // dm 추가 뮤테이션
  const { mutate: createDm } = useMutation('createDm', addDm, {
    onSuccess: async () => {
      await queryClient.invalidateQueries('myDms');
    },
    onError: (error) => {
      console.log(error);
    },
  });

  useEffect(() => {
    setDmLists(myDms);
  }, [ids]);

  const onClickDm = async () => {
    if (!id || !user) return;

    // 리스트에 없는 방일 때
    if (!ids.includes(`${user.uid + id}` || `${id + user.uid}`)) {
      createDm({ myId: user.uid, appoId: id });
      setRoomNum(user.uid + id);
      if (router.pathname !== '/chat') {
        router.push('/chat');
      }
    }

    // 리스트에 이미 있는 방일 때
    if (ids.includes(`${user.uid + id}`)) {
      setRoomNum(user.uid + id);
      if (router.pathname !== '/chat') {
        router.push('/chat');
      }
    } else if (ids.includes(`${id + user.uid}`)) {
      setRoomNum(id + user.uid);
      if (router.pathname !== '/chat') {
        router.push('/chat');
      }
    }
  };

  if (myDmsLoading) {
    return <Loading />;
  }

  return (
    <>
      {id !== userId ? (
        <DmButtonWrapper onClick={() => onClickDm()}>
          <IconImg src="/assets/icons/myPage/DM.svg" />
          메시지
        </DmButtonWrapper>
      ) : null}
    </>
  );
};

export default DmButton;

const DmButtonWrapper = styled.button`
  margin-left: 20px;
  ${({ theme }) => theme.btn.btn50}
  background-color: #fff;
  color: #000;
  :hover {
    background-color: #ffcab5;
    color: black;
  }
`;

const IconImg = styled.img`
  width: 1.5rem;
  height: 1.5rem;
  margin-right: 5px;
  margin-bottom: 2px;
`;
