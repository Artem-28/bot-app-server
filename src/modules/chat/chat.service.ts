import { Injectable } from '@nestjs/common';
import { ChatSessionRepository } from '@/repositories/chat-session';
import { CreateChatSessionDto } from '@/modules/chat/dto';
import { ScriptRepository } from '@/repositories/script';
import { RespondentRepository } from '@/repositories/respondent';
import { CommonError, errors } from '@/common/error';
import { RespondentAggregate } from '@/models/respondent';
import { hGenerateCode } from '@/common/utils/generator';
import * as bcrypt from 'bcrypt';
import { ChatSessionAggregate } from '@/models/chat-session';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class ChatService {
  constructor(
    private readonly _jwtService: JwtService,
    private readonly _chatSessionRepository: ChatSessionRepository,
    private readonly _scriptRepository: ScriptRepository,
    private readonly _respondentRepository: RespondentRepository,
  ) {}

  public async getStartData() {}

  public async createSession(dto: CreateChatSessionDto) {
    const { projectId, scriptId, respondentId } = dto;
    const script = await this._scriptRepository.getOne({
      filter: [
        { field: 'id', value: scriptId },
        { field: 'projectId', value: projectId, operator: 'and' },
      ],
    });
    if (!script) {
      throw new CommonError({ messages: errors.chat.session_create });
    }

    let respondent = null;
    if (respondentId) {
      respondent = await this._respondentRepository.getOne({
        filter: [
          { field: 'id', value: respondentId },
          { field: 'projectId', value: projectId },
        ],
      });
    }
    if (!respondent) {
      respondent = RespondentAggregate.create({
        projectId,
        name: 'respondent.new',
      });
      respondent = await this._respondentRepository.create(respondent.instance);
    }

    const key = hGenerateCode('****-****-****-****');
    const hashKey = await bcrypt.hash(key, 10);
    const sessionInstance = ChatSessionAggregate.create({
      projectId,
      scriptId,
      respondentId: respondent.id,
      key: hashKey,
      title: script.title,
    }).instance;
    const session = await this._chatSessionRepository.create(sessionInstance);

    const chatToken = this._jwtService.sign({
      sessionKey: key,
      sessionId: session.id,
    });

    return {
      chatToken,
      respondent,
    };
  }
}
