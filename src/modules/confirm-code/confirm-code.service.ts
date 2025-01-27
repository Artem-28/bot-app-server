import { Injectable } from '@nestjs/common';
import {
  CheckConfirmCodeDto,
  CreateConfirmCodeDto,
} from '@/modules/confirm-code/dto';
import {
  ConfirmCodeAggregate,
  ConfirmCodeTypeEnum,
  IValidateCodeResponse,
  TValidateCodeField,
} from '@/models/confirm-code';
import { ConfirmCodeRepository } from '@/repositories/confirm-code';
import { hGenerateCode } from '@/common/utils/generator';
import { CommonError } from '@/common/error';

@Injectable()
export class ConfirmCodeService {
  private readonly _codeOptions = {
    [ConfirmCodeTypeEnum.REGISTRATION]: {
      mask: '######',
      timeLive: 360,
      timeDelay: 120,
    },
    [ConfirmCodeTypeEnum.UPDATE_PASSWORD]: {
      mask: '######',
      timeLive: 360,
      timeDelay: 120,
    },
  };
  constructor(private _confirmCodeRepository: ConfirmCodeRepository) {}
  public async create(dto: CreateConfirmCodeDto) {
    const { mask, timeDelay, timeLive } = this._codeOptions[dto.type];

    const code = await this._confirmCodeRepository.getOne([
      { field: 'destination', value: dto.destination },
      { field: 'type', value: dto.type },
    ]);

    if (!code) {
      const newCode = ConfirmCodeAggregate.create({
        destination: dto.destination,
        type: dto.type,
        value: hGenerateCode(mask),
      });
      newCode.setLiveTime(timeLive);
      newCode.setDelayTime(timeDelay);
      return await this._confirmCodeRepository.create(newCode.instance);
    }

    if (code.delay) {
      throw new CommonError({
        message: 'errors.confirm_code.delay',
        ctx: 'field',
        field: 'code',
      });
    }
    code.update({ value: hGenerateCode(mask) });
    code.setLiveTime(timeLive);
    code.setDelayTime(timeDelay);
    const updated = await this._confirmCodeRepository.update(
      code.id,
      code.instance,
    );
    if (!updated) {
      throw new CommonError({
        message: 'errors.confirm_code.create',
        ctx: 'app',
        field: null,
      });
    }

    return code;
  }

  public async check(
    dto: CheckConfirmCodeDto,
    throwExceptionField?: TValidateCodeField[],
  ) {
    const code = await this._confirmCodeRepository.getOne([
      { field: 'destination', value: dto.destination },
      { field: 'type', value: dto.type },
    ]);

    console.log('GET CODE', code, dto);

    const throwException = Array.isArray(throwExceptionField) && !!throwExceptionField.length;

    const validate: IValidateCodeResponse = {
      matched: false,
      live: false,
      delay: false,
    };

    if (!code && throwException) {
      throw new CommonError({
        message: 'errors.confirm_code.matched_invalid',
        ctx: 'field',
        field: 'code',
      });
    }

    if (!code) return validate;

    code.match(dto.code);
    const { matched, live, delay } = code;
    Object.assign(validate, { matched, live, delay });

    if (!throwException) return validate;

    console.log('CODE', code);
    console.log('VALIDATE', validate);

    throwExceptionField.forEach((field) => {
      const valid = validate[field];
      if (!valid) {
        throw new CommonError({
          ctx: 'field',
          field: 'code',
          message: `errors.confirm_code.${field}_invalid`,
        });
      }
    });

    return validate;
  }
}
