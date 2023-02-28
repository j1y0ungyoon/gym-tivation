import { dbService, storage } from '../../firebase';
import { deleteDoc, doc, setDoc, updateDoc } from 'firebase/firestore';
import {
  EditCommentLikeParameterType,
  EditRecruitPostParameterType,
  editUserParticipationParameterType,
} from '../../type';
import { deleteObject, ref } from 'firebase/storage';
import { query } from 'firebase/database';
import { describe } from 'node:test';

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

// 운동 참가 버튼 누른 후 유저 프로필 수정하기
export const editUserParticipation = async ({
  userId,
  edittedProfile,
}: editUserParticipationParameterType) => {
  await updateDoc(doc(dbService, 'profile', userId), edittedProfile);
};

// 댓글 삭제하기
export const deleteComment = async (commentId: string) => {
  await deleteDoc(doc(dbService, 'comments', commentId));
};

// 댓글 좋아요 눌렀을 때
export const editCommentLike = async ({
  commentId,
  edittedComment,
}: EditCommentLikeParameterType) => {
  await updateDoc(doc(dbService, 'comments', commentId), edittedComment);
};

//게시판 댓글 삭제하기
export const deleteBoardComment = async (id: string) => {
  await deleteDoc(doc(dbService, 'boardComment', id));
};

export const deleteGalleryComment = async (id: string) => {
  await deleteDoc(doc(dbService, 'galleryComment', id));
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

export const deleteGalleryPost = async ({ id, photo }: any) => {
  await deleteObject(ref(storage, photo));
  await deleteDoc(doc(dbService, 'gallery', id));
};
export const editGalleryBoard = async ({ id, editGalleryPost }: any) => {
  await updateDoc(doc(dbService, 'gallery', id), editGalleryPost);
};

// export const fetchRecruitPost = async (recruitPostId: string) => {
//   const res = await getDoc(doc(dbService, 'recruitments', recruitPostId));

//   return res.data();
// };
