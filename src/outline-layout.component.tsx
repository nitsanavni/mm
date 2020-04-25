import React, { memo } from "react";
import { Box, Color } from "ink";
import InkTextInput from "ink-text-input";
import { isEmpty } from "lodash";
import chalk from "chalk";

import { OutlineNode, Mode } from "./outline";

const meta = chalk.dim.yellow;
const focus = chalk.yellowBright.bold.underline;
const label = (n: OutlineNode) => (isEmpty(n.label) ? meta("·") : n.label);
const style = (n: OutlineNode) => (n.focused ? focus(label(n)) : label(n));
const collapse = meta("+");
const siblinPrefix = (s: OutlineNode) => {
	const first = meta("⸝");
	const middle = meta("·");
	const last = meta("⸌");
	const single = meta("·");

	return [
		[middle, last],
		[first, single],
	][s.previousSiblin ? 0 : 1][s.nextSiblin ? 0 : 1];
};

export const OutlineLayout = memo(
	({
		n,
		onChange,
		mode,
		prefix = "",
	}: {
		n: OutlineNode;
		onChange: (value: string) => void;
		mode: Mode;
		prefix?: string;
	}) => (
		<Box flexDirection="row" key={`box ${n.key}`} alignItems="center">
			{n.collapsedLeft ? collapse : prefix}
			{n.focused && mode === "edit node" ? (
				<Color yellow={true} bold={true}>
					<InkTextInput onChange={onChange} value={n.label} />
				</Color>
			) : (
				style(n)
			)}
			{n.collapsed
				? collapse
				: n.firstChild && (
						<Box flexDirection="column">
							{(() => {
								let next: OutlineNode | undefined = n.firstChild;
								const acc = [];

								while (next) {
									acc.push(
										<OutlineLayout
											key={`ll+${next.key}`}
											n={next}
											{...{ onChange, mode }}
											prefix={siblinPrefix(next)}
										/>
									);
									next = next.nextSiblin;
								}

								return acc;
							})()}
						</Box>
				  )}
		</Box>
	)
	// (prev, next) => false
);
