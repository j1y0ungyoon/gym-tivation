import { useRouter } from 'next/router';
import React from 'react';
import styled from 'styled-components';
// import checkedLike from '../public/assets/images/checkedLike.png';
import Image from 'next/image';

type BoardGet = {
  paramsId: string;
  board: Board[];
};

const MyPageBoard = ({ paramsId, board }: BoardGet) => {
  const router = useRouter();
  const goToBoardDetailPost = (id: any) => {
    router.push({
      pathname: `/boardDetail/${id}`,
      query: {
        id,
      },
    });
  };

  return (
    <MyPageBoardWrapper>
      {board
        .filter((item) => item.userId === paramsId)
        .map((item) => {
          return (
            <MyPageBoardContainer
              key={item.id}
              onClick={() => goToBoardDetailPost(item.id)}
            >
              <UserPhotoBox>
                <UserPhoto>
                  <Photo src={item.userPhoto} />
                </UserPhoto>
              </UserPhotoBox>
              <TitleNickNameBox>
                <TitleBox>
                  <BoardCategory>{item.category}</BoardCategory>
                  <BoardTitleText>{item.title}</BoardTitleText>

                  <RecruitComment>[{item.comment}]</RecruitComment>
                </TitleBox>
                <NickNameBox>
                  <NickNameText>{item.nickName}</NickNameText>
                  <NickNameText>{String(item.date)}</NickNameText>
                  <IconImg src="/assets/icons/myPage/Likes.svg" />
                  <NickNameText>
                    {item.like ? item.like.length : 0}
                  </NickNameText>
                </NickNameBox>
              </TitleNickNameBox>
            </MyPageBoardContainer>
          );
        })}
    </MyPageBoardWrapper>
  );
};

export default MyPageBoard;
const MyPageBoardWrapper = styled.div`
  margin-left: 40px;
  padding-top: 20px;
  padding-bottom: 20px;
  width: 92%;
  height: 70%;
  flex-wrap: wrap;
`;

const MyPageBoardContainer = styled.div`
  display: flex;
  width: 100%;
  height: 40%;
  max-height: 105px;
  padding: 10px;
  background-color: white;
  border-color: black;
  border-style: solid;
  border-width: 0.1rem;
  border-radius: 15px;
  margin-bottom: 16px;
  box-shadow: -2px 2px 0px 0px #000000;
  :hover {
    cursor: pointer;
    transform: scale(1.03, 1.03);
    transition: 0.3s;
  }
`;

const PhotoBox = styled.div`
  width: 28%;
  height: 100%;
`;
const ProfilePhoto = styled.div`
  width: 95%;
  height: 100%;
  border-radius: 1rem;
  overflow: hidden;
`;
const Photo = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  :hover {
    cursor: pointer;
    transform: scale(1.2, 1.2);
  }
`;
const BoardCategory = styled.button`
  width: 150px;
  height: 36px;
  ${({ theme }) => theme.font.font30};
  font-weight: bold;
  background-color: white;
  border-radius: 2rem;
  margin-right: 8px;
  box-shadow: -2px 2px 0px 0px #000000;
`;

const BoardTitleText = styled.span`
  ${({ theme }) => theme.font.font30};
  max-width: 260px;
  text-align: left;
  margin-top: 4px;
  font-weight: bolder;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
const NickNameText = styled.span`
  font-size: 12px;
  margin-right: 10px;
`;

const TitleBox = styled.div`
  display: flex;
  margin-top: 4px;
  margin-bottom: 8px;
  width: 100%;
  height: 50%;
`;
const NickNameBox = styled.div`
  display: flex;
  width: 80%;
  height: 30%;
`;
const TitleNickNameBox = styled.div`
  width: 100%;
  height: 100%;
  padding-left: 10px;
`;
const RecruitComment = styled.span`
  font-size: 12px;
  margin-top: 6px;
  color: gray;
  font-weight: bolder;
  margin-left: 8px;
`;
const IconImg = styled.img`
  width: 16px;
  height: 16px;
  margin-right: 5px;
  margin-bottom: 2px;
`;
const UserPhoto = styled.div`
  width: 95%;
  height: 100%;
  border-radius: 70%;
  overflow: hidden;
`;
const UserPhotoBox = styled.div`
  margin: auto;
  width: 70px;
  height: 60px;
`;
