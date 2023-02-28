import React, { useState } from 'react';
import { CommentType, EditCommentLikeParameterType } from '@/type';
import styled from 'styled-components';
import { useMutation } from '@tanstack/react-query';
import { deleteComment, editCommentLike } from '@/pages/api/api';
import { authService } from '@/firebase';
import { arrayUnion } from 'firebase/firestore';

const Comment = ({ comment }: { comment: CommentType }) => {
  // 좋아요 눌렀는지 표시
  const [isClickedLike, setIsClickedLike] = useState(false);

  // 좋아요 클릭 시 댓글 수정 useMutation
  const { mutate: clickLike } = useMutation(
    ['editCommentLike', comment.id],
    (body: EditCommentLikeParameterType) => editCommentLike(body),
    {
      onSuccess: () => {
        console.log('좋아요 수정 성공');
      },
      onError: (err) => {
        console.log('좋아요 수정 실패:', err);
      },
    },
  );

  // 댓글 삭제 useMutation
  const { isLoading: isDeleting, mutate: removeComment } = useMutation(
    ['deleteComment', comment.id],
    (body: string) => deleteComment(body),
    {
      onSuccess: () => {
        console.log('삭제 성공');
      },
      onError: (err) => {
        console.log('삭제 실패:', err);
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

  const onClickLike = async () => {
    if (!authService.currentUser) {
      alert('로그인 후 이용해주세요!');
      return;
    }

    const exist = comment.like?.findIndex(
      (userId) => userId === authService.currentUser?.uid,
    );

    console.log('exist', exist);

    if (exist === -1) {
      console.log('likeCount', comment.likeCount);
      if (comment.likeCount || comment.likeCount === 0) {
        await clickLike({
          commentId: comment.id,
          edittedComment: {
            like: arrayUnion(authService.currentUser?.uid),
            likeCount: comment.likeCount + 1,
          },
        });
        setIsClickedLike(true);
      }
      return;
    }

    if (exist !== -1) {
      if (comment.likeCount) {
        const edittedComments = comment.like?.filter(
          (userId) => userId !== authService.currentUser?.uid,
        );

        if (edittedComments) {
          await clickLike({
            commentId: comment.id,
            edittedComment: {
              like: [...edittedComments],
              likeCount: edittedComments.length,
            },
          });
        }
        setIsClickedLike(false);
      }
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
        {isClickedLike ? (
          <LikeImg
            onClick={onClickLike}
            src="/assets/icons/mapBoard/like_icon_active.svg"
          />
        ) : (
          <LikeImg
            onClick={onClickLike}
            src="/assets/icons/mapBoard/like_icon_inactive.svg"
          />
        )}
        {comment.likeCount !== 0 ? comment.likeCount : null}

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

const LikeImg = styled.img`
  cursor: pointer;
`;

const LikeImgBox = styled.div``;
