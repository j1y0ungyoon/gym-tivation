import { authService } from '@/firebase';
import { updateDoc, doc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { dbService } from '@/firebase';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import { useQuery, useMutation, useQueryClient } from 'react-query';

const Follow = ({ item, userUid, follwoingInformation }: FollowInformation) => {
  const user = authService.currentUser;
  const router = useRouter();
  const queryClient = useQueryClient();

  const goToMyPage = (id: any) => {
    router.push({
      pathname: `/myPage/${item.id}`,
      query: { id },
    });
  };

  const FollowOn = async () => {
    if (user !== null) {
      await updateDoc(doc(dbService, 'profile', userUid), {
        following: arrayUnion(item.id),
      });
      await updateDoc(doc(dbService, 'profile', item.id), {
        follower: arrayUnion(user.uid),
      });
    }
  };

  const FollowReMove = async () => {
    if (user !== null) {
      await updateDoc(doc(dbService, 'profile', userUid), {
        following: arrayRemove(item.id),
      });
      await updateDoc(doc(dbService, 'profile', item.id), {
        follower: arrayRemove(user.uid),
      });
      follwoingInformation.replace(item.id, '');
    }
  };
  const { mutate: FollowOnClick } = useMutation(['FollowOnClick'], FollowOn, {
    onSuccess: async () => {
      await queryClient.invalidateQueries('follow');
      await queryClient.invalidateQueries('profile');
    },
    onError: (error) => {
      console.log('error : ', error);
    },
  });
  const { mutate: FollowReMoveOnClick } = useMutation(
    ['FollowReMoveOnClick'],
    FollowReMove,
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries('follow');
        await queryClient.invalidateQueries('profile');
      },
      onError: (error) => {
        console.log('error : ', error);
      },
    },
  );

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
              style={{ backgroundColor: ' #FF4800', color: 'white' }}
              onClick={() => FollowReMoveOnClick()}
            >
              팔로잉
            </ClickFollowButton>
          ) : (
            <ClickFollowButton onClick={() => FollowOnClick()}>
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
  margin-bottom: 8px;
  width: 430px;
  padding-bottom: 50px;
  height: 60px;
  border-radius: 15px;
  :hover {
    cursor: pointer;
  }
`;

const ProfilePhoto = styled.div`
  width: 100px;
  height: 50px;
  margin-top: 8px;
  margin-left: 12px;
  margin-right: 20px;
  border-radius: 70%;
  overflow: hidden;
  background-color: black;
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
  margin-top: 8px;
  text-align: left;
  width: 140px;
`;
const StateBox = styled.div`
  margin-top: 16px;
  text-align: right;
  width: 420px;
`;
const ClickFollowButton = styled.button`
  background-color: white;
  padding: 2px 8px;
  margin-right: 50px;
  box-shadow: -2px 2px 0px 1px #000000;
  border-radius: 15px;
  border-width: 1px;
  font-size: 16px;
  :hover {
    cursor: pointer;
    background-color: #ffcab5;
    color: black;
  }
`;
