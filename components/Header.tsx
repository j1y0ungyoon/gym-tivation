import { authService, dbService } from '@/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import Link from 'next/link';
import React from 'react';
import styled from 'styled-components';

const Header = () => {
  const onLogout = async () => {
    try {
      const user = authService.currentUser;
      if (user !== null) {
        authService.signOut();
        await updateDoc(doc(dbService, 'profile', user.uid), {
          loginState: false,
        });
      }
      alert('로그아웃');
    } catch {
      (error: any) => {
        alert(error);
      };
    }
  };
  return (
    <HeaderWrapper>
      <div>LOGO</div>

      <Itembox>
        <div>search bar</div>
        {!authService.currentUser ? (
          <div>
            <Link href="/signUp">회원가입</Link>
            <Link href="/signIn">로그인</Link>
          </div>
        ) : (
          <button onClick={onLogout}>로그아웃</button>
        )}
      </Itembox>
    </HeaderWrapper>
  );
};

const HeaderWrapper = styled.header`
  background-color: #ddd;
  display: flex;
  justify-content: space-between;
  height: 10vh;
`;

const Itembox = styled.div`
  display: flex;
`;
export default Header;
