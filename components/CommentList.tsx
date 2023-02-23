import { authService, dbService } from '@/firebase';
import Comment from '@/components/Comment';
import { CommentType } from '@/type';
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
} from 'firebase/firestore';
import React, { useEffect, useState } from 'react';

// props로 받은 id는 해당 recruitPost의 id임
const CommentList = ({ id }: { id: string }) => {
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

    const newComment = {
      postId: id,
      userId: authService.currentUser?.uid,
      nickName: authService.currentUser?.displayName,
      userPhoto: authService.currentUser?.photoURL,
      comment: inputComment,
      createdAt: Date.now(),
    };

    await addDoc(collection(dbService, 'comments'), newComment)
      .then(() => console.log('데이터 전송 성공'))
      .catch((error) => console.log('에러 발생', error));

    setInputComment('');
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

    const q = query(commentsRef, orderBy('createdAt', 'desc'));

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

  return (
    <>
      {comments
        .filter((comment) => comment.postId === id)
        .map((comment) => {
          return <Comment comment={comment} />;
        })}

      <div>
        <input
          onChange={onChangeInputComment}
          onKeyUp={onPressSubmitComment}
          value={inputComment}
        />
        <button onClick={onSubmitComment}>댓글 작성</button>
      </div>
    </>
  );
};

export default CommentList;
