import React, { useEffect, useState } from 'react';
import { Socket } from 'socket.io';
import io from 'socket.io-client';

import { nanoid } from 'nanoid';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';

import { authService, dbService } from '@/firebase';
import {
  addDoc,
  collection,
  getDocs,
  onSnapshot,
  query,
} from 'firebase/firestore';

import styled from 'styled-components';
import DmChat from '@/components/DmChat';

type ChatLog = {
  id: string | undefined;
  msg: string;
  username: string;
  photoURL?: string | null | undefined;
  date?: string;
};

type DmList = {
  id: string;
  enterUser: string[];
  chatLog: string[];
};

const Chat = () => {
  const [inputValue, setInputValue] = useState('');
  const [chatLogs, setChatLogs] = useState<ChatLog[]>([
    {
      id: authService.currentUser?.uid,
      msg: '전체채팅에 접속하셨습니다.',
      username: '관리자',
      photoURL: authService.currentUser?.photoURL,
    },
  ]);
  const [socket, setSocket] = useState<Socket<DefaultEventsMap> | null>(null);
  const [dmLists, setDmLists] = useState<any>();
  const [roomNum, setRoomNum] = useState<string | undefined>();

  const [isMyDmOn, setIsMyDmOn] = useState(false);

  const user = authService.currentUser;
  const username = user?.displayName;
  const anonymousname = 'user-' + nanoid();

  // useEffect 로 처음 접속시 소켓서버 접속
  useEffect(() => {
    // socket.io 접속 함수
    const connectToSocket = async () => {
      await fetch('/api/chat');
      const socket = io();

      setSocket(socket as any);

      // 초기 연결
      socket.on('connect', () => {
        console.log('연결성공!');
      });

      // "chat" 이름으로 받은 chatLogs(채팅내용들) 서버에서 받아옴
      socket.on('chat', (chatLog: any) => {
        // 만약 전체채팅이 아니면 return
        if (!chatLog.roomNum) {
          setChatLogs((prev) => [...prev, chatLog]);
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

  // 채팅 전송시 실행 함수
  const postChat = async (e: React.KeyboardEvent<EventTarget>) => {
    if (e.key !== 'Enter') return;
    if (inputValue === '') return;

    // 날짜 추가
    const newDate = new Date();

    const hours = newDate.getHours(); // 시
    const minutes = newDate.getMinutes(); // 분
    const seconds = newDate.getSeconds(); // 초
    const time = `${hours}:${minutes}:${seconds}`;

    const chatLog = {
      id: nanoid(),
      msg: (e.target as any).value,
      username: username ? username : anonymousname,
      photoURL: user ? user.photoURL : null,
      date: time,
    };

    // "chat" 이름으로 chatLog(채팅내용) 서버로 올려줌
    socket?.emit('chat', chatLog);
    setInputValue('');
  };

  const onChangeInputValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  // 처음에 dms 불러오는 함수
  useEffect(() => {
    onSnapshot(query(collection(dbService, 'dms')), (snapshot: any) => {
      const dms = snapshot.docs.map((doc: any) => ({
        id: doc.id,
        ...doc.data(),
      }));
      const myDms = dms.filter((dm: any) => {
        if (dm.enterUser) {
          if ((dm.enterUser[0] || dm.enterUser[1]) === user?.uid) {
            return dm;
          }
        }
      });
      setDmLists([...myDms]);
    });
  }, []);

  const onClickDm = async () => {
    dmLists.filter((dmList: DmList) => {
      if (
        dmList.id ===
        (user?.uid + 'DM보낼 상대 id' || 'DM보낼 상대 id' + user?.uid)
      ) {
        setRoomNum(dmList.id);
        return;
      } else {
        addDoc(collection(dbService, 'dms'), {
          id: user?.uid + 'DM보낼 상대 id',
          enterUser: [user?.uid, 'DM보낼 상대 id'],
          chatLog: [],
        });
        setRoomNum(user?.uid + 'DM보낼 상대 id');
        return;
      }
    });
  };

  return (
    <ChatWrapper>
      <CategoryContainer>
        <CategoryBtn onClick={() => setIsMyDmOn(false)}>All</CategoryBtn>
        <CategoryBtn
          onClick={() => {
            setIsMyDmOn(true);
            if (dmLists.length === 0) {
              addDoc(collection(dbService, 'dms'), {
                id: user?.uid,
                enterUser: [user?.uid, '나와의채팅'],
                chatLog: [],
              });
              setRoomNum(user?.uid);
              return;
            }
            setRoomNum(user?.uid);
          }}
        >
          DM
        </CategoryBtn>
        <CategoryBtn
          onClick={() => {
            onClickDm();
          }}
        >
          DM 로직
        </CategoryBtn>
      </CategoryContainer>

      {isMyDmOn ? (
        <DmContainer>
          <MyDmListBox>
            <SearchBar>
              <SearchInput />
              <SearchIcon src="/assets/icons/searchIcon.png" />
            </SearchBar>
            {dmLists?.map((dmList: DmList) => {
              return (
                <div key={dmList.id}>
                  {dmList.enterUser?.includes(`${user?.uid}`) ? (
                    <MyDmList onClick={() => setRoomNum(dmList.id)}>
                      {dmList.enterUser.map((enterUser) => {
                        if (enterUser !== user?.uid) {
                          return enterUser;
                        }
                      })}
                    </MyDmList>
                  ) : null}
                </div>
              );
            })}
          </MyDmListBox>
          <DmChat roomNum={roomNum} />
        </DmContainer>
      ) : (
        <ChatContainer>
          <ChatLogBox>
            {chatLogs.map((chatLog) => (
              <ChatBox key={chatLog.id}>
                <UserImg src={`${chatLog.photoURL}`} />
                <div>
                  <ChatName>{chatLog.username}</ChatName>
                  <ChatText>{chatLog.msg}</ChatText>
                  <ChatTime>{chatLog.date}</ChatTime>
                </div>
              </ChatBox>
            ))}
          </ChatLogBox>

          <ChatInput
            placeholder="채팅을 입력하세요."
            type="text"
            onKeyPress={postChat}
            value={inputValue}
            onChange={onChangeInputValue}
          />
        </ChatContainer>
      )}
    </ChatWrapper>
  );
};

const ChatWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  width: 100%;
  max-height: 100%;
  padding: 30px;
  background-color: #eee;
`;

const DmContainer = styled.div`
  display: flex;
  width: 100%;
  height: calc(100vh - 200px);
`;

const MyDmListBox = styled.section`
  width: 40%;
  min-width: 240px;
  background-color: #ddd;
  padding: 10px 20px;
  border-radius: 20px;
  overflow-y: auto;
`;

const SearchBar = styled.div`
  width: 100%;
  height: 50px;
  margin: 10px 0 20px 0;
  background-color: #eee;
  border-radius: 25px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const SearchInput = styled.input`
  width: calc(100% - 65px);
  height: 40px;
  margin-left: 20px;
  border: none;
  outline: none;
  background-color: #eee;
`;

const SearchIcon = styled.img`
  width: 20px;
  margin-right: 20px;
  margin-left: 5px;
`;

const MyDmList = styled.div`
  background-color: #ccc;
  padding: 10px;
  border-radius: 10px;
  text-decoration: none;
  cursor: pointer;
  margin: 10px 0;
`;

const ChatContainer = styled.section`
  background-color: #ddd;
  border-radius: 20px;
  padding: 30px;
  width: 100%;
  height: calc(100vh - 200px);
`;

const ChatLogBox = styled.div`
  max-width: 100%;
  height: calc(100% - 30px);
  overflow-y: auto;
  word-break: break-all;
`;

const ChatBox = styled.div`
  display: flex;
  margin-bottom: 16px;
`;

const UserImg = styled.img`
  width: 50px;
  height: 50px;
  border: 1px solid black;
  border-radius: 50px;
  margin-right: 10px;
`;

const ChatName = styled.div`
  font-weight: bold;
`;

const ChatText = styled.span`
  display: block;
  margin: 0;
`;

const ChatTime = styled.span`
  font-size: 0.875rem;
  color: gray;
  margin: 0;
`;

const ChatInput = styled.input`
  width: 100%;
  height: 40px;
  outline: none;
  border: none;
  border-radius: 20px;
  padding: 5px 20px;
  font-size: 0.875rem;
`;

const CategoryContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: left;
  align-items: flex-start;
`;

const CategoryBtn = styled.button`
  width: 120px;
  height: 40px;
  padding: 0;
  margin-bottom: 20px;
  margin-right: 10px;

  border-radius: 50px;
  border: none;
  background-color: #d9d9d9;
  color: #000;
  :hover {
    background-color: #000;
    color: #fff;
  }
`;

export default Chat;
