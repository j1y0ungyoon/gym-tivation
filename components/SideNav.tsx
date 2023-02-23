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
      <Link href={'/'}>Home</Link>
      <Link href={'/chat'}>채팅</Link>
      <Link href={'/board'}>게시판</Link>
      <RoutingDiv onClick={goToMapBoard}>주변 동료 모집</RoutingDiv>
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

const RoutingDiv = styled.div`
  cursor: pointer;
  background-color: black;
  color: white;
`;
