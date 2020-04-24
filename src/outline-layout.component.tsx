import React, { memo } from "react";
import { Box, Color, Text } from "ink";
import InkTextInput from "ink-text-input";
import { isEmpty, noop } from "lodash";
import chalk from "chalk";
import { appendFile } from "fs";

import { OutlineNode, Mode } from "./outline";

const label = (n: OutlineNode) => (isEmpty(n.label) ? "·" : n.label);
const style = (n: OutlineNode) =>
	n.focused ? chalk.yellow.bold.underline(label(n)) : label(n);

export const OutlineLayout = memo(
	({
		n,
		onChange,
		mode,
		prefix,
	}: {
		n: OutlineNode;
		onChange: (value: string) => void;
		mode: Mode;
		prefix?: string;
	}) => (
		<Box flexDirection="row" key={`box ${n.key}`} alignItems="center">
			{prefix}
			{n.focused && mode === "edit node" ? (
				<Color yellow={true} bold={true}>
					<InkTextInput onChange={onChange} value={n.label} />
				</Color>
			) : (
				style(n)
			)}
			{/* </Color> */}
			{n.collapsed
				? chalk.dim.yellow("+")
				: n.firstChild && (
						<Box flexDirection="column">
							{(() => {
								let next: OutlineNode | undefined = n.firstChild;
								const acc = [];

								const prefixes = {
									first: chalk.bold(" ╭"),
									middle: chalk.bold("  "),
									last: chalk.bold(" ╰"),
									single: chalk.bold(" ─"),
								};

								while (next) {
									const p = [
										[prefixes.middle, prefixes.last],
										[prefixes.first, prefixes.single],
									][next.previousSiblin ? 0 : 1][next.nextSiblin ? 0 : 1];

									acc.push(
										<OutlineLayout
											key={`ll+${next.key}`}
											n={next}
											{...{ onChange, mode }}
											prefix={p}
										/>
									);
									next = next.nextSiblin;
								}

								return acc;
							})()}
						</Box>
				  )}
		</Box>
	),
	(prev, next) => false
);
