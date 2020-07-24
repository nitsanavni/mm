import React from "react";
import test from "ava";
import { render } from "ink-testing-library";
import stripAnsi from "strip-ansi";
import chalk from "chalk";

import { Outline } from "../src/outline.component";
import { rturn } from "./keys";
import { cursor } from "./cursor";
import { tick } from "./tick";

test.failing("edit the root", async (t) => {
	const { lastFrame, stdin } = render(<Outline />);

	const plainLastFrame = () => stripAnsi(lastFrame()!);

	t.is(lastFrame(), chalk.bold(cursor));

	stdin.write("boom root node!");

	t.is(plainLastFrame(), `boom root node! `);

	stdin.write(rturn);

	t.is(plainLastFrame(), "boom root node!");
});

test.failing("add first child - hit return", async (t) => {
	const { lastFrame, stdin } = render(<Outline />);

	const plainLastFrame = () => stripAnsi(lastFrame()!);

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
