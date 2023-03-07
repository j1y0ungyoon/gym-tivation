import { authService, dbService } from '@/firebase';
import Comment from '@/components/comment/Comment';
import { CommentType } from '@/type';
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  runTransaction,
  doc,
} from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import useModal from '@/hooks/useModal';
import { GLOBAL_MODAL_TYPES } from '@/recoil/modalState';

// props로 받은 id는 해당 recruitPost의 id임
const CommentList = ({ id, category }: { id: string; category: string }) => {
  const [inputComment, setInputComment] = useState('');
  const [comments, setComments] = useState<CommentType[]>([]);
  const { showModal } = useModal();

  const onChangeInputComment = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      currentTarget: { value },
    } = event;
    setInputComment(value);
  };

  // 댓글 작성 완료
  const onSubmitComment = async () => {
    if (!inputComment) {
      showModal({
        modalType: GLOBAL_MODAL_TYPES.AlertModal,
        modalProps: { contentText: '댓글 내용을 작성해주세요!' },
      });
      return;
    }

    if (authService.currentUser) {
      const newComment = {
        postId: id,
        userId: authService.currentUser?.uid,
        nickName: authService.currentUser?.displayName,
        userPhoto: authService.currentUser?.photoURL,
        category,
        like: [],
        likeCount: 0,
        comment: inputComment,
        createdAt: Date.now(),
      };

      if (category === '동료 모집') {
        //댓글로 인한 수정
        await addDoc(collection(dbService, 'comments'), newComment)
          .then(() => console.log('데이터 전송 성공'))
          .catch((error) => console.log('에러 발생', error));
        setInputComment('');
        await runTransaction(dbService, async (transaction) => {
          const sfDocRef = doc(dbService, 'recruitments', id);
          const sfDoc = await transaction.get(sfDocRef);

          if (!sfDoc.exists()) {
            throw '데이터가 없습니다.';
          }
          const commentNumber = sfDoc.data().comment + 1;
          transaction.update(sfDocRef, { comment: commentNumber });
        });
        return;
      }
      if (category === '게시판') {
        await addDoc(collection(dbService, 'comments'), newComment)
          .then(() => console.log('데이터 전송 성공'))
          .catch((error) => console.log('에러 발생', error));
        setInputComment('');
        await runTransaction(dbService, async (transaction) => {
          const sfDocRef = doc(dbService, 'posts', id);
          const sfDoc = await transaction.get(sfDocRef);

          if (!sfDoc.exists()) {
            throw '데이터가 없습니다.';
          }
          const commentNumber = sfDoc.data().comment + 1;
          transaction.update(sfDocRef, { comment: commentNumber });
        });
        return;
      }
      if (category === '갤러리') {
        await addDoc(collection(dbService, 'comments'), newComment)
          .then(() => console.log('데이터 전송 성공'))
          .catch((error) => console.log('에러 발생', error));
        setInputComment('');
        await runTransaction(dbService, async (transaction) => {
          const sfDocRef = doc(dbService, 'gallery', id);
          const sfDoc = await transaction.get(sfDocRef);

          if (!sfDoc.exists()) {
            throw '데이터가 없습니다.';
          }
          const commentNumber = sfDoc.data().comment + 1;
          transaction.update(sfDocRef, { comment: commentNumber });
        });
        return;
      }
    }

    if (!authService.currentUser) {
      showModal({
        modalType: GLOBAL_MODAL_TYPES.LoginRequiredModal,
        modalProps: { contentText: '로그인 후 이용해주세요!' },
      });
      setInputComment('');
      return;
    }
  };

  // 엔터 후 댓글 작성 완료
  const onPressSubmitComment = (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === 'Enter') {
      onSubmitComment();
    }
  };

  // 실시간 댓글 불러오기
  useEffect(() => {
    const commentsRef = collection(dbService, 'comments');

    const q = query(commentsRef, orderBy('createdAt', 'asc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newComments = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setComments(newComments);
    });

    return () => {
      unsubscribe();
    };
  }, []);
  //scroll 아래로 내려가기 기능 추가 해야함
  return (
    <CommentListWrapper>
      <CommentWrapper>
        {comments
          .filter((comment) => comment.postId === id)
          .map((comment) => {
            return (
              <Comment key={comment.id} comment={comment} category={category} />
            );
          })}
      </CommentWrapper>
      <InputWrapper>
        {authService.currentUser ? (
          <CommentInput
            onChange={onChangeInputComment}
            onKeyPress={onPressSubmitComment}
            value={inputComment}
            type="text"
            maxLength={90}
            placeholder="최대 90자까지 입력할 수 있습니다"
          />
        ) : (
          <CommentInput disabled />
        )}

        <ButtonWrapper>
          {authService.currentUser ? (
            <SubmitCommentButton onClick={onSubmitComment}>
              등록
            </SubmitCommentButton>
          ) : (
            <SubmitCommentButton disabled>등록</SubmitCommentButton>
          )}
        </ButtonWrapper>
      </InputWrapper>
    </CommentListWrapper>
  );
};

export default CommentList;

const CommentListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 100%;
`;
const CommentWrapper = styled.div`
  display: flex;
  flex-direction: column-reverse;
  height: 100%;
  width: 100%;
  overflow: auto;
  overflow-x: hidden;
  &::-webkit-scrollbar {
    display: none;
  }
`;
const InputWrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  margin-top: 10px;
  margin-bottom: 10px;
`;

const CommentInput = styled.input`
  width: 100%;
  ${({ theme }) => theme.inputDiv}
  border: 0.1px solid black;
  outline: none;
  background-color: white;
`;
const ButtonWrapper = styled.div``;
const SubmitCommentButton = styled.button`
  ${({ theme }) => theme.btn.btn50}
  min-width:80px;
  margin-left: 5px;
  background-color: white;
  border: 1px solid black;
`;
