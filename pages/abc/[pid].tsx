import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

const Abc = () => {
  const router = useRouter();
  const { pid } = router.query;

  // router.query로 불러 온 pid를 새로고침해도 유지하려면 아래 처리가 필수!
  useEffect(() => {
    if (router.isReady) {
      console.log('router', router);
      console.log('pid', pid);
    }
  }, [router.isReady]);

  return <div></div>;
};

export default Abc;
