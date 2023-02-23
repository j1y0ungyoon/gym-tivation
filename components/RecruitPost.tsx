import { RecruitPostType } from '@/type';
import { useRouter } from 'next/router';
import styled from 'styled-components';

const RecruitPost = ({ post }: { post: RecruitPostType }) => {
  const router = useRouter();

  // Detail 페이지로 이동
  const GoToRecruitDetail = (post: RecruitPostType) => {
    // 필요한 데이터를 url을 통해 건네주고 있는데, url 길이가 너무 길어짐.
    //! url 길이를 줄일 수 있는 개선점을 찾지 못한다면
    // useQuery를 이용해서 db에 데이터 요청하는 방법이 깔끔할 수도 있을 것 같다.
    router.push(
      {
        pathname: `/recruitDetail/${post.id}`,
        // query: { pid: post.id },
      },
      // `/recruitDetail/${post.id}`,
    );
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
  width: 50rem;
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
