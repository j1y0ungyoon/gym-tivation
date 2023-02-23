import styled from 'styled-components';
import { ProfileItem } from '@/pages/myPage';

type ProfileEditProps = {
  item: ProfileItem;
  toggle: boolean;
  follwoingInformation: string;
  followerInformation: string;
};

const LoginState = ({
  item,
  toggle,
  follwoingInformation,
  followerInformation,
}: ProfileEditProps) => {
  console.log('팔로잉', follwoingInformation);
  return (
    <>
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
    </>
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
