import { authService } from '@/firebase';
import { navMenuState } from '@/recoil/navMenu';
import { useRouter } from 'next/router';

import React from 'react';
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

  React.useEffect(() => {
    // home
    if (router.pathname === '/') {
      setNowMenu('home');
    }

    // chat
    if (router.pathname === '/chat') {
      setNowMenu('chat');
    }

    // board
    if (router.pathname === '/board') {
      setNowMenu('board');
    }
    if (router.pathname === '/board/post') {
      setNowMenu('board');
    }
    if (router.pathname === '/boardDetail/[...params]') {
      setNowMenu('board');
    }

    // mapBoard
    if (router.pathname === '/mapBoard') {
      setNowMenu('mapBoard');
    }
    if (router.pathname === '/mapBoard/WritingRecruitment') {
      setNowMenu('mapBoard');
    }
    if (router.pathname === '/recruitDetail/[...params]') {
      setNowMenu('mapBoard');
    }

    // gallery
    if (router.pathname === '/gallery') {
      setNowMenu('gallery');
    }
    if (router.pathname === '/gallery/Post') {
      setNowMenu('gallery');
    }
    if (router.pathname === '/galleryDetail/[...params]') {
      setNowMenu('gallery');
    }

    // myPage
    if (router.pathname === '/myPage') {
      setNowMenu('myPage');
    }
  });

  return (
    <SideNavWrapper>
      {nowMenu === 'home' ? (
        <NavBtn
          onClick={() => router.push('/')}
          alt="홈 버튼"
          src={'/assets/icons/nav/nav_home_active.svg'}
        />
      ) : (
        <NavBtn
          alt="홈 버튼"
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
          alt="채팅 게시판 버튼"
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
          alt="채팅 게시판 버튼"
          src={'/assets/icons/nav/nav_chat.svg'}
        />
      )}
      {nowMenu === 'board' ? (
        <NavBtn
          onClick={() => router.push('/board')}
          alt="게시판 버튼"
          src={'/assets/icons/nav/nav_board_active.svg'}
        />
      ) : (
        <NavBtn
          onClick={() => {
            router.push('/board');
            setNowMenu('board');
            return;
          }}
          alt="게시판 버튼"
          src={'/assets/icons/nav/nav_board.svg'}
        />
      )}
      {nowMenu === 'mapBoard' ? (
        <NavBtn
          alt="운동 동료 모집 게시판 버튼"
          onClick={() => router.push('/mapBoard')}
          src={'/assets/icons/nav/nav_recruit_active.svg'}
        />
      ) : (
        <NavBtn
          alt="운동 동료 모집 게시판 버튼"
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
          alt="오운완 갤러리 버튼"
          onClick={() => router.push('/gallery')}
          src={'/assets/icons/nav/nav_gallery_active.svg'}
        />
      ) : (
        <NavBtn
          alt="오운완 갤러리 버튼"
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
            alt="마이페이지 버튼"
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
            alt="마이페이지 버튼"
            src={'/assets/icons/nav/nav_my.svg'}
          />
        ))}
    </SideNavWrapper>
  );
};

const SideNavWrapper = styled.nav`
  border-right: 1px solid #f0dcca;

  position: fixed;
  width: 180px;
  height: calc(100vh - 80px);
  background-color: #fffcf3;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow-y: auto;
  ::-webkit-scrollbar {
    display: none;
  }
`;

const NavBtn = styled.img`
  width: 100px;
  height: 100px;
  cursor: pointer;
`;

export default SideNav;
