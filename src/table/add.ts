import { times, stubObject } from "lodash";

import { Table } from "./table";

const emptyColumn = (length: number) => times(length, stubObject);
const height = (table: Table) => table.columns[0].length;
const insert = <T>(arr: T[], at: number, item: T) => arr.splice(at, 0, item);

export const addColumn = (table: Table) => (atColumn: number) => (
	insert(table.columns, atColumn, emptyColumn(height(table))), table
);
