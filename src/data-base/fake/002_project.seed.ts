import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { UserEntity } from '@/models/user';
import { IProject, ProjectAggregate, ProjectEntity } from '@/models/project';

const adjectives = [
  'Безумный',
  'Космический',
  'Танцующий',
  'Фиолетовый',
  'Сырный',
  'Загадочный',
  'Квантовый',
  'Летающий',
  'Апокалиптический',
  'Тайный',
  'Воинственный',
  'Межгалактический',
  'Эволюционирующий',
  'Симфонический',
  'Программистский',
  'Виртуальный',
  'Ироничный',
  'Теоретический',
  'Пародийный',
  'Упоротый',
  'Смешной',
  'Наивный',
  'Фантастический',
  'Парадоксальный',
];

const nouns = [
  'Шляпник',
  'Ёжик',
  'Кактус',
  'Единорог',
  'Монстр',
  'Кролик',
  'Мысль',
  'Борщ',
  'Диван',
  'Носок',
  'Конфетти',
  'Скрепка',
  'Роза',
  'Шаурма',
  'Пылесос',
  'Ведро',
  'Да Винчик',
  'Пельмень',
  'Дискотека',
  'Ключ',
  'Хайп',
  'Сисадмин',
  'Бабушка',
  'Лентяй',
  'Попугай',
  'Хомячок',
  'Сновидение',
  'Ученый',
  'Поэзия',
  'Сарказм',
  'Видео',
  'Заговор',
  'Тамагочи',
];

function generateName() {
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  return `Проект ${adjective} ${noun.toLowerCase()}`;
}

function generateResource(user: UserEntity) {
  return ProjectAggregate.create({
    title: generateName(),
    owner_id: user.id,
  }).instance;
}

export class ProjectSeed implements Seeder {
  public async run(dataSource: DataSource): Promise<any> {
    const total = 10;

    const userRepository = dataSource.getRepository(UserEntity);
    const projectRepository = dataSource.getRepository(ProjectEntity);

    const users = await userRepository.createQueryBuilder().getMany();

    const resource: IProject[] = [];

    users.forEach((user) => {
      const projects = Array.from({ length: total }, () =>
        generateResource(user),
      );
      resource.push(...projects);
    });

    await projectRepository.save(resource);
  }
}
