import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { RecruitPostType } from '../../type';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { authService, dbService } from '@/firebase';
import RecruitPost from '@/components/mapBoard/RecruitPost';
import styled from 'styled-components';
import { CoordinateType } from '../../type';
import SearchColleague from '@/components/mapBoard/SearchColleague';
import useModal from '@/hooks/useModal';
import { GLOBAL_MODAL_TYPES } from '@/recoil/modalState';

const initialCoordinate: CoordinateType = {
  lat: 33.5563,
  lng: 126.79581,
};

const MapBoard = () => {
  const router = useRouter();
  // 모집글 객체 배열
  const [recruitPosts, setRecruitPosts] = useState<RecruitPostType[]>();
  // 위도, 경도 담아주기 (좌표 -> coordinate)
  const [coordinate, setCoordinate] =
    useState<CoordinateType>(initialCoordinate);

  // 마커 선택한 좌표
  const [markerCoordi, setMarkerCoordi] = useState<CoordinateType>();

  // 마커 선택한 좌표대로 필터된 모집글 배열
  const [selectedPosts, setSelectedPosts] = useState<RecruitPostType[]>();

  // SearchMyColleague에서 검색할 때 onChange에 쓰이는 state
  const [region, setRegion] = useState('서울');

  const { showModal } = useModal();

  // 글쓰기 페이지로 이동
  const goToWrite = () => {
    if (!authService.currentUser) {
      showModal({
        modalType: GLOBAL_MODAL_TYPES.AlertModal,
        modalProps: {
          contentText: '로그인 후 이용 해주세요!',
        },
      });
      router.push('/signIn');

      return;
    }

    if (authService.currentUser) {
      router.push('/mapBoard/WritingRecruitment');
    }
  };

  // 마커 클릭한 좌표로 RecruitPosts 필터하기
  useEffect(() => {
    const filteredPosts = recruitPosts?.filter(
      (post) =>
        post.coordinate?.lat === markerCoordi?.lat &&
        post.coordinate?.lng === markerCoordi?.lng,
    );
    setSelectedPosts(filteredPosts);
  }, [markerCoordi]);

  // 동료 검색을 하면 selectedPosts를 초기화 해준다
  useEffect(() => {
    setSelectedPosts([]);
  }, [region]);

  // 마운트 시 post 실시간으로 불러오기
  useEffect(() => {
    const recruitPostsRef = collection(dbService, 'recruitments');

    const q = query(recruitPostsRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newRecruitPosts = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRecruitPosts(newRecruitPosts);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  // 교정이 필요하다. 이건 클라이언트 state다. server state로 바꿀 필요가 있다.
  if (!recruitPosts) {
    return <div>게시글을 불러오고 있습니다.</div>;
  }

  return (
    <>
      <MapBoardWrapper>
        <MapBoardContainer>
          <MapBoardHeadContainer>
            <MapBoardWritingButton onClick={goToWrite}>
              모집글 작성하기
            </MapBoardWritingButton>
          </MapBoardHeadContainer>

          <MapBoardBodyContainer>
            <MapBox>
              <SearchColleague
                setCoordinate={setCoordinate}
                coordinate={coordinate}
                setMarkerCoordi={setMarkerCoordi}
                region={region}
                setRegion={setRegion}
              />
            </MapBox>

            <MapBoardPostsBox>
              <MapBoardPostHead>{`"${region}"에서 모임`}</MapBoardPostHead>
              {selectedPosts?.length !== 0 ? (
                selectedPosts?.map((post) => {
                  return <RecruitPost post={post} key={post.id} />;
                })
              ) : (
                <>
                  <EmptyPostImageBox>
                    <img src="/assets/icons/mapBoard/empty_pictogram.svg" />
                    <EmptyPostTextBox>
                      <EmptyImageText>지도의&nbsp;</EmptyImageText>
                      <FingerImage src="/assets/icons/mapBoard/mappin_hand_icon.svg" />
                      <EmptyImageText>
                        을 클릭하고 게시물을 확인하세요!
                      </EmptyImageText>
                    </EmptyPostTextBox>
                  </EmptyPostImageBox>
                </>
              )}
            </MapBoardPostsBox>
          </MapBoardBodyContainer>
        </MapBoardContainer>
      </MapBoardWrapper>
    </>
  );
};

export default MapBoard;

const MapBoardWrapper = styled.main`
  ${({ theme }) => theme.mainLayout.wrapper}
`;

const MapBoardContainer = styled.section`
  ${({ theme }) => theme.mainLayout.container}
  flex-direction: column;
`;

const MapBoardBodyContainer = styled.section`
  display: flex;
  flex-direction: row;
  height: calc(100% - 70px);
  margin-top: 20px;
  align-items: center;
  justify-content: center;
  gap: 30px;
  /* margin-top: -10px; */
`;

const MapBox = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid black;
  border-radius: 2rem;
  width: 50%;
  height: 100%;
  background-color: white;
`;

const MapBoardPostsBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding: 1rem;
  border: 1px solid black;
  background-color: #ffff;
  border-radius: 2rem;
  width: 50%;
  height: 100%;

  overflow: auto;
  overflow-x: hidden;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const MapBoardPostHead = styled.span`
  font-size: ${({ theme }) => theme.font.font70};
  margin-bottom: 16px;
`;

const MapBoardHeadContainer = styled.section`
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

const MapBoardWritingButton = styled.button`
  ${({ theme }) => theme.btn.btn100}
  background-color: ${({ theme }) => theme.color.brandColor100};
  color: white;
  border: 1px solid black;
  /* &:hover {
    background-color: #ffcab5;
  } */
`;

const MapdBox2 = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-color: white;
  border-radius: 2rem;
  width: 100%;
  height: 100%;
  gap: 1rem;
`;

const EmptyPostImageBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
`;

const EmptyPostTextBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin-top: 20px;
`;

const FingerImage = styled.img`
  width: 24px;
  height: 24px;
`;

const EmptyImageText = styled.span`
  font-size: ${({ theme }) => theme.font.font50};
`;
