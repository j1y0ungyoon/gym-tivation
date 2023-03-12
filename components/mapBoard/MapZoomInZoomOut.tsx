import React from 'react';
import styled from 'styled-components';

const MapZoomInZoomOut = ({
  mapLevel,
  setMapLevel,
}: {
  mapLevel: number;
  setMapLevel: React.Dispatch<React.SetStateAction<number>>;
}) => {
  // map level 더하기
  const mapLevelPlus = () => {
    if (mapLevel === 11) return;
    setMapLevel(mapLevel + 1);
  };

  // map level 빼기
  const mapLevelMinus = () => {
    if (mapLevel === 0) return;
    setMapLevel(mapLevel - 1);
  };

  return (
    <>
      <PlustImage src="/assets/icons/mapBoard/+.svg" onClick={mapLevelMinus} />
      <Line />
      <MinusImage src="/assets/icons/mapBoard/-.svg" onClick={mapLevelPlus} />
    </>
  );
};

export default MapZoomInZoomOut;

const Line = styled.div`
  height: 0px;
  width: 28px;
  border: 1px solid gray;
`;

const PlustImage = styled.img`
  width: 18px;
  height: 18px;
  :hover {
    cursor: pointer;
    transform: scale(1.2);
  }
`;

const MinusImage = styled.img`
  width: 18px;
  height: 18px;
  :hover {
    cursor: pointer;
    transform: scale(1.2);
  }
`;
