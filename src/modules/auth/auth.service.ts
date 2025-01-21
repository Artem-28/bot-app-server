import { Injectable } from '@nestjs/common';
import { SignUpDto } from '@/modules/auth/dto';
import { AuthDataRepository } from '@/repositories/auth-data';
import { AuthDataAggregate } from '@/models/auth-data';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly _authDataRepository: AuthDataRepository) {}
  async signUp(dto: SignUpDto): Promise<boolean> {
    if (!dto.licenseAgreement) {
      throw new Error('errors.registration.licenseAgreement');
    }
    const password = await bcrypt.hash(dto.password, 10);
    const authDataInstance = AuthDataAggregate.create({
      login: dto.email,
      password,
    }).instance;

    console.log('INTSTNCE', authDataInstance);

    const authData = await this._authDataRepository.create(authDataInstance);

    return !!authData.id;
  }
}
