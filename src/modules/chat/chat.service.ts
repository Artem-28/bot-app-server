import { Injectable } from '@nestjs/common';
import { ChatConnectionRepository } from '@/repositories/chat-connection';
import {
  OperatorConnectionDto,
  RespondentConnectionDto,
} from '@/modules/chat/dto';
import { JwtService } from '@nestjs/jwt';
import { hGenerateCode } from '@/common/utils/generator';
import * as bcrypt from 'bcrypt';
import { ChatConnectionAggregate } from '@/models/chat-connections';
import { ScriptRepository } from '@/repositories/script';
import { RespondentRepository } from '@/repositories/respondent';
import { CommonError, errors } from '@/common/error';
import { RespondentAggregate } from '@/models/respondent';

@Injectable()
export class ChatService {
  constructor(
    private readonly _jwtService: JwtService,
    private readonly _chatConnectionRepository: ChatConnectionRepository,
    private readonly _scriptRepository: ScriptRepository,
    private readonly _respondentRepository: RespondentRepository,
  ) {}

  private async generateConnectionKey() {
    const key = hGenerateCode('****-****-****-****');
    const hashKey = await bcrypt.hash(key, 10);
    return { key, hashKey };
  }

  public async operatorConnectionData(dto: OperatorConnectionDto) {
    const { key, hashKey } = await this.generateConnectionKey();

    const connection = await this._chatConnectionRepository.create(
      ChatConnectionAggregate.create({
        projectId: dto.projectId,
        userId: dto.userId,
        key: hashKey,
      }),
    );

    return this._jwtService.sign({
      connectionKey: key,
      connectionId: connection.id,
    });
  }

  public async respondentConnectionData(dto: RespondentConnectionDto) {
    const { projectId, scriptId, fingerprint } = dto;
    const respondentInstance = RespondentAggregate.create({
      projectId,
      name: 'respondent.new',
    }).instance;
    console.log('RESPONDENT', respondentInstance);
  }

  /*public async respondentConnectionData(dto: RespondentConnectionDto) {
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

      const { key, hashKey } = await this.generateConnectionKey();

      const connection = await this._chatConnectionRepository.create(
        ChatConnectionAggregate.create({
          projectId: dto.projectId,
          scriptId: dto.scriptId,
          respondentId: respondent.id,
          key: hashKey,
        }),
      );

      const token = this._jwtService.sign({
        connectionKey: key,
        connectionId: connection.id,
      });

      return { token, respondent };
    }
  }*/
}
