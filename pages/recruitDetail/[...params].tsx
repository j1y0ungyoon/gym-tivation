import { useRouter } from 'next/router';
import { useState, useRef, useEffect } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { editRecruitPost, deleteRecruitPost } from '../api/api';
import {
  CoordinateType,
  EditRecruitPostParameterType,
  RecruitPostType,
} from '../type';
import { doc, onSnapshot } from 'firebase/firestore';
import { dbService } from '@/firebase';
import styled from 'styled-components';
import {
  DayAndTimeContainer,
  DayBox,
  DetailAddressText,
  PlaceContainer,
  PlaceText,
  StyledText,
  TextAreaContainer,
  TitleInput,
} from '../mapBoard/WritingRecruitment';
import UseDropDown from '@/components/UseDropDown';
import SearchMyGym from '@/components/SearchMyGym';

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
  // 맵 모달창 오픈
  const [openMap, setOpenMap] = useState(false);

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
  const onSubmitEdittedPost = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

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

    let edittedRecruitPost = {};

    Object.assign(edittedRecruitPost, {
      title: editTitle,
      content: editContent,
    });

    try {
      await reviseRecruitPost({ recruitPostId: id, edittedRecruitPost });
      setEditTitle('');
      setEditContent('');
      setChangeForm(false);

      // detail에서 변경된 정보를 바로 불러오지 못하기 때문에 mapBoard로 경로 이동 시켜줘야 함.
      // useQuery를 이용하면 경로 이동을 안해도 될 것이므로 사용자가 수정하자마자 수정 내용을 바로 확인할 수 있게 가능할 것 같음.
      // 하지만 통신 비용이 더 들 수 있다.
      // router.push('/mapBoard');
    } catch (error) {
      console.log('에러입니다', error);
    }
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

  // map modal 열기
  const onClickOpenMap = () => {
    setOpenMap(!openMap);
  };

  useEffect(() => {
    // 수정한 게시글을 실시간 감지해서 화면에 반영하기 위함.
    const unsubscribe = onSnapshot(
      doc(dbService, 'recruitments', id),
      (doc) => {
        const data = doc.data();

        const newObj: RecruitPostType = {
          id: data?.id,
          title: data?.title,
          content: data?.content,
          gymName: data?.gymName,
          region: data?.region,
          startTime: data?.startTime,
          endTime: data?.endTime,
          selectedDays: data?.selectedDays,
          createdAt: data?.createdAt,
        };

        setRefetchedPost(newObj);
      },
    );

    return () => {
      unsubscribe();
    };
  }, []);

  if (!refetchedPost) {
    return <div>데이터를 불러오고 있습니다.</div>;
  }

  // if (isLoading) {
  //   return <div>로딩중입니다....</div>;
  // }

  return (
    <>
      {isEditting ? (
        <div>게시물을 수정중입니다</div>
      ) : isDeleting ? (
        <div>게시물을 삭제중입니다</div>
      ) : (
        <>
          {changeForm ? (
            <DetailPostFormMain>
              <form onSubmit={onSubmitEdittedPost}>
                <TitleInput
                  defaultValue={refetchedPost?.title}
                  onChange={onChangeEditTitle}
                  ref={editTitleRef}
                />
                <br />
                <PlaceContainer>
                  <StyledText>운동 장소</StyledText>
                  {refetchedPost.gymName ? (
                    <div>
                      <PlaceText>{refetchedPost.gymName}</PlaceText>
                      <DetailAddressText>
                        ({refetchedPost.region})
                      </DetailAddressText>
                    </div>
                  ) : (
                    <DetailAddressText>
                      원하는 헬스장을 검색해 주세요!
                    </DetailAddressText>
                  )}
                  <button onClick={onClickOpenMap}>운동 장소 선택 </button>{' '}
                  <br />
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
                  <textarea
                    defaultValue={refetchedPost?.content}
                    onChange={onChangeEditContent}
                    ref={editContentRef}
                  />
                </TextAreaContainer>
                <br />
                <span>{refetchedPost?.createdAt}</span> <br />
                <button>수정 완료</button>
              </form>
              <button onClick={onClickChangeForm}>취소</button>
            </DetailPostFormMain>
          ) : (
            <DetailPostFormMain>
              <h3>{refetchedPost?.title}</h3>
              <PostInfoContainer>
                <PostInfoTextBox>{refetchedPost.region}</PostInfoTextBox>
                <PostInfoTextBox>{refetchedPost.gymName}</PostInfoTextBox>
                <PostInfoTextBox>
                  {refetchedPost?.selectedDays?.map((day) => {
                    return <span>{day}</span>;
                  })}
                </PostInfoTextBox>
                <PostInfoTextBox>
                  {`${refetchedPost?.startTime} ~ ${refetchedPost?.endTime}`}
                </PostInfoTextBox>
              </PostInfoContainer>
              <h4>{refetchedPost?.content}</h4>
              <span>{refetchedPost?.createdAt}</span> <br />
              <div>
                <button onClick={onClickChangeForm}>수정</button>
                <button onClick={onClickDeletePost}>삭제</button>
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
  background-color: #d9d9d9;
  height: 100vh;
  padding: 1rem;
  gap: 2rem;
`;

const PostInfoContainer = styled.section`
  display: flex;
  flex-direction: row;
  gap: 0.8rem;
`;

const PostInfoTextBox = styled.div`
  display: flex;
  flex-direction: row;
  background-color: white;
  border-radius: 0.6rem;
  gap: 0.6rem;
  padding: 6px;
`;
