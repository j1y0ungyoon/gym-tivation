import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { RecruitPostType } from '../../type';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { authService, dbService } from '@/firebase';
import RecruitPost from '@/components/RecruitPost';
import styled from 'styled-components';
import { CoordinateType } from '../../type';
import SearchColleague from '@/components/SearchColleague';

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

  // 글쓰기 페이지로 이동
  const goToWrite = () => {
    if (!authService.currentUser) {
      alert('로그인을 먼저 해주세요!');
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
      <Wrapper>
        <MapBoardHeadContainer>
          <MapBoardWritingButton onClick={goToWrite}>
            모집글 작성하기
          </MapBoardWritingButton>
        </MapBoardHeadContainer>

        <Wapper2>
          <MapWrapper>
            <MapBoardContainer>
              <SearchColleague
                setCoordinate={setCoordinate}
                coordinate={coordinate}
                setMarkerCoordi={setMarkerCoordi}
                region={region}
                setRegion={setRegion}
              />
            </MapBoardContainer>
          </MapWrapper>

          <MapBoardWrapper>
            <h4>{`"${region}"에서 모임`}</h4>
            {selectedPosts?.map((post) => {
              return <RecruitPost post={post} key={post.id} />;
            })}
          </MapBoardWrapper>
        </Wapper2>
      </Wrapper>
    </>
  );
};

export default MapBoard;

const Wrapper = styled.main`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const Wapper2 = styled.section`
  display: flex;
  flex-direction: row;
  padding: 20px;
  align-items: center;
  justify-content: center;
  gap: 30px;
  margin-top: -10px;
`;

const MapWrapper = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #d9d9d9;
  border-radius: 2rem;
`;

const MapBoardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding: 2rem;
  background-color: #d9d9d9;
  border-radius: 2rem;
  width: 40%;
  height: 60rem;
`;

const MapBoardHeadContainer = styled.section`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 10px;
  margin-top: 10px;
  margin-right: 2.3rem;
`;

const MapBoardWritingButton = styled.button`
  padding: 10px;
  margin-right: 75px;
  background-color: #d9d9d9;
  border: none;
  border-radius: 1rem;
`;

const MapBoardContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-color: #d9d9d9;
  border-radius: 2rem;
  width: 35%;
  height: 60rem;
  gap: 1rem;
`;

const PostListSection = styled.div``;
