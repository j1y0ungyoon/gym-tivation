import React, { useEffect, useState } from 'react';
import { Socket } from 'socket.io';
import io from 'socket.io-client';
import { nanoid } from 'nanoid';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';

type ChatLog = {
  id: number;
  msg: string;
  username: string;
};

const Chat = () => {
  const [inputValue, setInputValue] = useState('');
  const [chatLogs, setChatLogs] = useState<ChatLog[]>([
    { id: 1, msg: '어서오세요!', username: 'username' },
  ]);
  const [socket, setSocket] = useState<Socket<DefaultEventsMap> | null>(null);

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
        setChatLogs((prev) => [...prev, chatLog]);
      });
    };
    // 소켓서버 접속함수 실행
    connectToSocket();

    // 소켓 여러번 뚫리는거 방지용
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
      username: 'testUser',
    };

    // "chat" 이름으로 chatLog(채팅내용) 서버로 올려줌
    socket?.emit('chat', chatLog);
    setInputValue('');
  };

  const onChangeInputVlaue = (e: React.ChangeEvent<HTMLInputElement>) => {
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
        onChange={onChangeInputVlaue}
      />
    </div>
  );
};

export default Chat;
