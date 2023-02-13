import { RecruitPostType } from '@/pages/type';
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
        pathname: `/recruitDetail/${post.id}/${post.title}/${post.content}/${post.createdAt}`,
        query: { pid: post.id },
      },
      // `/recruitDetail/${post.id}`,
    );
  };

  return (
    <>
      <RecruitPostBox key={post.id} onClick={() => GoToRecruitDetail(post)}>
        <h4>{post.title}</h4>
        <h5>{post.content}</h5>
      </RecruitPostBox>
    </>
  );
};

export default RecruitPost;

const RecruitPostBox = styled.div`
  width: 20rem;
  height: 10rem;
  border: 1px solid black;
  margin-bottom: 2rem;
  padding: 1rem;
  cursor: pointer;
`;
