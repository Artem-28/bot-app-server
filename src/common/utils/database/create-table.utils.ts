import {
  TableColumn,
  Table,
  TableColumnOptions,
  TableOptions,
  TableUniqueOptions,
  TableUnique,
} from 'typeorm';

export interface HCreateTableOptions {
  columnId: boolean;
  columnCreatedAt: boolean;
  columnUpdatedAt: boolean;
  uniques: Array<string[]>;
}

export type HCreateTable = (
  name: string,
  columns: TableColumnOptions[],
  options?: Partial<HCreateTableOptions>,
) => Table;

export type HCreateTableColumns = (
  options: TableColumnOptions[],
) => TableColumn[];

export const hCreateTable: HCreateTable = (name, columns, options?) => {
  const opt = Object.assign<HCreateTableOptions, Partial<HCreateTableColumns>>(
    {
      columnId: true,
      columnCreatedAt: true,
      columnUpdatedAt: true,
      uniques: [],
    },
    options,
  );
  if (opt.columnId) {
    columns.unshift({
      name: 'id',
      type: 'int',
      isGenerated: true,
      isPrimary: true,
      generationStrategy: 'increment',
    });
  }
  if (opt.columnCreatedAt) {
    columns.push({
      name: 'created_at',
      type: 'timestamp',
      default: 'CURRENT_TIMESTAMP',
    });
  }
  if (opt.columnUpdatedAt) {
    columns.push({
      name: 'updated_at',
      type: 'timestamp',
      default: 'CURRENT_TIMESTAMP',
      onUpdate: 'CURRENT_TIMESTAMP',
    });
  }
  const tableOptions: TableOptions = {
    name,
    columns: hCreateTableColumns(columns),
  };

  const uniques: TableUniqueOptions[] = [];
  opt.uniques.forEach((keys) => {
    uniques.push(
      new TableUnique({
        name: `${name}_${keys.join('_')}`,
        columnNames: keys,
      }),
    );
  });

  if (uniques.length) {
    tableOptions.uniques = uniques;
  }

  return new Table(tableOptions);
};

export const hCreateTableColumns: HCreateTableColumns = (options) => {
  return options.map((opt) => new TableColumn(opt));
};
