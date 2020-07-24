import React from "react";
import test from "ava";
import { render } from "ink-testing-library";
import { find } from "lodash";
import stripAnsi from "strip-ansi";

import { Player } from "../src/demo";
import { clips } from "../src/clips";

test.todo("demo page layout");

test("move up", (t) => {
	const { lastFrame } = render(
		<Player clip={find(clips, { name: "move up" })!.clip} />
	);

	t.is(
		stripAnsi(lastFrame()!),
		`    /A - first
list·B - second
    \\C - third`
	);
});
