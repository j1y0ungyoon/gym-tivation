import { useRouter } from 'next/router';
import { useState } from 'react';

const RecruitDetail = ({ params }: any) => {
  const [detailPost, setDetailPost] = useState<object>();
  const router = useRouter();

  // getServerSideProps를 이용하면 router.push를 이용해 url로 데이터를 전달해도
  // 새로고침 시 해당 페이지에서 데이터가 사라지지 않는다.
  // params로 데이터를 받아와서 활용하면 된다.
  const [id, title, content, createdAt] = params;

  console.log(id);
  console.log(title);
  console.log(content);
  console.log(createdAt);

  // useEffect(() => {
  //   const { pid } = router.query;
  //   const getDetailPost = async () => {
  //     if (typeof pid === 'string') {
  //       const docRef = doc(dbService, 'recruitments', pid);
  //       const docSnap = await getDoc(docRef);
  //       return docSnap.data();
  //     }
  //   };
  // }, []);

  return (
    <div>
      <h3>{title}</h3>
      <h4>{content}</h4>
      <span>{createdAt}</span>
    </div>
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

// 1. RecruitPost 컴포넌트에서 RecruitDetail에 파람스로 post.id를 보내고
// 2. post.id를 이용해서 getDoc 한 후,
// 3. input, textarea 태그 defaultValue에 기존 텍스트를 준다.
// 4. '삭제하기' 버튼을 누르면 삭제가 되어야 한다.
// 5. '수정하기' 버튼을 누르면 기존 텍스트는 유지가 된 상태로 수정이 진행되어야 한다.
// 6. '수정 완료' 버튼을 누르면 update가 완료되고 다시 detail 페이지가 보인다.
