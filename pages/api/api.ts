import { dbService } from '../../firebase';
import { deleteDoc, doc, updateDoc } from 'firebase/firestore';
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
