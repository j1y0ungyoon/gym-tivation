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
      <div>
        <ProfileImage src={comment.userPhoto} />
        <span>{comment.nickName}</span>
        <span>{comment.comment}</span>
        {authService.currentUser?.uid === comment.userId ? (
          <button onClick={onClickDeleteComment}>삭제</button>
        ) : null}
      </div>
    </>
  );
};

export default Comment;

const ProfileImage = styled.img`
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  margin-left: 1rem;
  margin-right: 0.6rem;
`;
