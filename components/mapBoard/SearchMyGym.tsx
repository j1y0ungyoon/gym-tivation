import { SearchMyGymProps } from '@/type';
import React, { useState, useEffect, useRef } from 'react';
import { CustomOverlayMap, Map, MapMarker } from 'react-kakao-maps-sdk';
import styled from 'styled-components';
import MapZoomInZoomOut from './MapZoomInZoomOut';

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
  const [mapLevel, setMapLevel] = useState(8);

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
        setDetailAddress(result[0].address.address_name);
      }

      if (status === kakao.maps.services.Status.ZERO_RESULT) {
        console.log(result);
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
    if (event.currentTarget.value === '') return;
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
        <SearchHeadBox>
          <HeadText>운동 장소</HeadText>
          <SerachBar>
            <SerachImg
              src="/assets/icons/searchIcon.svg"
              onClick={onClickSetRegion}
            />
            <SerachInput
              onChange={onChangeInputRegion}
              onKeyPress={onPressSetRegion}
              value={inputRegion}
              placeholder="예시) 서울 종로구"
            />
          </SerachBar>
        </SearchHeadBox>
        <StyledMap // 로드뷰를 표시할 Container
          center={{
            lat: 37.566826,
            lng: 126.9786567,
          }}
          level={mapLevel}
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
                  <InfoBox onClick={onClickOkButton}>{marker.content}</InfoBox>
                </CustomOverlayMap>
              )}
            </MapMarker>
          ))}
        </StyledMap>
        <PlusMinusButtonBox>
          <MapZoomInZoomOut mapLevel={mapLevel} setMapLevel={setMapLevel} />
        </PlusMinusButtonBox>
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
  min-width: 150px;
  padding: 10px 20px;
  box-shadow: -1px 1px 0px 1px #000000;
  background-color: white;
  border: 1px solid black;
  border-radius: 8px;
  overflow: hidden; // 을 사용해 영역을 감출 것
  text-overflow: ellipsis; // 로 ... 을 만들기
  white-space: nowrap; // 아래줄로 내려가는 것을 막기위해
  word-break: break-all;
  font-size: ${({ theme }) => theme.font.font50};
  &:hover {
    background-color: ${({ theme }) => theme.color.brandColor100};
    color: white;
  }
`;

const PlusMinusButtonBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: absolute;
  left: 24px;
  bottom: 50px;
  width: 40px;
  height: 84px;
  z-index: 2;
  gap: 8px;
  background-color: white;
  border: 1px solid black;
  border-radius: ${({ theme }) => theme.borderRadius.radius10};
  box-shadow: -2px 2px 0px 1px #000000;
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
  border-radius: ${({ theme }) => theme.borderRadius.radius100};
  align-items: center;
  justify-content: center;
  padding-top: 40px;
  width: 40%;
  min-width: 500px;
  height: 85%;
  min-height: 600px;
  background-color: #fffcf3;
  z-index: 1000;
  box-shadow: -2px 2px 0px 1px #000000;
`;

const SearchHeadBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  gap: 20px;
  margin-bottom: 0.8rem;
`;

const HeadText = styled.span`
  font-size: ${({ theme }) => theme.font.font50};
  font-weight: bold;
`;

const SerachBar = styled.div`
  ${({ theme }) => theme.inputDiv}
  background-color: white;
  border: 1px solid black;
  width: 78%;
  box-shadow: -1px 1px 0px 1px #000000;
`;

const SerachImg = styled.img`
  width: 20px;
  margin-right: 10px;
  cursor: pointer;
`;

const SerachInput = styled.input`
  ${({ theme }) => theme.input}
  background-color: white;
`;

const ConfirmButton = styled.button`
  width: 100px;
  height: 40px;
  color: white;
  background-color: ${({ theme }) => theme.color.brandColor100};
  border-radius: ${({ theme }) => theme.borderRadius.radius50};
  font-weight: bold;
  box-shadow: -1px 1px 0px 1px #000000;

  &:hover {
    background-color: black;
    color: white;
  }
`;

const StyledMap = styled(Map)`
  width: 100%;
  height: 100%;
  border-top: 3px solid black;
  border-bottom: 1px solid black;
  margin-top: 20px;
  border-bottom-left-radius: ${({ theme }) => theme.borderRadius.radius100};
  border-bottom-right-radius: ${({ theme }) => theme.borderRadius.radius100};
`;
