import {
  openDatabase,
  enablePromise,
  SQLiteDatabase,
} from 'react-native-sqlite-storage';

const tableName = 'diary';
export type DiaryItem = {
  date: string;
  text: string;
  result: string;
};

enablePromise(true);

export const getDBconnection = async () => {
  return openDatabase({name: 'diary.db', location: 'default'});
};

export const createTable = async (db: SQLiteDatabase) => {
  // create table if not exists
  const query = `CREATE TABLE IF NOT EXISTS ${tableName}(
          date TEXT UNIQUE NOT NULL, text TEXT NOT NULL, result TEXT NOT NULL
      );`;

  await db.executeSql(query);
};

export const getDiaryItem = async (
  db: SQLiteDatabase,
  date: string,
): Promise<string | null> => {
  try {
    let diaryItem: string | null = null;
    const result = await db.executeSql(
      `SELECT date, text, result FROM ${tableName} WHERE date = ${date}`,
    );
    console.log(result[0].rows.item(result[0].rows.length - 1));
    // results.forEach(result => {
    //   for (let index = 0; index < result.rows.length; index++) {
    //     diaryItems.push(result.rows.item(index));
    //   }
    // });
    diaryItem = result[0].rows.item(result[0].rows.length - 1).text;
    return diaryItem;
  } catch (error) {
    console.error(error);
    throw Error('Failed to get items !!!');
  }
};

export const saveDiary = async (
  db: SQLiteDatabase,
  date: string,
  text: string,
  result: string,
) => {
  const insertQuery =
    `INSERT OR REPLACE INTO ${tableName}(date, text, result) values` +
    `(${date}, '${text}', '${result}')`;

  return db.executeSql(insertQuery);
};

export const deleteTodoItem = async (db: SQLiteDatabase, date: string) => {
  const deleteQuery = `DELETE from ${tableName} where date = ${date}`;
  await db.executeSql(deleteQuery);
};

export const deleteTable = async (db: SQLiteDatabase) => {
  const query = `drop table ${tableName}`;

  await db.executeSql(query);
};
