import { dbService } from '../../firebase';
import { deleteDoc, doc, getDoc, updateDoc } from 'firebase/firestore';
import { EditRecruitPostParameterType } from '../type';

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

// export const fetchRecruitPost = async (recruitPostId: string) => {
//   const res = await getDoc(doc(dbService, 'recruitments', recruitPostId));

//   return res.data();
// };
