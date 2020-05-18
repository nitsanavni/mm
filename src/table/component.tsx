import React, { memo, Fragment } from "react";
import { Box } from "ink";
import { first, times } from "lodash";
import chalk from "chalk";

import { Cell } from "./table";

type Props = {
	doEdit?: boolean;
	columns?: ReadonlyArray<ReadonlyArray<Cell>>;
};

const meta = chalk.dim.yellow;
const separator = meta("|");

const ColumnSeparator = memo(({ length = 1 }: { length?: number }) => (
	<div>{times(length, () => separator)}</div>
));

// TODO
// - add (at least) one wrapper component that will handle table state and user input
// - use TextInput when editing cell (TDD me)
export const Table = ({ columns = [[]], doEdit = false }: Props) => (
	<Box flexDirection="row">
		{columns.map((column, i) => (
			<Fragment key={`f${i}`}>
				<ColumnSeparator length={column.length || 1} key={`s${i}`} />
				<div key={`d${i}`}>
					{column.length > 0
						? column.map((cell) =>
								cell.focused ? `*${cell.value}*` : cell.value
						  )
						: "·"}
				</div>
			</Fragment>
		))}
		{<ColumnSeparator length={first(columns)!.length || 1} key={`s-2`} />}
	</Box>
);
