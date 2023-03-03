import { authService, dbService } from '@/firebase';
import { GalleryCommentType } from '@/type';
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  doc,
  runTransaction,
} from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import GalleryComment from './GalleryComment';

const GalleryCommentList = ({ id }: { id: string }) => {
  const [inputGalleryComment, setInputGalleryComment] = useState('');
  const [galleryComments, setGalleryComments] = useState<GalleryCommentType[]>(
    [],
  );

  const user = authService.currentUser?.uid;
  const nickName = authService.currentUser?.displayName;
  const userPhoto = authService.currentUser?.photoURL;

  const onChangeInputGalleryComment = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setInputGalleryComment(event.target.value);
  };
  const onPressSubmitGalleryComment = (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === 'Enter') {
      onSubmitGalleryComment();
    }
  };
  const onSubmitGalleryComment = async () => {
    if (!inputGalleryComment) {
      alert('댓글 내용을 입력해주세요!');
      return;
    }
    const newComment = {
      postId: id,
      user: user,
      nickName: nickName,
      photo: userPhoto,
      galleryComment: inputGalleryComment,
      createdAt: Date.now(),
    };
    await addDoc(collection(dbService, 'galleryComment'), newComment);
    setInputGalleryComment('');
    await runTransaction(dbService, async (transaction) => {
      const sfDocRef = doc(dbService, 'gallery', id);
      const sfDoc = await transaction.get(sfDocRef);
      if (!sfDoc.exists()) {
        throw '데이터가 없습니다.';
      }
      const commentNumber = sfDoc.data().comment + 1;
      transaction.update(sfDocRef, { comment: commentNumber });
    });
  };
  useEffect(() => {
    const commentRef = collection(dbService, 'galleryComment');
    const q = query(commentRef, orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newComments = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setGalleryComments(newComments);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <CommentListWrapper>
      <InputWrapper>
        <CommentInput
          onChange={onChangeInputGalleryComment}
          onKeyUp={onPressSubmitGalleryComment}
          value={inputGalleryComment}
        />

        <ButtonWrapper>
          <SubmitCommentButton onClick={onSubmitGalleryComment}>
            등록
          </SubmitCommentButton>
        </ButtonWrapper>
      </InputWrapper>
      <CommentWrapper>
        {galleryComments
          .filter((item) => item.postId === id)
          .map((item) => {
            return <GalleryComment key={item.id} item={item} />;
          })}
      </CommentWrapper>
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
export default GalleryCommentList;
