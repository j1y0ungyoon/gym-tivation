import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { Socket } from 'socket.io';
import { nanoid } from 'nanoid';
import io from 'socket.io-client';
import { authService, dbService } from '@/firebase';
import styled from 'styled-components';
import {
  collection,
  doc,
  getDocs,
  where,
  query,
  updateDoc,
  arrayUnion,
} from 'firebase/firestore';
import { useRecoilState } from 'recoil';
import { roomState } from '@/recoil/dmData';

type ChatLog = {
  id?: number;
  msg?: string;
  username?: string;
  photoURL?: string | null | undefined;
  date?: string;
  roomNum?: string;
};

type DmTextProps = {
  user?: string;
};

const DmChat = () => {
  const router = useRouter();

  const [dmInputValue, setDmInputValue] = useState('');
  const [chatLogs, setChatLogs] = useState<ChatLog[]>([]);
  const [roomNum, setRoomNum] = useRecoilState(roomState);

  const user = authService.currentUser;
  const username = user?.displayName;

  const dmLogBoxRef = useRef<HTMLDivElement>();

  const [socket, setSocket] = useState<Socket<DefaultEventsMap> | null>(null);

  const [chatId, setChatId] = useState('');

  // 처음에 채팅로그 받아오기
  useEffect(() => {
    // DB에서 roomNum 과 같은 doc의 id 받아와서 chatId에 입력해줌
    const getDocId = async () => {
      const data = await getDocs(
        query(collection(dbService, 'dms'), where('id', '==', roomNum)),
      );
      data.docs.map((doc) => {
        if (doc.data().id == roomNum) {
          return setChatId(doc.id);
        }
      });
    };

    // DB에서 챗로그 가져오기
    const chatLogsGetDoc = async () => {
      const chatDoc = await getDocs(
        query(collection(dbService, 'dms'), where('id', '==', roomNum)),
      );

      const prevChatLog = chatDoc?.docs[0]?.data().chatLog;
      setChatLogs(prevChatLog);
    };

    // roomNum 바뀔때마다 챗로그 비우고, DB에서 채팅로그 받아옴
    setChatLogs([]);
    if (roomNum) {
      getDocId();
      chatLogsGetDoc();
    }
    router.isReady;
  }, [roomNum]);

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
      });

      // "chat" 이름으로 받은 chatLogs(채팅내용들) 서버에서 받아옴
      socket.on('chat', (chatLog: any) => {
        if (roomNum === chatLog.roomNum) {
          setChatLogs((prev) => {
            if (prev) {
              return [...prev, chatLog];
            } else {
              return [chatLog];
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
  }, [router.isReady, roomNum]);

  const scrollToBottom = () => {
    if (dmLogBoxRef.current) {
      dmLogBoxRef.current.scrollTop = dmLogBoxRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatLogs]);

  // 채팅 전송시 실행 함수
  const postChat = async (e: React.KeyboardEvent<EventTarget>) => {
    if (e.key !== 'Enter') return;
    if (dmInputValue === '') return;

    // 날짜 추가
    const newDate = new Date();

    const hours = newDate.getHours(); // 시
    const minutes = newDate.getMinutes(); // 분
    const seconds = newDate.getSeconds(); // 초
    const time = `${hours}:${minutes}:${seconds}`;

    const chatLog = {
      id: nanoid(),
      msg: (e.target as any).value,
      username: username,
      photoURL: user?.photoURL,
      date: time,
      roomNum,
    };

    await updateDoc(doc(dbService, 'dms', chatId), {
      chatLog: arrayUnion({
        id: chatId,
        msg: chatLog.msg,
        username: chatLog.username,
        photoURL: chatLog.photoURL,
        date: chatLog.date,
        roomNum: chatLog.roomNum,
      }),
    });

    // "chat" 이름으로 chatLog(채팅내용) 서버로 올려줌
    socket?.emit('chat', chatLog);
    setDmInputValue('');
  };

  const onChangeInputValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDmInputValue(e.target.value);
  };

  return (
    <DmChatWrapper>
      <DmLogBox ref={dmLogBoxRef}>
        {/* <DmBox>
          <UserImg src={`${authService.currentUser?.photoURL}`} />
          <div>
            <DmName>{username}</DmName>
            <DmText>{roomNum}방에 입장하셨습니다.</DmText>
          </div>
        </DmBox> */}
        {chatLogs?.map((chatLog) => (
          <DmBox key={nanoid()}>
            <UserImg src={`${chatLog.photoURL}`} />
            <div>
              <DmName>{chatLog?.username}</DmName>
              <DmText user={user?.uid}>{chatLog?.msg}</DmText>
              <DmTime>{chatLog.date}</DmTime>
            </div>
          </DmBox>
        ))}
      </DmLogBox>
      <DmInput
        placeholder="채팅을 입력하세요."
        type="text"
        onKeyPress={postChat}
        value={dmInputValue}
        onChange={onChangeInputValue}
      />
    </DmChatWrapper>
  );
};

const DmChatWrapper = styled.section`
  width: 60%;
  min-width: 400px;
  margin-left: 20px;
  background-color: #fff;
  padding: 20px;
  border: 1px solid black;
  border-radius: ${({ theme }) => theme.borderRadius.radius100};
  overflow-y: auto;
`;

const DmLogBox = styled.div<any>`
  max-width: 100%;
  height: calc(100% - 50px);
  overflow-y: auto;
  word-break: break-all;
  padding-right: 10px;

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
const DmBox = styled.div`
  display: flex;
  margin-bottom: 20px;
`;
const UserImg = styled.img`
  min-width: 40px;
  width: 40px;
  min-height: 40px;
  height: 40px;
  border-radius: 50px;
  margin-right: 10px;
`;
const DmName = styled.div`
  font-weight: bold;
  font-size: 14px;
  margin-bottom: 4px;
`;
const DmText = styled.div<DmTextProps>`
  border-radius: 0 20px 20px 20px;
  padding: 10px 20px;
  border: 1px solid black;
  display: block;
  margin: 0;
  font-size: 14px;
  background-color: ${({ user }) =>
    user === authService.currentUser?.uid ? '#00A3FF' : '#fff'};
  color: ${({ user }) =>
    user === authService.currentUser?.uid ? '#fff' : '#000'};
`;
const DmTime = styled.span`
  font-size: 12px;
  color: gray;
  margin: 0;
`;

const DmInput = styled.input`
  width: 100%;
  height: 48px;
  outline: none;
  border: 1px solid black;
  border-radius: 50px;
  padding: 5px 20px;
  font-size: 0.875rem;
  ::placeholder {
    font-size: 14px;
  }
`;
export default DmChat;
