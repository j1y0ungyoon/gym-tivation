import React, { useEffect, useState } from 'react';
import { Socket } from 'socket.io';
import io from 'socket.io-client';
import { nanoid } from 'nanoid';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { authService } from '@/firebase';

type ChatLog = {
  id: number;
  msg: string;
  username: string;
};

const Chat = () => {
  const [inputValue, setInputValue] = useState('');
  const [chatLogs, setChatLogs] = useState<ChatLog[]>([
    { id: 1, msg: '전체채팅에 접속하셨습니다.', username: '관리자' },
  ]);
  const [socket, setSocket] = useState<Socket<DefaultEventsMap> | null>(null);
  const [username, setUsername] = useState('user-' + nanoid());

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
    </div>
  );
};

export default Chat;
