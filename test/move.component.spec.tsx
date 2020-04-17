import React from "react";
import test from "ava";
import { render } from "ink-testing-library";
import { Move } from "../src/move.component";
import { tick } from "../src/tick";

// TODO - withMovement HOC
// TODO - withMountedInput HOC
// TODO - support multi-line nodes

type Node = {
	label: string;
	children: Node[] | undefined;
};

// const left = "\u001b[D";
const right = "\u001b[C";
// const up = "\u001b[A";
const down = "\u001b[B";
// const escape = "\u001b";
// const f2 = "\u001bOQ";
// const tab = "\t";
// const returnKey = "\r";

test("move", async (t) => {
	const { stdin, lastFrame } = render(<Move w={3} h={3} />);

	t.is(lastFrame(), "XOO\nOOO\nOOO");

	await tick();

	stdin.write(right);
	stdin.write(down);

	await tick();

	t.is(lastFrame(), "OOO\nOXO\nOOO");
});
