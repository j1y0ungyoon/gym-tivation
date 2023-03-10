import { useRouter } from 'next/router';
import { useState, useRef, useEffect } from 'react';
import { useMutation, useQuery } from 'react-query';
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
import UseDropDown from '@/components/common/dropDown/UseDropDown';
import SearchMyGym from '@/components/mapBoard/SearchMyGym';
import CommentList from '@/components/comment/CommentList';
import SelectDay from '@/components/mapBoard/SelectDay';
import { nanoid } from 'nanoid';
import {
  AllDaysBox,
  AllTimesBox,
  ClockImage,
  DayImage,
  DropDownButtonBox,
  SmallText,
  Time,
  UpperBox,
} from '../mapBoard/WritingRecruitment';
import useModal from '@/hooks/useModal';
import { GLOBAL_MODAL_TYPES } from '@/recoil/modalState';
import Loading from '@/components/common/globalModal/Loading';
import FollowButton from '@/components/FollowButton';
import DmButton from '@/components/DmButton';

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

  const { showModal } = useModal();

  const { data, isLoading: gettingYourProfile } = useQuery('profile');

  const yourProfile = data as ProfileItem[];

  // 유저가 운동 참여 버튼을 클릭했는지 판별하기 위함
  const isClickedParticipationButton = refetchedPost?.participation?.filter(
    (item) => item.userId === authService.currentUser?.uid,
  );

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
    try {
      await removeRecruitPost(id);
      router.push('/mapBoard');
      ``;
    } catch (error) {
      console.log('에러입니다', error);
    }
  };

  // confrim 모달로 게시글 삭제하기
  const openConfirmModal = () => {
    showModal({
      modalType: GLOBAL_MODAL_TYPES.ConfirmModal,
      modalProps: {
        contentText: '정말 삭제하시겠습니까?',
        handleConfirm: onClickDeletePost,
      },
    });
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
      showModal({
        modalType: GLOBAL_MODAL_TYPES.AlertModal,
        modalProps: { contentText: '제목을 작성해 주세요!' },
      });
      editTitleRef.current?.focus();
      return;
    }

    if (!editContent) {
      showModal({
        modalType: GLOBAL_MODAL_TYPES.AlertModal,
        modalProps: { contentText: '내용을 작성해 주세요!' },
      });
      editContentRef.current?.focus();
      return;
    }

    if (!detailAddress) {
      showModal({
        modalType: GLOBAL_MODAL_TYPES.AlertModal,
        modalProps: { contentText: '운동 장소를 입력해 주세요!' },
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

    if (selectedDays.length === 0) {
      showModal({
        modalType: GLOBAL_MODAL_TYPES.AlertModal,
        modalProps: { contentText: '요일을 입력해 주세요!' },
      });
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
      showModal({
        modalType: GLOBAL_MODAL_TYPES.AlertModal,
        modalProps: { contentText: '로그인 후 이용해 주세요!' },
      });
      return;
    }
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
            // toast.success('참여가 완료 되었습니다!');
            showModal({
              modalType: GLOBAL_MODAL_TYPES.LoginRequiredModal,
              modalProps: { contentText: '참여가 완료 되었습니다!' },
            });
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
        // toast.info('참여를 취소했습니다!');
        showModal({
          modalType: GLOBAL_MODAL_TYPES.LoginRequiredModal,
          modalProps: { contentText: '참여를 취소했습니다!' },
        });
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
          lv: data?.lv,
          lvName: data?.lvName,
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
    return <Loading />;
  }

  return (
    <>
      {isEditting ? (
        <Loading />
      ) : isDeleting ? (
        <Loading />
      ) : (
        <>
          {changeForm ? (
            // 수정 모드 form
            <WritingFormWrapper>
              <WritingFormContainer>
                <WritingFormBox>
                  <UpperBox>
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
                      <RoundPushpinImg src="/assets/icons/mapBoard/Round pushpin.svg" />

                      {gymName ? (
                        <GymLocationBox>
                          <PlaceText>{gymName}</PlaceText>
                          <DetailAddressText>
                            ({detailAddress})
                          </DetailAddressText>
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
                          />
                        </AllDaysBox>

                        <AllTimesBox>
                          <ClockImage src="/assets/icons/mapBoard/One oclock.svg" />
                          <SmallText>시간</SmallText>
                          <DropDownButtonBox>
                            <UseDropDown
                              key={`start2-${nanoid()}`}
                              setStart={setStart}
                              setEnd={setEnd}
                            >
                              시작 시간
                            </UseDropDown>
                            <Time>{start ? `${start}` : null}</Time>

                            <UseDropDown
                              key={`end2-${nanoid()}`}
                              setStart={setStart}
                              setEnd={setEnd}
                            >
                              종료 시간
                            </UseDropDown>
                            <Time>{end ? end : null}</Time>
                          </DropDownButtonBox>
                        </AllTimesBox>
                      </AllDaysAndTimes>
                    </DayAndTimeContainer>
                  </UpperBox>

                  <TextAreaContainer>
                    <TextAreaInput
                      defaultValue={refetchedPost?.content}
                      onChange={onChangeEditContent}
                      ref={editContentRef}
                    />
                    <ButtonContainer>
                      <SubmitAndCancelButtonBox>
                        <SubmitAndCancelButton onClick={onSubmitEdittedPost}>
                          수정 완료
                        </SubmitAndCancelButton>
                        <SubmitAndCancelButton onClick={onClickChangeForm}>
                          취소
                        </SubmitAndCancelButton>
                      </SubmitAndCancelButtonBox>
                    </ButtonContainer>
                  </TextAreaContainer>
                </WritingFormBox>
              </WritingFormContainer>
            </WritingFormWrapper>
          ) : (
            // 수정 전 모드 form
            <DetailPostFormWrapper>
              <DetailPostFormContainer>
                <DetailPostHeadContainer>
                  <TitleContainer>
                    <TitleText>{refetchedPost?.title}</TitleText>
                    {authService.currentUser?.uid === refetchedPost.userId ? (
                      <EditAndDeleteButtonBox>
                        <StyledButton onClick={onClickChangeForm}>
                          수정
                        </StyledButton>
                        <StyledButton onClick={openConfirmModal}>
                          삭제
                        </StyledButton>
                      </EditAndDeleteButtonBox>
                    ) : null}
                  </TitleContainer>
                  <InfoContainer>
                    <PostInfoContainer>
                      {/* 참가자 가져오기 */}
                      <RecruitInfoTextBox>
                        {refetchedPost.region}
                      </RecruitInfoTextBox>
                      <RecruitInfoTextBox>
                        {refetchedPost.gymName}
                      </RecruitInfoTextBox>

                      <RecruitInfoTextBox>
                        {refetchedPost?.selectedDays?.map((day) => {
                          return (
                            <span key={`day-${nanoid()}-${day}`}>{day}</span>
                          );
                        })}
                      </RecruitInfoTextBox>
                      <RecruitInfoTextBox>
                        {`${refetchedPost?.startTime} ~ ${refetchedPost?.endTime}`}
                      </RecruitInfoTextBox>
                    </PostInfoContainer>
                    <UserInfoContainer>
                      <UserImageAndNameBox>
                        <ProfileImage
                          src={refetchedPost.userPhoto}
                          onClick={() =>
                            router.push(`/myPage/${refetchedPost.userId}`)
                          }
                        />
                        <UserNameBox>
                          <NickNameText>{refetchedPost.nickName}</NickNameText>
                          <span>{`${refetchedPost.lvName} Lv${refetchedPost.lv}`}</span>
                        </UserNameBox>

                        <FollowButton
                          Id={refetchedPost.userId}
                          item={
                            yourProfile.filter(
                              (item) => item.id === refetchedPost.userId,
                            )[0]
                          }
                        />

                        <DmButton id={refetchedPost.userId} />
                      </UserImageAndNameBox>
                      {authService.currentUser?.uid ===
                      refetchedPost.userId ? null : (
                        <ParticipationImgAndBtnBox>
                          <ParticipationImgBox>
                            {refetchedPost.participation
                              ? refetchedPost.participation.map((item, i) => {
                                  if (!refetchedPost.participation?.length)
                                    return;
                                  if (
                                    refetchedPost?.participation?.length > 3
                                  ) {
                                    if (i >= 1) return;
                                    return (
                                      <>
                                        <ParticipationImage
                                          key={`image-${refetchedPost.participation[0].userId}`}
                                          src={
                                            refetchedPost.participation[0]
                                              .userPhoto
                                          }
                                        />
                                        <ParticipationImage
                                          key={`image-${refetchedPost.participation[1].userId}`}
                                          src={
                                            refetchedPost.participation[1]
                                              .userPhoto
                                          }
                                        />
                                        <ParticipationImage
                                          key={`image-${refetchedPost.participation[2].userId}`}
                                          src={
                                            refetchedPost.participation[2]
                                              .userPhoto
                                          }
                                        />
                                        <SmallText>
                                          +
                                          {refetchedPost.participation.length -
                                            3}
                                        </SmallText>
                                      </>
                                    );
                                  } else {
                                    return (
                                      <ParticipationImage
                                        key={`image-${item.userId}`}
                                        src={item.userPhoto}
                                      />
                                    );
                                  }
                                })
                              : null}
                          </ParticipationImgBox>
                          {isClickedParticipationButton?.length !== 0 ? (
                            <ButtonBox>
                              <ClickedParticipationBtn
                                onClick={onClcikParticipate}
                              >
                                <ParticipationImg src="/assets/icons/mapBoard/like_icon_inactive.svg" />
                                참여중!
                              </ClickedParticipationBtn>
                            </ButtonBox>
                          ) : (
                            <ButtonBox>
                              <ParticipationBtn onClick={onClcikParticipate}>
                                <ParticipationImg src="/assets/icons/mapBoard/like_icon_inactive.svg" />
                                참여할래요!
                              </ParticipationBtn>
                            </ButtonBox>
                          )}
                        </ParticipationImgAndBtnBox>
                      )}
                    </UserInfoContainer>
                  </InfoContainer>
                </DetailPostHeadContainer>
                <ContentBox>
                  <ContentText>{refetchedPost?.content}</ContentText>
                </ContentBox>
                <CommentListBox>
                  <CommentList id={id} category="동료 모집" />
                </CommentListBox>
              </DetailPostFormContainer>
            </DetailPostFormWrapper>
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

const DetailPostFormWrapper = styled.main`
  ${({ theme }) => theme.mainLayout.wrapper}
`;

const DetailPostFormContainer = styled.section`
  ${({ theme }) => theme.mainLayout.container}
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: white;
  border: 1px solid black;
  box-shadow: -2px 2px 0px 1px #000000;
  border-radius: ${({ theme }) => theme.borderRadius.radius100};
  height: calc(100% - 40px);
`;

const DetailPostHeadContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  background-color: #fffcf3;
  width: 100%;
  height: 30%;
  padding: 40px;
  padding-left: 75px;
  padding-right: 75px;
  border-bottom: 3px solid black;
  border-top-left-radius: ${({ theme }) => theme.borderRadius.radius100};
  border-top-right-radius: ${({ theme }) => theme.borderRadius.radius100};
`;

const PostInfoContainer = styled.section`
  display: flex;
  align-items: center;
  width: 100%;
  min-height: 50%;

  gap: 0.8rem;
`;

const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: flex-start;
  width: 100%;
  min-height: 70%;
`;

const RecruitInfoTextBox = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 2.6rem;
  background-color: white;
  font-size: ${({ theme }) => theme.font.font30};
  font-weight: bold;
  border: 1px solid black;
  box-shadow: -2px 2px 0px 1px #000000;
  border-radius: ${({ theme }) => theme.borderRadius.radius50};
  padding: 16px;
  gap: 8px;
`;

const ProfileImage = styled.img`
  ${({ theme }) => theme.profileDiv}
  border: 1px solid white;
  margin-right: 8px;
  cursor: pointer;
`;

const ParticipationImage = styled.img`
  ${({ theme }) => theme.profileDiv}
  margin-left: -16px;
  border: 1px solid white;
`;

const EditAndDeleteButtonBox = styled.div`
  display: flex;
  flex-direction: row;
  gap: 0.6rem;
`;

const ButtonBox = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 4px;
`;

const StyledButton = styled.button`
  height: 2.6rem;
  width: 4rem;
  border: 1px solid black;
  box-shadow: -2px 2px 0px 1px #000000;

  font-size: ${({ theme }) => theme.font.font30};
  font-weight: bold;
  border-radius: ${({ theme }) => theme.borderRadius.radius50};
  background-color: white;
`;

const ParticipationBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  font-weight: bold;
  padding: 10px;
  border-radius: ${({ theme }) => theme.borderRadius.radius50};
  box-shadow: -2px 2px 0px 1px #000000;
  background-color: white;
  &:hover {
    background-color: black;
    color: white;
  }
`;

const ClickedParticipationBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  font-weight: bold;
  padding: 10px;
  border-radius: ${({ theme }) => theme.borderRadius.radius50};
  background-color: black;
  color: white;
  &:hover {
    background-color: white;
    color: black;
  }
`;

const ParticipationImg = styled.img`
  width: 20px;
  height: 20px;
  margin-right: 8px;
`;

const UserInfoContainer = styled.section`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  position: relative;
  width: 100%;
  height: 70%;
`;

const UserImageAndNameBox = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  width: 60%;
`;

const ParticipationImgAndBtnBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-end;
  position: absolute;
  right: 0px;
  bottom: 8px;
  width: 40%;
  gap: 4px;
`;

const ParticipationImgBox = styled.div``;

const UserNameBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-width: 8%;
  margin-right: 12px;
`;

const NickNameText = styled.span`
  font-size: ${({ theme }) => theme.font.font30};
  font-weight: bold;
`;

const FollowAndMessageBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: white;
  min-width: 16%;
  height: 2.6rem;
  margin-right: 0.5rem;
  font-size: ${({ theme }) => theme.font.font30};
  font-weight: bold;
  border: 1px solid black;
  border-radius: ${({ theme }) => theme.borderRadius.radius50};
  padding: 16px;
`;

const FollowAndMessageImg = styled.img`
  width: 20px;
  height: 20px;
  margin-right: 0.5rem;
`;

const TitleContainer = styled.section`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 30%;
`;

const EditTitleContainer = styled.section`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  height: 20%;
  width: 100%;
  margin-top: 16px;
`;

const TitleText = styled.span`
  font-size: ${({ theme }) => theme.font.font70};
  width: 80%;
`;

const ContentBox = styled.div`
  width: calc(100% - 150px);
  height: 40%;
  padding: 20px;
  margin: 30px 0;
  border: 1px solid black;
  box-shadow: -2px 2px 0px 1px #000000;
  border-radius: ${({ theme }) => theme.borderRadius.radius50};
  background-color: white;
`;

const ContentText = styled.span`
  font-size: ${({ theme }) => theme.font.font30};
`;

const CommentListBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: calc(100% - 60px);
  height: calc(30% - 60px);
  padding-bottom: 30px;
`;

const DayAndTimeContainer = styled.section`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 40%;
  width: 100%;
  margin-top: -4px;
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

const PlaceContainer = styled.section`
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

const StyledText = styled.span`
  display: flex;
  align-items: center;
  font-size: ${({ theme }) => theme.font.font50};
  font-weight: bold;
  height: 100%;
  min-width: 10%;
`;

const RoundPushpinImg = styled.img`
  width: 30px;
  height: 30px;
  margin-right: 8px;
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

const TitleInput = styled.input`
  width: 100%;
  height: 40px;
  padding: 1rem;
  border: 1px solid black;
  border-radius: ${({ theme }) => theme.borderRadius.radius50};
  box-shadow: -2px 2px 0px 1px #000000;
`;

const WritingFormWrapper = styled.main`
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
  background-color: #fffcf3;
  box-shadow: -2px 2px 0px 1px #000000;
  border-radius: ${({ theme }) => theme.borderRadius.radius100};
`;

const SearchButtonText = styled.span`
  font-size: ${({ theme }) => theme.font.font30};
`;

const SearchLocationButton = styled.div`
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

const GymLocationBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: 100%;
  height: 80%;
`;

const AllDaysAndTimes = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 20px;
  width: 90%;
  height: 100%;
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

const SubmitAndCancelButton = styled.button`
  width: 120px;
  height: 40px;
  font-size: ${({ theme }) => theme.font.font50};
  font-weight: bold;
  box-shadow: -2px 2px 0px 1px #000000;
  border: 1px solid black;
  background-color: white;
  border-radius: ${({ theme }) => theme.borderRadius.radius50};
  &:hover {
    background-color: #ffcab5;
  }
`;

const ButtonContainer = styled.div`
  width: calc(100% - 60px);
`;

const SubmitAndCancelButtonBox = styled.div`
  display: flex;
  flex-direction: row;
  min-width: 300px;
  margin-top: 50px;
  margin-right: 50px;
  justify-content: flex-end;
  align-items: center;
  gap: 20px;
`;
