import { ProfileItem } from '@/pages/myPage/[...params]';
import { useRouter } from 'next/router';
import { dbService } from '@/firebase';
import { getDocs } from 'firebase/firestore';

import styled from 'styled-components';

type ProfileEditProps = {
  item: ProfileItem;
  toggle: boolean;
  follower: [];
  following: [];
  paramsId: string;
};

const LoginState = ({
  item,
  toggle,
  following,
  follower,
  paramsId,
}: ProfileEditProps) => {
  const router = useRouter();

  const goToMyPage = (id: any) => {
    router.push({
      pathname: `/myPage/${item.id}`,
      query: {
        id,
      },
    });
  };

  return (
    <>
      <LoginStateWrapper>
        {toggle ? (
          <>
            {String(follower).includes(item.id) ? (
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
            ) : null}
          </>
        ) : (
          <>
            {String(following).includes(item.id) ? (
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
            ) : null}
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
