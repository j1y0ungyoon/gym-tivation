import styled from 'styled-components';
import { useMutation, useQueryClient } from 'react-query';
import { deleteMainComment } from '@/pages/api/api';
import { authService } from '@/firebase';
import { doc, runTransaction } from 'firebase/firestore';
import { dbService } from '@/firebase';
import useModal from '@/hooks/useModal';
import { GLOBAL_MODAL_TYPES } from '@/recoil/modalState';

const MainComment = ({ item }: any) => {
  const queryClient = useQueryClient();
  const user = authService.currentUser?.uid;
  //   댓글 삭제 useMutation
  const { mutate: removeBoardComment, isLoading: isDeleting } =
    useMutation(deleteMainComment);

  const { showModal } = useModal();

  // 게시글 삭제 클릭 이벤트
  const onClickDeleteComment = () => {
    const onDeleteFunction = async () => {
      try {
        await removeBoardComment(item.id, {
          onSuccess: () => {
            queryClient.invalidateQueries('getCommentData', {
              refetchActive: true,
            });
          },
        });

        await runTransaction(dbService, async (transaction) => {
          const sfDocRef = doc(dbService, 'posts', String(item.id));
          const sfDoc = await transaction.get(sfDocRef);
          if (!sfDoc.exists()) {
            throw '데이터가 없습니다.';
          }
          const commentNumber = sfDoc.data().comment - 1;
          transaction.update(sfDocRef, { comment: commentNumber });
        });
      } catch (error) {
        console.log('에러입니다', error);
      }
    };

    showModal({
      modalType: GLOBAL_MODAL_TYPES.ConfirmModal,
      modalProps: {
        contentText: '정말 삭제하시겠습니까?',
        handleConfirm: onDeleteFunction,
      },
    });
  };

  return (
    <>
      <CommentWrapper>
        <CommentContainer>
          <NumberWrapper>{item.number}등</NumberWrapper>
          <NickName>
            <ProfileImage src={item?.photo} />
            {item?.nickName}
          </NickName>

          <CommentListWrapper>{item.comment}</CommentListWrapper>
          <PostCountWrapper>{item.postCount}일째 운동 중</PostCountWrapper>
          <UserLvWrapper>LV {item.userLv}</UserLvWrapper>

          {user === item?.user ? (
            <DeleteButton onClick={onClickDeleteComment}>삭제</DeleteButton>
          ) : (
            <DeleteButton
              style={{
                backgroundColor: 'white',
                border: 'none',
                cursor: 'default',
              }}
            />
          )}
        </CommentContainer>
      </CommentWrapper>
    </>
  );
};
export const PostCountWrapper = styled.span`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 15%;
`;
export const UserLvNameWrapper = styled.span`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 5px;
  min-width: 5%;
`;
export const UserLvWrapper = styled.span`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-direction: center;
  margin: 5px;

  min-width: 5%;
`;
const NumberWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 10%;
`;

const CommentWrapper = styled.div`
  display: flex;
  flex-direction: row;
  border: 1px solid black;
  margin: 10px;
  align-items: center;
  justify-content: center;
  height: 80px;
  width: 1200px;
  box-shadow: -2px 2px 0px 0px #000000;
  border-radius: 19px;
`;
const CommentContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 100%;
`;
export const CommentListWrapper = styled.span`
  display: flex;
  align-items: center;
  width: 80%;
  margin: 10px;
`;
export const NickName = styled.div`
  display: flex;
  min-width: 15%;
  align-items: center;
`;
const DeleteButton = styled.button`
  width: 7%;
  height: 2.5rem;
  align-items: center;
  justify-content: center;
  margin: 1rem;
  border-radius: 1rem;
  border: 0.1px solid black;
`;
const ProfileImage = styled.img`
  display: flex;
  align-items: center;
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  margin-left: 1rem;
  margin-right: 0.6rem;
`;

export default MainComment;
