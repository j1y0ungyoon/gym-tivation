import styled from 'styled-components';
import { dbService, authService } from '@/firebase';
import { doc, updateDoc, arrayRemove, arrayUnion } from 'firebase/firestore';
import { useMutation, useQueryClient } from 'react-query';
import useModal from '@/hooks/useModal';
import { GLOBAL_MODAL_TYPES } from '@/recoil/modalState';
import { useEffect, useState } from 'react';
import Image from 'next/image';

type FollowButtonType = {
  item: ProfileItem;
  Id?: string;
  propWidth?: string;
  propHeight?: string;
  propDisplay?: string;
  propBorderRadius?: string;
  propMinWidth?: string;
  propPadding?: string;
};
interface FollowButtonProps {
  width?: string | undefined;
  height?: string | undefined;
  borderRadius?: string | undefined;
  minWidth?: string | undefined;
  padding?: string | undefined;
}
interface TextProps {
  display?: string | undefined;
}
//item은 firebase profile를 map으로 돌린 값
//Id는 상대방 id값
const FollowButton = ({
  item,
  Id,
  propWidth,
  propHeight,
  propDisplay,
  propBorderRadius,
  propMinWidth,
  propPadding,
}: FollowButtonType) => {
  const { showModal } = useModal();
  const [width, setWidth] = useState('120px');
  const [height, setHeight] = useState('40px');
  const [display, setDisplay] = useState('flex');
  const [borderRadius, setBorderRadius] = useState('40px');
  const [minWidth, setMinWidth] = useState('120px');
  const [padding, setPadding] = useState('0 20px');
  const user = String(authService.currentUser?.uid);
  const queryClient = useQueryClient();

  //팔로우, 팔로잉
  const FollowOn = async () => {
    if (user !== null) {
      await updateDoc(doc(dbService, 'profile', user), {
        following: arrayUnion(Id),
      });
      await updateDoc(doc(dbService, 'profile', item.id), {
        follower: arrayUnion(user),
      });
    }
  };

  const FollowReMove = async () => {
    if (user !== null) {
      await updateDoc(doc(dbService, 'profile', user), {
        following: arrayRemove(Id),
      });
      await updateDoc(doc(dbService, 'profile', item.id), {
        follower: arrayRemove(user),
      });
    }
  };
  const { mutate: FollowOnClick } = useMutation(['followOnClick'], FollowOn, {
    onSuccess: async () => {
      await queryClient.invalidateQueries('profile');
    },
    onError: (error) => {
      console.log('error : ', error);
    },
  });
  const { mutate: FollowReMoveOnClick } = useMutation(
    ['FollowReMoveOnClick'],
    FollowReMove,
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries('profile');
      },
      onError: (error) => {
        console.log('error : ', error);
      },
    },
  );
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
  }, []);
  return (
    <>
      {item.follower?.includes(user) ? (
        <>
          {item.id === authService.currentUser?.uid ? null : (
            <EditButton
              width={width}
              padding={padding}
              height={height}
              borderRadius={borderRadius}
              minWidth={minWidth}
              style={{ backgroundColor: '#FF4800', color: 'white' }}
              onClick={() => FollowReMoveOnClick()}
            >
              <IconImg>
                <Image
                  alt="팔로우 아이콘"
                  layout="fill"
                  objectFit="cover"
                  objectPosition="center"
                  src="/assets/icons/myPage/followingcheck.svg"
                />
              </IconImg>
              <Text display={display}>팔로잉</Text>
            </EditButton>
          )}
        </>
      ) : (
        <>
          {item.id === authService.currentUser?.uid ? null : (
            <EditButton
              width={width}
              padding={padding}
              height={height}
              borderRadius={borderRadius}
              minWidth={minWidth}
              onClick={() =>
                authService.currentUser
                  ? FollowOnClick()
                  : showModal({
                      modalType: GLOBAL_MODAL_TYPES.AlertModal,
                      modalProps: { contentText: '로그인 후 이용해주세요!' },
                    })
              }
            >
              <IconImg>
                <Image
                  alt="팔로우 아이콘"
                  layout="fill"
                  objectFit="cover"
                  objectPosition="center"
                  src="/assets/icons/myPage/Follow.svg"
                />
              </IconImg>

              <Text display={display}> 팔로우</Text>
            </EditButton>
          )}
        </>
      )}
    </>
  );
};
export default FollowButton;
const Text = styled.span<TextProps>`
  display: ${(props) => props.display};
  margin-left: 5px;
`;
const EditButton = styled.button<FollowButtonProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 20px;
  ${({ theme }) => theme.btn.btn50}
  box-shadow: -2px 2px 0px 1px #000000;
  background-color: #fff;
  color: #000;
  min-width: ${(props) => props.minWidth};
  width: ${(props) => props.width};
  height: ${(props) => props.height};
  padding: ${(props) => props.padding};
  border-radius: ${(props) => props.borderRadius};
  :hover {
    background-color: #ffcab5;
    color: black;
  }
`;
const IconImg = styled.div`
  position: relative;
  width: 1.5rem;
  height: 1.5rem;
`;
