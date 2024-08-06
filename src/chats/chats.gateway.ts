import {
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  // ws://localhost:3000/chats
  namespace: 'chats',
})
export class ChatsGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  handleConnection(socket: Socket) {
    console.log(`on Connect Called: ${socket.id}`);
  }

  //   ㄷ간단한 메시지를 보낼 수 있는 이벤트 하단에
  //   subScribeMessage에 첫번째 param으로는 이벤트 이름이 들어가야 한다. client와 이벤트를 맞춰 줘야 함
  @SubscribeMessage('send_message')
  sendMessage(@MessageBody() message: string) {
    this.server.emit('receive_message', 'hello from server');
    console.log(message);
  }
}
