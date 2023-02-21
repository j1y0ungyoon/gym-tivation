import { dbService, storage } from '../../firebase';
import { deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { EditRecruitPostParameterType } from '../type';
import { deleteObject, ref } from 'firebase/storage';

export const deleteRecruitPost = async (postId: string) => {
  await deleteDoc(doc(dbService, 'recruitments', postId));
};

export const editRecruitPost = async ({
  recruitPostId,
  edittedRecruitPost,
}: EditRecruitPostParameterType) => {
  await updateDoc(
    doc(dbService, 'recruitments', recruitPostId),
    edittedRecruitPost,
  );
};

export const deleteBoardPost = async ({ id, photo }: any) => {
  await deleteObject(ref(storage, photo));
  await deleteDoc(doc(dbService, 'posts', id));
};

export const editBoardPost = async ({ id, editDetailPost }: any) => {
  await updateDoc(doc(dbService, 'posts', id), editDetailPost);
};

// export const fetchRecruitPost = async (recruitPostId: string) => {
//   const res = await getDoc(doc(dbService, 'recruitments', recruitPostId));

//   return res.data();
// };
