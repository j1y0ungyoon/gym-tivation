import styled from 'styled-components';

// import { useState, useEffect } from 'react';
// import {
//   query,
//   collection,
//   getDocs,
//   where,
//   onSnapshot,
// } from 'firebase/firestore';
// import { dbService, authService } from '@/firebase';
// import Follow from '@/components/Follow';

// type Follow = {
//   id: string;
//   area?: string;
//   introduction?: string;
//   instagram?: string;
//   displayName?: string;
//   email?: string;
//   photoURL?: string;
//   loginState?: boolean;
//   follow?: string;
//   uid?: string;
// };

const Home = () => {
  ////////////////////////////// 여기부터 팔로우 시작 ////////////////////////////
  // const [followInformation, setFollowInformation] = useState<Follow[]>([]);

  // const userUid: any = String(authService.currentUser?.uid);

  // useEffect(() => {
  //   const q = query(
  //     collection(dbService, 'profile'),
  //     where('uid', '!=', userUid),
  //   );
  //   const unsubscribe = onSnapshot(q, (snapshot) => {
  //     const newfollows = snapshot.docs.map((doc) => {
  //       const newfollow = {
  //         id: doc.id,
  //         ...doc.data(),
  //       };
  //       return newfollow;
  //     });
  //     setFollowInformation(newfollows);
  //   });

  //   return () => {
  //     unsubscribe();
  //   };
  // }, [authService.currentUser]);

  // return (
  //   <div>
  //     {followInformation.map((item) => {
  //       return <Follow key={item.id} item={item} userUid={userUid} />;
  //     })}
  //   </div>
  // );
  //////////////////////////////// 여기까지 팔로우 ////////////////////////////////////

  return (
    <HomeWrapper>
      <TitleText>현재 함께 운동중인 동료들 2683명!</TitleText>
      <ImgContainer>
        <ImgBox style={{ zIndex: 100 }} src="/assets/images/testImg01.png" />
        <ImgBox style={{ zIndex: 50 }} src="/assets/images/testImg02.png" />
        <ImgBox style={{ zIndex: 0 }} src="/assets/images/testImg01.png" />
      </ImgContainer>
    </HomeWrapper>
  );
};

const HomeWrapper = styled.main`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const TitleText = styled.h1`
  margin-top: 50px;
  font-size: 3rem;
  font-weight: bold;
`;

const ImgContainer = styled.section`
  margin-top: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ImgBox = styled.img`
  margin-left: -50px;
  width: 400px;
  height: 600px;
  border: 1px solid red;
  border-radius: 200px;
`;

export default Home;
