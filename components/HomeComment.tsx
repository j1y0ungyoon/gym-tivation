import React from 'react';
import styled from 'styled-components';

const HomeComment = ({ mainComment }: any) => {
  return (
    <HomeCommentWrapper>
      <HomeCommentContainer>
        <CommentImg src={mainComment.photo} />
        <ContentBox>
          <Name>{mainComment.nickName}</Name>
          <Comment>{mainComment.comment}</Comment>
        </ContentBox>
      </HomeCommentContainer>
    </HomeCommentWrapper>
  );
};

const HomeCommentWrapper = styled.div`
  display: flex;
  align-items: center;
  background-color: #fff2e7;
  height: 100px;
  border-top: 1px solid black;
  border-bottom: 3px solid black;
`;
const HomeCommentContainer = styled.div`
  padding: 0 20px;
  display: flex;
  border-left: 1px solid black;
`;

const ContentBox = styled.div`
  margin-left: 10px;
  height: 40px;
`;
const Name = styled.div`
  font-size: 14px;
  color: #797979;
  overflow: hidden;
  text-overflow: ellipsis;
  height: 21px;
`;
const Comment = styled.div`
  max-width: 200px;
  position: relative;
  font-size: 16px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  height: 24px;
  /* :before {
    content: '...';
    position: absolute;
    right: 0;
    bottom: 0;
  } */
`;

const CommentImg = styled.img<any>`
  width: 40px;
  height: 40px;
  /* background-image: ${(props) => `url(${props.img})`};
  background-size: cover;
  background-position: center center; */
  border-radius: 40px;
`;

export default HomeComment;
