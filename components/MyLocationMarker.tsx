import { MyLocationProps } from '@/type';
import React, { useState, useEffect } from 'react';
import { MapMarker } from 'react-kakao-maps-sdk';

const MyLocationMarker = (props: MyLocationProps) => {
  const { setMyPosition, myPosition } = props;

  useEffect(() => {
    if (navigator.geolocation) {
      // GeoLocation을 이용해서 접속 위치를 얻어옵니다
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setMyPosition((prev) => ({
            ...prev,
            center: {
              lat: position.coords.latitude, // 위도
              lng: position.coords.longitude, // 경도
            },
            isLoading: false,
          }));
        },
        (err) => {
          setMyPosition((prev) => ({
            ...prev,
            errMsg: err.message,
            isLoading: false,
          }));
        },
      );
    } else {
      // HTML5의 GeoLocation을 사용할 수 없을때 마커 표시 위치와 인포윈도우 내용을 설정합니다
      setMyPosition((prev) => ({
        ...prev,
        errMsg: 'geolocation을 사용할수 없어요..',
        isLoading: false,
      }));
    }
  }, []);

  return (
    <>
      {!myPosition.isLoading && (
        <MapMarker
          position={myPosition.center}
          image={{
            src: '/assets/icons/mapBoard/Vector.svg',
            size: { width: 50, height: 50 },
          }}
        >
          <div style={{ padding: '5px', color: '#000' }}>
            {myPosition.errMsg ? myPosition.errMsg : '내 위치'}
          </div>
        </MapMarker>
      )}
    </>
  );
};

export default MyLocationMarker;
