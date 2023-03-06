import { useEffect, useState } from 'react';
import styled from 'styled-components';

import { authService, dbService } from '@/firebase';
import { collection, getDocs, limit, orderBy, query } from 'firebase/firestore';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import BoardCommentList from '@/components/BoardCommentList';

type ImgBoxProps = {
  mainImg: string;
};

const Home = () => {
  const user = authService.currentUser;

  const [mainImgs, setMainImgs] = useState<any>([]);

  useEffect(() => {
    const getGallery = async () => {
      const q = await getDocs(
        query(
          collection(dbService, 'gallery'),
          orderBy('like', 'desc'),
          limit(5),
        ),
      );

      const gallery = q.docs.map((doc) => {
        return doc.data().photo;
      });

      setMainImgs(gallery);
    };
    getGallery();
  }, []);

  const settings = {
    className: 'center',
    dots: false,
    centerMode: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 2000,
    slidesToShow: 3,
    slideToScroll: 1,
    centerPadding: '60px',
    speed: 500,
    arrows: false,
  };

  return (
    <HomeWrapper>
      <HomeContainer>
        <TitleText>현재 함께 운동중인 동료들 2683명!</TitleText>
        <SliderContainer {...settings}>
          {mainImgs?.map((mainImg: string) => {
            return <Img key={mainImg} mainImg={mainImg} />;
          })}
        </SliderContainer>
        <BoardCommentList />
      </HomeContainer>
    </HomeWrapper>
  );
};

const HomeWrapper = styled.main`
  ${({ theme }) => theme.mainLayout.wrapper}
`;

const HomeContainer = styled.div`
  ${({ theme }) => theme.mainLayout.container}
`;

const TitleText = styled.h1`
  height: 60px;
  margin-top: 50px;
  font-size: 3rem;
  font-weight: bold;
  text-align: center;
`;

const Img = styled.div<ImgBoxProps>`
  background-image: ${(props) => `url(${props.mainImg})`};
  background-size: cover;
  background-position: center center;
`;

const SliderContainer = styled(Slider)`
  width: 100%;
  height: calc(100% - 120px);

  .slick-list {
    width: 100%;
    height: 100%;
  }

  .silck-track {
  }

  .slick-slide {
    min-height: 740px;
    height: calc(100vh - 240px);
    display: flex;
    align-items: center;
  }
  .slick-slide div {
    width: 100%;
  }
  .slick-slide div div {
    height: 500px;
    border-radius: 500px;
    object-fit: cover;
  }
  .slick-center div div {
    height: 500px;
    border-radius: 500px;
    transition: all 300ms ease;
    transform: scale(1.4);
  }
`;

export default Home;
