import { useState, useEffect } from 'react';
import { collection, query, getDocs, where } from 'firebase/firestore';
import { dbService, authService } from '@/firebase';
import styled from 'styled-components';
import { ProfileItem } from '@/pages/myPage';

type ProfileEditProps = {
  item: ProfileItem;
  toggle: boolean;
};

const LoginState = ({ item, toggle }: ProfileEditProps) => {
  const [following, setFollowing] = useState([] as any);
  const [follower, setFollower] = useState([] as any);
  const follwoingInformation = following.join();
  const followerInformation = follower.join();

  const userID: any = String(authService.currentUser?.uid);

  const followGetDoc = async () => {
    const q = query(
      collection(dbService, 'profile'),
      where('uid', '==', userID),
    );
    const data = await getDocs(q);
    data.docs.map((doc) => {
      setFollowing((prev: any) => [...prev, doc.data().following]);
      setFollower((prev: any) => [...prev, doc.data().follower]);
    });
  };

  useEffect(() => {
    followGetDoc;
    return () => {
      followGetDoc();
    };
  }, []);

  return (
    <LoginStateWrapper>
      {toggle ? (
        <>
          {followerInformation.includes(item.id) ? (
            <OnOffBox>
              <ProfilePhoto>
                <Photo src={item.photoURL} />
              </ProfilePhoto>
              <TextBox>
                <FollowText> {item.displayName}</FollowText>
                <div>{item.email}</div>
              </TextBox>
              <StateBox>
                {item.loginState && true ? (
                  <OnLineState>ONLINE</OnLineState>
                ) : (
                  <OFFLineState>OFFLINE</OFFLineState>
                )}
              </StateBox>
            </OnOffBox>
          ) : null}
        </>
      ) : (
        <>
          {follwoingInformation.includes(item.id) ? (
            <OnOffBox>
              <ProfilePhoto>
                <Photo src={item.photoURL} />
              </ProfilePhoto>
              <TextBox>
                <FollowText> {item.displayName}</FollowText>
                <div>{item.email}</div>
              </TextBox>
              <StateBox>
                {item.loginState && true ? (
                  <OnLineState>ONLINE</OnLineState>
                ) : (
                  <OFFLineState>OFFLINE</OFFLineState>
                )}
              </StateBox>
            </OnOffBox>
          ) : null}
        </>
      )}
    </LoginStateWrapper>
  );
};

export default LoginState;

const LoginStateWrapper = styled.div`
  overflow: auto;
`;

const OnOffBox = styled.div`
  display: flex;
  margin: auto;
  margin-bottom: 2vh;
  width: 24vw;
  height: 8vh;
  border-radius: 15px;
`;

const ProfilePhoto = styled.div`
  width: 5vw;
  height: 50px;
  margin-top: 2vh;
  margin-left: 1vw;
  margin-right: 1vw;
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
const OnLineState = styled.li`
  font-size: 12px;
  ::marker {
    color: green;
    font-size: 16px;
  }
`;
const OFFLineState = styled.li`
  font-size: 12px;
  ::marker {
    font-size: 16px;
  }
`;
const TextBox = styled.div`
  margin-top: 3vh;
  text-align: left;
  width: 20vw; ;
`;
const StateBox = styled.div`
  margin-top: 3vh;
  text-align: right;
  width: 20vw; ;
`;
