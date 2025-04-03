import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { AuthDataAggregate, AuthDataEntity } from '@/models/auth-data';
import { UserAggregate, UserEntity } from '@/models/user';

const resource = [
  {
    email: 'artem.mikheev.git@gmail.com',
    password: '123456',
    name: 'Артем Михеев',
    phone: '+7(918)697-92-15',
  },
  {
    email: 'amikheev028@gmail.com',
    password: '123456',
    name: 'Иван Николаевич',
    phone: '+7(918)515-92-97',
  },
  {
    email: 'artem.mikheev91@yandex.ru',
    password: '123456',
    name: 'Светлана Владимировна',
    phone: '+7(918)515-92-37',
  },
  {
    email: 'artemMyDisk@yandex.ru',
    password: '123456',
    name: 'Иванов Иван Иванович',
    phone: '+7(918)515-92-00',
  },
  {
    email: 'ebustoscapustos@gmail.com',
    password: 'belelu33',
    name: 'Николай Михеевч',
    phone: '+7(989)245-07-39',
  },
];

export class UserSeed implements Seeder {
  public async run(dataSource: DataSource): Promise<any> {
    const authDataRepository = dataSource.getRepository(AuthDataEntity);
    const userRepository = dataSource.getRepository(UserEntity);

    for (let i = 0; i < resource.length; i++) {
      const data = resource[i];

      const password = await bcrypt.hash(data.password, 10);
      const authDataInstance = AuthDataAggregate.create({
        login: data.email,
        password,
      }).instance;

      await authDataRepository.save(authDataInstance);

      const userInstance = UserAggregate.create({
        email: data.email,
        name: data.name,
        phone: data.phone,
        licenseAgreement: true,
        lastActiveAt: new Date(),
        emailVerifiedAt: new Date(),
      }).instance;

      await userRepository.save(userInstance);
    }
  }
}
