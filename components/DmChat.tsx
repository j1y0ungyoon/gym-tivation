import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { Socket } from 'socket.io';
import { nanoid } from 'nanoid';
import io from 'socket.io-client';
import { authService } from '@/firebase';
import styled from 'styled-components';

type ChatLog = {
  id: number;
  msg: string;
  username: string;
  photoURL?: string | null | undefined;
  roomNum: any;
};

type DmChatProps = {
  roomNum?: string;
};

const DmChat = ({ roomNum }: DmChatProps) => {
  const router = useRouter();
  console.log('roomNum', roomNum);

  const [inputValue, setInputValue] = useState('');
  const [chatLogs, setChatLogs] = useState<ChatLog[]>([
    {
      id: 1,
      msg: `${roomNum}채팅에 접속하셨습니다.`,
      username: '관리자',
      photoURL: authService.currentUser?.photoURL,
      roomNum,
    },
  ]);

  const user = authService.currentUser;
  const username = user?.displayName;
  const anonymousname = 'user-' + nanoid();

  const [socket, setSocket] = useState<Socket<DefaultEventsMap> | null>(null);

  // /room/roomnum 으로 들어온 상태에서 새로고침 해도 잘 돌아가게 해주기
  useEffect(() => {
    router.isReady;
  }, []);

  // useEffect 로 처음 접속시 소켓서버 접속
  useEffect(() => {
    if (router.isReady === false) return;
    // socket.io 접속 함수
    const connectToSocket = async () => {
      await fetch('/api/chat');
      const socket = io();

      setSocket(socket as any);

      // 초기 연결
      socket.on('connect', () => {
        console.log('연결성공!');

        socket.emit('roomEnter', roomNum);
        console.log(roomNum);
      });

      // "chat" 이름으로 받은 chatLogs(채팅내용들) 서버에서 받아옴
      socket.on('chat', (chatLog: any) => {
        if (roomNum === chatLog.roomNum) {
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
  }, [router.isReady, roomNum]);

  // 채팅 전송시 실행 함수
  const postChat = (e: React.KeyboardEvent<EventTarget>) => {
    if (e.key !== 'Enter') return;
    if (inputValue === '') return;

    const chatLog = {
      id: nanoid(),
      msg: (e.target as any).value,
      username: username ? username : anonymousname,
      photoURL: user ? user.photoURL : null,
      roomNum,
    };

    // "chat" 이름으로 chatLog(채팅내용) 서버로 올려줌
    socket?.emit('chat', chatLog);
    setInputValue('');
  };

  const onChangeInputValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  return (
    <DmChatWrapper>
      <DmLogBox>
        {chatLogs?.map((chatLog) => (
          <DmBox key={chatLog?.id}>
            <UserImg src={`${chatLog.photoURL}`} />
            <DmText>
              {chatLog?.username} : {chatLog?.msg}
            </DmText>
          </DmBox>
        ))}
      </DmLogBox>
      <DmInput
        placeholder="채팅을 입력하세요."
        type="text"
        onKeyPress={postChat}
        value={inputValue}
        onChange={onChangeInputValue}
      />
    </DmChatWrapper>
  );
};

const DmChatWrapper = styled.section`
  width: 60%;
  min-width: 400px;
  margin-left: 20px;
  background-color: #ddd;
  padding: 30px;
  border-radius: 20px;
  overflow-y: auto;
`;

const DmLogBox = styled.div`
  max-width: 100%;
  height: calc(100% - 40px);
  overflow-y: auto;
  word-break: break-all;
`;
const DmBox = styled.div`
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
const DmText = styled.span`
  margin: 0;
`;

const DmInput = styled.input`
  width: 100%;
  height: 40px;
  outline: none;
  border: none;
  border-radius: 20px;
  padding: 5px 20px;
  font-size: 0.875rem;
`;
export default DmChat;
