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
      <NavBtn
        onClick={() => router.push('/')}
        src={'/assets/icons/nav/nav_home.svg'}
      />
      <NavBtn
        onClick={() => router.push('/chat')}
        src={'/assets/icons/nav/nav_chat.svg'}
      />
      <NavBtn
        onClick={() => router.push('/board')}
        src={'/assets/icons/nav/nav_board.svg'}
      />
      <NavBtn
        onClick={() => router.push('/mapBoard')}
        src={'/assets/icons/nav/nav_recruit.svg'}
      />
      <NavBtn
        onClick={() => router.push('/gallery')}
        src={'/assets/icons/nav/nav_gallery.svg'}
      />
      {isLoggedIn && (
        <NavBtn
          onClick={() => goToDetailMyPage(id)}
          src={'/assets/icons/nav/nav_my.svg'}
        />
      )}
    </SideNavWrapper>
  );
};

const SideNavWrapper = styled.nav`
  width: 180px;
  height: calc(100vh - 80px);
  background-color: #fffcf3;
  border-right: 1px solid #f0dcca;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const NavBtn = styled.img`
  width: 100px;
  height: 100px;
  cursor: pointer;
  /* :hover {
    background-color: #fff2e7;
  } */
`;

export default SideNav;

const RoutingDiv = styled.div`
  cursor: pointer;
  background-color: black;
  color: white;
`;
