import styled from 'styled-components';
import { useMutation, useQueryClient } from 'react-query';
import { deleteMainComment } from '@/pages/api/api';
import { authService } from '@/firebase';
import { doc, runTransaction } from 'firebase/firestore';
import { dbService } from '@/firebase';

const MainComment = ({ item }: any) => {
  const queryClient = useQueryClient();
  const user = authService.currentUser?.uid;
  //   댓글 삭제 useMutation
  const { mutate: removeBoardComment, isLoading: isDeleting } =
    useMutation(deleteMainComment);

  // 게시글 삭제 클릭 이벤트
  const onClickDeleteComment = async () => {
    const answer = confirm('정말 삭제하시겠습니까?');

    if (answer) {
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
    } else {
      return;
    }
  };

  if (isDeleting) {
    return <div>삭제중입니다</div>;
  }

  return (
    <>
      <CommentWrapper>
        <div>{item.number}등</div>
        <ProfileImage src={item?.photo} />
        <NickName>{item?.nickName}</NickName>
        <div>{item.userLv}</div>
        <div>{item.userLvName}</div>
        <div>{item.postCount}일째 운동 중</div>
        <CommentListWrapper>{item.comment}</CommentListWrapper>
        {user === item?.user ? (
          <DeleteButton onClick={onClickDeleteComment}>삭제</DeleteButton>
        ) : null}
      </CommentWrapper>
    </>
  );
};

const CommentWrapper = styled.div`
  display: flex;
  flex-direction: row;
`;
const CommentListWrapper = styled.div`
  display: flex;
  align-items: center;
  width: 80%;
  margin: 1rem;
`;
const NickName = styled.div`
  display: flex;
  width: 3rem;
  align-items: center;
  margin: 1rem;
`;
const DeleteButton = styled.button`
  width: 5rem;
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
