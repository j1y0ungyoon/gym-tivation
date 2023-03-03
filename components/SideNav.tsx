import { authService } from '@/firebase';
import Link from 'next/link';
import { useRouter } from 'next/router';

import React from 'react';
import styled from 'styled-components';

const SideNav = ({ isLoggedIn }: { isLoggedIn: boolean }) => {
  const router = useRouter();

  const id = authService.currentUser?.uid;
  const goToDetailMyPage = (id: any) => {
    console.log('아이디', id);
    router.push({
      pathname: `/myPage/${id}`,
      query: { id },
    });
  };

  return (
    <SideNavWrapper>
      <NavBtn onClick={() => router.push('/')}>Home</NavBtn>
      <NavBtn onClick={() => router.push('/chat')}>채팅</NavBtn>
      <NavBtn onClick={() => router.push('/board')}>게시판</NavBtn>
      <NavBtn onClick={() => router.push('/mapBoard')}>주변 동료 모집</NavBtn>
      <NavBtn onClick={() => router.push('/gallery')}>오운완 갤러리</NavBtn>
      {isLoggedIn && (
        <NavBtn onClick={() => goToDetailMyPage(id)}>마이페이지</NavBtn>
      )}
    </SideNavWrapper>
  );
};

const SideNavWrapper = styled.nav`
  width: 180px;
  height: calc(100vh - 80px);
  border-right: 1px solid #ddd;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const NavBtn = styled.div`
  width: 180px;
  padding: 10px;
  cursor: pointer;
  :hover {
    background-color: #ddd;
  }
`;

export default SideNav;

const RoutingDiv = styled.div`
  cursor: pointer;
  background-color: black;
  color: white;
`;
