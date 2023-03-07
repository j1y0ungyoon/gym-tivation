import { useEffect, useState } from 'react';
import styled from 'styled-components';

import { authService, dbService } from '@/firebase';
import {
  collection,
  getCountFromServer,
  getDocs,
  limit,
  orderBy,
  query,
} from 'firebase/firestore';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import MainCommentList from '@/components/MainCommentList';

type ImgBoxProps = {
  mainImg: string;
};

const Home = () => {
  const user = authService.currentUser;

  const [mainImgs, setMainImgs] = useState<any>([]);
  const [userCount, setUserCount] = useState<number>();

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
    const getProfile = async () => {
      const profileCollection = collection(dbService, 'profile');
      const snapshot = await getCountFromServer(profileCollection);
      const profileCount = snapshot.data().count;
      setUserCount(profileCount);
    };

    getProfile();
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
    centerPadding: '0',
    speed: 500,
    nextArrow: (
      <ArrowR>
        <SVG src={'/assets/icons/next.svg'} />
      </ArrowR>
    ),
    prevArrow: (
      <ArrowL>
        <SVG src={'/assets/icons/prev.svg'} />
      </ArrowL>
    ),
  };

  return (
    <HomeWrapper>
      <HomeContainer>
        <SubTitleText>
          운동 동기부여 어렵지 않아요! GYMTIVATION과 함께해봐요!
        </SubTitleText>
        <TitleText>
          {userCount}명의 동료들이 짐티베이션에 참여하고 있습니다!
        </TitleText>
        <DIV>
          <SliderContainer {...settings}>
            {mainImgs?.map((mainImg: string) => {
              return <Img key={mainImg} mainImg={mainImg} />;
            })}
          </SliderContainer>

          <TitleSvg src={'/assets/icons/title.svg'} />
        </DIV>
        <MainCommentList />
      </HomeContainer>
    </HomeWrapper>
  );
};

const HomeWrapper = styled.main`
  ${({ theme }) => theme.mainLayout.wrapper}
`;

const HomeContainer = styled.div`
  ${({ theme }) => theme.mainLayout.container}
  height: calc(100vh - 100px);
`;

const SubTitleText = styled.h1`
  height: 24px;
  margin-top: 60px;
  font-size: 20px;
  text-align: center;
`;
const TitleText = styled.h1`
  height: 60px;
  margin-top: 10px;
  font-size: 30px;
  font-weight: bold;
  text-align: center;
`;
const DIV = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const Img = styled.div<ImgBoxProps>`
  background-image: ${(props) => `url(${props.mainImg})`};
  background-size: cover;
  background-position: center center;
`;

const SliderContainer = styled(Slider)`
  width: 100%;
  height: calc(100% - 320px);
  min-height: 620px;

  position: relative;

  .slick-prev::before,
  .slick-next::before {
    opacity: 0;
    display: none;
  }

  .slick-list {
    width: 100%;
    min-height: 600px;
    height: 100%;
  }

  .silck-track {
  }

  .slick-slide {
    min-height: 600px;
    height: calc(100vh - 440px);
    display: flex;
    align-items: center;
  }
  .slick-slide div {
    width: 380px;
    height: 380px;
  }
  .slick-slide div div {
    width: 100%;
    height: 100%;
    border-radius: 500px;
    object-fit: cover;
  }
  .slick-center div div {
    width: 100%;
    height: 100%;
    border-radius: 500px;
    transition: all 300ms ease;
    transform: scale(1.4);
  }
`;
const TitleSvg = styled.img`
  position: absolute;
  bottom: 40px;
`;

const ArrowR = styled.div`
  width: 40px;
  height: 40px;
  position: absolute;
  right: 48px;
  z-index: 99;
`;
const ArrowL = styled.div`
  width: 40px;
  height: 40px;
  position: absolute;
  left: 48px;
  z-index: 99;
`;
const SVG = styled.img`
  width: 40px;
  height: 40px;
`;
export default Home;
