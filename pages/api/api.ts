import { dbService, storage } from '../../firebase';
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
  where,
} from 'firebase/firestore';
import { EditRecruitPostParameterType } from '../../type';
import { deleteObject, ref } from 'firebase/storage';
import { query } from 'firebase/database';

// 동료 모집글 삭제하기
export const deleteRecruitPost = async (postId: string) => {
  await deleteDoc(doc(dbService, 'recruitments', postId));
};

// 동료 모집글 수정하기
export const editRecruitPost = async ({
  recruitPostId,
  edittedRecruitPost,
}: EditRecruitPostParameterType) => {
  await updateDoc(
    doc(dbService, 'recruitments', recruitPostId),
    edittedRecruitPost,
  );
};

// 동료 모집글 가져오기(위도, 경도를 뽑기 위해)
// export const fetchRecruitPosts = async () => {
//   const querySnapshot = await getDocs(collection(dbService, 'recruitments'));

//   const recruitPosts = querySnapshot.docs.map((doc) => ({
//     id: doc.id,
//     ...doc.data(),
//   }));

//   return recruitPosts;
// };

// 게시판 글 삭제하기
export const deleteBoardPost = async ({ id, photo }: any) => {
  await deleteObject(ref(storage, photo));
  await deleteDoc(doc(dbService, 'posts', id));
};

// 게시판 글 수정하기
export const editBoardPost = async ({ id, editDetailPost }: any) => {
  await updateDoc(doc(dbService, 'posts', id), editDetailPost);
};

// export const fetchRecruitPost = async (recruitPostId: string) => {
//   const res = await getDoc(doc(dbService, 'recruitments', recruitPostId));

//   return res.data();
// };
