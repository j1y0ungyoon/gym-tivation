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
            <DayText>{post.selectedDays}</DayText>
            <TimeText>{`${post.startTime} ~ ${post.endTime}`}</TimeText>
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
  width: 98%;
  height: 5rem;
  border: 1px solid black;
  border-radius: 1.2rem;
  margin-bottom: 1rem;
  padding: 1rem;
  background-color: white;
  cursor: pointer;
`;

const TitleText = styled.span`
  font-size: large;
  font-weight: bold;
`;

const ProfileImage = styled.img`
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  margin-left: 1rem;
  margin-right: 0.6rem;
`;

const UserInfoBox = styled.div`
  display: flex;
  flex-direction: column;
`;

const RecruitPostInfoBox = styled.div`
  display: flex;
  flex-direction: column;
`;

const DayTimeInfoBox = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 0.2rem;
`;

const DayText = styled.span`
  margin-right: 1rem;
  border: 1px solid black;
  border-radius: 0.8rem;
  padding: 0.2rem;
  background-color: #d9d9d9;
`;

const TimeText = styled.span`
  margin-right: 1rem;
  border: 1px solid black;
  border-radius: 0.8rem;
  padding: 0.2rem;
  background-color: #d9d9d9;
`;
