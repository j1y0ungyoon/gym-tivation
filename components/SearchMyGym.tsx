import { SearchMyGymProps } from '@/type';
import React, { useState, useEffect, useRef } from 'react';
import { CustomOverlayMap, Map, MapMarker } from 'react-kakao-maps-sdk';
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

  // Info window 열고 닫기
  const [openInfo, setOpenInfo] = useState(false);

  // 모달 창 닫기 currentTarget 저장용
  const modalRef = useRef<HTMLDivElement>(null);

  // 모달 창 닫기
  const closeMap = (event: React.MouseEvent<HTMLDivElement>) => {
    if (modalRef.current === event.target) {
      setOpenMap(false);
    }
  };

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
    setInputRegion('');
  };

  // 엔터 후 지역 설정
  const onPressSetRegion = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      onClickSetRegion();
    }
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

        for (let i = 0; i < data.length; i++) {
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
    <BackgroundContainer onClick={closeMap} ref={modalRef}>
      <ModalContainer>
        <SerachBar>
          <SerachInput
            onChange={onChangeInputRegion}
            onKeyPress={onPressSetRegion}
            value={inputRegion}
            placeholder="예시) 서울 종로구"
          />
          <SerachImg
            src="/assets/icons/searchIcon.png"
            onClick={onClickSetRegion}
          />
        </SerachBar>
        <Map // 로드뷰를 표시할 Container
          center={{
            lat: 37.566826,
            lng: 126.9786567,
          }}
          style={{
            width: '100%',
            height: '80%',
          }}
          level={2}
          // @ts-ignore
          onCreate={setMap}
        >
          {markers.map((marker) => (
            <MapMarker
              key={`marker-${marker.content}-${marker.position.lat},${marker.position.lng}`}
              // @ts-ignore
              position={marker.position}
              infoWindowOptions={{ zIndex: -100 }}
              image={{
                src: '/assets/icons/mapBoard/mappin_hand_icon.svg',
                size: { width: 50, height: 53 },
              }}
              onClick={() => {
                setInfo(marker);
                setCoordinate({
                  lat: Number(marker.position.lat),
                  lng: Number(marker.position.lng),
                });
              }}
            >
              {info && info.content === marker.content && (
                <CustomOverlayMap
                  position={{
                    lat: Number(marker.position?.lat),
                    lng: Number(marker.position?.lng),
                  }}
                  xAnchor={0.5}
                  yAnchor={2.5}
                >
                  <InfoBox>{marker.content}</InfoBox>
                </CustomOverlayMap>
              )}
            </MapMarker>
          ))}
        </Map>
        <ConfirmButton onClick={onClickOkButton}>선택 완료</ConfirmButton>
      </ModalContainer>
    </BackgroundContainer>
  );
};

export default SearchMyGym;

const InfoBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 40px;
  width: 250px;
  padding: 10px;
  background-color: white;
  border: 2px solid black;
  border-radius: 8px;
  overflow: hidden; // 을 사용해 영역을 감출 것
  text-overflow: ellipsis; // 로 ... 을 만들기
  white-space: nowrap; // 아래줄로 내려가는 것을 막기위해
  word-break: break-all;
  font-size: ${({ theme }) => theme.font.font50};
`;

const BackgroundContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-width: 75%;
  height: 100%;
  min-height: 75%;
  z-index: 999;
  background-color: rgba(0, 0, 0, 0.7);
`;

const ModalContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  border-radius: 2rem;
  align-items: center;
  justify-content: center;
  width: 40%;
  min-width: 30%;
  height: 85%;
  min-height: 75%;
  background-color: white;
  z-index: 1000;
`;

const SerachBar = styled.div`
  ${({ theme }) => theme.inputDiv}
  background-color: white;
  border: 2px solid black;
  width: 85%;
  margin-bottom: 0.7rem;
`;

const SerachImg = styled.img`
  width: 20px;
  margin-left: 10px;
  cursor: pointer;
`;

const SerachInput = styled.input`
  ${({ theme }) => theme.input}
  background-color: white;
`;

const ConfirmButton = styled.button`
  width: 6rem;
  height: 3rem;
  background-color: #d9d9d9;
  border-radius: 1rem;
  font-weight: bold;
  margin-top: 2rem;
  &:hover {
    background-color: black;
    color: white;
  }
`;
