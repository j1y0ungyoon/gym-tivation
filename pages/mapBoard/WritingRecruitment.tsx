import { authService, dbService } from '@/firebase';
import { addDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { useRef, useState } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { CoordinateType, DayType, WorkOutTimeType } from '../../type';
import SearchMyGym from '@/components/mapBoard/SearchMyGym';
import UseDropDown from '@/components/common/dropDown/UseDropDown';
import SelectDay from '@/components/mapBoard/SelectDay';
import { useEffect } from 'react';
import { nanoid } from 'nanoid';
import useModal from '@/hooks/useModal';
import { GLOBAL_MODAL_TYPES } from '@/recoil/modalState';

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

  // 정렬된 요일에 대한 state
  const [sortedDays, setSortedDays] = useState<string[]>([]);

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

  const { showModal } = useModal();

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
      showModal({
        modalType: GLOBAL_MODAL_TYPES.AlertModal,
        modalProps: { contentText: '제목을 입력해 주세요!' },
      });
      return;
    }

    if (!recruitContent) {
      showModal({
        modalType: GLOBAL_MODAL_TYPES.AlertModal,
        modalProps: { contentText: '내용을 입력해 주세요!' },
      });
      return;
    }

    if (!detailAddress) {
      showModal({
        modalType: GLOBAL_MODAL_TYPES.AlertModal,
        modalProps: { contentText: '운동 장소를 입력해 주세요!' },
      });
      return;
    }

    if (selectedDays.length === 0) {
      showModal({
        modalType: GLOBAL_MODAL_TYPES.AlertModal,
        modalProps: { contentText: '요일을 입력해 주세요!' },
      });
      return;
    }

    if (start === '') {
      showModal({
        modalType: GLOBAL_MODAL_TYPES.AlertModal,
        modalProps: { contentText: '시작 시간을 입력해 주세요!' },
      });
      return;
    }

    if (end === '') {
      showModal({
        modalType: GLOBAL_MODAL_TYPES.AlertModal,
        modalProps: { contentText: '종료 시간을 입력해 주세요!' },
      });
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
      selectedDays: sortedDays,
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
      showModal({
        modalType: GLOBAL_MODAL_TYPES.AlertModal,
        modalProps: { contentText: '로그인을 해주세요!' },
      });
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
                <RoundPushpinImg src="/assets/icons/mapBoard/Round pushpin.svg" />

                {gymName ? (
                  <GymLocationBox>
                    <PlaceText>{gymName}</PlaceText>
                    <DetailAddressText>({detailAddress})</DetailAddressText>
                    <CancelImage
                      src="/assets/icons/mapBoard/modal_cancel_x_button.svg"
                      onClick={() => {
                        setGymName('');
                        setDetailAddress('');
                      }}
                    />
                  </GymLocationBox>
                ) : (
                  <SearchLocationButton onClick={onClickOpenMap}>
                    <SearchButtonText>위치 찾기</SearchButtonText>
                  </SearchLocationButton>
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
                      setSortedDays={setSortedDays}
                    />
                  </AllDaysBox>

                  <AllTimesBox>
                    <ClockImage src="/assets/icons/mapBoard/One oclock.svg" />
                    <SmallText>시간</SmallText>
                    <DropDownButtonBox>
                      <UseDropDown
                        key={`start-${nanoid()}`}
                        setStart={setStart}
                        setEnd={setEnd}
                      >
                        시작 시간
                      </UseDropDown>
                      <Time>{start ? `${start}` : '00 : 00'}</Time>

                      <UseDropDown
                        key={`end-${nanoid()}`}
                        setStart={setStart}
                        setEnd={setEnd}
                      >
                        종료 시간
                      </UseDropDown>
                      <Time>{end ? end : '00 : 00'}</Time>
                    </DropDownButtonBox>
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
              <UploadButtonContainer>
                <UploadButtonBox onClick={onSubmitRecruitPost}>
                  작성 완료
                </UploadButtonBox>
              </UploadButtonContainer>
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
  height: calc(100% - 40px);
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
  height: 100%;
  /* padding: 20px; */
  border: 1px solid black;
  box-shadow: -2px 2px 0px 1px #000000;
  background-color: #fffcf3;
  border-radius: ${({ theme }) => theme.borderRadius.radius100};
`;

export const UpperBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  gap: 10px;
  padding: 40px;
  padding-left: 75px;
  padding-right: 75px;
  height: 35%;
  width: 100%;
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
  min-height: 60px;
  width: 100%;
`;

const PlaceText = styled.span`
  font-size: ${({ theme }) => theme.font.font50};
  font-weight: bold;
`;

const DetailAddressText = styled.span`
  font-size: ${({ theme }) => theme.font.font50};
`;

const CancelImage = styled.img`
  width: 20px;
  height: 20px;
  margin-left: 10px;
  cursor: pointer;
`;

const DayAndTimeContainer = styled.section`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 40%;
  width: 100%;
  margin-top: -4px;
`;

const AllDaysAndTimes = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 20px;
  width: 90%;
  height: 100%;
`;

export const AllDaysBox = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  min-width: 900px;
  width: 100%;
`;

export const AllTimesBox = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  min-width: 900px;
  width: 100%;
`;

export const DropDownButtonBox = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  min-width: 500px;
`;

export const SmallText = styled.span`
  font-size: ${({ theme }) => theme.font.font30};
  font-weight: bold;
  width: 5%;
  margin-left: 2px;
`;

export const Time = styled.span`
  font-size: ${({ theme }) => theme.font.font30};
  min-width: 70px;
  margin-right: 0.5rem;
`;

export const SearchLocationButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  width: 92px;
  height: 40px;
  margin-left: 6px;
  border: 1px solid black;
  box-shadow: -2px 2px 0px 1px #000000;
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
  max-width: 100%;
  height: 80%;
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
  width: calc(100% - 150px);
  height: 65%;
  padding: 1.5rem;
  margin-top: 40px;
  border: 1px solid black;
  box-shadow: -2px 2px 0px 1px #000000;

  border-radius: ${({ theme }) => theme.borderRadius.radius100};
`;

const UploadButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  width: calc(100% - 150px);
  margin-top: 45px;
`;

const TextAreaContainer = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  border-top: 3px solid black;
  margin-top: 2%;
  width: 100%;
  height: 80%;
  background-color: white;
  border-bottom-left-radius: ${({ theme }) => theme.borderRadius.radius100};
  border-bottom-right-radius: ${({ theme }) => theme.borderRadius.radius100};
`;

const UploadButtonBox = styled.button`
  width: 120px;
  height: 40px;
  font-size: ${({ theme }) => theme.font.font50};
  font-weight: bold;
  box-shadow: -2px 2px 0px 1px #000000;
  border-radius: ${({ theme }) => theme.borderRadius.radius50};
  background-color: ${({ theme }) => theme.color.brandColor100};
  color: white;
  border: 1px solid black;
  &:hover {
    background-color: black;
  }
`;

export const StyledText = styled.span`
  display: flex;
  align-items: center;
  font-size: ${({ theme }) => theme.font.font50};
  font-weight: bold;
  height: 100%;
  min-width: 10%;
`;

export const RoundPushpinImg = styled.img`
  width: 30px;
  height: 30px;
  margin-right: 8px;
`;

export const TitleInput = styled.input`
  width: 100%;
  height: 40px;
  padding: 1rem;
  border: 1px solid black;
  box-shadow: -2px 2px 0px 1px #000000;
  border-radius: ${({ theme }) => theme.borderRadius.radius50};
`;

export const ClockImage = styled.img`
  width: 30px;
  height: 30px;
  margin-right: 6px;
`;

export const DayImage = styled.img`
  width: 30px;
  height: 30px;
  margin-right: 6px;
`;
