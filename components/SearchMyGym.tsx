import { SearchMyGymProps } from '@/pages/type';
import React, { useState, useEffect } from 'react';
import { Map, MapMarker } from 'react-kakao-maps-sdk';
import styled from 'styled-components';

interface MarkersType {
  position: {
    lat: string;
    lng: string;
  };
  content: string;
}

const SearchMyGym = (props: SearchMyGymProps) => {
  const {
    coordinate,
    setCoordinate,
    setOpenMap,
    setGymName,
    setDetailAddress,
  } = props;

  const [info, setInfo] = useState<MarkersType>();
  const [markers, setMarkers] = useState<MarkersType[]>([]);
  const [map, setMap] = useState();
  const [inputRegion, setInputRegion] = useState('');
  const [region, setRegion] = useState('서울');

  // 상세 주소 얻기
  const getDetailAddress = () => {
    const geocoder = new kakao.maps.services.Geocoder();

    geocoder.coord2Address(coordinate.lng, coordinate.lat, (result, status) => {
      if (status === kakao.maps.services.Status.OK) {
        console.log('어디임? ', result[0].address.address_name);
        setDetailAddress(result[0].address.address_name);
      }

      if (status === kakao.maps.services.Status.ZERO_RESULT) {
        console.log(result);
        console.log('좌표', coordinate.lat, coordinate.lng);
        console.log('이상함');
      }
    });
  };

  const onChangeInputRegion = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      currentTarget: { value },
    } = event;
    setInputRegion(value);
  };

  // 지역 설정
  const onClickSetRegion = () => {
    setRegion(inputRegion);
  };

  // 확인 버튼
  const onClickOkButton = () => {
    if (info) {
      getDetailAddress();
      setGymName(info.content);
    }
    setOpenMap(false);
  };

  useEffect(() => {
    if (!map) return;
    const ps = new kakao.maps.services.Places();

    ps.keywordSearch(`${region} 헬스장`, (data, status, _pagination) => {
      if (status === kakao.maps.services.Status.OK) {
        // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
        // LatLngBounds 객체에 좌표를 추가합니다
        const bounds = new kakao.maps.LatLngBounds();
        let markers = [];

        for (var i = 0; i < data.length; i++) {
          //   @ts-ignore
          markers.push({
            position: {
              lat: data[i].y,
              lng: data[i].x,
            },
            content: data[i].place_name,
          });
          // @ts-ignore
          bounds.extend(new kakao.maps.LatLng(data[i].y, data[i].x));
        }
        setMarkers(markers);

        // 검색된 장소 위치를 기준으로 지도 범위를 재설정합니다
        //   @ts-ignore
        map.setBounds(bounds);
      }
    });
  }, [map, region]);

  return (
    <BackgroundContainer>
      <ModalContainer>
        <div style={{ height: '20%', width: '100%', backgroundColor: 'blue' }}>
          <input
            onChange={onChangeInputRegion}
            value={inputRegion}
            placeholder="예시) 서울 종로구"
          />
          <button onClick={onClickSetRegion}>위치 입력</button> <br />
          <p>
            {info
              ? `lat: ${info.position.lat}, lng: ${info.position.lng}`
              : '선택한 곳 없음'}
          </p>
        </div>
        <Map // 로드뷰를 표시할 Container
          center={{
            lat: 37.566826,
            lng: 126.9786567,
          }}
          style={{
            width: '100%',
            height: '70%',
          }}
          level={3}
          // @ts-ignore
          onCreate={setMap}
        >
          {markers.map((marker) => (
            <MapMarker
              key={`marker-${marker.content}-${marker.position.lat},${marker.position.lng}`}
              // @ts-ignore
              position={marker.position}
              onClick={() => {
                setInfo(marker);
                setCoordinate({
                  lat: Number(marker.position.lat),
                  lng: Number(marker.position.lng),
                });
              }}
            >
              {info && info.content === marker.content && (
                <div style={{ color: '#000' }}>{marker.content}</div>
              )}
            </MapMarker>
          ))}
        </Map>
        <button onClick={onClickOkButton}>선택 완료</button>
      </ModalContainer>
    </BackgroundContainer>
  );
};

export default SearchMyGym;

const BackgroundContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  z-index: 999;
  background-color: rgba(0, 0, 0, 0.7);
`;

const ModalContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  border: 1px black solid;
  align-items: center;
  justify-content: center;
  width: 1000px;
  height: 1000px;
  background-color: white;
  z-index: 1000;
`;
