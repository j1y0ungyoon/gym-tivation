import { useEffect, useState } from 'react';
import styled from 'styled-components';

import { authService, dbService } from '@/firebase';
import { addDoc, collection, getDocs, query } from 'firebase/firestore';

const Home = () => {
  const user = authService.currentUser;

  const [mainImg, setMainImg] = useState<any>([]);

  useEffect(() => {
    const getGallery = async () => {
      const q = await getDocs(query(collection(dbService, 'gallery')));

      const gallery = q.docs.map((doc) => {
        return doc.data();
      });

      setMainImg(gallery);
    };
    getGallery();
  }, []);

  return (
    <HomeWrapper>
      <TitleText>현재 함께 운동중인 동료들 2683명!</TitleText>
      <ImgContainer>
        {/* <ImgBox style={{ zIndex: 100 }} src={`${mainImg[0].photo}`} />
        <ImgBox style={{ zIndex: 50 }} src={`${mainImg[1].photo}`} />
        <ImgBox style={{ zIndex: 0 }} src={`${mainImg[2].photo}`} /> */}
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
  object-fit: cover;
`;

export default Home;
