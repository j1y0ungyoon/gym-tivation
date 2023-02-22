import React, { useEffect, useState } from 'react';
import { Socket } from 'socket.io';
import io from 'socket.io-client';

import { nanoid } from 'nanoid';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';

import { authService, dbService } from '@/firebase';
import { addDoc, collection, getDocs, query } from 'firebase/firestore';

import Link from 'next/link';
import styled from 'styled-components';
import { useRouter } from 'next/router';

type ChatLog = {
  id: number;
  msg: string;
  username: string;
};

type DmList = {
  id: string;
  enterUser: string[];
  chatLog: string[];
};

const Chat = () => {
  const [inputValue, setInputValue] = useState('');
  const [chatLogs, setChatLogs] = useState<ChatLog[]>([
    { id: 1, msg: '전체채팅에 접속하셨습니다.', username: '관리자' },
  ]);
  const [socket, setSocket] = useState<Socket<DefaultEventsMap> | null>(null);
  const [dmLists, setDmLists] = useState<any>();

  const [isMyDmOn, setIsMyDmOn] = useState(false);

  const user = authService.currentUser;
  const username = user?.displayName;
  const anonymousname = 'user-' + nanoid();

  const router = useRouter();

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
  }, []);

  // 채팅 전송시 실행 함수
  const postChat = (e: React.KeyboardEvent<EventTarget>) => {
    if (e.key !== 'Enter') return;
    if (inputValue === '') return;

    const chatLog = {
      id: nanoid(),
      msg: (e.target as any).value,
      username: username ? username : anonymousname,
    };

    // "chat" 이름으로 chatLog(채팅내용) 서버로 올려줌
    socket?.emit('chat', chatLog);
    setInputValue('');
  };

  // 처음에 dms 불러오는 함수
  useEffect(() => {
    const getDmList = async () => {
      const q = await getDocs(query(collection(dbService, 'dms')));

      const dms = q.docs.map((doc) => {
        return doc.data();
      });

      const myDms = dms.filter((dm) => {
        if ((dm.enterUser[0] || dm.enterUser[1]) === user?.uid) {
          return dm;
        }
      });

      setDmLists([...myDms]);
    };
    getDmList();
  }, []);

  const onChangeInputValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const onClickDm = () => {
    dmLists.filter((dmList: DmList) => {
      if (
        dmList.id ===
        (user?.uid + 'DM보낼 상대 id' || 'DM보낼 상대 id' + user?.uid)
      ) {
        return;
      } else {
        addDoc(collection(dbService, 'dms'), {
          id: user?.uid + 'DM보낼 상대 id',
          enterUser: [user?.uid, 'DM보낼 상대 id'],
          chatLog: [],
        });
      }
    });

    router.push(`/chat/room/${user?.uid + 'DM보낼 상대 id'}`);
  };

  return (
    <ChatWrapper>
      <TEST>
        <CategoryBtn
          onClick={() => {
            onClickDm();
          }}
        >
          DM 버튼
        </CategoryBtn>
      </TEST>
      <CategoryContainer>
        <CategoryBtn onClick={() => setIsMyDmOn(false)}>All</CategoryBtn>
        <CategoryBtn onClick={() => setIsMyDmOn(true)}>DM</CategoryBtn>
      </CategoryContainer>

      {isMyDmOn ? (
        <div>
          {dmLists?.map((dmList: DmList) => {
            return (
              <div key={dmList.id}>
                {dmList.enterUser[0] || dmList.enterUser[1] === user?.uid ? (
                  <Link href={`/chat/room/${dmList.id}`}>
                    <button>{dmList.id}</button>
                  </Link>
                ) : null}
              </div>
            );
          })}
        </div>
      ) : (
        <ChatContainer>
          <ChatLogBox>
            {chatLogs.map((chatLog) => (
              <ChatBox key={chatLog.id}>
                <UserImg src={`${user?.photoURL}`} />
                <p>
                  {chatLog.username} : {chatLog.msg}
                </p>
              </ChatBox>
            ))}
          </ChatLogBox>

          <ChatInput
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
  border: 3px solid blue;
`;

const ChatContainer = styled.div`
  background-color: #add;
  padding: 30px;
  width: 100%;
`;

const ChatLogBox = styled.div`
  max-width: 100%;
  height: 670px;
  overflow-y: auto;
  word-break: break-all;
`;

const ChatBox = styled.div`
  display: flex;
`;

const UserImg = styled.img`
  width: 50px;
  height: 50px;
  border: 1px solid black;
  border-radius: 50px;
  margin-right: 10px;
`;

const ChatInput = styled.input`
  margin-top: 30px;
  width: 100%;
  height: 30px;
`;

const TEST = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const CategoryContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: left;
  align-items: flex-start;
`;

const CategoryBtn = styled.button`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  width: 140px;
  height: 40px;

  border-radius: 10px;
  background-color: #ddd;
  font-size: 1rem;
  text-decoration: none;
`;

export default Chat;
