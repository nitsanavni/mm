import test from "ava";
import { render } from "ink-testing-library";

import * as React from "react";
import chalk from "chalk";

import { MirrorInput } from "../src/mirror-input.component";
import { Input } from "../src/ui";

const CURSOR = chalk.inverse(" ");

test("input", (t) => {
	const { lastFrame, stdin } = render(<Input focus={true} />);

	t.is(lastFrame(), CURSOR);

	stdin.write("X");

	t.is(lastFrame(), `X${CURSOR}`);
});

test("init - empty", (t) => {
	const { lastFrame } = render(<MirrorInput />);

	t.is(lastFrame(), "");
});

test("app mirrors input", (t) => {
	const { stdin, lastFrame } = render(<MirrorInput />);

	t.is(lastFrame(), "");

	stdin.write("hello");

	t.is(lastFrame(), "hello");
});
