import { authService } from '@/firebase';
import { addMainComment, getMainComments } from '@/pages/api/api';
import { MainCommentType } from '@/type';
import { useMutation, useQuery, useQueryClient } from 'react-query';

import { useEffect, useState } from 'react';
import styled from 'styled-components';

import BoardComment from './BoardComment';

const BoardCommentList = ({ id }: MainCommentType) => {
  const queryClient = useQueryClient();
  const [inputComment, setInputComment] = useState('');
  const [mainComments, setMainComments] = useState<MainCommentType[]>([]);
  const [userLv, setUserLv] = useState('');
  const [userLvName, setUserLvName] = useState('');
  const [postCount, setPostCount] = useState<any>();
  const user = authService.currentUser?.uid;
  const nickName = authService.currentUser?.displayName;
  const userPhoto = authService.currentUser?.photoURL;

  const { data, isLoading } = useQuery(['getCommentData', id], getMainComments);

  const { mutate: addMutate } = useMutation(addMainComment);

  const onChangeInputComment = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputComment(event.target.value);
  };

  const onPressSubmitComment = (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === 'Enter') {
      onSubmitCommemt();
    }
  };

  // const getCommentNumber = async () => {
  //   const q = query(
  //     collection(dbService, 'gallery'),
  //     where('userId', '==', authService.currentUser?.uid),
  //   );
  //   const docsData = await getDocs(q);
  //   const galleryPostCount = docsData.docs.length;
  //   setPostCount(galleryPostCount);
  // };
  // const profileData = async () => {
  //   if (!authService.currentUser) return;
  //   const q = query(
  //     collection(dbService, 'profile'),
  //     where('uid', '==', authService.currentUser?.uid),
  //   );
  //   const docsData = await getDocs(q);
  //   const getLvName = docsData.docs[0].data().lvName;
  //   const getLv = docsData.docs[0].data().lv;
  //   setUserLvName(getLvName);
  //   setUserLv(getLv);
  // };

  const onSubmitCommemt = async () => {
    if (!inputComment) {
      alert('댓글 내용을 입력해주세요!');
      return;
    }

    const newComment = {
      user: user,
      nickName: nickName,
      photo: userPhoto,
      comment: inputComment,
      createdAt: Date.now(),
      // userLv: userLv,
      // userLvName: userLvName,
      // number: mainComments.length + 1,
      // postCount: postCount,
    };

    addMutate(newComment, {
      onSuccess: () => {
        queryClient.invalidateQueries('getCommentData', {
          refetchActive: true,
        });
      },
    });

    if (isLoading) {
      return <div>로딩중입니다</div>;
    }
    setInputComment('');
  };

  useEffect(() => {
    // const commentsRef = collection(dbService, 'mainComment');
    // const q = query(commentsRef, orderBy('createdAt', 'desc'));
    // const unsubscribe = onSnapshot(q, (snapshot) => {
    //   const newComments = snapshot.docs.map((doc) => ({
    //     id: doc.id,
    //     ...doc.data(),
    //   }));
    //   setMainComments(newComments);
    // });
    // profileData();
    // getCommentNumber();
    // return () => {
    //   unsubscribe();
    // };
  }, [postCount]);

  return (
    <CommentListWrapper>
      <InputWrapper>
        <CommentInput
          onChange={onChangeInputComment}
          onKeyPress={onPressSubmitComment}
          value={inputComment}
        />

        <ButtonWrapper>
          <SubmitCommentButton onClick={onSubmitCommemt}>
            등록
          </SubmitCommentButton>
        </ButtonWrapper>
      </InputWrapper>
      {data?.map((item) => {
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
