import styled from 'styled-components';
import { dbService, authService } from '@/firebase';
import { doc, updateDoc, arrayRemove, arrayUnion } from 'firebase/firestore';
import { useMutation, useQueryClient } from 'react-query';
import useModal from '@/hooks/useModal';
import { GLOBAL_MODAL_TYPES } from '@/recoil/modalState';

type FollowButtonType = {
  item: ProfileItem;
  Id?: string;
};
//item은 firebase profile를 map으로 돌린 값
//Id는 상대방 id값
const FollowButton = ({ item, Id }: FollowButtonType) => {
  const { showModal } = useModal();
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
  return (
    <>
      {item.follower?.includes(user) ? (
        <>
          {item.id === authService.currentUser?.uid ? null : (
            <EditButton
              style={{ backgroundColor: '#FF4800', color: 'white' }}
              onClick={() => FollowReMoveOnClick()}
            >
              <IconImg src="/assets/icons/myPage/followingcheck.svg" />
              팔로잉
            </EditButton>
          )}
        </>
      ) : (
        <>
          {item.id === authService.currentUser?.uid ? null : (
            <EditButton
              onClick={() =>
                authService.currentUser
                  ? FollowOnClick()
                  : showModal({
                      modalType: GLOBAL_MODAL_TYPES.AlertModal,
                      modalProps: { contentText: '로그인 후 이용해주세요!' },
                    })
              }
            >
              <IconImg src="/assets/icons/myPage/Follow.svg" />
              팔로우
            </EditButton>
          )}
        </>
      )}
    </>
  );
};
export default FollowButton;

const EditButton = styled.button`
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
