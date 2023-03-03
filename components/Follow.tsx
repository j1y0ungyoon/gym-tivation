import { authService } from '@/firebase';
import { updateDoc, doc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { dbService } from '@/firebase';
import { useState } from 'react';
import styled from 'styled-components';
import { Follows } from './SearchUser';
import { useRouter } from 'next/router';

type FollowInformation = {
  item: Follows;
  userUid: string;
  follwoingInformation: string;
  setFollowing: (p: string) => void;
  following: string;
};

const Follow = ({
  item,
  userUid,
  follwoingInformation,
  setFollowing,
  following,
}: FollowInformation) => {
  const user = authService.currentUser;
  const router = useRouter();

  const goToMyPage = (id: any) => {
    router.push({
      pathname: `/myPage/${item.id}`,
      query: { id },
    });
  };

  const FollowOnClick = async () => {
    if (user !== null) {
      await updateDoc(doc(dbService, 'profile', userUid), {
        following: arrayUnion(item.id),
      });
      await updateDoc(doc(dbService, 'profile', item.id), {
        follower: arrayUnion(user.uid),
      });

      alert('팔로우 완료');
    }
  };

  const FollowReMoveOnClick = async () => {
    if (user !== null) {
      await updateDoc(doc(dbService, 'profile', userUid), {
        following: arrayRemove(item.id),
      });
      await updateDoc(doc(dbService, 'profile', item.id), {
        follower: arrayRemove(user.uid),
      });
      const reMoveId = follwoingInformation.replace(item.id, '');
      setFollowing(reMoveId);
      alert('언팔로우 완료');
    }
  };

  return (
    <FollowWrapper>
      <OnOffBox>
        <ProfilePhoto
          onClick={() => {
            goToMyPage(item.id);
          }}
        >
          <Photo src={item.photoURL} />
        </ProfilePhoto>
        <TextBox
          onClick={() => {
            goToMyPage(item.id);
          }}
        >
          <FollowText> {item.displayName}</FollowText>
          <div>{item.email}</div>
        </TextBox>

        <StateBox>
          {follwoingInformation.includes(item.id) ? (
            <ClickFollowButton
              style={{ backgroundColor: 'gray', color: 'white' }}
              onClick={FollowReMoveOnClick}
            >
              팔로잉
            </ClickFollowButton>
          ) : (
            <ClickFollowButton onClick={FollowOnClick}>
              팔로우
            </ClickFollowButton>
          )}
        </StateBox>
      </OnOffBox>
    </FollowWrapper>
  );
};

export default Follow;

const FollowWrapper = styled.div``;
const OnOffBox = styled.div`
  display: flex;
  margin: auto;
  margin-bottom: 20px;
  width: 540px;
  height: 60px;
  border-radius: 15px;
  :hover {
    cursor: pointer;
    transform: scale(1.1, 1.1); /* 가로2배 새로 1.2배 로 커짐 */
    transition: 0.3s;
  }
`;

const ProfilePhoto = styled.div`
  width: 100px;
  height: 50px;
  margin-top: 18px;
  margin-left: 12px;
  margin-right: 20px;
  border-radius: 70%;
  overflow: hidden;
`;
const Photo = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;
const FollowText = styled.span`
  font-size: 16px;
  text-align: center;
  font-weight: bolder;
`;

const TextBox = styled.div`
  margin-top: 20px;
  text-align: left;
  width: 400px;
`;
const StateBox = styled.div`
  margin-top: 3vh;
  text-align: right;
  width: 400px; ;
`;
const ClickFollowButton = styled.button`
  background-color: #eeeeee;
  border: none;
  border-radius: 15px;
  font-size: 16px;
  :hover {
    cursor: pointer;
    background-color: gray;
    color: white;
  }
`;
