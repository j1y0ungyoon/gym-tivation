import Link from 'next/link';
import React from 'react';
import styled from 'styled-components';

const SideNav = () => {
  return (
    <SideNavWrapper>
      <Link href={'/'}>Home</Link>
      <Link href={'/chat'}>채팅</Link>
      <Link href={'/board'}>게시판</Link>
      <Link href={'/mapBoard'}>주변 동료 모집</Link>
      <Link href={'/'}>오운완 갤러리</Link>
      <Link href={'/myPage'}>마이페이지</Link>
    </SideNavWrapper>
  );
};

const SideNavWrapper = styled.nav`
  background-color: #888;
  display: flex;
  flex-direction: column;
  height: 90vh;
`;

export default SideNav;
