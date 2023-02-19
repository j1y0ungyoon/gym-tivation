import React, { useEffect } from 'react';
import io from 'socket.io-client';

const Chat = () => {
  // useEffect 로 처음 접속시 소켓서버 접속
  useEffect(() => {
    // socket.io 접속 함수
    const connectToSocket = async () => {
      await fetch('/api/chat');
      const socket = io();

      socket.on('connect', () => {
        console.log('연결성공!');
      });
    };
    // 소켓서버 접속함수 실행
    connectToSocket();
  }, []);

  return <div>Chatting</div>;
};

export default Chat;
