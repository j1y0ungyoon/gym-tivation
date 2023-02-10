import { dbService } from '@/firebase';
import { addDoc, collection } from 'firebase/firestore';
import { useState } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';

const WritingRecruitment = () => {
  const [recruitTitle, setRecruitTitle] = useState('');
  const [recruitContent, setRecruitContent] = useState('');

  const router = useRouter();

  const onChangeRecruitTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRecruitTitle(event.currentTarget.value);
  };

  const onChangeRecruitContent = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setRecruitContent(event.currentTarget.value);
  };

  const onSubmitRecruitPost = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    const newRecruitPost = {
      title: recruitTitle,
      content: recruitContent,
      // userId : string,
      // nickName : string,
      // category: string,
      // date: string,
      createdAt: Date.now(),
    };

    await addDoc(collection(dbService, 'recruitments'), newRecruitPost)
      .then(() => console.log('데이터 전송 성공'))
      .catch((error) => console.log('에러 발생', error));

    setRecruitTitle('');
    setRecruitContent('');

    router.push('/mapBoard');
  };

  return (
    <div>
      <form onSubmit={onSubmitRecruitPost}>
        <span>제목 </span>
        <input onChange={onChangeRecruitTitle} value={recruitTitle} /> <br />
        <span>지역 </span> <br />
        <span>시간 </span> <br />
        <textarea
          onChange={onChangeRecruitContent}
          value={recruitContent}
        />{' '}
        <br />
        <button>작성 완료</button>
      </form>
    </div>
  );
};

export default WritingRecruitment;
