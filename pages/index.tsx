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
import { nanoid } from 'nanoid';
import HomeComment from '@/components/HomeComment';

type ImgBoxProps = {
  img: string;
};

const Home = () => {
  const user = authService.currentUser;

  const [mainImgs, setMainImgs] = useState<any>([]);
  const [userCount, setUserCount] = useState<number>();
  const [mainComments, setMainComments] = useState<any>([]);

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

  useEffect(() => {
    const getComment = async () => {
      const q = await getDocs(
        query(
          collection(dbService, 'mainComment'),
          orderBy('createdAt', 'desc'),
          limit(10),
        ),
      );

      const comment = q.docs.map((doc) => {
        return doc.data();
      });

      setMainComments(comment);
    };
    getComment();
    console.log('메코', mainComments);
  }, []);

  const imgSettings = {
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

  const commentSettings = {
    infinite: true,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    speed: 1800,
    autoplaySpeed: 1800,
    cssEase: 'linear',
    pauseOnHover: false,
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
        <SliderWrapper>
          <ImgSliderContainer {...imgSettings}>
            {mainImgs?.map((mainImg: string) => {
              return <Img key={mainImg} img={mainImg} />;
            })}
          </ImgSliderContainer>

          <TitleSvg src={'/assets/icons/title.svg'} />
        </SliderWrapper>

        <SliderWrapper>
          <MainCommentSliderContainer {...commentSettings}>
            {mainComments?.map((mainComment: any) => {
              return <HomeComment key={nanoid()} mainComment={mainComment} />;
            })}
          </MainCommentSliderContainer>
        </SliderWrapper>

        <MainCommentList />
      </HomeContainer>
    </HomeWrapper>
  );
};

const HomeWrapper = styled.main`
  ${({ theme }) => theme.mainLayout.wrapper}
  height: 100%;
`;

const HomeContainer = styled.div`
  ${({ theme }) => theme.mainLayout.container}
  height: 100%;
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
const SliderWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const Img = styled.div<ImgBoxProps>`
  background-image: ${(props) => `url(${props.img})`};
  background-size: cover;
  background-position: center center;
`;

const ImgSliderContainer = styled(Slider)`
  width: 100%;
  height: calc(100% - 320px);
  min-height: 620px;
  max-height: 720px;

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
    border: 1px solid black;
    box-shadow: -2px 2px 0px 1px #000000;
    object-fit: cover;
  }
  .slick-center div div {
    width: 100%;
    height: 100%;
    border-radius: 500px;
    border: 1px solid black;
    box-shadow: -2px 2px 0px 1px #000000;
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

const MainCommentSliderContainer = styled(Slider)`
  width: 100%;
  height: 100px;
  margin: 105px 0;
  position: relative;
  /* 
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
  } */
`;

const MainCommentWrapper = styled.div``;

export default Home;
