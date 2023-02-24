import { authService, dbService } from '@/firebase';
import { addDoc, collection } from 'firebase/firestore';
import { useState } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { CoordinateType, WorkOutTimeType } from '../../type';
import SearchMyGym from '@/components/SearchMyGym';
import UseDropDown from '@/components/UseDropDown';
import SelectDay from '@/components/SelectDay';

const initialCoordinate: CoordinateType = {
  // 사용자가 처음 등록한 위도, 경도로 바꿔주자
  lat: 33.5563,
  lng: 126.79581,
};

// 운동 시간 초깃값
const initialWorkOutTime: WorkOutTimeType = {
  start: '01시',
  end: '01시',
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
  // 운동 시간 선택을 위한 state
  const [workOutTime, setWorkOutTime] =
    useState<WorkOutTimeType>(initialWorkOutTime);
  // 시작 시간, 종료 시간을 위한 state
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');

  // 선택한 요일에 대한 state
  const [selectedDays, setSelectedDays] = useState<string[]>([]);

  // 버튼 박스 클릭 시 색상 변경을 위한 state 나중에 수정 필요
  const [mon, setMon] = useState(false);
  const [tus, setTus] = useState(false);
  const [wed, setWed] = useState(false);
  const [thurs, setThurs] = useState(false);
  const [fri, setFri] = useState(false);
  const [sat, setSat] = useState(false);
  const [sun, setSun] = useState(false);
  const [every, setEvery] = useState(false);

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

    if (!detailAddress) {
      alert('운동 장소를 입력해 주세요!');
      return;
    }

    if (start === '') {
      alert('운동 시간을 입력해 주세요!');
      return;
    }

    if (end === '') {
      alert('운동 시간을 입력해 주세요!');
      return;
    }

    if (selectedDays.length === 0) {
      alert('운동 요일을 입력해 주세요!');
      return;
    }

    const newRecruitPost = {
      title: recruitTitle,
      content: recruitContent,
      userId: authService.currentUser?.uid,
      nickName: authService.currentUser?.displayName,
      userPhoto: authService.currentUser?.photoURL,
      region: `${detailAddress.split(' ')[0]} ${detailAddress.split(' ')[1]}`,
      gymName,
      coordinate,
      startTime: start,
      endTime: end,
      selectedDays,
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
        </TitleContainer>

        <PlaceContainer>
          <StyledText>운동 장소</StyledText>
          <SearchLocationButton onClick={onClickOpenMap}>
            <SearchButtonText>위치 찾기</SearchButtonText>
          </SearchLocationButton>
          {gymName ? (
            <GymLocationBox>
              <PlaceText>{gymName}</PlaceText>
              <DetailAddressText>({detailAddress})</DetailAddressText>
            </GymLocationBox>
          ) : (
            <GymLocationBox>원하는 헬스장을 검색해 주세요!</GymLocationBox>
          )}
        </PlaceContainer>
        <DayAndTimeContainer>
          <StyledText>가능 요일 </StyledText>

          <SelectDay
            mon={mon}
            tus={tus}
            wed={wed}
            thurs={thurs}
            fri={fri}
            sat={sat}
            sun={sun}
            every={every}
            setMon={setMon}
            setTus={setTus}
            setWed={setWed}
            setThurs={setThurs}
            setFri={setFri}
            setSat={setSat}
            setSun={setSun}
            setEvery={setEvery}
            selectedDays={selectedDays}
            setSelectedDays={setSelectedDays}
          />

          <StyledText>가능 시간</StyledText>
          <UseDropDown setStart={setStart} setEnd={setEnd}>
            시작 시간
          </UseDropDown>
          {start ? start : '00시 00분'}
          <span> ~ </span>
          <UseDropDown setStart={setStart} setEnd={setEnd}>
            종료 시간
          </UseDropDown>
          {end ? end : '00시 00분'}
        </DayAndTimeContainer>

        <TextAreaContainer>
          <TextAreaInput
            onChange={onChangeRecruitContent}
            value={recruitContent}
            placeholder="문구 입력.."
          />
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

export const WritingFormMain = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #d9d9d9;
  width: 100%;
  height: 100vh;
  padding: 1rem;
  gap: 2rem;
`;

export const TitleContainer = styled.section`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

export const PlaceContainer = styled.section`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
`;

export const PlaceText = styled.span`
  font-size: larger;
  font-weight: bold;
`;

export const DetailAddressText = styled.span`
  font-size: large;
`;

export const DayAndTimeContainer = styled.section`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

export const DayText = styled.span`
  font-weight: bold;
  font-size: large;
`;

export const DayBox = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 3rem;
  height: 2.5rem;
  border: none;
  border-radius: 1rem;
  cursor: pointer;
  padding: 5px;
  background-color: white;
`;

export const SearchLocationButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  width: 7rem;
  height: 2.5rem;
  border: 1px solid black;
  border-radius: 1rem;
  background-color: white;
`;

export const SearchButtonText = styled.span`
  font-size: large;
  font-weight: bold;
`;

export const GymLocationBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: white;
  border-radius: 2rem;
  width: 54rem;
  height: 3rem;
  padding: 1rem;
`;

const SelectedDayBox = styled.div`
  border: 1px solid black;
  cursor: pointer;
  padding: 5px;
  background-color: black;
  color: white;
`;

export const TextAreaInput = styled.textarea`
  resize: none;
  width: 70rem;
  height: 40rem;
  padding: 1.5rem;
  border: none;
  border-radius: 2rem;
`;

export const TextAreaContainer = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 60%;
`;

export const UploadButtonBox = styled.button`
  margin-top: 2rem;
  width: 10rem;
  height: 3rem;
  font-size: large;
  font-weight: bold;
  border-radius: 1rem;
`;

export const StyledText = styled.span`
  font-size: x-large;
  font-weight: bold;
`;

export const TitleInput = styled.input`
  width: 62rem;
  height: 3rem;
  padding: 1rem;
  border: none;
  border-radius: 2rem;
  margin-left: 3rem;
`;
