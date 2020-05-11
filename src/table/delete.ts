import { Transform } from "./transform";
import { cellAt } from "./cell-at";

export const deleteCellValue: Transform = (table) => (
	(cellAt(table)(table.focus!).value = ""), table
);
