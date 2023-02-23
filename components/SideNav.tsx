import { authService } from '@/firebase';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import styled from 'styled-components';

const SideNav = () => {
  const router = useRouter();

  const goToMapBoard = () => {
    if (authService.currentUser) {
      router.push('/mapBoard');
      return;
    }

    if (!authService.currentUser) {
      alert('로그인이 필요합니다!');
      router.push('/signIn');
    }
  };

  return (
    <SideNavWrapper>
      <NavBtn onClick={() => router.push('/')}>Home</NavBtn>
      <NavBtn onClick={() => router.push('/chat')}>채팅</NavBtn>
      <NavBtn onClick={() => router.push('/board')}>게시판</NavBtn>
      <NavBtn onClick={goToMapBoard}>주변 동료 모집</NavBtn>
      <NavBtn onClick={() => router.push('/gallery')}>오운완 갤러리</NavBtn>
      <NavBtn onClick={() => router.push('/myPage')}>마이페이지</NavBtn>
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
  width: 160px;
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
