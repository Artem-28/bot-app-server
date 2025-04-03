import { appDataSource } from '@/providers/typeorm';

interface IMigration {
  id: number;
  name: string;
  timestamp: number;
}

async function getMigrations(): Promise<IMigration[]> {
  try {
    return appDataSource.query(
      `SELECT id, timestamp, name FROM migrations ORDER BY timestamp DESC`,
    );
  } catch (e) {
    throw new Error('Ошибка при получение списка миграций: ' + e);
  }
}

async function dataBaseReset() {
  try {
    await appDataSource.initialize();
    const migrations = await getMigrations();

    if (migrations.length === 0) {
      console.log('Нет миграций для отката');
      return;
    }

    let resetError = false;
    let count = 0;
    while (!resetError && count < migrations.length) {
      try {
        await appDataSource.undoLastMigration();
        count++;
      } catch (e) {
        console.error('Ошибка отката миграции: ', e);
        resetError = true;
      }
    }
  } catch (e) {
    console.error(e);
  } finally {
    await appDataSource.destroy();
  }
}

dataBaseReset().catch(console.error);
