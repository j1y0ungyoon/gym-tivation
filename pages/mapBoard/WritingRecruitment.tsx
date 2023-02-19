import { dbService } from '@/firebase';
import { addDoc, collection } from 'firebase/firestore';
import { useState } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { CoordinateType } from '../type';
import SearchMyGym from '@/components/SearchMyGym';
import UseDropDown from '@/components/UseDropDown';

const initialCoordinate: CoordinateType = {
  // 사용자가 처음 등록한 위도, 경도로 바꿔주자
  lat: 33.5563,
  lng: 126.79581,
};

const WritingRecruitment = () => {
  const [recruitTitle, setRecruitTitle] = useState('');
  const [recruitContent, setRecruitContent] = useState('');
  // 맵 모달창 오픈
  const [openMap, setOpenMap] = useState(false);
  // 위도, 경도 담아주기 (좌표 -> coordinate)
  const [coordinate, setCoordinate] =
    useState<CoordinateType>(initialCoordinate);
  // 운동 장소 선택 시, 좌표에 대응하는 헬스장 이름
  const [gymName, setGymName] = useState('');
  // 헬스장의 상세 주소
  const [detailAddress, setDetailAddress] = useState('');
  // 요일 배열
  const dyas = [
    '월요일',
    '화요일',
    '수요일',
    '목요일',
    '금요일',
    '토요일',
    '일요일',
  ];

  const router = useRouter();

  const onChangeRecruitTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRecruitTitle(event.currentTarget.value);
  };

  const onChangeRecruitContent = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setRecruitContent(event.currentTarget.value);
  };

  const onSubmitRecruitPost = async () => {
    if (!recruitTitle) {
      alert('제목을 입력해 주세요!');
      return;
    }

    if (!recruitContent) {
      alert('내용을 입력해 주세요!');
      return;
    }

    const newRecruitPost = {
      title: recruitTitle,
      content: recruitContent,
      // userId : string,
      // nickName : string,
      // category: string,
      // date: string,
      createdAt: Date.now(),
    };

    await addDoc(collection(dbService, 'recruitments'), newRecruitPost)
      .then(() => console.log('데이터 전송 성공'))
      .catch((error) => console.log('에러 발생', error));

    setRecruitTitle('');
    setRecruitContent('');

    router.push('/mapBoard');
  };

  // map modal 열기
  const onClickOpenMap = () => {
    setOpenMap(!openMap);
  };

  return (
    <>
      <WritingFormMain>
        <TitleContainer>
          <StyledText>제목 </StyledText>
          <TitleInput
            onChange={onChangeRecruitTitle}
            value={recruitTitle}
            placeholder={'제목을 작성하세요'}
          />
          <br />
        </TitleContainer>
        <PlaceContainer>
          <StyledText>운동 장소</StyledText>
          {gymName ? (
            <div>
              <PlaceText>{gymName}</PlaceText>
              <DetailAddressText>({detailAddress})</DetailAddressText>
            </div>
          ) : (
            <DetailAddressText>
              원하는 헬스장을 검색해 주세요!
            </DetailAddressText>
          )}
          <button onClick={onClickOpenMap}>운동 장소 선택 </button> <br />
        </PlaceContainer>
        <DayAndTimeContainer>
          <StyledText>가능 요일 </StyledText>
          {dyas.map((day) => {
            return (
              <DayBox>
                <span>{day}</span>
              </DayBox>
            );
          })}
          <StyledText>가능 시간</StyledText>
          <UseDropDown>시작 시간</UseDropDown>
          <span> ~ </span>
          <UseDropDown>종료 시간</UseDropDown>
        </DayAndTimeContainer>

        <TextAreaContainer>
          <textarea onChange={onChangeRecruitContent} value={recruitContent} />{' '}
          <UploadButtonBox onClick={onSubmitRecruitPost}>
            작성 완료
          </UploadButtonBox>
        </TextAreaContainer>
      </WritingFormMain>
      {openMap ? (
        <SearchMyGym
          coordinate={coordinate}
          setCoordinate={setCoordinate}
          setOpenMap={setOpenMap}
          setGymName={setGymName}
          setDetailAddress={setDetailAddress}
        />
      ) : null}
    </>
  );
};

export default WritingRecruitment;

const WritingFormMain = styled.main`
  display: flex;
  flex-direction: column;
  background-color: #d9d9d9;
  height: 100vh;
  padding: 1rem;
  gap: 2rem;
`;

const TitleContainer = styled.section`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const PlaceContainer = styled.section`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const PlaceText = styled.span`
  font-size: larger;
  font-weight: bold;
`;

const DetailAddressText = styled.span`
  font-size: large;
`;

const DayAndTimeContainer = styled.section`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const DayBox = styled.div`
  border: 1px;
`;

const TextAreaContainer = styled.section`
  display: flex;
  flex-direction: column;
  background-color: green;
  width: 60%;
`;

const UploadButtonBox = styled.button`
  width: 10rem;
`;

const StyledText = styled.span`
  font-size: x-large;
  font-weight: bold;
`;

const TitleInput = styled.input`
  width: 25rem;
  height: 1rem;
  padding: 10px;
  border: none;
  border-radius: 0.5rem;
`;
