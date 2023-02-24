import React from 'react';
import { CommentType } from '@/type';
import styled from 'styled-components';
import { useMutation } from '@tanstack/react-query';
import { deleteComment } from '@/pages/api/api';
import { authService } from '@/firebase';

const Comment = ({ comment }: { comment: CommentType }) => {
  // 댓글 삭제 useMutation
  const { isLoading: isDeleting, mutate: removeComment } = useMutation(
    ['deleteComment', comment.id],
    (body: string) => deleteComment(body),
    {
      onSuccess: () => {
        console.log('수정 성공');
      },
      onError: (err) => {
        console.log('수정 실패:', err);
      },
    },
  );

  // 게시글 삭제 클릭 이벤트
  const onClickDeleteComment = async () => {
    const answer = confirm('정말 삭제하시겠습니까?');

    if (answer) {
      try {
        await removeComment(comment.id);
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
        <ProfileImage src={comment.userPhoto} />
        <NickName>{comment.nickName}</NickName>
        <CommentListWrapper>{comment.comment}</CommentListWrapper>
        {authService.currentUser?.uid === comment.userId ? (
          <DeleteButton onClick={onClickDeleteComment}>삭제</DeleteButton>
        ) : null}
      </CommentWrapper>
    </>
  );
};

export default Comment;

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
