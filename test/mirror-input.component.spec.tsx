import test from "ava";
import { render } from "ink-testing-library";

import * as React from "react";
import chalk from "chalk";

import { MirrorInput } from "../src/mirror-input.component";
import { Input } from "../src/ui";
import { tick } from "../src/tick";

const CURSOR = chalk.inverse(" ");

test.failing("input", async (t) => {
	const { lastFrame, stdin } = render(<Input focus={true} />);

	await tick();

	// t.is(lastFrame(), CURSOR);

	await tick();

	stdin.write("X");

	t.is(lastFrame(), `X${CURSOR}`);
});

test("init - empty", (t) => {
	const { lastFrame } = render(<MirrorInput />);

	t.is(lastFrame(), "");
});

test("app mirrors input", async (t) => {
	const { stdin, lastFrame } = render(<MirrorInput />);

	t.is(lastFrame(), "");

	await tick();

	stdin.write("hello");

	t.is(lastFrame(), "hello");
});
