import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { CommonError, errors } from '@/common/error';
import { jwtConfig } from '@/providers/jwt/jwt.config';
import * as bcrypt from 'bcrypt';
import { ChatSessionRepository } from '@/repositories/chat-session';
import { RespondentRepository } from '@/repositories/respondent';

@Injectable()
export class ChatGuard implements CanActivate {
  constructor(
    private readonly _jwtService: JwtService,
    private readonly _chatSessionRepository: ChatSessionRepository,
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
      if (!payload.sessionId) return false;

      const session = await this._chatSessionRepository.getOne({
        filter: { field: 'id', value: payload.sessionId },
      });
      if (!session) return false;

      const matched = await bcrypt.compare(payload.sessionKey, session.key);
      if (!matched) return false;

      const respondent = await this._respondentRepository.getOne({
        filter: { field: 'id', value: session.respondentId },
      });
      if (!respondent) return false;

      client['chatSession'] = session;
      client['respondent'] = respondent;

      return true;
    } catch (e) {
      return false;
    }
  }
}
