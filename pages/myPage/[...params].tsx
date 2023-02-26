import styled from 'styled-components';
import { authService, dbService } from '@/firebase';
import { useState, useEffect } from 'react';
import {
  collection,
  query,
  onSnapshot,
  where,
  getDocs,
} from 'firebase/firestore';
import ProfileEdit from '@/components/ProfileEdit';
import MyPageCalendar from '@/components/MyPageCalendar';
import LoginState from '@/components/LoginState';
import MyPageGalley from '@/components/MyPageGallery';
import MyPageLike from '@/components/MyPageLike';
import { useRouter } from 'next/router';
import { type } from 'os';
import MyPageBoard from '@/components/MyPageBoard';

export type ProfileItem = {
  id: string;
  area?: string;
  introduction?: string;
  instagram?: string;
  displayName?: string;
  email?: string;
  photoURL?: string;
  loginState?: boolean;
  following?: string;
  follower?: string;
  uid?: string;
  lv?: number;
  lvName?: string;
};
// next.js = 랜더의 주체가 node 서버에서 랜더를 하고 뿌림 마운팅 node가 마운팅 후에 핸들링 브라우저
const MyPage = ({ params }: any) => {
  //불러오기
  //캘린더
  const paramsId = String(params);

  console.log(authService.currentUser?.uid);
  console.log(paramsId);
  const [isLoadCalendar, setIsLoadCalendar] = useState<boolean>(false);

  const [profileInformation, setProfileInformation] = useState<ProfileItem[]>(
    [],
  );

  const [following, setFollowing] = useState([] as any);
  const [follower, setFollower] = useState([] as any);
  // const follwoingInformation = following.join();
  // const followerInformation = follower.join();

  const [toggle, setToggle] = useState(false);
  const onClickToggle = () => {
    setToggle(!toggle);
  };
  const [galley, setGalley] = useState(true);
  const [board, setBoard] = useState(false);
  const [like, setLike] = useState(false);
  const [meeting, setMeeting] = useState(false);
  const [followModal, setFollowModal] = useState(false);

  //버튼
  const galleyButton = !galley ? (
    <GalleyButton
      onClick={() => {
        setGalley(true), setBoard(false), setLike(false), setMeeting(false);
      }}
    >
      오운완 갤러리
    </GalleyButton>
  ) : (
    <GalleyButton style={{ backgroundColor: 'gray', color: 'white' }}>
      오운완 갤러리
    </GalleyButton>
  );
  const boardButton = !board ? (
    <GalleyButton
      onClick={() => {
        setGalley(false), setBoard(true), setLike(false), setMeeting(false);
      }}
    >
      게시판
    </GalleyButton>
  ) : (
    <GalleyButton style={{ backgroundColor: 'gray', color: 'white' }}>
      게시판
    </GalleyButton>
  );

  const likeButton = !like ? (
    <GalleyButton
      onClick={() => {
        setGalley(false), setBoard(false), setLike(true), setMeeting(false);
      }}
    >
      좋아요
    </GalleyButton>
  ) : (
    <GalleyButton style={{ backgroundColor: 'gray', color: 'white' }}>
      좋아요
    </GalleyButton>
  );
  const meetingButton = !meeting ? (
    <GalleyButton
      onClick={() => {
        setGalley(false), setBoard(false), setLike(false), setMeeting(true);
      }}
    >
      참여중 모임
    </GalleyButton>
  ) : (
    <GalleyButton style={{ backgroundColor: 'gray', color: 'white' }}>
      참여중 모임
    </GalleyButton>
  );
  //Calendar 업로드 시간 설정

  const profileOnSnapShot = () => {
    paramsId === authService.currentUser?.uid
      ? setIsLoadCalendar(true)
      : setIsLoadCalendar(false);
    const q = query(collection(dbService, 'profile'));
    onSnapshot(q, (snapshot) => {
      const newprofiles = snapshot.docs.map((doc) => {
        const newprofile = {
          id: doc.id,
          ...doc.data(),
        };
        return newprofile;
      });
      setProfileInformation(newprofiles);
    });
  };
  // const followGetDoc = () => {
  //   const q = query(
  //     collection(dbService, 'profile'),
  //     where('uid', '==', paramsId),
  //   );
  //   onSnapshot(q, (snapshot) => {
  //     snapshot.docs.map((doc) => {
  //       setFollowing((prev: any) => [...prev, doc.data().following]);
  //       setFollower((prev: any) => [...prev, doc.data().follower]);
  //     });
  //   });
  // };
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
    profileOnSnapShot();
    followGetDoc();
    return () => {
      profileOnSnapShot();
      followGetDoc();
    };
  }, [paramsId, authService.currentUser]);

  return (
    <MyPageWrapper>
      {profileInformation && (
        <MyPageContainer>
          <ProfileBox>
            {profileInformation
              .filter((item) => item.id === String(paramsId))
              .map((item) => {
                return (
                  <ProfileEdit
                    key={item.id}
                    item={item}
                    paramsId={paramsId}
                    follower={follower}
                    following={following}
                    setFollowModal={setFollowModal}
                  />
                );
              })}
            {/* <MyPageHeader>
              <HeaderText>좋아요</HeaderText>
              <ClickText>전체보기</ClickText>
            </MyPageHeader>
            <InformationBox>{/* <MyPageLike /> </InformationBox> */}
          </ProfileBox>
          <ScheduleBox>
            <Schedule>{isLoadCalendar && <MyPageCalendar />}</Schedule>
          </ScheduleBox>
          <NavigationBox>
            {galleyButton}
            {boardButton}
            {likeButton}
            {meetingButton}
          </NavigationBox>
          {galley && (
            <GalleyBox>
              <MyPageGalley paramsId={paramsId} />
            </GalleyBox>
          )}

          <MypageBox>
            <MyPageHeader>
              {board && (
                <GalleyBox>
                  <MyPageBoard paramsId={paramsId} />
                </GalleyBox>
              )}
            </MyPageHeader>
            {followModal && (
              <>
                <ModalClose
                  onClick={() => {
                    setFollowModal(false);
                  }}
                ></ModalClose>
                <FollowModal>
                  <ToggleButtonBox>
                    {toggle ? (
                      <>
                        <ToggleButton onClick={onClickToggle}>
                          팔로잉
                        </ToggleButton>
                        <FollowToggleButton onClick={onClickToggle}>
                          팔로워
                        </FollowToggleButton>
                      </>
                    ) : (
                      <>
                        <FollowToggleButton onClick={onClickToggle}>
                          팔로잉
                        </FollowToggleButton>
                        <ToggleButton onClick={onClickToggle}>
                          팔로워
                        </ToggleButton>
                      </>
                    )}
                  </ToggleButtonBox>
                  <LoginStateBox>
                    {profileInformation.map((item) => {
                      return (
                        <LoginState
                          key={item.id}
                          item={item}
                          toggle={toggle}
                          follower={follower}
                          following={following}
                          paramsId={paramsId}
                        />
                      );
                    })}
                  </LoginStateBox>
                </FollowModal>
              </>
            )}
          </MypageBox>
        </MyPageContainer>
      )}
    </MyPageWrapper>
  );
};

export function getServerSideProps({ params: { params } }: any) {
  return {
    props: {
      params,
    },
  };
}

export default MyPage;

const MyPageWrapper = styled.div`
  display: flex;
  text-align: center;
  width: 100%;
`;
const MyPageContainer = styled.div`
  width: 100%;
  height: 100%;
  margin-left: 2vw;
  margin-top: 2vh;
`;
const ProfileBox = styled.div`
  float: left;
  width: 60%;
  height: 32%;
`;
const ScheduleBox = styled.div`
  float: right;
  width: 25%;
  height: 100vh;
`;
const Schedule = styled.div`
  background-color: #eeeeee;
  width: 20vw;
  border-radius: 16px;
`;
const NavigationBox = styled.div`
  display: flex;
  float: left;
  width: 67%;
  height: 7%;
  text-align: left;
  margin-left: 4vw;
  border-bottom-style: solid;
  border-color: #eeeeee;
`;

const GalleyButton = styled.button`
  margin-right: 4vw;
  background-color: #eeeeee;
  border-radius: 2rem;
  border: none;
  width: 6vw;
  height: 4.5vh;
  :hover {
    cursor: pointer;
    background-color: gray;
    color: white;
  }
`;

const GalleyBox = styled.div`
  position: absolute;
  width: 65%;
  height: 100%;
  margin-left: 2vw;
  top: 52%;
`;

const MypageBox = styled.div`
  float: left;
  width: 70%;
`;
const InformationBox = styled.div``;

const MyPageHeader = styled.div`
  display: flex;
  margin-bottom: 2vh;
  color: #495057;
`;
const HeaderText = styled.span`
  margin-right: auto;
  font-size: 20px;
  :hover {
    cursor: pointer;
    color: black;
  }
`;
const ClickText = styled.button`
  background-color: white;
  border: none;
  font-size: 16px;
  :hover {
    cursor: pointer;
    color: black;
  }
`;
const ToggleButtonBox = styled.div`
  background-color: #eeeeee;
  width: 10vw;
  margin: auto;
  height: 5vh;
  margin-bottom: 2vh;
  border-radius: 30px;
`;
const ToggleButton = styled.button`
  width: 5vw;
  height: 5vh;
  border: none;
  border-radius: 30px;
  :hover {
    cursor: pointer;
    background-color: lightgray;
  }
  :focus {
    background-color: gray;
    color: white;
  }
`;

const FollowToggleButton = styled.button`
  width: 5vw;
  height: 5vh;
  background-color: gray;
  color: white;
  border: none;
  border-radius: 30px;
  :hover {
    cursor: pointer;
    background-color: lightgray;
  }
`;
const LoginStateBox = styled.div`
  height: 85%;
  overflow: auto;
  ::-webkit-scrollbar {
    display: none;
  }
`;
const ModalClose = styled.div`
  z-index: 1500;
  display: block;
  background: rgba(0, 0, 0, 0.3);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

const FollowModal = styled.div`
  z-index: 2000;
  width: 27%;
  height: 60%;
  position: fixed;
  top: 50%;
  left: 50%;
  border-radius: 15px;
  background-color: white;
  transform: translate(-50%, -50%) !important;
  padding-top: 1.5rem;
  border-style: solid;
  border-width: 1px;
  border-color: gray;
`;
