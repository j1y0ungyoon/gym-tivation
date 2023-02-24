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
            {String(following).includes(item.id) ? (
              <OnOffBox
                onClick={() => {
                  goToMyPage(item.id);
                }}
              >
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
    </>
  );
};

export default LoginState;

const LoginStateWrapper = styled.div``;

const OnOffBox = styled.div`
  display: flex;
  margin: auto;
  margin-bottom: 2vh;
  width: 24vw;
  height: 8vh;
  border-radius: 15px;
  :hover {
    cursor: pointer;
  }
`;

const ProfilePhoto = styled.div`
  width: 100px;
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
  margin-top: 2vh;
  text-align: left;
  width: 20vw;
`;
const StateBox = styled.div`
  margin-top: 3vh;
  text-align: right;
  width: 20vw; ;
`;
