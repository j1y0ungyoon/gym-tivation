import { authService, dbService } from '@/firebase';
import { addDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { useState } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { CoordinateType, WorkOutTimeType } from '../../type';
import SearchMyGym from '@/components/SearchMyGym';
import UseDropDown from '@/components/UseDropDown';
import SelectDay from '@/components/SelectDay';
import { useEffect } from 'react';
import { nanoid } from 'nanoid';
import { toast } from 'react-toastify';

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

  // 유저 레벨 저장
  const [userLvName, setUserLvName] = useState<string>('');
  const [userLv, setUserLv] = useState<number>();

  const router = useRouter();

  const onChangeRecruitTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRecruitTitle(event.currentTarget.value);
  };

  const onChangeRecruitContent = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setRecruitContent(event.currentTarget.value);
  };
  const profileData = async () => {
    if (!authService.currentUser) return;
    const q = query(
      collection(dbService, 'profile'),
      where('uid', '==', authService.currentUser?.uid),
    );
    const docsData = await getDocs(q);
    const getLvName = docsData.docs[0].data().lvName;
    const getLv = docsData.docs[0].data().lv;
    setUserLvName(getLvName);
    setUserLv(getLv);
  };

  const onSubmitRecruitPost = async () => {
    if (!recruitTitle) {
      toast.info('제목을 입력해 주세요!');
      return;
    }

    if (!recruitContent) {
      toast.info('내용을 입력해 주세요!');
      return;
    }

    if (!detailAddress) {
      toast.info('운동 장소를 입력해 주세요!');
      return;
    }

    if (start === '') {
      toast.info('운동 시간을 입력해 주세요!');
      return;
    }

    if (end === '') {
      toast.info('운동 시간을 입력해 주세요!');
      return;
    }

    if (selectedDays.length === 0) {
      toast.info('운동 요일을 입력해 주세요!');
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
      lv: userLv,
      lvName: userLvName,
      coordinate,
      startTime: start,
      endTime: end,
      selectedDays,
      participation: [],
      createdAt: Date.now(),
      comment: 0,
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

  useEffect(() => {
    if (!authService.currentUser) {
      toast.info('로그인을 먼저 해주세요!');
      router.push('/mapBoard');
    }
  }, []);

  // 현재 유저 프로필에서 LvName, Lv 가져오기
  useEffect(() => {
    profileData();
  }, []);

  if (!authService.currentUser) {
    return <div>로그인이 필요합니다.</div>;
  }

  return (
    <>
      <WritingFormWrapper>
        <WritingFormContainer>
          <WritingFormBox>
            <UpperBox>
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
                  <GymLocationBox>
                    원하는 헬스장을 검색해 주세요!
                  </GymLocationBox>
                )}
              </PlaceContainer>
              <DayAndTimeContainer>
                <StyledText>가능 시간 </StyledText>
                <AllDaysAndTimes>
                  <AllDaysBox>
                    <DayImage src="/assets/icons/mapBoard/Tear-off calendar.svg" />
                    <SmallText>요일</SmallText>
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
                  </AllDaysBox>

                  <AllTimesBox>
                    <ClockImage src="/assets/icons/mapBoard/One oclock.svg" />
                    <SmallText>시간</SmallText>
                    <UseDropDown
                      key={`start-${nanoid()}`}
                      setStart={setStart}
                      setEnd={setEnd}
                    >
                      시작 시간
                    </UseDropDown>
                    <Time>{start ? `${start}  ~` : '시작 시간  ~'}</Time>

                    <UseDropDown
                      key={`end-${nanoid()}`}
                      setStart={setStart}
                      setEnd={setEnd}
                    >
                      종료 시간
                    </UseDropDown>
                    <Time>{end ? end : '종료 시간'}</Time>
                  </AllTimesBox>
                </AllDaysAndTimes>
              </DayAndTimeContainer>
            </UpperBox>

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
          </WritingFormBox>
        </WritingFormContainer>
      </WritingFormWrapper>
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

export const WritingFormWrapper = styled.main`
  ${({ theme }) => theme.mainLayout.wrapper}
`;

const WritingFormContainer = styled.section`
  ${({ theme }) => theme.mainLayout.container}
  display: flex;
  align-items: center;
  justify-content: center;
`;

const WritingFormBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 90%;
  padding: 20px;
  border: 1px solid black;
  background-color: white;
  border-radius: ${({ theme }) => theme.borderRadius.radius100};
`;

export const UpperBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  height: 40%;
  width: 95%;
`;

export const TitleContainer = styled.section`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  height: 20%;
  width: 100%;
  margin-top: 16px;
`;

export const PlaceContainer = styled.section`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  height: 20%;
  width: 100%;
`;

const PlaceText = styled.span`
  font-size: ${({ theme }) => theme.font.font50};
  font-weight: bold;
`;

const DetailAddressText = styled.span`
  font-size: ${({ theme }) => theme.font.font50};
`;

const DayAndTimeContainer = styled.section`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 40%;
  width: 100%;
`;

const AllDaysAndTimes = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  width: 90%;
  height: 100%;
`;

export const AllDaysBox = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
`;

export const AllTimesBox = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
`;

export const SmallText = styled.span`
  font-size: ${({ theme }) => theme.font.font30};
  font-weight: bold;
  width: 5%;
  margin-left: 2px;
`;

export const Time = styled.span`
  font-size: ${({ theme }) => theme.font.font30};
  width: 10%;
  margin-right: 0.5rem;
`;

export const SearchLocationButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  width: 10%;
  height: 85%;
  border: 1px solid black;
  border-radius: ${({ theme }) => theme.borderRadius.radius50};
  background-color: white;
  &:hover {
    background-color: #ffcab5;
  }
`;

const SearchButtonText = styled.span`
  font-size: ${({ theme }) => theme.font.font30};
`;

const GymLocationBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: white;
  width: 72%;
  min-width: 60%;
  height: 85%;
  margin-left: 3%;
  padding: 1rem;
  border: 1px solid black;
  border-radius: ${({ theme }) => theme.borderRadius.radius50};
`;

const SelectedDayBox = styled.div`
  border: 1px solid black;
  cursor: pointer;
  padding: 5px;
  background-color: black;
  color: white;
`;

const TextAreaInput = styled.textarea`
  resize: none;
  width: 100%;
  height: 75%;
  padding: 1.5rem;
  border: 1px solid black;
  border-radius: ${({ theme }) => theme.borderRadius.radius100};
`;
const TextAreaContainer = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  margin-top: 2%;
  width: 95%;
  height: 80%;
`;

const UploadButtonBox = styled.button`
  width: 10rem;
  height: 3rem;
  font-size: ${({ theme }) => theme.font.font50};
  font-weight: bold;
  border-radius: ${({ theme }) => theme.borderRadius.radius50};
  background-color: ${({ theme }) => theme.color.brandColor100};
  color: white;
  border: 1px solid black;
`;

export const StyledText = styled.span`
  display: flex;
  align-items: center;
  font-size: ${({ theme }) => theme.font.font50};
  font-weight: bold;
  height: 100%;
  min-width: 10%;
`;

export const TitleInput = styled.input`
  width: 85%;
  height: 100%;
  min-width: 70%;
  padding: 1rem;
  border: 1px solid black;
  border-radius: ${({ theme }) => theme.borderRadius.radius50};
`;

export const ClockImage = styled.img`
  width: 20px;
  height: 20px;
`;

export const DayImage = styled.img`
  width: 20px;
  height: 20px;
`;
