import { authService, dbService, storage } from '@/firebase';
import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
// import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { useRouter } from 'next/router';
import BoardCategory from '@/components/BoardCategory';
import { runTransaction } from 'firebase/firestore';
import { toast } from 'react-toastify';
// import { nanoid } from 'nanoid';
import dynamic from 'next/dynamic';

import 'react-quill/dist/quill.snow.css';
const ReactQuill = dynamic(() => import('react-quill'), {
  ssr: false,
  loading: () => <p>Loading ...</p>,
});

const Post = () => {
  const [boardTitle, setBoardTitle] = useState('');
  const [boardContent, setBoardContent] = useState('');
  const [category, setCategory] = useState('');
  const [userLv, setUserLv] = useState('');
  const [userLvName, setUserLvName] = useState('');
  // const [imageUpload, setImageUpload] = useState<any>('');
  // const [boardPhoto, setBoardPhoto] = useState('');
  const router = useRouter();
  const today = new Date().toLocaleString().slice(0, -3);

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
      // toggle to add extra line breaks when pasting HTML:
      matchVisual: false,
    },
    // handler: {
    //   image: imageHandler,
    // },
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

  // const onChangeUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setImageUpload(event.target.files?.[0]);
  // };

  // useEffect(() => {
  //   const imageRef = ref(storage, `images/${nanoid()}`);
  //   if (!imageUpload) return;
  //   uploadBytes(imageRef, imageUpload).then((snapshot) => {
  //     getDownloadURL(snapshot.ref).then((url) => {
  //       setBoardPhoto(url);
  //     });
  //   });
  // }, [imageUpload]);

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
    const getLvName = docsData.docs[0].data().lvName;
    const getLv = docsData.docs[0].data().lv;
    setUserLvName(getLvName);
    setUserLv(getLv);
  };
  useEffect(() => {
    if (!authService.currentUser) {
      toast.info('로그인을 먼저 해주세요!');
      router.push('/board');
    }
    profileData();
  }, []);

  if (!authService.currentUser) {
    return <div>로그인이 필요합니다.</div>;
  }
  // Create Post
  const onSubmitBoard = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!boardTitle) {
      toast.warn('제목을 입력해주세요!');
      return;
    }
    if (!boardContent) {
      toast.warn('내용을 입력해주세요!');
      return;
    }
    if (!category) {
      toast.warn('카테고리를 선택해주세요!');
      return;
    }
    profileData();

    const newPost = {
      title: boardTitle,
      content: boardContent,
      category: category,
      createdAt: today,
      userId: authService.currentUser?.uid,
      nickName: authService.currentUser?.displayName,
      // photo: boardPhoto,
      like: [],
      userPhoto: authService.currentUser?.photoURL,
      userLv: userLv,
      userLvName: userLvName,
    };

    await addDoc(collection(dbService, 'posts'), newPost)
      .then(() => console.log('post'))
      .catch((error) => {
        console.log('에러 발생!', error);
      });

    //lv 추가 및 lvName 추가
    const id = String(authService.currentUser?.uid);
    try {
      await runTransaction(dbService, async (transaction) => {
        const sfDocRef = doc(dbService, 'profile', id);
        const sfDoc = await transaction.get(sfDocRef);

        if (!sfDoc.exists()) {
          throw '데이터가 없습니다.';
        }
        const newwLvName = sfDoc.data().lvName;
        const newLv = sfDoc.data().lv + 1;
        transaction.update(sfDocRef, { lv: newLv });
        if (newwLvName === '일반인' && newLv > 4) {
          transaction.update(sfDocRef, { lvName: '헬애기' });
          transaction.update(sfDocRef, { lv: 1 });
        } else if (newwLvName === '헬애기' && newLv > 14) {
          transaction.update(sfDocRef, { lvName: '헬린이' });
          transaction.update(sfDocRef, { lv: 1 });
        } else if (newwLvName === '헬린이' && newLv > 29) {
          transaction.update(sfDocRef, { lvName: '헬른이' });
          transaction.update(sfDocRef, { lv: 1 });
        } else if (newwLvName === '헬른이' && newLv > 59) {
          transaction.update(sfDocRef, { lvName: '헬애비' });
          transaction.update(sfDocRef, { lv: 1 });
        }
      });
    } catch (error: any) {
      alert(error.message);
    }

    goToBoard();
    // setBoardPhoto('');
  };

  return (
    <>
      <PostWrapper>
        <PostContainer>
          <PostForm onSubmit={onSubmitBoard}>
            <PostUpperWrapper>
              <TitleContainer>
                <Title>제목</Title>
                <InputDiv>
                  <PostTitle onChange={onChangeBoardTitle} value={boardTitle} />
                </InputDiv>
              </TitleContainer>
              <BoardCategory setCategory={setCategory} />
            </PostUpperWrapper>
            <ContentContainer>
              {/* <PostImageWrapper>
                <ImageInput
                  type="file"
                  accept="boardPhoto/*"
                  onChange={onChangeUpload}
                  multiple
                />
                <ImagePreview src={boardPhoto} />
              </PostImageWrapper> */}

              <Editor
                onChange={onChangeBoardContent}
                value={boardContent}
                modules={modules}
                formats={formats}
              />
            </ContentContainer>
            <PostButtonWrapper>
              <PostButton type="submit">작성완료</PostButton>
            </PostButtonWrapper>
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
  border-radius: ${({ theme }) => theme.borderRadius.radius100};
  display: flex;
  flex-direction: column;
  background-color: white;
  border: 1px solid black;
`;

const PostForm = styled.form`
  flex-direction: column;
  align-items: center;
  height: 90%;
  border-radius: ${({ theme }) => theme.borderRadius.radius100};
  margin: 20px;
`;
const PostUpperWrapper = styled.div`
  margin-left: 50px;
`;
const InputDiv = styled.div`
  ${({ theme }) => theme.inputDiv};
  background-color: white;
  margin: 10px 0;
  margin-left: 62px;
  width: 85%;
  border: 1px solid black;
`;
const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row;
`;
const PostTitle = styled.input`
  ${({ theme }) => theme.input}
  background-color:white;
`;
const ContentContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 80%;
  padding: 2rem;
`;
// const ContentInput = styled.textarea`
//   display: flex;
//   padding: 1rem;
//   width: 50%;
//   height: 90%;
//   border-radius: 2rem;
//   font-size: 1.5rem;
//   margin: 1rem;
//   resize: none;
//   border: none;
// `;
const Title = styled.span`
  display: flex;
  flex-direction: column;
  font-size: ${({ theme }) => theme.font.font70};
`;
const PostButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 100%;
`;
const PostButton = styled.button`
  ${({ theme }) => theme.btn.btn50}
  border: 1px solid black;
  margin-right: 20px;
  margin-bottom: 10px;
`;

const Editor = styled(ReactQuill)`
  width: 100%;
  height: 90%;
  margin: 1rem;
  border: 1px solid black;
  border-radius: ${({ theme }) => theme.borderRadius.radius10};
  .ql-toolbar.ql-snow + .ql-container.ql-snow {
    border: none;
    border-top: 1px solid black;
  }
  .ql-toolbar.ql-snow {
    border: none;
  }
`;

const ImageInput = styled.input`
  width: 100%;
  height: 2rem;
`;
const ImagePreview = styled.img`
  margin-top: 1rem;
  width: 100%;
  height: 100%;
  border-radius: 2rem;
`;
const PostImageWrapper = styled.div`
  display: flex;
  width: 50%;
  height: 90%;
  flex-direction: column;
  margin: 1rem;
`;

export default Post;
