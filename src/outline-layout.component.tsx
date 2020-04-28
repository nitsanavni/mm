import React, { memo, FC } from "react";
import { Box, Color } from "ink";
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

const PrePost: FC<{ prefix?: string; postfix?: string }> = ({
	prefix = "",
	postfix = "",
	children,
}) => (
	<span
		style={{ flexDirection: "row" }}
		// @ts-ignore
		unstable__transformChildren={(c) => prefix + children + postfix}
	>
		{children}
	</span>
);

const Node = ({ n, onChange, mode, prefix = "" }: Props) => (
	<PrePost
		prefix={n.collapsedLeft ? collapse : prefix}
		postfix={n.collapsed ? collapse : ""}
	>
		{n.focused && mode === "edit node" ? (
			<Color yellow={true} bold={true}>
				<InkTextInput onChange={onChange} value={n.label} />
			</Color>
		) : (
			style(n)
		)}
	</PrePost>
);

const NodeChildren = ({ n, onChange, mode }: Props) => (
	<>
		{!n.collapsed && n.firstChild && (
			<Box flexDirection="column" paddingLeft={2}>
				{map(childrenArray(n), (c) => (
					<OutlineLayout
						key={`ll+${c.key}`}
						n={c}
						{...{ onChange, mode }}
						prefix={siblinPrefix(c)}
					/>
				))}
			</Box>
		)}
	</>
);

export const OutlineLayout = memo((props: Props) => (
	<Box flexDirection="column">
		<Node {...props} />
		<NodeChildren {...props} />
	</Box>
));
