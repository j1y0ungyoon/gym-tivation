import { authService, dbService } from '@/firebase';
import { addMainComment, getMainComments } from '@/pages/api/api';
import { MainCommentType } from '@/type';
import { useMutation, useQuery, useQueryClient } from 'react-query';

import { useEffect, useState } from 'react';
import styled from 'styled-components';

import MainComment from './MainComment';
import { collection, getDocs, query, where } from 'firebase/firestore';

interface MainCommentListProps {
  data:
    | {
        id: string;
      }[]
    | undefined;
}
const MainCommentList = ({ id }: MainCommentType) => {
  const queryClient = useQueryClient();
  const [inputComment, setInputComment] = useState('');
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

  const getCommentNumber = async () => {
    const q = query(
      collection(dbService, 'gallery'),
      where('userId', '==', authService.currentUser?.uid),
    );
    const docsData = await getDocs(q);
    const galleryPostCount = docsData.docs.length;
    setPostCount(galleryPostCount);
  };

  const profileData = async () => {
    const q = query(
      collection(dbService, 'profile'),
      where('uid', '==', authService.currentUser?.uid),
    );
    const docsData = await getDocs(q);
    const getLvName = docsData.docs[0].data()?.lvName;
    const getLv = docsData.docs[0].data()?.lv;
    setUserLvName(getLvName);
    setUserLv(getLv);
  };

  const onSubmitCommemt = async () => {
    if (!inputComment) {
      alert('댓글 내용을 입력해주세요!');
      return;
    }
    const getNumber: any = data?.length;
    const newComment: any = {
      user: user,
      nickName: nickName,
      photo: userPhoto,
      comment: inputComment,
      createdAt: Date.now(),
      userLv: userLv,
      userLvName: userLvName,
      number: getNumber + 1,
      postCount: postCount,
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
    if (!authService.currentUser?.uid) return;
    profileData();
    getCommentNumber();
  }, [postCount, user]);

  return (
    <CommentListWrapper>
      <InputWrapper>
        <TextContainer>
          <Icon src={'/assets/icons/main/Fire.png'} />

          <TextWrapper>GYMTIVATE 한마디</TextWrapper>
          <Icon src={'/assets/icons/main/Fire.png'} />
        </TextContainer>

        <InputContainer>
          <CommentInput
            placeholder="동기부여 입력하기"
            onChange={onChangeInputComment}
            onKeyPress={onPressSubmitComment}
            value={inputComment}
            maxLength={92}
          />

          <ButtonWrapper>
            <SubmitCommentButton onClick={onSubmitCommemt}>
              등록
            </SubmitCommentButton>
          </ButtonWrapper>
        </InputContainer>
      </InputWrapper>
      <MainCommentWrapper>
        <ContentWrapper>
          <NumberWrapper>등수</NumberWrapper>
          <Text>운동 동료</Text>
          <CommentWrapper>동기부여 한마디</CommentWrapper>
          <CountWrapper>오운완 인증일</CountWrapper>
          <LvWrapper>레벨</LvWrapper>
        </ContentWrapper>
        {data?.map((item) => {
          return <MainComment key={item.id} item={item} />;
        })}
      </MainCommentWrapper>
    </CommentListWrapper>
  );
};

const LvWrapper = styled.span`
  display: flex;
  flex-direction: column;
  /* align-items: center; */
  flex-direction: center;
  margin: 5px;
  min-width: 12%;
`;
const CountWrapper = styled.span`
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  justify-content: center;
  width: 15%;
`;
const NumberWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  width: 10%;
`;
const MainCommentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: 10px;
  align-items: center;
  justify-content: center;
  width: 1200px;
`;
const Text = styled.span`
  display: flex;
  min-width: 15%;
  align-items: center;
`;
const ContentWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 1200px;
`;
const Icon = styled.img`
  width: 50px;
  height: 50px;
`;
const TextWrapper = styled.span`
  font-size: ${({ theme }) => theme.font.font50};
  font-weight: 600;
`;
const TextContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
`;
const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const CommentListWrapper = styled.div``;
const CommentWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  width: 80%;
  margin: 10px;
`;
const InputContainer = styled.div`
  display: flex;
  margin-bottom: 40px;
`;

const CommentInput = styled.input`
  ${({ theme }) => theme.input}
  background-color:white;
  padding: 15px;
  margin: 10px;
  width: 600px;
  border-radius: 40px;
  height: 40px;
  border: 0.1px solid black;
  box-shadow: -2px 2px 0px 0px #000000;
`;
const ButtonWrapper = styled.div``;
const SubmitCommentButton = styled.button`
  margin: 10px;
  height: 40px;
  width: 70px;
  border-radius: 30px;
  padding: 0 15px;
  border: none;
  background-color: black;
  color: white;
  :hover {
    background-color: #ff3d00;
  }
`;
export default MainCommentList;
