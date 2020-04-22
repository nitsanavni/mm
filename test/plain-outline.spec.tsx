import React from "react";
import test from "ava";
import { Box, Text } from "ink";
import { isEmpty, keys, split } from "lodash";
import { render } from "ink-testing-library";

import {
	pipe,
	init,
	edit,
	addChild,
	addSiblin,
	home,
	parent,
	OutlineNode,
	Outline,
} from "../src/outline";

const emptyNode = "·";

const PlainOutline = ({ n }: { n?: OutlineNode }) =>
	!n ? (
		<></>
	) : (
		<Box flexDirection="column" marginRight={1}>
			<Text>{isEmpty(n.label) ? "·" : n.label}</Text>
			<Box flexDirection="column">
				{(() => {
					let next = n.firstChild;
					const acc = [];

					while (next) {
						acc.push(
							<Box
								alignItems="center"
								marginLeft={2}
								flexDirection="row"
								key={`o${next.key}`}
							>
								<PlainOutline n={next} />
							</Box>
						);
						next = next.nextSiblin;
					}

					return acc;
				})()}
			</Box>
		</Box>
	);

const to = (o: Outline) => render(<PlainOutline n={o.root} />).lastFrame();

test("to - null", (t) => {
	const outline = pipe(init())(home());

	t.is(to(outline), emptyNode);
});

test("to - one node", (t) => {
	const outline = pipe(init())(edit("root"), home());

	t.is(to(outline), "root");
});

test("to - child", (t) => {
	const outline = pipe(init())(edit("root"), addChild(), edit("child"), home());

	t.is(
		to(outline),
		`root
  child`
	);
});

test("to - children", (t) => {
	const outline = pipe(init())(
		edit("root"),
		addChild(),
		edit("child"),
		addSiblin(),
		addSiblin(),
		home()
	);

	t.is(
		to(outline),
		`root
  child
  ${emptyNode}
  ${emptyNode}`
	);
});

test("to - extended family", (t) => {
	const outline = pipe(init())(
		addChild(),
		addChild(),
		parent(),
		addSiblin(),
		addSiblin(),
		home()
	);

	t.is(
		to(outline),
		`${emptyNode}
  ${emptyNode}
    ${emptyNode}
  ${emptyNode}
  ${emptyNode}`
	);
});

const indent = (line: string) =>
	/^( *)([^ ]*)/.exec(line)?.[1].length! / 2 || 0;

test("indent level", (t) => {
	t.is(indent("a") as any, 0);
	t.is(indent("  a" as any), 1);
	t.is(indent("    a"), 2);
});

const from = (plain: string) => {
	const lines = split(plain, "\n");
	const o = init();

	for (const line of lines) {
		const l = indent(line);

		if ()
	}

	edit(plain)(o);
};

// test("from - single", (t) => {
// 	const plain = "root";

// 	t.deepEqual(to(from(plain)), "root");
// });

// test("from - child", (t) => {
// 	const plain = "root\n  child";

// 	t.deepEqual(to(from(plain)), plain);
// 	t.deepEqual(keys(from(plain).nodes).length, 2);
// });
