import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Notification as NotificationPrisma } from '@prisma/client';
import { Server, Socket } from 'socket.io';
import { AuthService } from 'src/modules/auth/auth.service';

@WebSocketGateway({
  namespace: 'notification',
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['token'],
    credentials: true,
  },
})
export class NotificationGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly authService: AuthService) {}

  @WebSocketServer()
  server: Server;

  private userSockets: Map<string, string> = new Map();

  async handleConnection(client: Socket, ...args: any[]) {
    const jwtToken = client.handshake.headers['token'] as string;
    if (!jwtToken) {
      client.disconnect();
      return;
    }

    try {
      const user = await this.authService.validateJwt(jwtToken);
      this.userSockets.set(user.userId, client.id);
      client.data.user = user; // Store user info on the socket
    } catch (errors) {
      client.disconnect();
    }
  }
  handleDisconnect(client: Socket) {
    const user = client.data.user;
    if (user) {
      this.userSockets.delete(user.id);
    }
  }

  @SubscribeMessage('newNotification')
  create(@MessageBody() notification: any) {
    const recipientSocketId = this.userSockets.get(notification.accountId);
    if (recipientSocketId) {
      this.server.to(recipientSocketId).emit('newNotification', notification);
    }
    return notification;
  }

  // @SubscribeMessage('findAllNotification')
  // findAll() {
  //   return this.notificationService.findAll();
  // }

  // @SubscribeMessage('findOneNotification')
  // findOne(@MessageBody() id: number) {
  //   return this.notificationService.findOne(id);
  // }

  // @SubscribeMessage('updateNotification')
  // update(@MessageBody() updateNotificationDto: UpdateNotificationDto) {
  //   return this.notificationService.update(
  //     updateNotificationDto.id,
  //     updateNotificationDto,
  //   );
  // }

  // @SubscribeMessage('removeNotification')
  // remove(@MessageBody() id: number) {
  //   return this.notificationService.remove(id);
  // }
}
