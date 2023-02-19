import { dbService } from '@/firebase';
import { query } from 'firebase/database';
import { collection, onSnapshot, orderBy } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import BoardPost from './BoardPost';

// interface BoardItemProps {
//   title?: string;
//   content?: string;
//category?:string;
//   id: string;
//   createdAt?: number;
// }

const BoardItem = () => {
  const [boardPosts, setBoardPost] = useState();

  const getPost = () => {
    const q = query(
      collection(dbService, 'posts'),
      orderBy('createdAt', 'desc'),
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newPosts = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBoardPost(newPosts);
    });
    return unsubscribe;
  };
  useEffect(() => {
    const unsubscribe = getPost();
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <BoardList>
      {boardPosts?.map((item) => {
        return <BoardPost key={item.id} item={item} />;
      })}
    </BoardList>
  );
};

const BoardList = styled.div`
  width: 95%;
  height: 100%;
  border: 1px solid black;
  margin: 0.5rem;
  background-color: white;
  border-radius: 0.5rem;
  overflow: scroll;
`;

export default BoardItem;
