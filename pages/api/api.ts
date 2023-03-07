import { dbService, storage } from '../../firebase';
import {
  deleteDoc,
  doc,
  updateDoc,
  collection,
  orderBy,
  query,
  getDocs,
  addDoc,
  getDoc,
  arrayUnion,
  arrayRemove,
} from 'firebase/firestore';
import {
  EditCommentLikeParameterType,
  EditRecruitPostParameterType,
  editUserParticipationParameterType,
} from '../../type';
import { deleteObject, ref } from 'firebase/storage';

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
//메인 댓글 가져오기
export const getMainComments = async ({ queryKey }: any) => {
  const [, id] = queryKey;
  const commentsRef = collection(dbService, 'mainComment');
  const q = query(commentsRef, orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  const data = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  return data;
};
//매인 댓글 추가하기
export const addMainComment = async (item: any) => {
  await addDoc(collection(dbService, 'mainComment'), item);
};
//매인 댓글 삭제하기
export const deleteMainComment = async (id: string) => {
  await deleteDoc(doc(dbService, 'mainComment', id));
};

export const getGalleryPosts = async ({ queryKey }: any) => {
  const [, id] = queryKey;
  const q = query(
    collection(dbService, 'gallery'),
    orderBy('createdAt', 'desc'),
  );
  const snapshot = await getDocs(q);
  const data = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  return data;
};
//갤러리 추가하기
export const addGalleryPost = async (item: any) => {
  await addDoc(collection(dbService, 'gallery'), item);
};
//게시글 가져오기

export const getBoardPosts = async ({ queryKey }: any) => {
  const [, id] = queryKey;
  const q = query(collection(dbService, 'posts'), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  const data = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  return data;
};
//갤러리 디테일 페이지 가져오기
export const getFetchedGalleryDetail = async ({ queryKey }: any) => {
  const [, id] = queryKey;
  return await getDoc(doc(dbService, 'gallery', id));
};

//게시글 삭제하기
export const deleteGalleryPost = async ({ id, photo }: any) => {
  await deleteObject(ref(storage, photo));
  await deleteDoc(doc(dbService, 'gallery', id));
};

//게시글 수정하기
export const editGalleryBoard = async ({ id, editGalleryPost }: any) => {
  await updateDoc(doc(dbService, 'gallery', id), editGalleryPost);
};

//게시글 추가하기
export const addBoardPost = async (item: any) => {
  await addDoc(collection(dbService, 'posts'), item);
};

// 게시판 글 삭제하기
export const deleteBoardPost = async ({ id }: any) => {
  // await deleteObject(ref(storage, photo));
  await deleteDoc(doc(dbService, 'posts', id));
};

//게시판 디테일 페이지 글 가져오기
export const getFetchedBoardDetail = async ({ queryKey }: any) => {
  const [, id] = queryKey;
  return await getDoc(doc(dbService, 'posts', id));
};
// 게시판 글 수정하기
export const editBoardPost = async ({ id, editDetailPost }: any) => {
  await updateDoc(doc(dbService, 'posts', id), editDetailPost);
};

// 게시글 좋아요 업데이트 가져오기

export const updatePostLike = async ({ id, user, detailPost }: any) => {
  await updateDoc(doc(dbService, 'posts', id), {
    like: [...detailPost.like, user],
  });
};
// 게시글 좋아요 취소 업데이트
export const updatePostUnLike = async ({ id, user, detailPost }: any) => {
  await updateDoc(doc(dbService, 'posts', id), {
    like: detailPost?.like.filter((prev: any) => prev !== user),
  });
};

//게시글 like profile update

export const updatePorfilePostLike = async ({ id, user }: any) => {
  await updateDoc(doc(dbService, 'profile', user), {
    postLike: arrayUnion(id),
  });
};
export const updateProfilePostUnLike = async ({ id, user }: any) => {
  await updateDoc(doc(dbService, 'profile', user), {
    postLike: arrayRemove(id),
  });
};

//갤러리 like profile update

export const updateProfileGalleryLike = async ({ id, user }: any) => {
  await updateDoc(doc(dbService, 'profile', user), {
    postLike: arrayUnion(id),
  });
};

//갤러리 unlike profile update
export const updateProfileGalleryUnLike = async ({ id, user }: any) => {
  await updateDoc(doc(dbService, 'profile', user), {
    postLike: arrayRemove(id),
  });
};
// 갤러리 좋아요 업데이트 가져오기
export const updateGalleryLike = async ({
  id,
  user,
  detailGalleryPost,
}: any) => {
  await updateDoc(doc(dbService, 'gallery', id), {
    like: [...detailGalleryPost.like, user],
  });
};
//갤러리 좋아요 취소 업데이트
export const updateGalleryUnLike = async ({
  id,
  user,
  detailGalleryPost,
}: any) => {
  await updateDoc(doc(dbService, 'gallery', id), {
    like: detailGalleryPost?.like.filter((prev: any) => prev !== user),
  });
};

// export const fetchRecruitPost = async (recruitPostId: string) => {
//   const res = await getDoc(doc(dbService, 'recruitments', recruitPostId));

//   return res.data();
// };
