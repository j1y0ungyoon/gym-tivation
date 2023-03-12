import { authService, dbService } from '@/firebase';
import { collection, doc, getDocs, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import BoardCategory from '@/components/board/BoardCategory';
import { runTransaction } from 'firebase/firestore';
import dynamic from 'next/dynamic';

import 'react-quill/dist/quill.snow.css';
import { useMutation, useQueryClient } from 'react-query';
import { addBoardPost } from '../api/api';
import useModal from '@/hooks/useModal';
import { GLOBAL_MODAL_TYPES } from '@/recoil/modalState';
import Loading from '@/components/common/globalModal/Loading';

const ReactQuill = dynamic(() => import('react-quill'), {
  ssr: false,
  loading: () => <p>Loading ...</p>,
});

const Post = () => {
  const queryClient = useQueryClient();
  const [boardTitle, setBoardTitle] = useState('');
  const [boardContent, setBoardContent] = useState('');
  const [category, setCategory] = useState('');
  const [userLv, setUserLv] = useState('');
  const [userLvName, setUserLvName] = useState('');
  const router = useRouter();
  const today = new Date().toLocaleString('ko-KR').slice(0, -3);

  const { mutate, isLoading } = useMutation(addBoardPost);
  const { showModal } = useModal();
  const modules = {
    toolbar: [
      [{ font: [] }],
      [{ size: [] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ color: [] }, { background: [] }],
      [
        { list: 'ordered' },
        { list: 'bullet' },
        { indent: '-1' },
        { indent: '+1' },
      ],
      ['link'],
      ['clean'],
    ],

    clipboard: {
      matchVisual: false,
    },
  };

  const formats = [
    'font',
    'size',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'code-block',
    'color',
    'background',
    'list',
    'bullet',
    'indent',
    'link',
  ];

  const onChangeBoardTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBoardTitle(event.target.value);
  };

  const onChangeBoardContent = (value: any) => {
    setBoardContent(value);
  };

  //Board로 이동
  const goToBoard = () => {
    router.push({
      pathname: `/board`,
    });
  };
  const profileData = async () => {
    if (!authService.currentUser) return;
    const q = query(
      collection(dbService, 'profile'),
      where('uid', '==', authService.currentUser?.uid),
    );
    const docsData = await getDocs(q);
    const getLvName = docsData.docs[0]?.data().lvName;
    const getLv = docsData.docs[0]?.data().lv;
    setUserLvName(getLvName);
    setUserLv(getLv);
  };

  useEffect(() => {
    if (!authService.currentUser) {
      showModal({
        modalType: GLOBAL_MODAL_TYPES.LoginRequiredModal,
        modalProps: { contentText: '로그인 후 이용해주세요!' },
      });
      router.push('/board');
    }

    profileData();
  }, []);

  // Create Post
  const onSubmitBoard = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!boardTitle) {
      showModal({
        modalType: GLOBAL_MODAL_TYPES.AlertModal,
        modalProps: { contentText: '제목을 입력해주세요!' },
      });
      return;
    }
    if (!boardContent) {
      showModal({
        modalType: GLOBAL_MODAL_TYPES.AlertModal,
        modalProps: { contentText: '내용을 입력해주세요!' },
      });
      return;
    }
    if (!category) {
      showModal({
        modalType: GLOBAL_MODAL_TYPES.AlertModal,
        modalProps: { contentText: '카테고리를 선택해주세요!' },
      });
      return;
    }
    profileData();

    const newPost = {
      title: boardTitle,
      content: boardContent,
      category: category,
      createdAt: Date.now(),
      userId: authService.currentUser?.uid,
      nickName: authService.currentUser?.displayName,
      like: [],
      userPhoto: authService.currentUser?.photoURL,
      userLv: userLv,
      userLvName: userLvName,
      comment: 0,
      date: today,
    };

    await mutate(newPost, {
      onSuccess: () => {
        queryClient.invalidateQueries('getPostData', {
          refetchActive: true,
        });
      },
    });

    if (isLoading) {
      return <Loading />;
    }

    //lv 추가 및 lvName 추가
    const id = String(authService.currentUser?.uid);
    try {
      await runTransaction(dbService, async (transaction) => {
        const sfDocRef = doc(dbService, 'profile', id);
        const sfDoc = await transaction.get(sfDocRef);

        if (!sfDoc.exists()) {
          throw '데이터가 없습니다.';
        }
        const newLv = sfDoc.data().lv + 1;
        transaction.update(sfDocRef, { lv: newLv });
        if (60 > newLv && newLv > 29) {
          transaction.update(sfDocRef, { lvName: 'green' });
        } else if (90 > newLv && newLv > 59) {
          transaction.update(sfDocRef, { lvName: 'blue' });
        } else if (newLv > 89) {
          transaction.update(sfDocRef, { lvName: 'red' });
        }
      });
    } catch (error: any) {
      alert(error.message);
    }

    goToBoard();
  };

  if (!authService.currentUser) {
    return <div>로그인이 필요합니다.</div>;
  }
  return (
    <>
      <PostWrapper>
        <PostContainer>
          <PostForm onSubmit={onSubmitBoard}>
            <PostUpperWrapper>
              <TitleContainer>
                <TitleBox>
                  <Title>제목</Title>
                  <InputDiv>
                    <PostTitle
                      onChange={onChangeBoardTitle}
                      value={boardTitle}
                    />
                  </InputDiv>
                </TitleBox>
              </TitleContainer>
              <CategoryContainer>
                <BoardCategory setCategory={setCategory} />
              </CategoryContainer>
            </PostUpperWrapper>
            <ContentContainer>
              <Editor
                onChange={onChangeBoardContent}
                value={boardContent}
                modules={modules}
                formats={formats}
              />
              <PostButtonWrapper>
                <PostButton type="submit">작성완료</PostButton>
              </PostButtonWrapper>
            </ContentContainer>
          </PostForm>
        </PostContainer>
      </PostWrapper>
    </>
  );
};
const PostWrapper = styled.div`
  ${({ theme }) => theme.mainLayout.wrapper};
  align-items: center;
  justify-content: center;
`;
const PostContainer = styled.div`
  ${({ theme }) => theme.mainLayout.container};
  height: calc(100% - 40px);
  border-radius: ${({ theme }) => theme.borderRadius.radius100};
  display: flex;
  flex-direction: column;
  background-color: white;
  border: 1px solid black;
  box-shadow: -2px 2px 0px 1px #000000;
`;

const PostForm = styled.form`
  flex-direction: column;
  align-items: center;
  height: 100%;
  border-radius: ${({ theme }) => theme.borderRadius.radius100};
  margin: 20px;
`;
const PostUpperWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 10px;
  margin-top: 20px;
  height: 15%;
`;
const InputDiv = styled.div`
  ${({ theme }) => theme.inputDiv};
  box-shadow: -2px 2px 0px 1px #000000;
  background-color: white;
  margin: 10px 0;
  margin: 10px 0;
  width: 100%;
  border: 1px solid black;
`;
const TitleBox = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
`;
const CategoryContainer = styled.div`
  height: 50%;
  width: calc(100% - 150px);
  margin-top: 20px;
`;
const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row;
  width: calc(100% - 150px);
  height: 50%;
`;
const PostTitle = styled.input`
  ${({ theme }) => theme.input}
  background-color:white;
`;
const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 80%;
  padding: 10px;
`;
const Title = styled.span`
  display: flex;
  flex-direction: column;
  font-size: 20px;
  width: 110px;
`;
const PostButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  width: calc(100% - 150px);

  height: 5%;
  margin: 20px 0;
`;
const PostButton = styled.button`
  ${({ theme }) => theme.btn.btn50}
  border: 1px solid black;
  box-shadow: -2px 2px 0px 1px #000000;

  background-color: ${({ theme }) => theme.color.brandColor100};
  :hover {
    background-color: black;
    color: white;
  }
`;

const Editor = styled(ReactQuill)`
  width: calc(100% - 150px);
  height: 80%;
  border: 1px solid black;
  margin: 0 0 10px 0;
  box-shadow: -2px 2px 0px 1px #000000;

  border-radius: ${({ theme }) => theme.borderRadius.radius10};
  .ql-toolbar.ql-snow + .ql-container.ql-snow {
    border: none;
    border-top: 1px solid black;
  }
  .ql-toolbar.ql-snow {
    border: none;
  }
`;

export default Post;
