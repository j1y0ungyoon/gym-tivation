import { useRouter } from 'next/router';

const RecruitDetail = () => {
  const router = useRouter();

  const { post } = router.query;

  // const detailPost = JSON.parse(post);
  console.log(post);

  // const detailPost = JSON.parse(post)
  // if(post && typeof(post) == string) {
  // }
  return <div>Detail</div>;
};

export default RecruitDetail;

// 1. RecruitPost 컴포넌트에서 RecruitDetail에 파람스로 post.id를 보내고
// 2. post.id를 이용해서 getDoc 한 후,
// 3. input, textarea 태그 defaultValue에 기존 텍스트를 준다.
// 4. '삭제하기' 버튼을 누르면 삭제가 되어야 한다.
// 5. '수정하기' 버튼을 누르면 기존 텍스트는 유지가 된 상태로 수정이 진행되어야 한다.
// 6. '수정 완료' 버튼을 누르면 update가 완료되고 다시 detail 페이지가 보인다.
