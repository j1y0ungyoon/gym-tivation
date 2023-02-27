import { dbService } from '@/firebase';
import { MapModalProps, RecruitPostType, CoordinateType } from '@/type';
import { collection, getDocs } from 'firebase/firestore';
import React, { useRef, useEffect, useState } from 'react';
import { Map, MapMarker } from 'react-kakao-maps-sdk';
import styled from 'styled-components';
import MyLocation from './MyLocationMarker';
import SearchIcon from '@/public/assets/icons/searchIcon.png';

const initialPosition = {
  lat: 33.5563,
  lng: 126.79581,
};

const SearchColleague = (props: MapModalProps) => {
  const { setCoordinate, coordinate } = props;

  const [map, setMap] = useState();
  const [inputRegion, setInputRegion] = useState('');
  const [region, setRegion] = useState('서울');

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
      }
    });
  }, [map, region]);

  //
  useEffect(() => {
    // useQuery로 리펙토링 하기
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
          style={{ width: '100%', height: '90vh', borderRadius: '2rem' }}
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
        <Map
          key={`map-${myPosition.center.lat}-${myPosition.center.lng}`}
          center={myPosition.center}
          style={{ width: '40vw', height: '85vh', borderRadius: '2rem' }}
          //@ts-ignore
          onCreate={setMap}
          // onTileLoaded={(map) =>
          //   setPosition({
          //     lat: map.getCenter().getLat(),
          //     lng: map.getCenter().getLng(),
          //   })
          // }
          level={8}
        >
          {/* 맵 중심 위치 표시 */}
          {/* <MapMarker position={position}>
            <div style={{ color: '#000' }}>중심 위치</div>
          </MapMarker> */}
          {recruitPosts.map((post) => {
            if (post.coordinate) {
              return (
                <MapMarker
                  key={`marker-${post.coordinate?.lat}-${post?.coordinate?.lng}-id-${post.id}`}
                  position={{
                    lat: post.coordinate?.lat,
                    lng: post?.coordinate?.lng,
                  }}
                >
                  <div>{post.title}</div>
                </MapMarker>
              );
            }
          })}
          {/* 나의 위치 표시 */}
          <MyLocation myPosition={myPosition} setMyPosition={setMyPosition} />
        </Map>
      </MapModalMain>
    </>
  );
};

export default SearchColleague;

// 게시글 작성에서 '운동 장소 등록'이 필요함
// '운동 장소 등록'을 누르면 map 모달을 띄우고 사용자가 거기서 좌표를 선택하게 한다.
// 좌표 데이터를 받아서 주소지(헬스장 이름)으로 변환

// firebase에서 좌표 정보를 불러온다.

const MapModalMain = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
`;

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50rem;
  background-color: white;
  border-radius: 24px;
  margin-bottom: 10px;
`;

const SerachImg = styled.img`
  width: 20px;
  margin-right: 20px;
  margin-left: 5px;
  cursor: pointer;
`;

const SerachInput = styled.input`
  width: 90%;
  height: 40px;
  margin-left: 2px;
  border: none;
  outline: none;
  background-color: #fff;
`;
