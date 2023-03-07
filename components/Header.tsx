import { authService, dbService } from '@/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { useState } from 'react';
import SearchUser from './SearchUser';
import { useRouter } from 'next/router';
import React from 'react';
import styled from 'styled-components';
import { toast } from 'react-toastify';

const Header = ({ isLoggedIn }: { isLoggedIn: boolean }) => {
  const router = useRouter();

  const [searchOpen, setSearchOpen] = useState<Boolean>(false);
  const [searchName, setSearchName] = useState<string>('');
  const onLogout = async () => {
    try {
      const user = authService.currentUser;
      if (user !== null) {
        await updateDoc(doc(dbService, 'profile', user.uid), {
          loginState: false,
        });
        router.push('/');
        authService.signOut();
        toast.info('로그아웃');
      }
    } catch {
      (error: any) => {
        toast.warn(error);
      };
    }
  };

  return (
    <HeaderWrapper>
      <Logo onClick={() => router.push('/')} src="/assets/images/Logo.png" />

      <Itembox>
        <SearchBar>
          <SearchInput
            value={searchName}
            onChange={(e) => {
              setSearchName(
                e.target.value.replace(
                  /[ \{\}\[\]\/?.,;:|\)*~`!^\-_+┼<>@\#$%&\'\"\\\(\=]/gi,
                  '',
                ),
              );
            }}
            onFocus={() => {
              setSearchOpen(true);
            }}
          />
          <SearchIcon src="/assets/icons/searchIcon.svg" />
        </SearchBar>
        {searchOpen && (
          <SearchUser setSearchOpen={setSearchOpen} searchName={searchName} />
        )}

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
  background-color: black;
  min-width: 1180px;
`;

const Logo = styled.img`
  height: 30px;
  margin-left: 25px;
  object-fit: contain;
  cursor: pointer;
`;

const SearchBar = styled.div`
  width: 320px;
  height: 40px;
  background-color: #ddd;
  border-radius: 25px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-right: 20px;
  background-color: white;
`;

const SearchInput = styled.input`
  width: 265px;
  height: 40px;
  margin-left: 20px;
  border: none;
  outline: none;
  background-color: white;
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
  color: white;
  cursor: pointer;
  :hover {
    color: ${({ theme }) => theme.color.brandColor50};
  }
`;

const LogoutBtn = styled.button`
  width: 120px;
  height: 40px;
  margin-right: 25px;
  padding: 0;
  border-radius: 50px;
  border: none;
  background-color: white;
  color: #000;
  :hover {
    background-color: ${({ theme }) => theme.color.brandColor100};
    color: #fff;
  }
`;

export default Header;
