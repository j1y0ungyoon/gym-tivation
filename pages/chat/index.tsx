import React, { useEffect, useState, useRef } from 'react';
import { Socket } from 'socket.io';
import io from 'socket.io-client';

import { nanoid } from 'nanoid';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { apponentState, roomState } from '@/recoil/dmData';
import { useRecoilState } from 'recoil';

import { authService, dbService } from '@/firebase';
import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  updateDoc,
} from 'firebase/firestore';

import styled from 'styled-components';
import DmChat from '@/components/chat/DmChat';
import { MemoizedDmButton } from '@/components/DmButton';
import { MemoizedDmListUserInfo } from '@/components/chat/DmListUserInfo';
import { useRouter } from 'next/router';
import { useQuery } from 'react-query';
import { getMyDms } from '../api/api';
import Loading from '@/components/common/globalModal/Loading';
import { chatCategoryState } from '@/recoil/chat';

type ChatLog = {
  id: string | undefined;
  msg: string;
  username: string;
  photoURL?: string | null | undefined;
  date?: string;
  roomNum?: string;
};

type DmList = {
  id: string;
  enterUser: string[];
  chatLog: ChatLog[];
};

const Chat = () => {
  const [inputValue, setInputValue] = useState('');
  const [chatLogs, setChatLogs] = useState<ChatLog[]>([]);
  const [socket, setSocket] = useState<Socket<DefaultEventsMap> | null>(null);

  const [roomNum, setRoomNum] = useRecoilState(roomState);
  const [apponentId, setApponentId] = useRecoilState(apponentState);

  const [isMyDmOn, setIsMyDmOn] = useRecoilState(chatCategoryState);

  const [searchValue, setSearchValue] = useState('');
  const [users, setUsers] = useState<any>();

  const user = authService.currentUser;
  const username = user?.displayName;
  const anonymousname = 'user-' + nanoid();
  const chatLogBoxRef = useRef<HTMLDivElement>();
  const router = useRouter();

  // myDms 불러오는 함수
  const { data: myDms, isLoading: myDmsLoading } = useQuery(
    ['myDms', user?.uid],
    getMyDms,
  );

  // 최초에 채팅로그 받아오기
  useEffect(() => {
    if (!user) {
      return;
    }

    // DB에서 챗로그 가져오기
    const chatLogsGetDoc = async () => {
      const chatDoc = await getDoc(
        doc(collection(dbService, 'allChat'), 'allChat'),
      );

      const prevChatLog = chatDoc?.data()?.chatLog;
      setChatLogs(prevChatLog);
    };

    setChatLogs([]);
    chatLogsGetDoc();

    router.isReady;
  }, [user]);

  // useEffect 로 처음 접속시 소켓서버 접속
  useEffect(() => {
    socket?.disconnect();
    // socket.io 접속 함수
    const connectToSocket = async () => {
      await fetch('/api/chat');
      const socket = io();

      setSocket(socket as any);

      // 초기 연결
      socket.on('connect', () => {});

      // "chat" 이름으로 받은 chatLogs(채팅내용들) 서버에서 받아옴
      socket.on('chat', (chatLog: any) => {
        // 만약 전체채팅이 아니면 return
        if (!chatLog.roomNum) {
          setChatLogs((prev) => {
            if (!prev) {
              return [chatLog];
            } else {
              return [...prev, chatLog];
            }
          });
        }
      });
    };

    // 소켓서버 접속함수 실행
    connectToSocket();

    //  채팅 여러번 써지는거 방지.. 인데 이게 안되네(개발버전에서 저장을 하면 렌더링이 다시 되는데 이때 socket.on 으로 chatLogs 를 서버에서 받아오는게 두번 실행되어 두번씩 보임)
    return () => {
      socket?.disconnect();
    };
  }, [roomNum]);

  const scrollToBottom = () => {
    if (chatLogBoxRef.current) {
      chatLogBoxRef.current.scrollTop = chatLogBoxRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatLogs]);

  // 채팅 전송시 실행 함수
  const postChat = async (e: any) => {
    e.preventDefault();
    if (inputValue === '') return;

    // 날짜 추가
    const time = new Date().toLocaleTimeString('ko-KR');

    const chatLog = {
      id: user?.uid,
      msg: inputValue,
      username: username ? username : anonymousname,
      photoURL: user ? user.photoURL : null,
      date: time,
    };

    await updateDoc(doc(dbService, 'allChat', 'allChat'), {
      chatLog: arrayUnion({
        id: user?.uid,
        msg: chatLog.msg,
        username: chatLog.username,
        photoURL: chatLog.photoURL,
        date: chatLog.date,
      }),
    });

    // "chat" 이름으로 chatLog(채팅내용) 서버로 올려
    socket?.emit('chat', chatLog);
    setInputValue('');
  };

  const onChangeInputValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  useEffect(() => {
    const getUsers = () => {
      const q = query(collection(dbService, 'profile'));
      onSnapshot(q, (snapshot) => {
        const data = snapshot.docs.map((doc) => {
          const data = {
            id: doc.id,
            ...doc.data(),
          };
          return data;
        });
        setUsers(data);
      });
    };
    getUsers();
  }, []);

  const onClickDmUser = (enterUser: any) => {
    enterUser.forEach((id: string) => {
      if (id !== user?.uid) {
        setApponentId(id);
      }
    });
  };

  if (myDmsLoading) {
    return <Loading />;
  }

  return (
    <ChatWrapper>
      <ChatContainer>
        {isMyDmOn ? (
          <CategoryContainer>
            <CategoryBtn onClick={() => setIsMyDmOn(false)}>All</CategoryBtn>
            <ActivatedCategoryBtn
              onClick={() => {
                setIsMyDmOn(true);
              }}
            >
              DM
            </ActivatedCategoryBtn>
          </CategoryContainer>
        ) : (
          <CategoryContainer>
            <ActivatedCategoryBtn onClick={() => setIsMyDmOn(false)}>
              All
            </ActivatedCategoryBtn>
            <CategoryBtn
              onClick={() => {
                setIsMyDmOn(true);
              }}
            >
              DM
            </CategoryBtn>
          </CategoryContainer>
        )}
        {isMyDmOn ? (
          <DmContainer>
            <MyDmListContainer>
              <SearchWrapper>
                <SearchBar>
                  <SearchIcon
                    alt="찾기 버튼"
                    src="/assets/icons/searchIcon.svg"
                  />
                  {user ? (
                    <SearchInput
                      onChange={(e) => setSearchValue(e.target.value)}
                      value={searchValue}
                      placeholder={'메세지를 보낼 사람을 검색하세요.'}
                    />
                  ) : (
                    <SearchInput
                      placeholder="로그인 후 이용 가능합니다."
                      disabled
                    />
                  )}
                  {searchValue.length > 0 ? (
                    <SearchCancel
                      alt="검색 취소 버튼"
                      src={'/assets/icons/closeBtn.svg'}
                      onClick={() => {
                        setSearchValue('');
                      }}
                    />
                  ) : null}
                </SearchBar>
                {searchValue.length > 0 ? (
                  <SearchResultWrapper>
                    {users
                      .filter(
                        (item: any) =>
                          item.displayName?.match(searchValue) &&
                          authService.currentUser?.uid !== item.id,
                      )
                      .map((item: any) => {
                        return (
                          <SearchResult key={item.id}>
                            <UserInfo>
                              <UserImg
                                src={`${item.photoURL}`}
                                onClick={(e) => {
                                  return router.push(`/myPage/${item.id}`);
                                }}
                              />
                              <UserName>{item.displayName}</UserName>
                            </UserInfo>
                            <MemoizedDmButton id={item.id} />
                          </SearchResult>
                        );
                      })}
                  </SearchResultWrapper>
                ) : null}
              </SearchWrapper>

              {myDms?.map((dmList: any) => {
                return (
                  <MyDmListBox key={nanoid()}>
                    {dmList.enterUser?.includes(`${user?.uid}`) ? (
                      <MyDmList
                        onClick={() => {
                          onClickDmUser(dmList.enterUser);
                          setRoomNum(dmList.id);
                        }}
                      >
                        {dmList.enterUser.map((enterUser: any) => {
                          if (enterUser !== authService.currentUser?.uid) {
                            return (
                              <MemoizedDmListUserInfo
                                enterUser={enterUser}
                                key={nanoid()}
                              />
                            );
                          }
                        })}
                      </MyDmList>
                    ) : null}
                  </MyDmListBox>
                );
              })}
            </MyDmListContainer>
            <DmChat />
          </DmContainer>
        ) : (
          <ChattingContainer>
            <ChatLogBox ref={chatLogBoxRef}>
              {chatLogs?.map((chatLog) => (
                <ChatBox key={nanoid()}>
                  <UserImg
                    alt="유저 이미지"
                    src={`${chatLog.photoURL}`}
                    onClick={(e) => {
                      return router.push(`/myPage/${chatLog.id}`);
                    }}
                  />
                  <div>
                    <ChatName>{chatLog.username}</ChatName>
                    <ChatText>{chatLog.msg}</ChatText>
                    <ChatTime>{chatLog.date}</ChatTime>
                  </div>
                </ChatBox>
              ))}
            </ChatLogBox>

            {user ? (
              <ChatInputContainer>
                <UserImg alt="유저이미지" src={`${user?.photoURL}`} />
                <ChatInputBox onSubmit={(e) => postChat(e)}>
                  <ChatInput
                    placeholder="채팅을 입력하세요."
                    type="text"
                    value={inputValue}
                    onChange={onChangeInputValue}
                  />
                  <MessageBtn type="submit">
                    <MessageIcon src="/assets/icons/myPage/DM.svg" />
                  </MessageBtn>
                </ChatInputBox>
              </ChatInputContainer>
            ) : (
              <ChatInputBox>
                <ChatInput placeholder="로그인 후 이용 가능합니다." disabled />
              </ChatInputBox>
            )}
          </ChattingContainer>
        )}
      </ChatContainer>
    </ChatWrapper>
  );
};

const ChatWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  ${({ theme }) => theme.mainLayout.wrapper}
`;

const ChatContainer = styled.div`
  ${({ theme }) => theme.mainLayout.container}
  height: calc(100% - 40px);
`;

const DmContainer = styled.div`
  display: flex;
  width: 100%;
  height: calc(100vh - 200px);
`;

const MyDmListContainer = styled.section`
  width: 40%;
  min-width: 240px;
  background-color: #fff;
  padding: 30px 40px;
  border: 1px solid black;
  border-radius: ${({ theme }) => theme.borderRadius.radius100};
  overflow-y: auto;
  box-shadow: -2px 2px 0px 1px #000000;
`;

const SearchWrapper = styled.div`
  position: relative;
`;

const SearchBar = styled.div`
  width: 100%;
  height: 40px;
  margin: 0 0 32px 0;
  background-color: #fff;
  border: 1px solid black;
  border-radius: 25px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const SearchInput = styled.input`
  width: calc(100% - 65px);
  height: 30px;
  margin-right: 10px;
  border: none;
  outline: none;
  background-color: #fff;
`;
const SearchCancel = styled.img`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 12px;
  height: 12px;
  margin-right: 20px;
  cursor: pointer;
`;
const SearchIcon = styled.img`
  width: 20px;
  margin-right: 5px;
  margin-left: 20px;
`;
const MessageBtn = styled.button`
  background-color: transparent;
  border: none;
`;
const MessageIcon = styled.img`
  width: 20px;
  margin: 5px;
  cursor: pointer;
`;

const SearchResultWrapper = styled.div`
  width: 100%;
  margin-top: -20px;
  background-color: #fffcf3;
  position: absolute;
  z-index: 2;
  border: 1px solid #999;
  border-radius: 16px;
  padding: 0 24px;
`;
const SearchResult = styled.div`
  padding: 20px 0px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #999;

  :last-child {
    border-bottom: none;
  }
`;
const MyDmListBox = styled.div`
  border-bottom: 1px solid #d9d9d9;
  :last-child {
    border-bottom: none;
  }
`;
const MyDmList = styled.div`
  background-color: #fff;
  padding: 10px;
  border-radius: 10px;
  text-decoration: none;
  cursor: pointer;
  margin: 10px 0;
  :hover {
    background-color: ${({ theme }) => theme.color.brandColor50};
  }
`;

const ChattingContainer = styled.section`
  background-color: #fff;
  border: 1px solid black;
  border-radius: ${({ theme }) => theme.borderRadius.radius100};
  padding: 60px;
  width: 100%;
  height: calc(100vh - 200px);
  box-shadow: -2px 2px 0px 1px #000000;
`;

const ChatLogBox = styled.div<any>`
  max-width: 100%;
  height: calc(100% - 30px);
  overflow-y: auto;
  word-break: break-all;

  ::-webkit-scrollbar {
    width: 8px;
  }
  ::-webkit-scrollbar-thumb {
    background-color: #000;
    border-radius: 10px;
  }
  ::-webkit-scrollbar-track {
    background-color: transparent;
    border-radius: 10px;
    margin-bottom: 20px;
  }
`;

const ChatBox = styled.div`
  display: flex;
  margin-bottom: 20px;
`;
const UserInfo = styled.div`
  display: flex;
  align-items: center;
`;
const UserImg = styled.img`
  min-width: 40px;
  width: 40px;
  min-height: 40px;
  height: 40px;
  border-radius: 50px;
  margin-right: 10px;
  cursor: pointer;
`;
const UserName = styled.span`
  font-size: 16px;
`;

const ChatName = styled.div`
  font-weight: bold;
  font-size: 14px;
`;

const ChatText = styled.span`
  display: block;
  margin: 0;
  font-size: 14px;
`;

const ChatTime = styled.span`
  font-size: 12px;
  color: gray;
  margin: 0;
`;
const ChatInputContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
`;
const ChatInputBox = styled.form`
  width: 100%;
  padding: 0 20px;
  display: flex;
  align-items: center;
  border: 1px solid black;
  border-radius: 50px;
`;

const ChatInput = styled.input`
  width: 100%;
  height: 48px;
  outline: none;
  border: none;
  padding: 5px 0;
  font-size: 0.875rem;
  ::placeholder {
    font-size: 14px;
  }
`;

const CategoryContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: left;
  align-items: flex-start;
`;

const CategoryBtn = styled.button`
  ${({ theme }) => theme.btn.category}
  box-shadow: -2px 2px 0px 1px #000000;

  margin-bottom: 20px;
  margin-right: 10px;
  :hover {
    background-color: ${({ theme }) => theme.color.brandColor50};
    color: black;
  }
`;
const ActivatedCategoryBtn = styled.button`
  ${({ theme }) => theme.btn.category}
  background-color: ${({ theme }) => theme.color.brandColor100};
  color: white;
  box-shadow: -2px 2px 0px 1px #000000;

  margin-bottom: 20px;
  margin-right: 10px;
`;

export default Chat;
