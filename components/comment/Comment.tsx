import React, { useState } from 'react';
import { CommentType, EditCommentLikeParameterType } from '@/type';
import styled from 'styled-components';
import { useMutation } from 'react-query';
import { deleteComment, editCommentLike } from '@/pages/api/api';
import { authService, dbService } from '@/firebase';
import { arrayUnion, runTransaction, doc } from 'firebase/firestore';
import useModal from '@/hooks/useModal';
import { GLOBAL_MODAL_TYPES } from '@/recoil/modalState';

const Comment = ({
  comment,
  category,
}: {
  comment: CommentType;
  category: string;
}) => {
  // 좋아요 눌렀는지 표시
  const [isClickedLike, setIsClickedLike] = useState(false);

  const { showModal } = useModal();

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
  // const onClickDeleteComment = async () => {
  //   const answer = confirm('정말 삭제하시겠습니까?');

  //   if (answer) {
  //     try {
  //       await removeComment(comment.id);
  //       await runTransaction(dbService, async (transaction) => {
  //         const sfDocRef = doc(
  //           dbService,
  //           'recruitments',
  //           String(comment.postId),
  //         );
  //         const sfDoc = await transaction.get(sfDocRef);
  //         if (!sfDoc.exists()) {
  //           throw '데이터가 없습니다.';
  //         }
  //         const commentNumber = sfDoc.data().comment - 1;
  //         transaction.update(sfDocRef, { comment: commentNumber });
  //       });
  //     } catch (error) {
  //       console.log('에러입니다', error);
  //     }
  //   } else {
  //     return;
  //   }
  // };

  // 게시글 삭제 함수
  const deletePostComment = async () => {
    //댓글로 인한 수정
    if (category === '동료 모집') {
      try {
        await removeComment(comment.id);
        await runTransaction(dbService, async (transaction) => {
          const sfDocRef = doc(
            dbService,
            'recruitments',
            String(comment.postId),
          );
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
    }
    if (category === '게시판') {
      try {
        await removeComment(comment.id);
        await runTransaction(dbService, async (transaction) => {
          const sfDocRef = doc(dbService, 'posts', String(comment.postId));
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
    }
    if (category === '갤러리') {
      try {
        await removeComment(comment.id);
        await runTransaction(dbService, async (transaction) => {
          const sfDocRef = doc(dbService, 'gallery', String(comment.postId));
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
    }
  };

  // confirm 모달을 통해 코멘트 삭제하기
  const openConfrimModal = () => {
    showModal({
      modalType: GLOBAL_MODAL_TYPES.ConfirmModal,
      modalProps: {
        contentText: '정말 삭제하시겠습니까?',
        handleConfirm: deletePostComment,
      },
    });
  };

  const onClickLike = async () => {
    if (!authService.currentUser) {
      showModal({
        modalType: GLOBAL_MODAL_TYPES.AlertModal,
        modalProps: { contentText: '로그인 후 이용해주세요!' },
      });
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
          <ContentLikeBox>
            <CommentContent>
              <NickName>{comment.nickName}</NickName>
              <CommentListWrapper>{comment.comment}</CommentListWrapper>
            </CommentContent>

            <LikeBox>
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
              <LikeCount>{comment.likeCount}</LikeCount>
            </LikeBox>
          </ContentLikeBox>
        </UserProfile>
        {authService.currentUser?.uid === comment.userId ? (
          <DeleteButton onClick={openConfrimModal}>삭제</DeleteButton>
        ) : null}
      </CommentWrapper>
    </>
  );
};

export default Comment;

const CommentWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
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
  font-size: ${({ theme }) => theme.font.font10};
`;
const DeleteButton = styled.button`
  ${({ theme }) => theme.btn.btn50}
  min-width:80px;
  margin-left: 5px;
  border: 1px solid black;
  background-color: white;
`;

const UserProfile = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
`;

const CommentContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const ProfileImage = styled.img`
  ${({ theme }) => theme.profileDiv};
  margin-right: 8px;
`;

const ContentLikeBox = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  width: 100%;
`;

const LikeBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 12px;
`;
const LikeImg = styled.img`
  cursor: pointer;
  margin: 5px;
`;
const LikeCount = styled.span``;
const LikeImgBox = styled.div``;
