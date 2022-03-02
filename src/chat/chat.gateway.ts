import { Logger } from '@nestjs/common';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
  }
  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }
  private logger: Logger = new Logger('ChatGateway');

  afterInit(server: Server) {
    this.logger.log('Initialized');
  }
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('msgToServer')
  listenForMessages(client: Socket, text: string): WsResponse<string> {
    // this.server.emit('msgToClient',text)
    // client.emit('msgToClient',text)
    return { event: 'msgToClient', data: text };
  }
}
