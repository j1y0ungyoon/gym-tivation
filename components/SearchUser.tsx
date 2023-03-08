import { useState } from 'react';
import { query, collection, getDocs, where } from 'firebase/firestore';
import { dbService, authService } from '@/firebase';
import Follow from '@/components/Follow';
import styled from 'styled-components';
import { useQuery } from 'react-query';

const SearchUser = ({
  setSearchOpen,
  searchName,
}: {
  setSearchOpen: (p: boolean) => void;
  searchName: string;
}) => {
  const userUid: any = String(authService.currentUser?.uid);

  const followGet = async () => {
    const q = query(
      collection(dbService, 'profile'),
      where('uid', '==', userUid),
    );
    const data = await getDocs(q);
    return data.docs.map((doc) => doc.data().following);
  };
  const { isLoading: likeLoading, data: follow } = useQuery(
    'follow',
    followGet,
    {
      onSuccess: () => {},
      onError: (error) => {
        console.log('error : ', error);
      },
    },
  );
  const follwoingInformation = String(follow);

  const { isLoading: profileLoading, data: profile } = useQuery('profile');

  return (
    <>
      <UserWrapper>
        {/* <UserClose
          onClick={() => {
            setSearchOpen(false);
          }}
        ></UserClose>
        <UserClose2
          onClick={() => {
            setSearchOpen(false);
          }}
        ></UserClose2> */}
        {searchName.length > 0 &&
          (profile as ProfileItem[])
            .filter(
              (item) =>
                item.displayName?.match(searchName) &&
                authService.currentUser?.uid !== item.id,
            )
            .map((item) => {
              return (
                <Follow
                  key={item.id}
                  item={item}
                  userUid={userUid}
                  follwoingInformation={follwoingInformation}
                />
              );
            })}
      </UserWrapper>
    </>
  );
};

export default SearchUser;

const UserWrapper = styled.div`
  z-index: 1000;
  position: absolute;
  overflow: auto;
  width: 400px;
  max-height: 300px;
  top: 70px;
  border-radius: 10px;
  background-color: white;
  border-style: solid;
  border-width: 1px;
  ::-webkit-scrollbar {
    display: none;
  }
`;

// const UserClose = styled.div`
//   z-index: 1500;
//   width: 66vw;
//   display: block;
//   position: fixed;
//   top: 0;
//   left: 0;
//   right: 0;
//   bottom: 0;
// `;
// const UserClose2 = styled.div`
//   z-index: 1500;
//   display: block;
//   width: 100vw;
//   position: fixed;
//   top: 40vh;
//   left: 0;
//   right: 0;
//   bottom: 0;
//   background-color: black;
// `;
