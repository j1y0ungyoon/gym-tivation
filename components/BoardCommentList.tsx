import { authService, dbService } from '@/firebase';
import { BoardCommentType } from '@/type';
import {
  query,
  addDoc,
  collection,
  onSnapshot,
  orderBy,
} from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import BoardComment from './BoardComment';

const BoardCommentList = ({ id }: { id: string }) => {
  const [inputBoardComment, setInputBoardComment] = useState('');
  const [boardComments, setBoardComments] = useState<BoardCommentType[]>([]);
  const user = authService.currentUser?.uid;
  const nickName = authService.currentUser?.displayName;
  const userPhoto = authService.currentUser?.photoURL;
  const onChangeInputBoardComment = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setInputBoardComment(event.target.value);
  };
  const onPressSubmitComment = (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === 'Enter') {
      onSubmitBoardCommemt();
    }
  };
  const onSubmitBoardCommemt = async () => {
    if (!inputBoardComment) {
      alert('댓글 내용을 입력해주세요!');
      return;
    }
    const newComment = {
      postId: id,
      user: user,
      nickName: nickName,
      photo: userPhoto,
      boardComment: inputBoardComment,
      createdAt: Date.now(),
    };
    await addDoc(collection(dbService, 'boardComment'), newComment);
    setInputBoardComment('');
  };

  useEffect(() => {
    const commentsRef = collection(dbService, 'boardComment');
    const q = query(commentsRef, orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newComments = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBoardComments(newComments);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <CommentListWrapper>
      <InputWrapper>
        <CommentInput
          onChange={onChangeInputBoardComment}
          onKeyUp={onPressSubmitComment}
          value={inputBoardComment}
        />

        <ButtonWrapper>
          <SubmitCommentButton onClick={onSubmitBoardCommemt}>
            등록
          </SubmitCommentButton>
        </ButtonWrapper>
      </InputWrapper>
      {boardComments
        .filter((item) => item.postId === id)
        .map((item) => {
          return <BoardComment key={item.id} item={item} />;
        })}
    </CommentListWrapper>
  );
};
const CommentListWrapper = styled.div``;
const CommentWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;
const InputWrapper = styled.div`
  display: flex;
`;

const CommentInput = styled.input`
  width: 40rem;
  height: 2.5rem;
  margin-top: 1rem;
  border-radius: 1rem;
  border: 0.1px solid black;
`;
const ButtonWrapper = styled.div``;
const SubmitCommentButton = styled.button`
  width: 4rem;
  height: 2.5rem;
  align-items: center;
  justify-content: center;
  margin: 1rem;
  border-radius: 1rem;
  border: 0.1px solid black;
`;
export default BoardCommentList;
