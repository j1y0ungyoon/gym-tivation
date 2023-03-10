import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { dmListsState, roomState } from '@/recoil/dmData';
import { useRecoilState } from 'recoil';
import { useRouter } from 'next/router';

import { authService } from '@/firebase';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { addDm, getMyDms } from '@/pages/api/api';
import Loading from './common/globalModal/Loading';
import { GLOBAL_MODAL_TYPES } from '@/recoil/modalState';
import useModal from '@/hooks/useModal';

interface DmButtonProps {
  id?: string;
  propWidth?: string;
  propHeight?: string;
}
interface DmButtonWrapperProps {
  width: string | undefined;
  height: string | undefined;
}
const DmButton = ({ id, propWidth, propHeight }: DmButtonProps) => {
  const [dmLists, setDmLists] = useRecoilState<any>(dmListsState);
  const [roomNum, setRoomNum] = useRecoilState(roomState);
  const [width, setWidth] = useState('100px');
  const [height, setHeight] = useState('40px');

  const user = authService.currentUser;
  const userId = String(user?.uid);
  const router = useRouter();
  const ids = dmLists?.map((dmList: any) => dmList.id);
  const queryClient = useQueryClient();
  const { showModal } = useModal();

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
    if (propWidth) {
      setWidth(propWidth);
    }
    if (propHeight) {
      setHeight(propHeight);
    }
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
        <DmButtonWrapper
          width={width}
          height={height}
          onClick={() =>
            authService.currentUser
              ? onClickDm()
              : showModal({
                  modalType: GLOBAL_MODAL_TYPES.AlertModal,
                  modalProps: { contentText: '로그인 후 이용해주세요!' },
                })
          }
        >
          <IconImg src="/assets/icons/myPage/DM.svg" />
          메시지
        </DmButtonWrapper>
      ) : null}
    </>
  );
};

export const MemoizedDmButton = React.memo(DmButton);
export default DmButton;

const DmButtonWrapper = styled.button<DmButtonWrapperProps>`
  margin-left: 20px;
  ${({ theme }) => theme.btn.btn50}
  min-width:${(props) => props.width};
  height: ${(props) => props.height};
  box-shadow: -2px 2px 0px 1px #000000;
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
