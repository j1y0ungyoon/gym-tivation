import { Server as HTTPServer } from 'http';
import type { NextApiRequest, NextApiResponse } from 'next';
import type { Socket as NetSocket } from 'net';
import type { Server as IOServerType } from 'socket.io';
import { Server as IOServer } from 'socket.io';

// 타입 지정 해주기 io, server, socket
interface SocketServer extends HTTPServer {
  io?: IOServerType | undefined;
}
interface SocketWithIO extends NetSocket {
  server: SocketServer;
}
interface NextApiResponseWithSocket extends NextApiResponse {
  socket: SocketWithIO;
}

const socketHandler = (req: NextApiRequest, res: NextApiResponseWithSocket) => {
  if (res.socket.server.io) {
    console.log('이미 소켓서버가 작동중입니다.');
  } else {
    console.log('소켓 서버 초기화');
    const io = new IOServer(res.socket.server);
    res.socket.server.io = io;

    io.on('connection', (socket) => {
      console.log('클라이언트 접속 완료');
      socket.on('disconnected', () => {
        console.log('클라이언트 접속 종료');
      });

      // 전체 채팅 받는곳
      socket.on('chat', (data) => {
        console.log('채팅 받음', data);
        io.emit('chat', data);
      });
    });
  }
  res.end();
};

export default socketHandler;
