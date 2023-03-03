import { authService, dbService } from '@/firebase';
import Comment from '@/components/Comment';
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

// props로 받은 id는 해당 recruitPost의 id임
const CommentList = ({ id, category }: { id: string; category: string }) => {
  const [inputComment, setInputComment] = useState('');
  const [comments, setComments] = useState<CommentType[]>([]);

  const onChangeInputComment = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      currentTarget: { value },
    } = event;
    setInputComment(value);
  };

  // 댓글 작성 완료
  const onSubmitComment = async () => {
    if (!inputComment) {
      alert('댓글 내용을 작성해주세요!');
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

      if (category === '동료 모집' || '게시판' || '갤러리') {
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
    }

    if (!authService.currentUser) {
      alert('로그인을 먼저 해주세요!');
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
            return <Comment key={comment.id} comment={comment} />;
          })}
      </CommentWrapper>
      <InputWrapper>
        <CommentInput
          onChange={onChangeInputComment}
          onKeyUp={onPressSubmitComment}
          value={inputComment}
        />
        <ButtonWrapper>
          <SubmitCommentButton onClick={onSubmitComment}>
            등록
          </SubmitCommentButton>
        </ButtonWrapper>
      </InputWrapper>
    </CommentListWrapper>
  );
};

export default CommentList;

const CommentListWrapper = styled.div`
  width: 100%;
`;
const CommentWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;
const InputWrapper = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 50px;
`;

const CommentInput = styled.input`
  width: 100%;
  ${({ theme }) => theme.inputDiv}
  border: 0.1px solid black;
  outline: none;
`;
const ButtonWrapper = styled.div``;
const SubmitCommentButton = styled.button`
  ${({ theme }) => theme.btn.btn50}
  min-width:70px;
  margin-left: 5px;
`;
