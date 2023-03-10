import styled from 'styled-components';
import { authService, dbService } from '@/firebase';
import { useState } from 'react';
import { collection, query, getDocs, orderBy } from 'firebase/firestore';
import ProfileEdit from '@/components/mypage/ProfileEdit';
import MyPageCalendar from '@/components/mypage/MyPageCalendar';
import LoginState from '@/components/mypage/LoginState';
import MyPageGalley from '@/components/mypage/MyPageGallery';
import MyPageLike from '@/components/mypage/MyPageLike';
import MyPageBoard from '@/components/mypage/MyPageBoard';
import MyPageRecruit from '@/components/mypage/MyPageRecruit';
import { useQuery } from 'react-query';
import Loading from '@/components/common/globalModal/Loading';
import { getProfile } from '../api/api';
//mypage 컴포넌트 나누기 완료
const MyPage = ({ params }: any) => {
  //전달받은 id
  const paramsId = String(params);

  //토글
  const [toggle, setToggle] = useState(false);
  const onClickToggle = () => {
    setToggle(!toggle);
  };

  //MyPage 메뉴
  const [galleyMenu, setGalleyMenu] = useState(true);
  const [boardMenu, setBoardMenu] = useState(false);
  const [likeMenu, setLikeMenu] = useState(false);
  const [meetingMenu, setMeetingMenu] = useState(false);
  const [followModal, setFollowModal] = useState(false);

  //버튼
  const galleyButton = !galleyMenu ? (
    <GalleyButton
      onClick={() => {
        setGalleyMenu(true),
          setBoardMenu(false),
          setLikeMenu(false),
          setMeetingMenu(false);
      }}
    >
      오운완 갤러리
    </GalleyButton>
  ) : (
    <GalleyButton style={{ backgroundColor: 'black', color: 'white' }}>
      오운완 갤러리
    </GalleyButton>
  );
  const boardButton = !boardMenu ? (
    <GalleyButton
      onClick={() => {
        setGalleyMenu(false),
          setBoardMenu(true),
          setLikeMenu(false),
          setMeetingMenu(false);
      }}
    >
      작성한 글
    </GalleyButton>
  ) : (
    <GalleyButton style={{ backgroundColor: 'black', color: 'white' }}>
      작성한 글
    </GalleyButton>
  );

  const likeButton = !likeMenu ? (
    <GalleyButton
      onClick={() => {
        setGalleyMenu(false),
          setBoardMenu(false),
          setLikeMenu(true),
          setMeetingMenu(false);
      }}
    >
      좋아요
    </GalleyButton>
  ) : (
    <GalleyButton style={{ backgroundColor: 'black', color: 'white' }}>
      좋아요
    </GalleyButton>
  );
  const meetingButton = !meetingMenu ? (
    <GalleyButton
      onClick={() => {
        setGalleyMenu(false),
          setBoardMenu(false),
          setLikeMenu(false),
          setMeetingMenu(true);
      }}
    >
      참여중 모임
    </GalleyButton>
  ) : (
    <GalleyButton style={{ backgroundColor: 'black', color: 'white' }}>
      참여중 모임
    </GalleyButton>
  );

  // 프로필 불러오기

  const { isLoading: profileLoading, data: profile } = useQuery(
    'profile',
    getProfile,
    {
      onSuccess: () => {},
      onError: (error) => {
        console.log('error : ', error);
      },
    },
  );
  // 게시판 불러오기
  const getBoardPost = async () => {
    const q = query(
      collection(dbService, 'posts'),
      orderBy('createdAt', 'desc'),
    );
    const data = await getDocs(q);
    return data.docs.map((doc: any) => ({
      id: doc.id,
      ...doc.data(),
    }));
  };

  const { isLoading: boardLoading, data: board } = useQuery(
    'board',
    getBoardPost,
    {
      onSuccess: () => {},
      onError: (error) => {
        console.log('error : ', error);
      },
    },
  );

  //MyPageGallery 불러오기
  const getGalleryPost = async () => {
    const q = query(
      collection(dbService, 'gallery'),
      orderBy('createdAt', 'desc'),
    );
    const data = await getDocs(q);
    return data.docs.map((doc: any) => ({
      id: doc.id,
      ...doc.data(),
    }));
  };
  const { isLoading: galleryLoading, data: gallery } = useQuery(
    'gallery',
    getGalleryPost,
    {
      onSuccess: () => {},
      onError: (error) => {
        console.log('error : ', error);
      },
    },
  );

  const combineData = board?.concat(gallery);

  if (galleryLoading) {
    return <Loading />;
  }
  if (profileLoading) {
    return <Loading />;
  }
  if (boardLoading) {
    return <Loading />;
  }

  return (
    <MyPageWrapper>
      {profile && (
        <MyPageContainer>
          <ProfileBox>
            {profile
              .filter((item) => item.id === paramsId)
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
            <Schedule>
              {paramsId === authService.currentUser?.uid && <MyPageCalendar />}
            </Schedule>
          </ScheduleBox>
          <NavigationBox>
            {galleyButton}
            {boardButton}
            {likeButton}
            {meetingButton}
          </NavigationBox>
          <MypageBox>
            <>
              {gallery && galleyMenu && (
                <GalleyBox>
                  <MyPageGalley paramsId={paramsId} gallery={gallery} />
                </GalleyBox>
              )}
            </>
            {board && boardMenu && (
              <GalleyBox>
                <MyPageBoard paramsId={paramsId} board={board} />
              </GalleyBox>
            )}
            {combineData && likeMenu && (
              <GalleyBox>
                <MyPageLike combineData={combineData} paramsId={paramsId} />
              </GalleyBox>
            )}

            {meetingMenu && (
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
                    {profile.map((item) => {
                      return (
                        <LoginState
                          key={item.id}
                          item={item}
                          toggle={toggle}
                          paramsId={paramsId}
                          setFollowModal={setFollowModal}
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
  ${({ theme }) => theme.mainLayout.container}
  height : calc(100% - 40px);
`;
const ProfileBox = styled.div`
  float: left;
  width: 70%;
  height: 270px;
`;
const ScheduleBox = styled.div`
  float: right;
  margin-top: 0.5vh;
  margin-bottom: 0.5vh;
  margin-right: 16px;
  width: 25%;
`;
const Schedule = styled.div`
  width: 100%;
`;
const NavigationBox = styled.div`
  gap: 16px;
  display: flex;
  float: left;
  width: 65%;
  height: 70px;
  text-align: left;
  margin-top: 2vh;
  margin-left: 50px;
  border-bottom-style: solid;
  border-color: black;
  border-width: 0.1rem;
`;

const GalleyButton = styled.button`
  ${({ theme }) => theme.btn.category}
  min-width: 130px;
  background-color: white;
  border-style: solid;
  border-width: 0.1rem;
  box-shadow: -2px 2px 0px 0px #000000;
  :hover {
    cursor: pointer;
    background-color: black;
    color: white;
  }
`;

const GalleyBox = styled.div`
  width: 98%;
  height: 98%;
  overflow: auto;
  ::-webkit-scrollbar {
    display: none;
  }
`;

const MypageBox = styled.div`
  float: left;
  width: 72%;
  height: 51%;
  margin-left: 10px;
`;

const ToggleButtonBox = styled.div`
  background-color: white;
  width: 205px;
  margin: auto;
  height: 46px;
  margin-bottom: 20px;
  border-radius: 30px;
`;
const ToggleButton = styled.button`
  background-color: white;
  width: 102.5px;
  height: 46px;
  border: none;
  border-radius: 30px;
  :hover {
    cursor: pointer;
    background-color: black;
    color: white;
    transition: 0.7s;
  }
  :focus {
    background-color: black;
    color: white;
  }
`;

const FollowToggleButton = styled.button`
  width: 102.5px;
  height: 46px;
  background-color: black;
  color: white;
  border: none;
  border-radius: 30px;
`;
const LoginStateBox = styled.div`
  height: 80%;
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
  width: 550px;
  height: 600px;
  position: fixed;
  top: 50%;
  left: 50%;
  border-radius: 15px;
  box-shadow: -2px 2px 0px 0px #000000;
  transform: translate(-50%, -50%) !important;
  padding-top: 1.5rem;
  background-color: #fffcf3;
  border-style: solid;
  border-width: 0.1rem;
  border-color: black;
`;
