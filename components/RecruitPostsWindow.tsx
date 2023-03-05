import { CoordinateType, RecruitPostType } from '@/type';
import React, { useEffect } from 'react';
import styled from 'styled-components';

interface RecruitPostsWindowPropsType {
  post: RecruitPostType;
  recruitPosts: RecruitPostType[];
  setMarkerCoordi: React.Dispatch<
    React.SetStateAction<CoordinateType | undefined>
  >;
}

const RecruitPostsWindow = (props: RecruitPostsWindowPropsType) => {
  const { recruitPosts, post, setMarkerCoordi } = props;

  const filteredPosts = recruitPosts.filter(
    (item) =>
      item.coordinate?.lat === post.coordinate?.lat &&
      item.coordinate?.lng === post.coordinate?.lng,
  );

  // 마커의 좌표 가져오기
  const getCoordinate = () => {
    setMarkerCoordi({
      lat: Number(filteredPosts[0].coordinate?.lat),
      lng: Number(filteredPosts[0].coordinate?.lng),
    });
  };

  return (
    <>
      <InfoBox onClick={getCoordinate}>
        <ParticipationImage src="/assets/icons/mapBoard/like_icon_inactive.svg" />
        <ParticipationNumText>{`${filteredPosts.length}개의 모집글이 있습니다!`}</ParticipationNumText>
      </InfoBox>
    </>
  );
};

export default RecruitPostsWindow;

const InfoBox = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 30px;
  width: 210px;
  background-color: white;
  border: 1px solid black;
  border-radius: 8px;
`;

// 지도 화면에서 info window가 벗어나면 사라져버림.. 어떡해야함?
const ActiveInfoBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  height: 216px;
  width: 200px;

  background-color: white;
  border: 2px solid black;
  border-radius: 20px;
  &:after {
    border-top: 20px solid white;
    border-left: 15px solid transparent;
    border-right: 15px solid transparent;
    border-bottom: 0px solid transparent;

    content: '';
    position: relative;
    top: 32px;
    left: 16px;
  }
`;

const SliderBox = styled.div`
  width: 500px;
  margin: auto;
  height: 500px;
  overflow: hidden; // 선을 넘어간 이미지들은 숨겨줍니다.
`;

const ProfileImage = styled.img`
  width: 3rem;
  height: 3rem;
  border: 1px solid black;
  border-radius: 50%;
`;

const InfoTitleTextBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 184px;
  height: 40px;
  padding: 12px;
  /* background-color: bisque; */
`;

const InfoTitleText = styled.span`
  /* font-weight: bold; */
  font-size: 16px;
  overflow: hidden; // 을 사용해 영역을 감출 것
  text-overflow: ellipsis; // 로 ... 을 만들기
  white-space: nowrap; // 아래줄로 내려가는 것을 막기위해
  word-break: break-all;
  width: 184;
`;

const ImageTextBox = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  width: 11rem;
  /* background-color: black; */
`;

const ParticipationImage = styled.img`
  width: 20px;
  height: 20px;
`;

const ParticipationNumText = styled.span`
  font-size: 14px;
`;
