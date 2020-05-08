import React, { memo } from "react";
import test from "ava";
import { render } from "ink-testing-library";
import { Box } from "ink";
import { times, first } from "lodash";

// TODO
// - extract to src/
// - table model manipulation
//   - browse mode (arrow keys, ⌘ + arrows)
//   - edit mode
//   - move cells? reorder columns/rows

type Cell = {
	value: string;
	focused?: boolean;
};

type Props = {
	doEdit?: boolean;
	cells?: ReadonlyArray<ReadonlyArray<Cell>>;
};

const ColumnSeparator = memo(({ length = 1 }: { length?: number }) => (
	<div>{times(length, () => "|")}</div>
));

const Table = ({ cells = [[]] }: Props) => (
	<Box flexDirection="row">
		{cells.map((column) => (
			<>
				<ColumnSeparator length={column.length || 1} />
				<div>
					{column.length > 0
						? column.map((cell) =>
								cell.focused ? `*${cell.value}*` : cell.value
						  )
						: "·"}
				</div>
			</>
		))}
		{<ColumnSeparator length={first(cells)!.length || 1} />}
	</Box>
);

test("focus POC", (t) => {
	const { lastFrame } = render(
		<Table
			cells={[
				[{ value: "C1" }, { value: "hello", focused: true }],
				[{ value: "C2" }, { value: "world" }],
			]}
		/>
	);

	t.is(lastFrame(), "|C1     |C2   |\n|*hello*|world|");
});
test("empty", (t) => {
	const { lastFrame } = render(<Table />);

	t.is(lastFrame(), "|·|");
});

test("long", (t) => {
	const { lastFrame } = render(
		<Table
			cells={[
				["C1", "lon______g"],
				["C2", "short"],
			].map((c) => c.map((value) => ({ value })))}
		/>
	);

	t.is(lastFrame(), "|C1        |C2   |\n|lon______g|short|");
});

test("table", (t) => {
	const { lastFrame } = render(
		<Table
			cells={[
				["C1", "1", "2", "3"],
				["C2", "4", "5", "6"],
			].map((c) => c.map((value) => ({ value })))}
		/>
	);

	t.is(lastFrame(), "|C1|C2|\n|1 |4 |\n|2 |5 |\n|3 |6 |");
});
