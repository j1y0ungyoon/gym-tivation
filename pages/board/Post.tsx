import { authService, dbService, storage } from '@/firebase';
import { addDoc, collection, doc } from 'firebase/firestore';
import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { useRouter } from 'next/router';
import BoardCategory from '@/components/BoardCategory';
import { runTransaction } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { nanoid } from 'nanoid';
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

  const [imageUpload, setImageUpload] = useState<any>('');
  const [boardPhoto, setBoardPhoto] = useState('');
  const quillRef = useRef();
  const router = useRouter();
  const today = new Date().toLocaleString().slice(0, -3);
  console.log(today);

  // const imageHandler = () => {};

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
      ['link', 'image'],
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
    'image',
  ];

  const onChangeBoardTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBoardTitle(event.target.value);
  };

  const onChangeBoardContent = (value: any) => {
    setBoardContent(value);
  };

  const onChangeUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    setImageUpload(event.target.files?.[0]);
  };

  useEffect(() => {
    const imageRef = ref(storage, `images/${nanoid()}`);
    if (!imageUpload) return;
    uploadBytes(imageRef, imageUpload).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {
        setBoardPhoto(url);
      });
    });
  }, [imageUpload]);

  //Board로 이동
  const goToBoard = () => {
    router.push({
      pathname: `/board`,
    });
  };

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
    const newPost = {
      title: boardTitle,
      content: boardContent,
      category: category,
      createdAt: new Date(),
      userId: authService.currentUser?.uid,
      nickName: authService.currentUser?.displayName,
      photo: boardPhoto,
      like: [],
      userPhoto: authService.currentUser?.photoURL,
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
        console.log('sfdoc', sfDoc);
        if (!sfDoc.exists()) {
          throw '데이터가 없습니다.';
        }
        const newwLvName = sfDoc.data().lvName;
        const newLv = sfDoc.data().lv + 1;
        transaction.update(sfDocRef, { lv: newLv });
        console.log('랩', newLv);
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
    setBoardPhoto('');
  };

  return (
    <>
      <PostWrapper>
        <PostContent onSubmit={onSubmitBoard}>
          <TitleContainer>
            제목:
            <PostTitle onChange={onChangeBoardTitle} value={boardTitle} />
          </TitleContainer>
          <BoardCategory setCategory={setCategory} />
          <ContentContainer>
            <PostImageWrapper>
              <ImageInput
                type="file"
                accept="boardPhoto/*"
                onChange={onChangeUpload}
                multiple
              />
              <ImagePreview src={boardPhoto} />
            </PostImageWrapper>

            <ReactQuill
              onChange={onChangeBoardContent}
              value={boardContent}
              modules={modules}
              formats={formats}
            />
          </ContentContainer>
          <PostButtonWrapper>
            <PostButton type="submit">게시하기</PostButton>
          </PostButtonWrapper>
        </PostContent>
      </PostWrapper>
    </>
  );
};
const PostWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 95vh;
  background-color: white;
  border-radius: 2rem;
`;
const PostContent = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 97%;
  height: 95%;
  background-color: #f2f2f2;
  border-radius: 2rem;
`;
const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 1rem;
  width: 100%;
  font-size: 2rem;
`;
const PostTitle = styled.input`
  width: 80%;
  height: 3rem;
  border-radius: 1rem;
  border: none;
  margin: 1rem;
`;
const ContentContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 80%;
  padding: 2rem;
`;
const ContentInput = styled.textarea`
  display: flex;
  padding: 1rem;
  width: 50%;
  height: 90%;
  border-radius: 2rem;
  font-size: 1.5rem;
  margin: 1rem;
  resize: none;
  border: none;
`;
const PostButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 100%;
  height: 20%;
  padding: 2rem;
`;
const PostButton = styled.button`
  width: 10rem;
  height: 2rem;
  border-radius: 1rem;
  background-color: #d9d9d9;
  margin: 1rem;
  border: none;
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
