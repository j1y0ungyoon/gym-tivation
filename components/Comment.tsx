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

    if (exist === -1) {
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
        <UserProfile>
          <ProfileImage src={comment.userPhoto} />
        </UserProfile>
        <CommentContent>
          <NickName>{comment.nickName}</NickName>
          <CommentListWrapper>{comment.comment}</CommentListWrapper>
        </CommentContent>
        <LikeBox>
          <LikeCount>{comment.likeCount}</LikeCount>
          <LikeImgBox>
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
          </LikeImgBox>
        </LikeBox>
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
  align-items: center;
`;
const CommentListWrapper = styled.span`
  display: flex;
  align-items: center;
  width: 100%;
  margin-bottom: 10px;
  font-size: ${({ theme }) => theme.font.font50};
  font-weight: 600;
  flex-wrap: wrap;
`;
const NickName = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  color: gray;
`;
const DeleteButton = styled.button`
  ${({ theme }) => theme.btn.btn50}
  min-width:70px;
  margin-left: 5px;
`;
const UserProfile = styled.div``;
const CommentContent = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
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
const LikeBox = styled.div`
  display: flex;
  align-items: center;
`;
const LikeImg = styled.img`
  cursor: pointer;
  margin: 5px;
`;
const LikeCount = styled.span``;
const LikeImgBox = styled.div`
  display: flex;
`;
