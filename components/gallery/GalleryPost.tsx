import { getProfile } from '@/pages/api/api';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import styled from 'styled-components';
import Loading from '../common/globalModal/Loading';

interface GalleryPostPropsType {
  id: string;
  photo: string;
  userPhoto: string;
  nickName: string;
  userId: string;
  content: string;
}

interface MouseHoverWrapperProps {
  photo: string;
}

const GalleryPost = ({
  id,
  photo,
  userPhoto,
  userId,
  nickName,
  content,
}: GalleryPostPropsType) => {
  const router = useRouter();
  const goToGalleryDetailPost = (id: any) => {
    router.push({
      pathname: `/galleryDetail/${id}`,
      query: {
        id,
      },
    });
  };

  const [CurrentUserProfile, setCurrentUserProfile] = useState<ProfileItem>();

  const { data: profile, isLoading: profileLoading } = useQuery(
    'profile',
    getProfile,
  );

  useEffect(() => {
    setCurrentUserProfile(profile?.filter((item) => item.id === userId)[0]);
  }, []);

  if (profileLoading) return <Loading />;

  return (
    <>
      <GalleryPostWrapper key={id} onClick={() => goToGalleryDetailPost(id)}>
        <div className="background" />
        <MouseOverImage photo={photo} />
        <div className="userInfoContainer">
          <div className="userInfoBox">
            <UserProfileBox>
              <UserImage src={userPhoto} />
              <UserNickNameAndLvBox>
                <UserNicknameText>{nickName}</UserNicknameText>
                <UserLvText>
                  {CurrentUserProfile &&
                    `${CurrentUserProfile.lvName} ${CurrentUserProfile.lv}`}
                </UserLvText>
              </UserNickNameAndLvBox>
            </UserProfileBox>
            <ContentText>{content}</ContentText>
          </div>
        </div>
      </GalleryPostWrapper>
    </>
  );
};

const GalleryPostWrapper = styled.div`
  width: 256px;
  height: 290px;
  position: relative;
  border: 1px solid black;
  overflow: hidden;
  border-radius: ${({ theme }) => theme.borderRadius.radius50};
  .background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: black;
    z-index: 10;
    display: none;
    transform: scale(1.01, 1.01); /* 가로2배 새로 1.2배 로 커짐 */
    transition: 0.3s;
  }

  .userInfoContainer {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 20;
    .userInfoBox {
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      height: 50%;
      width: 100%;
    }

    :hover {
      img {
        display: block;
      }
      span {
        display: block;
      }
    }
  }

  :hover {
    transform: scale(1.02);
    transition: 300ms;

    cursor: pointer;
    .background {
      display: block;
      opacity: 0.6;
    }
  }
`;

const MouseOverImage = styled.div<MouseHoverWrapperProps>`
  overflow: hidden;
  width: 256px;
  height: 290px;
  position: relative;
  border-radius: ${({ theme }) => theme.borderRadius.radius50};
  cursor: pointer;
  object-fit: cover;
  background-image: url(${(props) => props.photo});
  background-position: center;
  background-size: cover;

  :hover {
    .background {
      display: block;
    }
  }
`;

const UserProfileBox = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 10px;
  width: 100%;
  height: 40%;
  gap: 10px;
`;

const UserNickNameAndLvBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: 4px;
`;

const UserNicknameText = styled.span`
  font-size: ${({ theme }) => theme.font.font10};
  font-weight: bold;
  color: white;
  display: none;
`;

const UserLvText = styled.span`
  font-size: ${({ theme }) => theme.font.font10};
  color: white;
  display: none;
`;

const ContentText = styled.span`
  margin-left: 12px;
  margin-bottom: 18px;
  width: 90%;
  color: white;
  display: none;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const UserImage = styled.img`
  ${({ theme }) => theme.profileDiv}
  z-index: 40;
  display: none;
`;

export default GalleryPost;
