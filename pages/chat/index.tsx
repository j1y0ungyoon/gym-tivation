import React, { useEffect, useState } from 'react';
import { Socket } from 'socket.io';
import io from 'socket.io-client';
import { nanoid } from 'nanoid';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { authService } from '@/firebase';
import Link from 'next/link';
import { addDoc, collection, getDocs, query } from 'firebase/firestore';
import { dbService } from '@/firebase';
import { type } from 'os';

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
  const [username, setUsername] = useState('user-' + nanoid());
  const [dmLists, setDmLists] = useState<any>();

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

  // 처음에 dms 불러오는 함수
  useEffect(() => {
    const getDmList = async () => {
      const q = await getDocs(query(collection(dbService, 'dms')));

      const dms = q.docs.map((doc) => {
        return doc.data();
      });

      setDmLists([...dms]);
    };
    getDmList();
  }, []);

  console.log(dmLists);

  // 채팅 전송시 실행 함수
  const postChat = (e: React.KeyboardEvent<EventTarget>) => {
    if (e.key !== 'Enter') return;
    if (inputValue === '') return;

    const chatLog = {
      id: nanoid(),
      msg: (e.target as any).value,
      username: authService.currentUser?.displayName
        ? authService.currentUser.displayName
        : username,
    };

    // "chat" 이름으로 chatLog(채팅내용) 서버로 올려줌
    socket?.emit('chat', chatLog);
    setInputValue('');
  };

  const onChangeInputValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const onClickDm = () => {
    addDoc(collection(dbService, 'dms'), {
      id: authService.currentUser?.uid + 'DM보낼 상대 id',
      enterUser: [authService.currentUser?.uid, 'DM보낼 상대 id'],
      chatLog: [],
    });
  };

  return (
    <div>
      <h1>Chatting</h1>

      <div>
        {chatLogs.map((chatLog) => (
          <div key={chatLog.id}>
            <p>
              {chatLog.username} : {chatLog.msg}
            </p>
          </div>
        ))}
      </div>

      <input
        type="text"
        onKeyPress={postChat}
        value={inputValue}
        onChange={onChangeInputValue}
      />

      <br />
      <br />

      <Link
        href={`/chat/room/${authService.currentUser?.uid + 'DM보낼 상대 id'}`}
        onClick={() => {
          onClickDm();
        }}
      >
        <button>DM 로직 버튼</button>
      </Link>

      <div>
        {dmLists.map((dmList: DmList) => {
          return (
            <div key={dmList.id}>
              {dmList.enterUser[0] ||
              dmList.enterUser[1] === authService.currentUser?.uid ? (
                <p>{dmList.id}</p>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Chat;
