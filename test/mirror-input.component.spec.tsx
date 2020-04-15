import * as React from "react";
import test from "ava";
import { render } from "ink-testing-library";
import { MirrorInput } from "../src/mirror-input.component";

test("init - empty", (t) => {
	const { lastFrame } = render(<MirrorInput />);

	t.is(lastFrame(), "");
});

test("app mirrors input", (t) => {
	const { stdin, lastFrame } = render(<MirrorInput />);

	stdin.write("hello\n\r");

	// how to trigger a rerender of the same element tree after stdin.write()?
	// rerender(??)

	t.is(lastFrame(), "hello"); // of course, fails
});
