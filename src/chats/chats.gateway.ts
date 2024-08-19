import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { CreateChatDto } from './dto/create-chat.dto';
import { ChatsService } from './chats.service';
import { EnterChatDto } from './dto/enter-chat.dto';
import { CreateMessagesDto } from './messages/dto/create-messages.dto';
import { ChatsMessagesService } from './messages/messages.service';
import { UseFilters, UsePipes, ValidationPipe } from '@nestjs/common';
import { SocketCatchHttpExceptionFilter } from 'src/common/exception-filter/socket-catch-http.exception.filter';
import { UsersModel } from 'src/users/entity/users.entity';
import { UsersService } from 'src/users/users.service';
import { AuthService } from 'src/auth/auth.service';

@WebSocketGateway({
  // ws://localhost:3000/chats
  namespace: 'chats',
})
export class ChatsGateway
  implements OnGatewayConnection, OnGatewayInit, OnGatewayDisconnect
{
  constructor(
    private readonly chatsService: ChatsService,
    private readonly messagesService: ChatsMessagesService,
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @WebSocketServer()
  server: Server;

  afterInit(server: any) {
    console.log('dsa');
  }

  handleDisconnect(socket: Socket) {
    console.log('dsa');
  }

  async handleConnection(socket: Socket & { user: UsersModel }) {
    console.log(`on Connect Called: ${socket.id}`);

    const headers = socket.handshake.headers;

    // bearer까지 붙어 있는 토큰 = rawToken
    const rawToken = headers['authorization'];

    if (!rawToken) {
      socket.disconnect();
      // throw new WsException('토큰이 없습니다!');
    }

    try {
      //extractTokenFromHeader함수에서 rawToken을 넣고 두번째 파람으로 true를 넣으면 accessToken을 가져오겠다라는 의미
      const token = this.authService.extractTokenFromHeader(rawToken, true);

      // payload를 가져오는 코드
      const payload = this.authService.verifyToken(token);
      const user = await this.usersService.getUserByEmail(payload.email);

      socket.user = user;

      return true;
    } catch (e) {
      socket.disconnect();
      // throw new WsException('토큰이 유효하지 않습니다.');
    }
  }

  //   chating방을 만드는 함수는 rest api로 만드는게 더 효율 적임 why? socket으로 만들면 연결을 계속 해줘야하기 때문에
  // 공부 목적으로 socket으로 만듬
  @UsePipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  )
  @UseFilters(SocketCatchHttpExceptionFilter)
  @SubscribeMessage('create_chat')
  async createChat(
    @MessageBody() data: CreateChatDto,
    @ConnectedSocket() socket: Socket & { user: UsersModel },
  ) {
    const chat = await this.chatsService.createChat(data);
  }

  @SubscribeMessage('enter_chat')
  @UsePipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  )
  @UseFilters(SocketCatchHttpExceptionFilter)
  async enterChat(
    // 방의 chat id들을 리스트로 받는다.
    @MessageBody() data: EnterChatDto,
    @ConnectedSocket() socket: Socket & { user: UsersModel },
  ) {
    // 존재하지 않는 chat을 조인할 필요 없음
    for (const chatId of data.chatIds) {
      const exists = await this.chatsService.checkIfChatExists(chatId);

      if (!exists) {
        throw new WsException({
          code: 100,
          message: `존재하지 않는 chat 입니다. chatId: ${chatId}`,
        });
      }
    }
    socket.join(data.chatIds.map((x) => x.toString()));
  }

  //   ㄷ간단한 메시지를 보낼 수 있는 이벤트 하단에
  //   subScribeMessage에 첫번째 param으로는 이벤트 이름이 들어가야 한다. client와 이벤트를 맞춰 줘야 함
  @UsePipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        // 임의로 변화하는걸 허가
        // class-validation를 기반으로 변환 해 준다.
        enableImplicitConversion: true,
      },
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  )
  @SubscribeMessage('send_message')
  @UsePipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  )
  @UseFilters(SocketCatchHttpExceptionFilter)
  async sendMessage(
    @MessageBody() dto: CreateMessagesDto,
    @ConnectedSocket() socket: Socket & { user: UsersModel },
  ) {
    const chatExists = await this.chatsService.checkIfChatExists(dto.chatId);

    if (!chatExists) {
      throw new WsException(
        `존재하지 않는 채팅방입니다. Chat Id: ${dto.chatId}`,
      );
    }

    const message = await this.messagesService.createMessage(
      dto,
      socket.user.id,
    );

    // socket.to를 통해 방을 설정하는데 이 방에서 현재 socket만 제외 후 메시지를 보내준다 이게 -> BroadCasting 방식
    socket
      .to(message.chat.id.toString())
      .emit('receive_message', message.message);

    // 선택된 방 안에 있는 사용자만 message를 보낼 수 있음.
    // this.server
    //   .in(message.chatId.toString())
    //   .emit('receive_message', message.message);
  }
}
