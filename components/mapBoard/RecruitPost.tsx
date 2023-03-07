import { CoordinateType, RecruitPostType } from '@/type';
import { useRouter } from 'next/router';
import styled from 'styled-components';

interface RecruitPostPropsType {
  post: RecruitPostType;
}

const RecruitPost = (props: RecruitPostPropsType) => {
  const { post } = props;
  const router = useRouter();

  // Detail 페이지로 이동
  const GoToRecruitDetail = (post: RecruitPostType) => {
    router.push({
      pathname: `/recruitDetail/${post.id}`,
    });
  };

  return (
    <>
      <RecruitPostBox key={post.id} onClick={() => GoToRecruitDetail(post)}>
        <UserInfoBox>
          <ProfileImage src={post.userPhoto} />
        </UserInfoBox>
        <RecruitPostInfoBox>
          <TitleText>{post.title}</TitleText>
          <DayTimeInfoBox>
            <DayTextBox>
              <DayImage src="/assets/icons/mapBoard/Tear-off calendar.svg" />
              <DayText>{post.selectedDays}</DayText>
            </DayTextBox>
            <TimeTextBox>
              <ClockImage src="/assets/icons/mapBoard/One oclock.svg" />
              <TimeText>{`${post.startTime} ~ ${post.endTime}`}</TimeText>
            </TimeTextBox>
            <ParticipationImage src="/assets/icons/mapBoard/like_icon_inactive.svg" />
            <ParticipationText>{`현재 ${post.participation?.length}명이 참여중입니다`}</ParticipationText>
          </DayTimeInfoBox>
        </RecruitPostInfoBox>
      </RecruitPostBox>
    </>
  );
};

export default RecruitPost;

const RecruitPostBox = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: start;
  align-items: center;
  gap: 0.8rem;
  width: 100%;
  height: 12%;
  border: 1px solid black;
  border-radius: ${({ theme }) => theme.borderRadius.radius50};
  margin-bottom: 8px;
  padding: 1rem;
  background-color: white;

  cursor: pointer;
  &:hover {
    background-color: #ffcab5;
  }
`;

const TitleText = styled.span`
  font-size: ${({ theme }) => theme.font.font30};
  font-weight: bold;
  width: 95%;
  overflow: hidden; // 을 사용해 영역을 감출 것
  text-overflow: ellipsis; // 로 ... 을 만들기
  white-space: nowrap; // 아래줄로 내려가는 것을 막기위해
  word-break: break-all;
`;

const ProfileImage = styled.img`
  /* width: 3rem;
  height: 3rem;
  border-radius: 50%;
  margin-left: 1rem;
  margin-right: 0.6rem; */
  ${({ theme }) => theme.profileDiv}
`;

const UserInfoBox = styled.div`
  display: flex;
  flex-direction: column;
`;

const RecruitPostInfoBox = styled.div`
  display: flex;
  flex-direction: column;
  width: 90%;
`;

const DayTimeInfoBox = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 0.2rem;
`;

const ClockImage = styled.img`
  width: 16px;
  height: 16px;
  margin-right: 8px;
`;

const DayImage = styled.img`
  width: 16px;
  height: 16px;
  margin-right: 8px;
`;

const ParticipationImage = styled.img`
  width: 16px;
  height: 16px;
  margin-right: 8px;
`;

const DayTextBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 12%;
  max-width: 42%;
  margin-right: 1rem;
  border: 1px solid black;
  border-radius: ${({ theme }) => theme.borderRadius.radius10};
  padding: 0.4rem;
  background-color: #ffff;
`;
const TimeTextBox = styled.div`
  display: flex;
  align-items: center;
  min-width: 30%;
  margin-right: 1rem;
  border: 1px solid black;
  border-radius: ${({ theme }) => theme.borderRadius.radius10};
  padding: 0.4rem;
  background-color: #ffff;
`;

const ParticipationBox = styled.div`
  display: flex;
  align-items: center;
  min-width: 30%;
  margin-right: 1rem;
  padding: 0.4rem;
  background-color: #ffff;
`;

const DayText = styled.span`
  /* ${({ theme }) => theme.font.font10} */
  font-size: 12px;
  width: 90%;
  overflow: hidden; // 을 사용해 영역을 감출 것
  text-overflow: ellipsis; // 로 ... 을 만들기
  white-space: nowrap; // 아래줄로 내려가는 것을 막기위해
  word-break: break-all;
`;

const TimeText = styled.span`
  /* ${({ theme }) => theme.font.font10} */
  font-size: 12px;
`;

const ParticipationText = styled.span`
  font-size: ${({ theme }) => theme.font.font10};
`;
