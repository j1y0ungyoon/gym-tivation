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
import { chatCategoryState } from '@/recoil/chat';
import Image from 'next/image';

interface DmButtonProps {
  id?: string;
  propWidth?: string;
  propHeight?: string;
  propDisplay?: string;
  propBorderRadius?: string;
  propMinWidth?: string;
  propPadding?: string;
  propMarginLeft?: string;
}
interface DmButtonWrapperProps {
  width?: string | undefined;
  height?: string | undefined;
  borderRadius?: string | undefined;
  minWidth?: string | undefined;
  padding?: string | undefined;
  marginLeft?: string | undefined;
}
interface TextProps {
  display?: string | undefined;
}
const DmButton = ({
  id,
  propWidth,
  propHeight,
  propDisplay,
  propBorderRadius,
  propMinWidth,
  propPadding,
  propMarginLeft,
}: DmButtonProps) => {
  const [dmLists, setDmLists] = useRecoilState<any>(dmListsState);
  const [roomNum, setRoomNum] = useRecoilState(roomState);
  const [width, setWidth] = useState('120px');
  const [height, setHeight] = useState('40px');
  const [display, setDisplay] = useState('flex');
  const [borderRadius, setBorderRadius] = useState('40px');
  const [minWidth, setMinWidth] = useState('120px');
  const [padding, setPadding] = useState('0 20px');
  const [marginLeft, setMarginLeft] = useState('20px');
  const user = authService.currentUser;
  const userId = String(user?.uid);
  const router = useRouter();
  const ids = dmLists?.map((dmList: any) => dmList.id);
  const queryClient = useQueryClient();
  const { showModal } = useModal();

  const [isMyDmOn, setIsMyDmOn] = useRecoilState(chatCategoryState);

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

    if (propDisplay) {
      setDisplay(propDisplay);
    }
    if (propBorderRadius) {
      setBorderRadius(propBorderRadius);
    }
    if (propMinWidth) {
      setMinWidth(propMinWidth);
    }
    if (propPadding) {
      setPadding(propPadding);
    }
    if (propMarginLeft) {
      setMarginLeft(propMarginLeft);
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
    if (ids.includes(`${user.uid + id}`) || ids.includes(`${id + user.uid}`)) {
      const roomNum = ids.includes(`${user.uid + id}`)
        ? user.uid + id
        : id + user.uid;
      setRoomNum(roomNum);
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
          minWidth={minWidth}
          width={width}
          height={height}
          borderRadius={borderRadius}
          padding={padding}
          marginLeft={marginLeft}
          onClick={() => {
            setIsMyDmOn(true);
            authService.currentUser
              ? onClickDm()
              : showModal({
                  modalType: GLOBAL_MODAL_TYPES.AlertModal,
                  modalProps: { contentText: '로그인 후 이용해주세요!' },
                });
          }}
        >
          <IconImg>
            <Image
              layout="fill"
              objectFit="cover"
              objectPosition="center"
              alt="DM 아이콘"
              src="/assets/icons/myPage/DM.svg"
            />
          </IconImg>
          <Text display={display}> 메시지</Text>
        </DmButtonWrapper>
      ) : null}
    </>
  );
};

export const MemoizedDmButton = React.memo(DmButton);
export default DmButton;

const DmButtonWrapper = styled.button<DmButtonWrapperProps>`
  display: flex;
  align-items: center;
  margin-left: ${(props) => props.marginLeft};
  justify-content: center;
  ${({ theme }) => theme.btn.btn50};
  min-width: ${(props) => props.minWidth};
  width: ${(props) => props.width};
  height: ${(props) => props.height};
  padding: ${(props) => props.padding};
  box-shadow: -2px 2px 0px 1px #000000;
  background-color: #fff;
  color: #000;
  border-radius: ${(props) => props.borderRadius};
  :hover {
    background-color: #ffcab5;
    color: black;
  }
`;
const Text = styled.div<TextProps>`
  display: ${(props) => props.display};
  margin-left: 5px;
`;
const IconImg = styled.div`
  position: relative;
  width: 20px;
  height: 20px;
`;
