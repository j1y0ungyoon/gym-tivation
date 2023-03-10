import { RecruitPostType } from '@/type';
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
            <ParticipationImage src="/assets/icons/mapBoard/FistImage2.svg" />
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
  box-shadow: -2px 2px 0px 1px #000000;

  cursor: pointer;
  &:hover {
    background-color: #ffcab5;
  }
  :hover {
    cursor: pointer;
    transform: scale(1.02, 1.02); /* 가로2배 새로 1.2배 로 커짐 */
    transition: 0.3s;
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
  width: 20px;
  height: 20px;
  margin-right: 8px;
  border-radius: 6px;
`;

const DayTextBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 12%;
  max-width: 42%;
  margin-right: 1rem;
  border: 1px solid black;
  border-radius: ${({ theme }) => theme.borderRadius.radius50};
  padding: 0.4rem;
  box-shadow: -2px 2px 0px 1px #000000;
  background-color: #ffff;
`;
const TimeTextBox = styled.div`
  display: flex;
  align-items: center;
  min-width: 24%;
  margin-right: 1rem;
  border: 1px solid black;
  border-radius: ${({ theme }) => theme.borderRadius.radius50};
  padding: 0.4rem;
  box-shadow: -2px 2px 0px 1px #000000;
  background-color: white;
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
  margin: 2px;
  font-size: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  word-break: break-all;
`;

const TimeText = styled.span`
  font-size: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  word-break: break-all;
`;

const ParticipationText = styled.span`
  font-size: ${({ theme }) => theme.font.font10};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  word-break: break-all;
`;
