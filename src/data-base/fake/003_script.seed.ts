import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { IProject, ProjectEntity } from '@/models/project';
import { IScript, ScriptAggregate, ScriptEntity } from '@/models/script';

const adjectives1 = [
  'Запутанный',
  'Зловещий',
  'Ироничный',
  'Мистический',
  'Сюрреалистичный',
  'Гротескный',
  'Абсурдный',
  'Парадоксальный',
  'Ностальгический',
  'Авангардный',
  'Киберпанковский',
  'Стимпанковский',
  'Постапокалиптический',
  'Фееричный',
  'Экзистенциальный',
  'Психоделический',
  'Нуарный',
  'Романтический',
  'Трагикомичный',
  'Фантасмагорический',
  'Эпичный',
  'Камерный',
  'Импровизационный',
  'Концептуальный',
];

const adjectives2 = [
  'Тень',
  'Эхо',
  'Голос',
  'Шепот',
  'Забвение',
  'Отражение',
  'Ключ',
  'Путь',
  'Ритуал',
  'Код',
  'Тайна',
  'Шифр',
  'Секрет',
  'Фантом',
  'Мираж',
  'Искажение',
  'Смещение',
  'Призрак',
  'Затмение',
  'Зеркало',
  'Проклятие',
  'Артефакт',
  'Портал',
  'Гротеск',
  'Клоун',
  'Иллюзия',
];

const nouns = [
  'Лабиринт',
  'Заговор',
  'Иллюзия',
  'Парадокс',
  'Метаморфоза',
  'Аномалия',
  'Коллапс',
  'Сингулярность',
  'Ренессанс',
  'Декаданс',
  'Матрица',
  'Арканум',
  'Катастрофа',
  'Феерия',
  'Экзистенция',
  'Галлюцинация',
  'Детектив',
  'Роман',
  'Фарс',
  'Видение',
  'Эпопея',
  'Диалог',
  'Импровизация',
  'Концепт',
];

const preposition = ['В', 'На', 'Под', 'Над', 'За', 'Перед', 'Около', 'У'];

function getRandomItem(resource: string[]) {
  return resource[Math.floor(Math.random() * resource.length)];
}

function generateName() {
  const randomNumber = Math.random(); // Случайное число от 0 до 1
  const adjective = getRandomItem(adjectives1);
  const adjective2 = getRandomItem(adjectives2).toLowerCase();
  const noun = getRandomItem(nouns).toLowerCase();
  const randomPreposition = getRandomItem(preposition).toLowerCase();
  const name = `Сценарий ${adjective}`;

  if (randomNumber < 0.33) {
    // 33% вероятность: прилагательное + существительное
    return name + ` ${noun}`;
  } else if (randomNumber < 0.66) {
    // 33% вероятность: прилагательное + прилагательное + существительное
    return name + ` ${adjective2}` + ` ${noun}`;
  } else {
    // 33% вероятность:  существительное + предлог + существительное
    return name + ` ${noun}` + ` ${randomPreposition}` + ` ${adjective2}`;
  }
}

function generateResource(project: IProject) {
  return ScriptAggregate.create({
    title: generateName(),
    project_id: project.id,
  }).instance;
}

export class ScriptSeed implements Seeder {
  public async run(dataSource: DataSource): Promise<any> {
    const total = 10;

    const projectRepository = dataSource.getRepository(ProjectEntity);
    const scriptRepository = dataSource.getRepository(ScriptEntity);

    const projects = await projectRepository.createQueryBuilder().getMany();

    const resource: IScript[] = [];

    projects.forEach((project) => {
      const scripts = Array.from({ length: total }, () =>
        generateResource(project),
      );
      resource.push(...scripts);
    });

    await scriptRepository.save(resource);
  }
}
