import { authService, dbService } from '@/firebase';
import { doc, updateDoc, query, collection, getDocs } from 'firebase/firestore';
import { useState } from 'react';
import SearchUser from '../SearchUser';
import { useRouter } from 'next/router';
import React from 'react';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import useModal from '@/hooks/useModal';
import { GLOBAL_MODAL_TYPES } from '@/recoil/modalState';
import { useQuery } from 'react-query';
import { useRecoilState } from 'recoil';
import { navMenuState } from '@/recoil/navMenu';

const Header = ({ isLoggedIn }: { isLoggedIn: boolean }) => {
  const router = useRouter();
  const { showModal } = useModal();

  const [searchOpen, setSearchOpen] = useState<Boolean>(false);
  const [searchName, setSearchName] = useState<string>('');

  const [nowMenu, setNowMenu] = useRecoilState(navMenuState);

  const user = authService.currentUser;

  const onLogout = async () => {
    try {
      if (user !== null) {
        await updateDoc(doc(dbService, 'profile', user.uid), {
          loginState: false,
        });
        router.push('/');
        authService.signOut();
        // showModal({
        //   modalType: GLOBAL_MODAL_TYPES.LoginRequiredModal,
        //   modalProps: { contentText: '로그아웃 되었습니다!' },
        // });
      }
    } catch {
      (error: any) => {
        toast.warn(error);
      };
    }
  };
  const getProfile = async () => {
    const q = query(collection(dbService, 'profile'));
    const data = await getDocs(q);
    return data.docs.map((doc: any) => ({
      id: doc.id,
      ...doc.data(),
    }));
  };

  const { isLoading, data: profile } = useQuery('profile', getProfile, {
    onSuccess: () => {},
    onError: (error) => {
      console.log('error : ', error);
    },
  });
  const id = authService.currentUser?.uid;
  const goToDetailMyPage = (id: any) => {
    router.push({
      pathname: `/myPage/${id}`,
      query: { id },
    });
  };

  return (
    <HeaderWrapper>
      <Logo
        onClick={() => {
          router.push('/');
          setNowMenu('home');
        }}
        src="/assets/images/Logo.png"
      />

      <Itembox>
        <SearchBar>
          <SearchIcon src="/assets/icons/searchIcon.svg" />
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
            placeholder="유저를 검색해주세요"
          />
          {searchOpen && searchName.length > 0 && (
            <SearchClose
              src="/assets/icons/closeBtn.svg"
              onClick={() => {
                setSearchOpen(false);
                setSearchName('');
              }}
            />
          )}
        </SearchBar>
        {searchOpen && (
          <SearchUser setSearchOpen={setSearchOpen} searchName={searchName} />
        )}
        <>
          {authService.currentUser && (
            <UserBox
              onClick={() => {
                goToDetailMyPage(id);
              }}
            >
              <ProfilePhoto>
                {authService.currentUser?.photoURL && (
                  <Photo src={authService.currentUser?.photoURL} />
                )}
              </ProfilePhoto>
              <TextBox>
                <FollowText>{authService.currentUser?.displayName}</FollowText>
              </TextBox>
            </UserBox>
          )}
        </>
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
  width: 400px;
  height: 40px;
  margin-right: 80px;
  background-color: #ddd;
  border-radius: 25px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-right: 20px;
  background-color: white;
`;

const SearchInput = styled.input`
  width: 400px;
  height: 40px;
  margin-right: 20px;
  border: none;
  outline: none;
  background-color: white;
`;

const SearchIcon = styled.img`
  width: 20px;
  margin-left: 15px;
  margin-right: 8px;
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
const SearchClose = styled.img`
  font-size: 16px;
  margin-right: 16px;
  :hover {
    cursor: pointer;
  }
`;

const ProfilePhoto = styled.div`
  width: 40px;
  height: 40px;
  margin-right: 16px;
  border-radius: 70%;
  overflow: hidden;
  background-color: black;
`;
const Photo = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;
const FollowText = styled.span`
  color: white;
  font-size: 16px;

  text-align: center;
  font-weight: bolder;
`;

const TextBox = styled.div`
  text-align: left;
  margin-top: 8px;
`;

const UserBox = styled.div`
  display: flex;
  margin-left: 26px;
  margin-right: 36px;

  :hover {
    cursor: pointer;
  }
`;

export default Header;
