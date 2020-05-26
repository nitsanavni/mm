import React from "react";
import { Box, Color } from "ink";
import InkTextInput from "ink-text-input";
import { isEmpty, map } from "lodash";
import chalk from "chalk";

import { OutlineNode, Mode, childrenArray } from "./outline";

const meta = chalk.dim.yellow;
const focus = chalk.yellowBright.bold.underline;
const label = (n: OutlineNode) => (isEmpty(n.label) ? "·" : n.label);
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
	<>
		{n.collapsedLeft ? collapse : prefix}
		{n.focused && mode === "edit node" ? (
			<Color yellow={true} bold={true}>
				<InkTextInput onChange={onChange} value={n.label} />
			</Color>
		) : (
			style(n)
		)}
	</>
);

const NodeChildren = ({ n, onChange, mode }: Props) => (
	<div>
		{n.collapsed
			? collapse
			: n.firstChild && (
					<>
						{map(childrenArray(n), (c) => (
							<OutlineLayout
								key={`ll+${c.key}`}
								n={c}
								{...{ onChange, mode }}
								prefix={siblinPrefix(c)}
							/>
						))}
					</>
			  )}
	</div>
);

export const OutlineLayout = (props: Props) => (
	<Box flexDirection="row" key={`box ${props.n.key}`} alignItems="center">
		<Node {...props} />
		<NodeChildren {...props} />
	</Box>
);
