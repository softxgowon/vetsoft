import { Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { OnGatewayConnection, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { isStaff } from '../common/enums';
import { JwtPayload } from '../common/types';

export const userRoom = (userId: string) => `user:${userId}`;
export const STAFF_ROOM = 'staff';

@WebSocketGateway({ cors: { origin: true, credentials: true } })
export class NotificationsGateway implements OnGatewayConnection {
  private readonly log = new Logger(NotificationsGateway.name);

  @WebSocketServer()
  server: Server;

  constructor(private readonly jwt: JwtService) {}

  // клиент передает jwt в handshake.auth.token, без валидного токена соединение закрывается
  async handleConnection(client: Socket): Promise<void> {
    try {
      const token = client.handshake.auth?.token as string | undefined;
      if (!token) throw new Error('токен не передан');
      const payload = await this.jwt.verifyAsync<JwtPayload>(token);
      await client.join(userRoom(payload.sub));
      if (isStaff(payload.role)) await client.join(STAFF_ROOM);
    } catch (error) {
      this.log.debug(`отклонено соединение ${client.id}: ${(error as Error).message}`);
      client.disconnect(true);
    }
  }

  emitToUser(userId: string, event: string, data: unknown): void {
    this.server?.to(userRoom(userId)).emit(event, data);
  }

  emitToStaff(event: string, data: unknown): void {
    this.server?.to(STAFF_ROOM).emit(event, data);
  }

  // список слотов не содержит персональных данных, поэтому его можно слать всем подключенным
  broadcastSlotsChanged(doctorId: string, date: string): void {
    this.server?.emit('slots:changed', { doctorId, date });
  }
}
