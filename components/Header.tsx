import { authService, dbService } from '@/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import styled from 'styled-components';

const Header = ({ isLoggedIn }: { isLoggedIn: boolean }) => {
  const router = useRouter();
  const onLogout = async () => {
    try {
      const user = authService.currentUser;
      if (user !== null) {
        alert('로그아웃');
        router.push('/');
        authService.signOut();
        await updateDoc(doc(dbService, 'profile', user.uid), {
          loginState: false,
        });
      }
    } catch {
      (error: any) => {
        alert(error);
      };
    }
  };

  return (
    <HeaderWrapper>
      <Logo onClick={() => router.push('/')} src="/assets/images/Logo.png" />

      <Itembox>
        <SearchBar>
          <SearchInput />
          <SearchIcon src="/assets/icons/searchIcon.png" />
        </SearchBar>
        {!isLoggedIn ? (
          <SignBox>
            <Sign onClick={() => router.push('/signUp')}>회원가입</Sign>/
            <Sign onClick={() => router.push('/signIn')}>로그인</Sign>
          </SignBox>
        ) : (
          <LogoutBtn onClick={onLogout}>로그아웃</LogoutBtn>
        )}
      </Itembox>
    </HeaderWrapper>
  );
};

const HeaderWrapper = styled.header`
  height: 80px;
  margin: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #ddd;
`;

const Logo = styled.img`
  height: 30px;
  margin-left: 25px;
  object-fit: contain;
  cursor: pointer;
`;

const SearchBar = styled.div`
  width: 280px;
  height: 50px;
  background-color: #ddd;
  border-radius: 25px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-right: 20px;
`;

const SearchInput = styled.input`
  width: 225px;
  height: 40px;
  margin-left: 20px;
  border: none;
  outline: none;
  background-color: #ddd;
`;

const SearchIcon = styled.img`
  width: 20px;
  margin-right: 20px;
  margin-left: 5px;
`;

const Itembox = styled.div`
  display: flex;
  align-items: center;
`;

const SignBox = styled.div`
  margin: 10px;
`;

const Sign = styled.span`
  margin: 5px;
  cursor: pointer;
  :hover {
    color: #79b8df;
  }
`;

const LogoutBtn = styled.button`
  width: 120px;
  height: 40px;
  margin-right: 25px;
  padding: 0;
  border-radius: 20px;
  border: none;
  background-color: #cecece;
  color: #222;
  :hover {
    background-color: #222;
    color: #eee;
  }
`;

export default Header;
