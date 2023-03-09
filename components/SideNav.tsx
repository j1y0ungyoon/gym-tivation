import { authService } from '@/firebase';
import { navMenuState } from '@/recoil/navMenu';
import { useRouter } from 'next/router';

import React, { useState } from 'react';
import { useRecoilState } from 'recoil';
import styled from 'styled-components';

const SideNav = ({ isLoggedIn }: { isLoggedIn: boolean }) => {
  const router = useRouter();

  const [nowMenu, setNowMenu] = useRecoilState(navMenuState);

  const id = authService.currentUser?.uid;
  const goToDetailMyPage = (id: any) => {
    router.push({
      pathname: `/myPage/${id}`,
      query: { id },
    });
  };

  return (
    <SideNavWrapper>
      {nowMenu === 'home' ? (
        <NavBtn
          onClick={() => router.push('/')}
          src={'/assets/icons/nav/nav_home_active.svg'}
        />
      ) : (
        <NavBtn
          onClick={() => {
            router.push('/');
            setNowMenu('home');
            return;
          }}
          src={'/assets/icons/nav/nav_home.svg'}
        />
      )}

      {nowMenu === 'chat' ? (
        <NavBtn
          onClick={() => router.push('/chat')}
          src={'/assets/icons/nav/nav_chat_active.svg'}
        />
      ) : (
        <NavBtn
          onClick={() => {
            router.push('/chat');
            setNowMenu('chat');
            return;
          }}
          src={'/assets/icons/nav/nav_chat.svg'}
        />
      )}
      {nowMenu === 'board' ? (
        <NavBtn
          onClick={() => router.push('/board')}
          src={'/assets/icons/nav/nav_board_active.svg'}
        />
      ) : (
        <NavBtn
          onClick={() => {
            router.push('/board');
            setNowMenu('board');
            return;
          }}
          src={'/assets/icons/nav/nav_board.svg'}
        />
      )}
      {nowMenu === 'mapBoard' ? (
        <NavBtn
          onClick={() => router.push('/mapBoard')}
          src={'/assets/icons/nav/nav_recruit_active.svg'}
        />
      ) : (
        <NavBtn
          onClick={() => {
            router.push('/mapBoard');
            setNowMenu('mapBoard');
            return;
          }}
          src={'/assets/icons/nav/nav_recruit.svg'}
        />
      )}
      {nowMenu === 'gallery' ? (
        <NavBtn
          onClick={() => router.push('/gallery')}
          src={'/assets/icons/nav/nav_gallery_active.svg'}
        />
      ) : (
        <NavBtn
          onClick={() => {
            router.push('/gallery');
            setNowMenu('gallery');
            return;
          }}
          src={'/assets/icons/nav/nav_gallery.svg'}
        />
      )}

      {isLoggedIn &&
        (nowMenu === 'my' ? (
          <NavBtn
            onClick={() => goToDetailMyPage(id)}
            src={'/assets/icons/nav/nav_my_active.svg'}
          />
        ) : (
          <NavBtn
            onClick={() => {
              goToDetailMyPage(id);
              setNowMenu('my');
              return;
            }}
            src={'/assets/icons/nav/nav_my.svg'}
          />
        ))}
    </SideNavWrapper>
  );
};

const SideNavWrapper = styled.nav`
  position: fixed;
  width: 180px;
  height: calc(100vh - 80px);
  background-color: #fffcf3;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow-y: auto;
`;

const NavBtn = styled.img`
  width: 100px;
  height: 100px;
  cursor: pointer;
`;

export default SideNav;
