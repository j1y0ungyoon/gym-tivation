import { ProfileItem } from '@/pages/myPage';
import { authService } from '@/firebase';
import { updateDoc, doc } from 'firebase/firestore';
import { dbService } from '@/firebase';

type FollowInformation = {
  item: ProfileItem;
  userUid: string;
};

const Follow = ({ item, userUid }: FollowInformation) => {
  const user = authService.currentUser;
  const FollowOnClick = async () => {
    if (user !== null) {
      await updateDoc(doc(dbService, 'profile', userUid), {
        following: [item.id],
      });
      await updateDoc(doc(dbService, 'profile', item.id), {
        follower: [user.uid],
      });
      alert('팔로우 완료');
    }
  };
  return (
    <div>
      <img src={item.photoURL} width="100px" />
      <p>{item.displayName}</p>
      <button onClick={FollowOnClick}>팔로우</button>
    </div>
  );
};

export default Follow;
