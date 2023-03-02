import { ProfileItem } from '@/pages/myPage/[...params]';
import { useRouter } from 'next/router';
import { dbService } from '@/firebase';
import { getDocs } from 'firebase/firestore';
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { collection, doc, query, where } from 'firebase/firestore';

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
  const [following, setFollowing] = useState([] as any);
  const [follower, setFollower] = useState([] as any);
  const router = useRouter();

  const goToMyPage = (id: any) => {
    router.push({
      pathname: `/myPage/${item.id}`,
      query: {
        id,
      },
    });
  };

  // 팔로워, 팔로잉 불러오기
  const followGetDoc = async () => {
    const q = query(
      collection(dbService, 'profile'),
      where('uid', '==', paramsId),
    );
    const data = await getDocs(q);
    data.docs.map((doc) => {
      setFollowing(doc.data().following);
      setFollower(doc.data().follower);
    });
  };

  useEffect(() => {
    followGetDoc();
    return () => {
      // followGetDoc(); //useEffect가 업데이트 되기 전 실행됨
    };
  }, [followModal]);

  return (
    <>
      <LoginStateWrapper>
        {toggle ? (
          <>
            {String(follower).includes(item.id) && (
              <OnOffBox
                onClick={() => {
                  goToMyPage(item.id);
                }}
              >
                <PhotoBox>
                  <ProfilePhoto>
                    <Photo src={item.photoURL} />
                  </ProfilePhoto>
                </PhotoBox>
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
            )}
          </>
        ) : (
          <>
            {String(following).includes(item.id) && (
              <OnOffBox
                onClick={() => {
                  goToMyPage(item.id);
                }}
              >
                <PhotoBox>
                  <ProfilePhoto>
                    <Photo src={item.photoURL} />
                  </ProfilePhoto>
                </PhotoBox>
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
  width: 24vw;
  height: 8vh;
  margin-bottom: 2vh;
  :hover {
    cursor: pointer;
  }
`;
const PhotoBox = styled.div`
  width: 25%;
  height: 100%;
`;
const ProfilePhoto = styled.div`
  width: 50px;
  height: 50px;
  margin-top: 2vh;
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
  font-size: 1rem;
  text-align: center;
  font-weight: bolder;
`;
const OnLineState = styled.li`
  font-size: 0.8rem;
  ::marker {
    color: green;
    font-size: 16px;
  }
`;
const OFFLineState = styled.li`
  font-size: 0.8rem;
  ::marker {
    font-size: 16px;
  }
`;
const TextBox = styled.div`
  margin-top: 2vh;
  text-align: left;
`;
const StateBox = styled.div`
  margin-top: 3vh;
  text-align: right;
  width: 20vw; ;
`;
