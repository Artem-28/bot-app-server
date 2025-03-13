import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ChatConnectionRepository } from '@/repositories/chat-connection';
import { Socket } from 'socket.io';
import { CommonError, errors } from '@/common/error';
import { jwtConfig } from '@/providers/jwt';
import { UserRepository } from '@/repositories/user';
import * as bcrypt from 'bcrypt';
import { RespondentRepository } from '@/repositories/respondent';

@Injectable()
export class JwtChatGuard implements CanActivate {
  constructor(
    private readonly _jwtService: JwtService,
    private readonly _chatConnectionRepository: ChatConnectionRepository,
    private readonly _userRepository: UserRepository,
    private readonly _respondentRepository: RespondentRepository,
  ) {}

  async canActivate(context: ExecutionContext) {
    const client: Socket = context.switchToWs().getClient();
    const headers = client.handshake.headers;
    const token = headers.autharization as string;
    if (!token) {
      throw new CommonError({ messages: errors.chat.connect });
    }

    try {
      const payload = this._jwtService.verify(token, jwtConfig.verifyOptions);
      if (!payload.connectionId) return false;

      const connection = await this._chatConnectionRepository.getOne({
        filter: { field: 'id', value: payload.connectionId },
      });

      if (!connection) return false;

      const matched = await bcrypt.compare(
        payload.connectionKey,
        connection.key,
      );
      if (!matched) return false;

      const isOperator = !!connection.userId;
      const isRespondent = !!connection.respondentId && !!connection.scriptId;
      if (!isOperator && !isRespondent) return false;

      let operator = null;
      let respondent = null;

      if (isOperator) {
        operator = await this._userRepository.getOne({
          filter: { field: 'id', value: connection.userId },
        });
      }
      if (isOperator && !operator) return false;

      if (isRespondent) {
        respondent = await this._respondentRepository.getOne({
          filter: [
            { field: 'id', value: connection.respondentId },
            { field: 'projectId', value: connection.projectId },
          ],
        });
      }
      if (isRespondent && !respondent) return false;

      connection.update({ respondent, operator });
      client['connection'] = connection;

      return true;
    } catch (e) {
      throw new CommonError({ messages: e });
    }
  }
}
