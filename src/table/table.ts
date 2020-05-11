export type Position = {
	column: number;
	row: number;
};

export type Cell = {
	value?: string;
	focused?: boolean;
};

export type Table = {
	// assuming single-line cells, rendering should be thought of in columns
	columns: Cell[][];
	focus?: Position;
	mode?: "edit" | "browse";
};

// TODO
// mvp:
// - model
// - type '|' -> starts a new table
// - text representation for the saved file - to/from plain text, indent like the other nodes, trim values
// - extract key adapter: {... (alt + up arrow): moveRowUp, (up arrow): up ...}
// - move(fromPostion, toPosition) ??
// - addColumn & grab it to move
// - grab column mode -> now left/right arrows move the column
// - addColumn = addColumnRightOf(focus)
// - addColumnLeftOf(focus)
// - addRow = addRowBelow(focus) = each(columns, column => addCellBelow(column, focus.row))
// - addRowAbove(focus)
// - delete = deleteCellValue
// - deleteRow
// - deleteColumn
// not mvp:
// - collapse
//   - keep only first cell
//   - keep only first rows
// - freeze columns/rows :)
// - outline - convertToTable / makeIntoTable
// - toOutline
