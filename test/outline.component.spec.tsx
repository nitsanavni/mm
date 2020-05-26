import React from "react";
import test from "ava";
import { render } from "ink-testing-library";
import stripAnsi from "strip-ansi";
import chalk from "chalk";
import { trimEnd, noop } from "lodash";

import { Outline, makeOutline } from "../src/outline.component";
import { rturn } from "./keys";
import { cursor } from "./cursor";
import { tick } from "./tick";
import { Key } from "../src/key";
import { CB } from "../src/types";

test("inject `onKey`", (t) => {
	let next: CB<Key> = noop;
	const Component = makeOutline((cb) => (next = cb));

	const { lastFrame, stdin } = render(<Component />);

	const is = (...lines: string[]) =>
		t.is(trimEnd(stripAnsi(lastFrame())), lines.join("\n"));

	is("");

	stdin.write("hello"); // edit node text
	next("tab"); // add child node
	stdin.write("world");
	next("return"); // stop editing node
	next("return"); // add sibling node
	stdin.write("A");
	next("return");
	next("return");
	stdin.write("B");
	next("return");
	next("alt up"); // move node up, move B above A
	next("tab"); // add children to B
	stdin.write("1");
	next("return");
	next("return");
	stdin.write("2");
	next("return");
	next("return");
	stdin.write("3");
	next("return");

	const r = String.raw;

	is(
		r`     /world`,
		r`       /1`,
		r`hello·B·2`, // B with its children are above A
		r`       \3`,
		r`     \A`
	);

	next("left"); // go from 3 to its parent B
	next("space"); // collapse

	is(
		// prettier please
		r`     /world`,
		r`hello·B+`, // B is collapsed
		r`     \A`
	);

	next("alt point"); // zoom in

	is("+B+"); // zoom in on B
});

test.failing("edit the root", async (t) => {
	const { lastFrame, stdin } = render(<Outline />);

	const plainLastFrame = () => stripAnsi(lastFrame());

	t.is(lastFrame(), chalk.bold(cursor));

	stdin.write("boom root node!");

	t.is(plainLastFrame(), `boom root node! `);

	stdin.write(rturn);

	t.is(plainLastFrame(), "boom root node!");
});

test.failing("add first child - hit return", async (t) => {
	const { lastFrame, stdin } = render(<Outline />);

	const plainLastFrame = () => stripAnsi(lastFrame());

	stdin.write("root");
	stdin.write(rturn); // exit edit mode

	t.is(plainLastFrame(), "root");

	// I still don't know why this is needed
	await tick();

	stdin.write(rturn); // create a new child node in edit mode
	stdin.write("child"); // edit the node

	t.is(lastFrame(), `root\n${chalk.bold(`child${cursor}`)}`);

	stdin.write(rturn); // exit edit mode

	t.is(lastFrame(), `root\n${chalk.bold("child")}`);
});
