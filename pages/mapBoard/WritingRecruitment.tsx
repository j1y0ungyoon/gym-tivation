import { dbService } from '@/firebase';
import { addDoc, collection } from 'firebase/firestore';
import { useState } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { CoordinateType, WorkOutTimeType } from '../type';
import SearchMyGym from '@/components/SearchMyGym';
import UseDropDown from '@/components/UseDropDown';

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
  // 클릭한 요일을 표시하는 state
  const [isClicked, setIsClicked] = useState(false);
  // 선택한 요일에 대한 state
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  // 요일 배열
  const days = ['월', '화', '수', '목', '금', '토', '일', '매일'];

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
      // userId : string,
      // nickName : string,
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

  // 요일 선택하기
  const onClickSelectDay = (event: React.MouseEvent<HTMLButtonElement>) => {
    const {
      currentTarget: { value }, // 무슨 요일인지 꺼냈음
    } = event;

    // 선택한 요일이 기존 배열에 포함되어 있으면 아래와 같이 동작
    if (selectedDays.includes(value)) {
      const newArr = selectedDays.filter((day) => day !== value);
      setSelectedDays([...newArr]);
      return;
    }

    // 선택한 요일이 기존 배열이 포함되어 있지 않으면 아래와 같이 동작
    if (!selectedDays.includes(value)) {
      setSelectedDays((prev) => [...prev, value]);
      return;
    }
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
          {days.map((day) => {
            return (
              <>
                <DayBox value={day} onClick={onClickSelectDay}>
                  {day}
                </DayBox>
              </>
            );
          })}
          <StyledText>가능 시간</StyledText>
          <UseDropDown setStart={setStart} setEnd={setEnd}>
            시작 시간
          </UseDropDown>
          {start ? start : ''}
          <span> ~ </span>
          <UseDropDown setStart={setStart} setEnd={setEnd}>
            종료 시간
          </UseDropDown>
          {end ? end : ''}
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

export const TitleContainer = styled.section`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

export const PlaceContainer = styled.section`
  display: flex;
  align-items: center;
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

export const DayBox = styled.button`
  border: 1px solid black;
  cursor: pointer;
  padding: 5px;
  &:focus {
    background-color: black;
    color: white;
  }
`;

const SelectedDayBox = styled.div`
  border: 1px solid black;
  cursor: pointer;
  padding: 5px;
  background-color: black;
  color: white;
`;

export const TextAreaContainer = styled.section`
  display: flex;
  flex-direction: column;
  background-color: green;
  width: 60%;
`;

export const UploadButtonBox = styled.button`
  width: 10rem;
`;

export const StyledText = styled.span`
  font-size: x-large;
  font-weight: bold;
`;

export const TitleInput = styled.input`
  width: 25rem;
  height: 1rem;
  padding: 10px;
  border: none;
  border-radius: 0.5rem;
`;
