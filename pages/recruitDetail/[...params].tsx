import { useRouter } from 'next/router';
import { useState, useRef, useEffect } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  editRecruitPost,
  deleteRecruitPost,
  editUserParticipation,
} from '../api/api';
import {
  CoordinateType,
  EditRecruitPostParameterType,
  editUserParticipationParameterType,
  RecruitPostType,
  UserProfileType,
} from '../../type';
import {
  arrayUnion,
  collection,
  doc,
  onSnapshot,
  query,
  updateDoc,
} from 'firebase/firestore';
import { authService, dbService } from '@/firebase';
import styled from 'styled-components';
import UseDropDown from '@/components/UseDropDown';
import SearchMyGym from '@/components/SearchMyGym';
import CommentList from '@/components/CommentList';
import SelectDay from '@/components/SelectDay';
import { nanoid } from 'nanoid';

const initialCoordinate: CoordinateType = {
  // 사용자가 처음 등록한 위도, 경도로 바꿔주자
  lat: 33.5563,
  lng: 126.79581,
};

const RecruitDetail = ({ params }: any) => {
  const router = useRouter();
  const [id] = params;
  // 요일 배열
  const days = ['월', '화', '수', '목', '금', '토', '일', '매일'];
  // 위도, 경도 담아주기 (좌표 -> coordinate)
  const [coordinate, setCoordinate] =
    useState<CoordinateType>(initialCoordinate);
  // 운동 장소 선택 시, 좌표에 대응하는 헬스장 이름
  const [gymName, setGymName] = useState('');
  // 헬스장의 상세 주소
  const [detailAddress, setDetailAddress] = useState('');

  // 초기값이 제대로 된 녀석이 있으면 옵셔널 처리 안해줘도 됨.
  const [refetchedPost, setRefetchedPost] = useState<RecruitPostType>();

  const editTitleRef = useRef<HTMLInputElement>(null);
  const editContentRef = useRef<HTMLTextAreaElement>(null);

  const [changeForm, setChangeForm] = useState(false);
  const [editTitle, setEditTitle] = useState(refetchedPost?.content);
  const [editContent, setEditContent] = useState(refetchedPost?.title);

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

  // 맵 모달창 오픈
  const [openMap, setOpenMap] = useState(false);

  // 유저 profile들을 담기 위한 배열 state
  const [userProfiles, setUserProfiles] = useState<UserProfileType[]>([]);

  // 현재 접속중인 유저 profile을 담기 위한 state
  const [currentUserProfile, setCurrentUserProfile] =
    useState<UserProfileType>();

  // 유저 프로필 수정 useMutation (운동 참여 버튼 클릭 시 필요)
  const { mutate: reviseUserProfile } = useMutation(
    ['editUserProfile', currentUserProfile?.uid],
    (body: editUserParticipationParameterType) => editUserParticipation(body),
    {
      onSuccess: () => {
        console.log('프로필 수정 성공');
      },
      onError: (error) => {
        console.log(error);
      },
    },
  );

  // 게시글 수정 useMutation
  const { isLoading: isEditting, mutate: reviseRecruitPost } = useMutation(
    ['editRecruitPost', id],
    (body: EditRecruitPostParameterType) => editRecruitPost(body),
    {
      onSuccess: () => {
        console.log('수정 성공');
      },
      onError: (err) => {
        console.log('수정 실패:', err);
      },
    },
  );

  // 게시글 삭제 useMutation
  const { isLoading: isDeleting, mutate: removeRecruitPost } = useMutation(
    ['deleteRecruitPost', id],
    (body: string) => deleteRecruitPost(body),
    {
      onSuccess: () => {
        console.log('삭제성공');
      },
      onError: (err) => {
        console.log('삭제 실패:', err);
      },
    },
  );

  // 게시글 삭제 클릭 이벤트
  const onClickDeletePost = async () => {
    const answer = confirm('정말 삭제하시겠습니까?');

    if (answer) {
      try {
        await removeRecruitPost(id);
        router.push('/mapBoard');
      } catch (error) {
        console.log('에러입니다', error);
      }
    } else {
      return;
    }
  };

  // 게시글 수정을 위한 input open
  const onClickChangeForm = () => {
    setChangeForm(!changeForm);
    setEditContent(refetchedPost?.content);
    setEditTitle(refetchedPost?.title);
  };

  const onChangeEditTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      currentTarget: { value },
    } = event;

    setEditTitle(value);
  };

  const onChangeEditContent = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    const {
      currentTarget: { value },
    } = event;

    setEditContent(value);
  };

  // 게시글 수정
  const onSubmitEdittedPost = async () => {
    if (!editTitle) {
      alert('제목을 작성해주세요!');
      editTitleRef.current?.focus();
      return;
    }

    if (!editContent) {
      alert('내용을 작성해주세요!');
      editContentRef.current?.focus();
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

    let edittedRecruitPost = {};

    Object.assign(edittedRecruitPost, {
      title: editTitle,
      content: editContent,
      region: `${detailAddress.split(' ')[0]} ${detailAddress.split(' ')[1]}`,
      gymName,
      coordinate,
      startTime: start,
      endTime: end,
      selectedDays,
    });

    try {
      await reviseRecruitPost({ recruitPostId: id, edittedRecruitPost });
      setEditTitle('');
      setEditContent('');
      setChangeForm(false);
    } catch (error) {
      console.log('에러입니다', error);
    }
  };

  // map modal 열기
  const onClickOpenMap = () => {
    setOpenMap(!openMap);
  };

  // 운동에 참여하기 클릭 이벤트
  const onClcikParticipate = async () => {
    // 비로그인 사용자가 참여 버튼을 눌렀을 때
    if (!authService.currentUser) {
      alert('로그인 후 이용해주세요!');
      return;
    }
    console.log('sdf', refetchedPost?.participation);
    // 로그인 사용자가 참여 버튼을 눌렀을 때
    if (authService.currentUser) {
      // 유저가 이미 운동 참여를 눌렀는지 아닌지 확인하기 위함
      const exist = refetchedPost?.participation?.findIndex(
        (item) => item.userId === authService.currentUser?.uid,
      );

      // exist가 -1이면 운동 참여 버튼을 누르지 않았다는 뜻
      if (exist === -1) {
        // participation이 undefined일 가능성이 있다고 type에러가 났기 때문에 아래와 같이 if문 활용
        if (refetchedPost?.participation) {
          // useMutation을 사용할 때, 아래와 같이 객체를 만들어서 reviseRecruitPost의 파라미터로 주어야 한다.
          // 그렇지 않으면 이미 reviseRecruitPost의 파라미터 타입을 준 것이 있기 때문에 그것의 영향으로 타입 에러가 발생한다.
          let edittedRecruitPost = {};

          Object.assign(edittedRecruitPost, {
            participation: [
              ...refetchedPost.participation,
              {
                userId: authService.currentUser.uid,
                userPhoto: authService.currentUser.photoURL,
              },
            ],
          });

          // 참여 버튼 누른 user id를 해당 게시물의 필드에 넣어주기
          await reviseRecruitPost({ recruitPostId: id, edittedRecruitPost });

          if (currentUserProfile?.userParticipation) {
            // 참여 버튼 누른 post를 해당 유저 프로필에 필드에 넣어주기
            let edittedProfile = {};

            Object.assign(edittedProfile, {
              userParticipation: arrayUnion({
                title: refetchedPost.title,
                content: refetchedPost.content,
                id: refetchedPost.id,
                userId: refetchedPost.userId,
                nickName: refetchedPost.nickName,
                userPhoto: refetchedPost.userPhoto,
                region: refetchedPost.region,
                gymName: refetchedPost.gymName,
                startTime: refetchedPost.startTime,
                endTime: refetchedPost.endTime,

                selectedDays: refetchedPost.selectedDays,
                participation: refetchedPost.participation,
                createdAt: refetchedPost.createdAt,
              }),
            });

            await reviseUserProfile({
              userId: authService.currentUser.uid,
              edittedProfile,
            });
            alert('참여가 완료 되었습니다!');
            return;
          }
        }
      }

      // exist가 -1이 아니면 운동 참여 버튼을 눌렀다는 뜻
      if (exist !== -1) {
        if (refetchedPost?.participation) {
          // 게시물 participation에서 해당 유저 삭제해주기
          const edittedRecruitPostsArr = refetchedPost?.participation?.filter(
            (item) => item.userId !== authService.currentUser?.uid,
          );

          await updateDoc(doc(dbService, 'recruitments', id), {
            participation: [...edittedRecruitPostsArr],
          });
        }

        if (currentUserProfile?.userParticipation) {
          // 유저 프로필 userParticipation에서 해당 게시물 삭제하기
          const edittedProfilesArr =
            currentUserProfile?.userParticipation.filter(
              (item) => item.id !== id,
            );

          await updateDoc(
            doc(dbService, 'profile', authService.currentUser.uid),
            { userParticipation: [...edittedProfilesArr] },
          );
        }
        alert('참여를 취소했습니다!');
        return;
      }
    }
  };

  useEffect(() => {
    // 수정한 게시글을 실시간 감지해서 화면에 반영하기 위함.
    const unsubscribe = onSnapshot(
      doc(dbService, 'recruitments', id),
      (doc) => {
        const data = doc.data();

        const newObj: RecruitPostType = {
          id: doc.id,
          title: data?.title,
          content: data?.content,
          userId: data?.userId,
          nickName: data?.nickName,
          userPhoto: data?.userPhoto,
          gymName: data?.gymName,
          region: data?.region,
          startTime: data?.startTime,
          endTime: data?.endTime,
          selectedDays: data?.selectedDays,
          participation: data?.participation,
          createdAt: data?.createdAt,
        };

        setRefetchedPost(newObj);
      },
    );

    // 언마운트 시 구독 끊기
    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    // 모든 유저 프로필 정보 불러오기
    const profileRef = collection(dbService, 'profile');
    const q = query(profileRef);
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedProfiles = snapshot.docs.map((doc) => ({
        ...doc.data(),
      }));
      setUserProfiles(fetchedProfiles);
    });

    // 현재 유저의 프로필만 담아주기
    const getCurrentUserProfile = () => {
      userProfiles
        ?.filter((profile) => profile.uid === authService.currentUser?.uid)
        .forEach((profile) => setCurrentUserProfile(profile));
    };

    getCurrentUserProfile();

    // 언마운트 시 구독 끊기
    return () => {
      unsubscribe();
    };
  }, [refetchedPost]);

  if (!refetchedPost) {
    return <div>데이터를 불러오고 있습니다.</div>;
  }

  return (
    <>
      {isEditting ? (
        <div>게시물을 수정중입니다</div>
      ) : isDeleting ? (
        <div>게시물을 삭제중입니다</div>
      ) : (
        <>
          {changeForm ? (
            // 수정 모드 form
            <WritingFormMain>
              <EditTitleContainer>
                <StyledText>제목 </StyledText>
                <TitleInput
                  defaultValue={refetchedPost?.title}
                  onChange={onChangeEditTitle}
                  ref={editTitleRef}
                />
              </EditTitleContainer>

              <PlaceContainer>
                <StyledText>운동 장소</StyledText>
                <SearchLocationButton onClick={onClickOpenMap}>
                  <SearchButtonText>위치 찾기</SearchButtonText>
                </SearchLocationButton>
                {refetchedPost.gymName ? (
                  <GymLocationBox>
                    <PlaceText>{refetchedPost.gymName}</PlaceText>
                    <DetailAddressText>
                      ({refetchedPost.region})
                    </DetailAddressText>
                  </GymLocationBox>
                ) : (
                  <DetailAddressText>
                    원하는 헬스장을 검색해 주세요!
                  </DetailAddressText>
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
                  defaultValue={refetchedPost?.content}
                  onChange={onChangeEditContent}
                  ref={editContentRef}
                />
                <ButtonContainer>
                  <SubmitAndCancelButton onClick={onSubmitEdittedPost}>
                    수정 완료
                  </SubmitAndCancelButton>
                  <SubmitAndCancelButton onClick={onClickChangeForm}>
                    취소
                  </SubmitAndCancelButton>
                </ButtonContainer>
              </TextAreaContainer>
            </WritingFormMain>
          ) : (
            // 수정 전 모드 form
            <DetailPostFormMain>
              <TitleContainer>
                <TitleText>{refetchedPost?.title}</TitleText>
                {authService.currentUser?.uid === refetchedPost.userId ? (
                  <ButtonBox>
                    <StyledButton onClick={onClickChangeForm}>
                      수정
                    </StyledButton>
                    <StyledButton onClick={onClickDeletePost}>
                      삭제
                    </StyledButton>
                  </ButtonBox>
                ) : (
                  <ButtonBox>
                    <StyledButton onClick={onClcikParticipate}>
                      참여하기
                    </StyledButton>
                  </ButtonBox>
                )}
              </TitleContainer>
              <InfoContainer>
                <PostInfoContainer>
                  <span>참가자</span>
                  {refetchedPost.participation
                    ? refetchedPost.participation.map((item) => {
                        return (
                          <ProfileImage
                            key={`image-${item.userId}`}
                            src={item.userPhoto}
                          />
                        );
                      })
                    : null}
                  <RecruitInfoTextBox>
                    {refetchedPost.region}
                  </RecruitInfoTextBox>
                  <RecruitInfoTextBox>
                    {refetchedPost.gymName}
                  </RecruitInfoTextBox>

                  <RecruitInfoTextBox>
                    {refetchedPost?.selectedDays?.map((day) => {
                      return <span key={`day-${nanoid()}`}>{day}</span>;
                    })}
                  </RecruitInfoTextBox>
                  <RecruitInfoTextBox>
                    {`${refetchedPost?.startTime} ~ ${refetchedPost?.endTime}`}
                  </RecruitInfoTextBox>
                </PostInfoContainer>
                <UserInfoContainer>
                  <ProfileImage src={refetchedPost.userPhoto} />
                  <span>{refetchedPost.nickName}</span>
                </UserInfoContainer>
              </InfoContainer>
              <ContentBox>
                <h4>{refetchedPost?.content}</h4>
              </ContentBox>
              <div>
                <CommentList id={id} category="동료 모집" />
              </div>
            </DetailPostFormMain>
          )}
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
      )}
    </>
  );
};

// 정말 좋은 녀석...
export function getServerSideProps({ params: { params } }: any) {
  return {
    props: {
      params,
    },
  };
}

export default RecruitDetail;

const DetailPostFormMain = styled.main`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #d9d9d9;
  height: 100vh;
  width: 100%;
  padding: 1rem;
  gap: 1rem;
`;

const PostInfoContainer = styled.section`
  display: flex;
  flex-direction: row;
  gap: 0.8rem;
`;

const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  width: 60rem;
  height: 13rem;
  gap: 1.7rem;
`;

const RecruitInfoTextBox = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 2.2rem;
  background-color: white;
  border-radius: 0.6rem;
  gap: 0.6rem;
  padding: 6px;
`;

const ProfileImage = styled.img`
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  margin-left: 1rem;
  margin-right: 0.6rem;
`;

const ButtonBox = styled.div`
  display: flex;
  flex-direction: row;
  gap: 0.6rem;
`;

const StyledButton = styled.button`
  height: 2rem;
  width: 4rem;
  border-radius: 0.6rem;
`;

const UserInfoContainer = styled.section`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const TitleContainer = styled.section`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 60rem;
  padding: 1rem;
  border-bottom: 1px solid black;
`;

const EditTitleContainer = styled.section`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const TitleText = styled.span`
  font-size: 2rem;
`;

const ContentBox = styled.div`
  width: 60rem;
  height: 25rem;
  padding: 2rem;
  border-radius: 2rem;
  background-color: white;
`;

export const DayAndTimeContainer = styled.section`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

export const DetailAddressText = styled.span`
  font-size: large;
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

export const StyledText = styled.span`
  font-size: x-large;
  font-weight: bold;
`;

export const TextAreaContainer = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 60%;
`;

export const TitleInput = styled.input`
  width: 62rem;
  height: 3rem;
  padding: 1rem;
  border: none;
  border-radius: 2rem;
  margin-left: 3rem;
`;

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

export const SearchButtonText = styled.span`
  font-size: large;
  font-weight: bold;
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

export const TextAreaInput = styled.textarea`
  resize: none;
  width: 70rem;
  height: 40rem;
  padding: 1.5rem;
  border: none;
  border-radius: 2rem;
`;

const SubmitAndCancelButton = styled.button`
  margin-top: 2rem;
  width: 10rem;
  height: 3rem;
  font-size: large;
  font-weight: bold;
  border-radius: 1rem;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 30rem;
  justify-content: center;
  align-items: center;
  gap: 3rem;
`;
