import React from "react";
import test from "ava";
import { render } from "ink-testing-library";

import { Player } from "../src/demo";
import stripAnsi from "strip-ansi";

test("move up", (t) => {
	const { lastFrame } = render(<Player clip="move up" />);

	t.is(
		stripAnsi(lastFrame()),
		`    /A - first
list·B - second
    \\C - third`
	);
});
