import { useRouter } from 'next/router';
import { dbService, authService } from '@/firebase';
import { getDocs } from 'firebase/firestore';
import { useState } from 'react';
import styled from 'styled-components';
import {
  collection,
  doc,
  query,
  where,
  arrayRemove,
  arrayUnion,
} from 'firebase/firestore';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import FollowButton from '../FollowButton';

type ProfileEditProps = {
  item: ProfileItem;
  toggle: boolean;
  paramsId: string;
  followModal: boolean;
};

const LoginState = ({
  item,
  toggle,
  paramsId,
  followModal,
}: ProfileEditProps) => {
  // const [following, setFollowing] = useState([] as any);
  // const [follower, setFollower] = useState([] as any);
  const router = useRouter();
  const queryClient = useQueryClient();
  const user = authService.currentUser;
  const goToMyPage = (id: any) => {
    router.push({
      pathname: `/myPage/${item.id}`,
      query: {
        id,
      },
    });
  };

  const [followingClick, setFollowingClick] = useState(false);

  // 팔로워, 팔로잉 불러오기
  const followerGet = async () => {
    const q = query(
      collection(dbService, 'profile'),
      where('uid', '==', paramsId),
    );
    const data = await getDocs(q);
    return data.docs.map((doc) => doc.data().follower);
  };
  const { isLoading: followerLoading, data: follower } = useQuery(
    'follower',
    followerGet,
    {
      onSuccess: () => {},
      onError: (error) => {
        console.log('error : ', error);
      },
    },
  );

  const followingGet = async () => {
    const q = query(
      collection(dbService, 'profile'),
      where('uid', '==', paramsId),
    );
    const data = await getDocs(q);
    return data.docs.map((doc) => doc.data().following);
  };
  const { isLoading: followingLoading, data: following } = useQuery(
    'following',
    followingGet,
    {
      onSuccess: () => {},
      onError: (error) => {
        console.log('error : ', error);
      },
    },
  );

  return (
    <>
      <LoginStateWrapper>
        {toggle ? (
          <>
            {String(follower).includes(item.id) && (
              <OnOffBox>
                <PhotoBox
                  onClick={() => {
                    goToMyPage(item.id);
                  }}
                >
                  <ProfilePhoto>
                    <Photo src={item.photoURL} />
                  </ProfilePhoto>
                </PhotoBox>
                <TextBox>
                  <FollowText>
                    {item.displayName}
                    {item.loginState && true ? (
                      <OnLineState />
                    ) : (
                      <OFFLineState />
                    )}
                  </FollowText>
                  <div>{item.email}</div>
                </TextBox>
                <StateBox>
                  <FollowButton item={item} Id={item.id} />
                </StateBox>
              </OnOffBox>
            )}
          </>
        ) : (
          <>
            {String(following).includes(item.id) && (
              <OnOffBox>
                <PhotoBox
                  onClick={() => {
                    goToMyPage(item.id);
                  }}
                >
                  <ProfilePhoto>
                    <Photo src={item.photoURL} />
                  </ProfilePhoto>
                </PhotoBox>
                <TextBox>
                  <FollowText>
                    {item.displayName}
                    {item.loginState && true ? (
                      <OnLineState />
                    ) : (
                      <OFFLineState />
                    )}
                  </FollowText>
                  <div>{item.email}</div>
                </TextBox>
                <StateBox>
                  <FollowButton item={item} Id={item.id} />
                </StateBox>
              </OnOffBox>
            )}
          </>
        )}
      </LoginStateWrapper>
    </>
  );
};

export default LoginState;

const LoginStateWrapper = styled.div``;

const OnOffBox = styled.div`
  display: flex;
  margin: auto;
  width: 460px;
  margin-bottom: 16px;
  :hover {
    cursor: pointer;
  }
`;
const PhotoBox = styled.div`
  width: 15%;
  height: 100%;
`;
const ProfilePhoto = styled.div`
  width: 50px;
  height: 50px;
  margin-top: 20px;
  margin-right: 16px;
  border-radius: 70%;
  overflow: hidden;
`;
const Photo = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;
const FollowText = styled.div`
  font-size: 1rem;
  text-align: left;
  font-weight: bolder;
  display: flex;
  width: 200px;
  height: 30px;
`;
const OnLineState = styled.button`
  margin-top: 6px;
  margin-left: 6px;
  border-radius: 100%;
  width: 12px;
  height: 12px;
  background-color: green;
  border: none;
`;
const OFFLineState = styled.button`
  margin-top: 6px;
  margin-left: 6px;
  border-radius: 100%;
  width: 12px;
  height: 12px;
  border: none;
`;
const TextBox = styled.div`
  margin-top: 20px;
  text-align: left;
`;
const StateBox = styled.div`
  margin-top: 20px;
  text-align: right;
  width: 360px;
`;
const ClickFollowButton = styled.button`
  background-color: white;
  box-shadow: -2px 2px 0px 1px #000000;
  border-radius: 15px;
  font-size: 16px;
  :hover {
    cursor: pointer;
    background-color: #ffcab5;
    color: black;
  }
`;
