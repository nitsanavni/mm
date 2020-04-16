import test from "ava";
import { render } from "ink-testing-library";

import * as React from "react";
import chalk from "chalk";

import { MirrorInput } from "../src/mirror-input.component";
import { Input } from "../src/ui";
import { tick } from "../src/tick";
import { sleep } from "../src/sleep";

const CURSOR = chalk.inverse(" ");

test.serial("input", async (t) => {
	const { lastFrame, stdin } = render(<Input focus={true} />);

	await sleep(10);

	t.is(lastFrame(), CURSOR);

	await tick();

	stdin.write("X");

	t.is(lastFrame(), `X${CURSOR}`);
});

test.serial("init - empty", (t) => {
	const { lastFrame } = render(<MirrorInput />);

	t.is(lastFrame(), "");
});

test.serial("app mirrors input", (t) => {
	const { stdin, lastFrame } = render(<MirrorInput />);

	t.is(lastFrame(), "");

	stdin.write("hello");

	t.is(lastFrame(), "hello");
});
