import { RecruitPostType } from '@/pages/type';
import { useMutation } from '@tanstack/react-query';
import { deleteRecruitPost } from '@/pages/api/api';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import Link from 'next/link';

const RecruitPost = ({ post }: { post: RecruitPostType }) => {
  const router = useRouter();

  // 게시글 삭제 useMutation
  const { isLoading: isLoadingDeleting, mutate: removeRecruitPost } =
    useMutation(
      ['deleteRecruitPost', post.id],
      (body: string) => deleteRecruitPost(body),
      {
        onSuccess: () => {
          console.log('삭제성공');
        },
        onError: (err) => {
          console.log('err in delete:', err);
        },
      },
    );

  // 게시글 삭제 클릭 이벤트
  const onClickDeletePost = async () => {
    try {
      await removeRecruitPost(post.id);
    } catch (error) {
      console.log('삭제중 에러 발생', error);
    }
  };

  // 게시글 수정 클릭 이벤트
  const onClickEditPost = async () => {};

  // Detail 페이지로 이동
  const GoToRecruitDetail = () => {
    router.push({
      pathname: `/recruitDetail/${post.id}`,
      query: { pid: post.id, post: JSON.stringify(post) },
    });
  };

  return (
    <>
      {isLoadingDeleting ? (
        <RecruitPostBox>게시물을 삭제하고 있습니다.</RecruitPostBox>
      ) : (
        <RecruitPostBox key={post.id} onClick={GoToRecruitDetail}>
          <h4>{post.title}</h4>
          <h5>{post.content}</h5>
          <button onClick={onClickDeletePost}>삭제</button>
          <button onClick={onClickEditPost}>수정</button>
        </RecruitPostBox>
      )}
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
