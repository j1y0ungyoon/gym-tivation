import { MapModalProps } from '@/pages/type';
import React, { useRef } from 'react';
import { Map, MapMarker } from 'react-kakao-maps-sdk';

const MapModal = (props: MapModalProps) => {
  const { setCoordinate, coordinate } = props;
  const mapRef = useRef();

  if (!coordinate) {
    <div>좌표 없음</div>;
  }

  return (
    <>
      <Map
        center={{ lat: coordinate.lat, lng: coordinate.lng }}
        style={{ width: '100%', height: '100vh', borderRadius: '2rem' }}
      >
        <MapMarker position={{ lat: 33.55635, lng: 126.795841 }}>
          <div style={{ color: '#000' }}>Hello World!</div>
        </MapMarker>
      </Map>
    </>
  );
};

export default MapModal;

// 게시글 작성에서 '운동 장소 등록'이 필요함
// '운동 장소 등록'을 누르면 map 모달을 띄우고 사용자가 거기서 좌표를 선택하게 한다.
// 좌표 데이터를 받아서 주소지(헬스장 이름)으로 변환
