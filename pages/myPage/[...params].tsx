import styled from 'styled-components';
import { authService, dbService } from '@/firebase';
import { useState, useEffect } from 'react';
import {
  collection,
  query,
  onSnapshot,
  getDocs,
  orderBy,
} from 'firebase/firestore';
import ProfileEdit from '@/components/ProfileEdit';
import MyPageCalendar from '@/components/MyPageCalendar';
import LoginState from '@/components/LoginState';
import MyPageGalley from '@/components/MyPageGallery';
import MyPageLike from '@/components/MyPageLike';
import MyPageBoard from '@/components/MyPageBoard';
import MyPageRecruit from '@/components/MyPageRecruit';
import { theme } from '@/styles/theme';

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
export type Board = {
  id: string;
  photo: string;
  userId: string;
  nickName: string;
  title: string;
  content: string;
  category: string;
  createdAt: number;
  comment: number;
  like: [];
};
export type Gallery = {
  id: string;
  photo: string;
  userId: string;
  nickName: string;
  title: string;
  content: string;
  category: string;
  createdAt: number;
  comment: number;
  like: [];
};

// next.js = 랜더의 주체가 node 서버에서 랜더를 하고 뿌림 마운팅 node가 마운팅 후에 핸들링 브라우저
const MyPage = ({ params }: any) => {
  //전달받은 id
  const paramsId = String(params);

  const [isLoadCalendar, setIsLoadCalendar] = useState<boolean>(false);
  //프로필 정보 불러오기
  const [profileInformation, setProfileInformation] = useState<ProfileItem[]>(
    [],
  );
  //MyPageBoard 불러오기
  const [boardInformation, setBoardInFormation] = useState([] as any);

  //MyPageGallery 불러오기
  const [galleryInformation, setGalleryInFormation] = useState([] as any);

  //토글
  const [toggle, setToggle] = useState(false);
  const onClickToggle = () => {
    setToggle(!toggle);
  };

  //MyPage 메뉴
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
    <GalleyButton style={{ backgroundColor: 'black', color: 'white' }}>
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
    <GalleyButton style={{ backgroundColor: 'black', color: 'white' }}>
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
    <GalleyButton style={{ backgroundColor: 'black', color: 'white' }}>
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
    <GalleyButton style={{ backgroundColor: 'black', color: 'white' }}>
      참여중 모임
    </GalleyButton>
  );

  //profile 컬렉션 불러오기
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
  // 팔로워, 팔로잉 불러오기

  //MyPageBoard 불러오기
  const getBoardPost = async () => {
    const q = query(
      collection(dbService, 'posts'),
      orderBy('createdAt', 'desc'),
    );
    const data = await getDocs(q);
    const getBoardData = data.docs.map((doc: any) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setBoardInFormation(getBoardData);
  };

  //MyPageGallery 불러오기
  const getGalleryPost = async () => {
    const q = query(
      collection(dbService, 'gallery'),
      orderBy('createdAt', 'desc'),
    );
    const data = await getDocs(q);
    const getGalleryData = data.docs.map((doc: any) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setGalleryInFormation(getGalleryData);
  };
  useEffect(() => {
    profileOnSnapShot();
    getBoardPost();
    getGalleryPost();
    return () => {
      profileOnSnapShot();
      getBoardPost();
      getGalleryPost();
      // followGetDoc(); //useEffect가 업데이트 되기 전 실행됨
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
                    setFollowModal={setFollowModal}
                    setToggle={setToggle}
                  />
                );
              })}
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
          <MypageBox>
            {galley && (
              <GalleyBox>
                <MyPageGalley
                  paramsId={paramsId}
                  galleryInformation={galleryInformation}
                />
              </GalleyBox>
            )}

            {board && (
              <GalleyBox>
                <MyPageBoard
                  paramsId={paramsId}
                  boardInformation={boardInformation}
                />
              </GalleyBox>
            )}
            {like && (
              <GalleyBox>
                <MyPageLike
                  galleryInformation={galleryInformation}
                  boardInformation={boardInformation}
                  paramsId={paramsId}
                />
              </GalleyBox>
            )}
            {meeting && (
              <GalleyBox>
                <MyPageRecruit paramsId={paramsId} />
              </GalleyBox>
            )}
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
                        <FollowToggleButton onClick={onClickToggle}>
                          팔로워
                        </FollowToggleButton>
                        <ToggleButton onClick={onClickToggle}>
                          팔로잉
                        </ToggleButton>
                      </>
                    ) : (
                      <>
                        <ToggleButton onClick={onClickToggle}>
                          팔로워
                        </ToggleButton>
                        <FollowToggleButton onClick={onClickToggle}>
                          팔로잉
                        </FollowToggleButton>
                      </>
                    )}
                  </ToggleButtonBox>
                  <LoginStateBox>
                    {profileInformation.map((item) => {
                      return (
                        <LoginState
                          followModal={followModal}
                          key={item.id}
                          item={item}
                          toggle={toggle}
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
  text-align: center;
  ${({ theme }) => theme.mainLayout.wrapper}
`;
const MyPageContainer = styled.div`
  ${({ theme }) => theme.mainLayout.container}/* background-color: black; */
`;
const ProfileBox = styled.div`
  float: left;
  width: 70%;
  height: 35%;
`;
const ScheduleBox = styled.div`
  float: right;
  margin-top: 20px;
  margin-bottom: 20px;
  width: 25%;
`;
const Schedule = styled.div`
  width: 100%;
`;
const NavigationBox = styled.div`
  display: flex;
  float: left;
  width: 63%;
  height: 8%;
  text-align: left;
  margin-left: 50px;
  margin-bottom: 2vh;
  border-bottom-style: solid;
  border-color: black;
  border-width: 0.1rem;
`;

const GalleyButton = styled.button`
  margin-right: auto;
  border-radius: 2rem;
  background-color: white;
  width: 130px;
  height: 45px;
  :hover {
    cursor: pointer;
    background-color: black;
    color: white;
  }
`;

const GalleyBox = styled.div`
  width: 98%;
  height: 55%;
  overflow: auto;
  ::-webkit-scrollbar {
    display: none;
  }
`;

const MypageBox = styled.div`
  float: left;
  width: 70%;
  height: 90%;
  margin-left: 10px;
`;

const MyPageHeader = styled.div``;

const ToggleButtonBox = styled.div`
  background-color: white;
  width: 10vw;
  margin: auto;
  height: 5vh;
  margin-bottom: 2vh;
  border-radius: 30px;
`;
const ToggleButton = styled.button`
  background-color: white;
  width: 5vw;
  height: 5vh;
  border: none;
  border-radius: 30px;
  :hover {
    cursor: pointer;
    background-color: black;
    color: white;
  }
  :focus {
    background-color: black;
    color: white;
  }
`;

const FollowToggleButton = styled.button`
  width: 5vw;
  height: 5vh;
  background-color: black;
  color: white;
  border: none;
  border-radius: 30px;
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
  background-color: #fffcf3;
  transform: translate(-50%, -50%) !important;
  padding-top: 1.5rem;
  border-style: solid;
  border-width: 0.1rem;
  border-color: black;
`;
