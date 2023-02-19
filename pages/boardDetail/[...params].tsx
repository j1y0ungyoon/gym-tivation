import { dbService } from '@/firebase';

import { doc, onSnapshot } from 'firebase/firestore';

import { useEffect, useState } from 'react';
import styled from 'styled-components';

interface DetailProps {
  id: string;
  title?: string;
  content?: string;
  createdAt: number;
  photo?: string;
  item?: any;
  detailPost: string;
}
const Detail = ({ params }: any) => {
  const [detailPost, setDetailPost] = useState<DetailProps>();
  const [id] = params;

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(dbService, 'posts', id), (doc) => {
      const data = doc.data();

      const getDetailPost: any = {
        id: data?.id,
        title: data?.title,
        content: data?.content,
        createdAt: data?.createdAt,
        creationTime: data?.creationTime,
        photo: data?.photo,
      };

      setDetailPost(getDetailPost);
    });

    return () => {
      unsubscribe();
    };
  }, []);
  return (
    <>
      {id}
      <PostTitle>{detailPost?.title}</PostTitle>
      <PostContent>{detailPost?.content}</PostContent>
      <div>created At{detailPost?.createdAt}</div>
      <ItemPhoto src={detailPost?.photo} />
      <button>수정</button>
      <button>삭제</button>
    </>
  );
};
const PostTitle = styled.p`
  font-size: 2rem;
  width: 100%;
  height: 50px;
  border: 1px solid black;
`;
const PostContent = styled.p`
  font-size: 1rem;
  width: 100%;
  height: 50px;
  border: 1px solid black;
`;

const ItemPhoto = styled.img`
  width: 500px;
  height: 500px;
  border: 1px solid black;
`;
export function getServerSideProps({ params: { params } }: any) {
  return {
    props: {
      params,
    },
  };
}

export default Detail;
