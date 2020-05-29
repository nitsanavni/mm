import React from "react";
import { ExecutionContext } from "ava";
import { render } from "ink-testing-library";
import { noop } from "lodash";
import stripAnsi from "strip-ansi";

import { CB } from "../src/types";
import { Key } from "../src/key";
import { makeOutline } from "../src/outline.component";

export const helper = (t: ExecutionContext) => {
	let next: CB<Key> = noop;
	const Component = makeOutline((cb) => (next = cb));

	const { lastFrame, stdin } = render(<Component />);

	const is = (...lines: string[]) =>
		t.is(stripAnsi(lastFrame()), lines.join("\n"));

	return { next, write: (str: string) => stdin.write(str), is };
};
