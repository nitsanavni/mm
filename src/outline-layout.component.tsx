import React from "react";
import { Box, Text } from "ink";
import InkTextInput from "ink-text-input";
import { isEmpty, map } from "lodash";
import chalk from "chalk";

import { OutlineNode, Mode, childrenArray } from "./outline";

const meta = chalk.dim.yellow;
const focus = chalk.yellowBright.bold.underline;
const label = (n: OutlineNode) => (isEmpty(n.label) ? meta("·") : n.label);
const style = (n: OutlineNode) => (n.focused ? focus(label(n)) : label(n));
const collapse = meta("+");
const siblinPrefix = (s: OutlineNode) => {
	const first = meta("/");
	const middle = meta("·");
	const last = meta("\\");
	const single = meta("-");

	return [
		[middle, last],
		[first, single],
	][s.previousSiblin ? 0 : 1][s.nextSiblin ? 0 : 1];
};

type Props = {
	n: OutlineNode;
	onChange: (value: string) => void;
	mode: Mode;
	prefix?: string;
};

const Node = ({ n, onChange, mode, prefix = "" }: Props) => (
	<Text>
		{n.collapsedLeft ? collapse : prefix}
		{n.focused && mode === "edit node" ? (
			<Text color={"yellow"} bold={true}>
				<InkTextInput onChange={onChange} value={n.label} />
			</Text>
		) : (
			style(n)
		)}
	</Text>
);

const NodeChildren = ({ n, onChange, mode }: Props) =>
	n.collapsed ? (
		<Text>{collapse}</Text>
	) : n.firstChild ? (
		<Box flexDirection="column">
			{map(childrenArray(n), (c) => (
				<OutlineLayout
					key={`ll+${c.key}`}
					n={c}
					{...{ onChange, mode }}
					prefix={siblinPrefix(c)}
				/>
			))}
		</Box>
	) : (
		<></>
	);

export const OutlineLayout = (props: Props) => (
	<Box flexDirection="row" key={`box ${props.n.key}`} alignItems="center">
		<Node {...props} />
		<NodeChildren {...props} />
	</Box>
);
