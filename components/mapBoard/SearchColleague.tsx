import { dbService } from '@/firebase';
import { MapModalProps, RecruitPostType } from '@/type';
import { collection, getDocs } from 'firebase/firestore';
import React, { useRef, useEffect, useState } from 'react';
import { Map, MapMarker, CustomOverlayMap } from 'react-kakao-maps-sdk';
import styled from 'styled-components';
import MyLocationMarker from './MyLocationMarker';
import RecruitPostsWindow from './RecruitPostsWindow';

// const initialPosition = {
//   lat: 33.5563,
//   lng: 126.79581,
// };

const SearchColleague = (props: MapModalProps) => {
  const { coordinate, setMarkerCoordi, region, setRegion } = props;

  const [map, setMap] = useState();
  const [inputRegion, setInputRegion] = useState('');

  // 서버로부터 fetch된 운동 동료 모집글 배열을 저장하는 state
  const [recruitPosts, setRecruitPosts] = useState<RecruitPostType[]>([]);

  // myLocation에서 내 위치를 중심으로 나타내기 위해 필요한 state
  const [myPosition, setMyPosition] = useState({
    center: {
      lat: 33.450701,
      lng: 126.570667,
    },
    errMsg: '',
    isLoading: true,
  });

  // onTileLoad(중심 위치)를 위한 위치 좌표 state
  // const [position, setPosition] = useState(initialPosition);

  const mapRef = useRef();

  const onChangeInputRegion = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      currentTarget: { value },
    } = event;
    setInputRegion(value);
  };

  // 지역 설정
  const onClickSetRegion = () => {
    setRegion(inputRegion);
    setInputRegion('');
  };

  // 엔터 후 지역 설정
  const onPressSetRegion = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      onClickSetRegion();
    }
  };

  // 마커의 좌표 가져오기
  const getCoordinate = (post: RecruitPostType) => {
    setMarkerCoordi({
      lat: Number(post.coordinate?.lat),
      lng: Number(post.coordinate?.lng),
    });
  };

  // 검색 위치로 지도 재설정
  useEffect(() => {
    if (!map) return;
    const ps = new kakao.maps.services.Places();

    ps.keywordSearch(`${region}`, (data, status, _pagination) => {
      if (status === kakao.maps.services.Status.OK) {
        // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
        // LatLngBounds 객체에 좌표를 추가합니다
        const bounds = new kakao.maps.LatLngBounds();

        for (let i = 0; i < data.length; i++) {
          // @ts-ignore
          bounds.extend(new kakao.maps.LatLng(data[i].y, data[i].x));
        }
        // 검색된 장소 위치를 기준으로 지도 범위를 재설정합니다
        //   @ts-ignore
        map.setBounds(bounds);
        console.log('bounds', bounds);
        console.log('map', map);
      }
    });
  }, [map, region]);

  useEffect(() => {
    const fetchRecruitPosts = async () => {
      const querySnapshot = await getDocs(
        collection(dbService, 'recruitments'),
      );

      const recruitPosts = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRecruitPosts(recruitPosts);
    };

    fetchRecruitPosts();
  }, []);

  if (!coordinate) {
    return (
      <>
        <Map
          center={{ lat: 33.5563, lng: 126.79581 }}
          style={{ width: '90%', height: '90%', borderRadius: '2rem' }}
        >
          <MapMarker position={{ lat: 33.55635, lng: 126.795841 }}>
            <div style={{ color: '#000' }}>설정된 좌표가 없습니다!</div>
          </MapMarker>
        </Map>
      </>
    );
  }

  return (
    <>
      <MapModalMain>
        <SearchBar>
          <SerachImg
            src="/assets/icons/searchIcon.png"
            onClick={onClickSetRegion}
          />
          <SerachInput
            onChange={onChangeInputRegion}
            onKeyUp={onPressSetRegion}
            value={inputRegion}
            placeholder="원하는 지역을 검색하세요!"
          />
        </SearchBar>
        <StyledMap
          key={`map-${myPosition.center.lat}-${myPosition.center.lng}`}
          center={myPosition.center}
          //@ts-ignore
          onCreate={setMap}
          level={8}
        >
          {recruitPosts.map((post) => {
            if (post.coordinate) {
              return (
                <>
                  <MapMarker
                    key={`marker-${post.coordinate?.lat}-${post?.coordinate?.lng}-id-${post.id}`}
                    position={{
                      lat: post.coordinate?.lat,
                      lng: post?.coordinate?.lng,
                    }}
                    image={{
                      src: '/assets/icons/mapBoard/mappin_hand_icon.svg',
                      size: { width: 50, height: 53 },
                    }}
                    onClick={() => getCoordinate(post)}
                  />
                  <CustomOverlayMap
                    position={{
                      lat: post.coordinate?.lat,
                      lng: post?.coordinate?.lng,
                    }}
                    xAnchor={0.5}
                    yAnchor={3}
                  >
                    <RecruitPostsWindow
                      post={post}
                      recruitPosts={recruitPosts}
                      setMarkerCoordi={setMarkerCoordi}
                    />
                  </CustomOverlayMap>
                </>
              );
            }
          })}
          {/* 나의 위치 표시 */}
          {/* <MyLocationMarker
            myPosition={myPosition}
            setMyPosition={setMyPosition}
          /> */}
        </StyledMap>
      </MapModalMain>
    </>
  );
};

export default SearchColleague;

// 게시글 작성에서 '운동 장소 등록'이 필요함
// '운동 장소 등록'을 누르면 map 모달을 띄우고 사용자가 거기서 좌표를 선택하게 한다.
// 좌표 데이터를 받아서 주소지(헬스장 이름)으로 변환

// firebase에서 좌표 정보를 불러온다.

const StyledMap = styled(Map)`
  width: 100%;
  height: 100%;
  border-top: 1px solid black;
  border-bottom-left-radius: 5%;
  border-bottom-right-radius: 5%;
`;

const MapModalMain = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
`;

const SearchContianer = styled.div`
  width: 100%;
  border-bottom: 1px solid black;
`;

const SearchBar = styled.div`
  ${({ theme }) => theme.inputDiv}
  background-color: white;
  border: 1px solid black;
  width: 80%;
  margin-top: 20px;
  margin-bottom: 20px;
`;

const SerachImg = styled.img`
  width: 20px;
  margin-right: 20px;

  cursor: pointer;
`;

const SerachInput = styled.input`
  ${({ theme }) => theme.input}
  background-color: white;
`;
