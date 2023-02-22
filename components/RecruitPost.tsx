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
        <TitleText>{post.title}</TitleText>
        <ContentText>{post.content}</ContentText>
      </RecruitPostBox>
    </>
  );
};

export default RecruitPost;

const RecruitPostBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 0.8rem;
  width: 15rem;
  height: 8rem;
  border: 1px solid black;
  margin-bottom: 1rem;
  padding: 1rem;
  cursor: pointer;
`;

const TitleText = styled.span`
  font-size: medium;
  font-weight: bold;
`;

const ContentText = styled.span`
  font-size: small;
`;
