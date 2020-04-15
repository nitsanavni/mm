import * as React from "react";
import test, { cb } from "ava";
import { render } from "ink-testing-library";
import { App } from "../src/ui";

test("init - empty", (t) => {
    const { lastFrame } = render(<App />);

    t.is(lastFrame(), "");
});

test("app mirrors input", (t) => {
    const { stdin, rerender, lastFrame } = render(<App />);

    stdin.write("hello\n\r");

    // how to trigger a rerender of the same element tree after stdin.write()?
    // rerender(??)

    t.is(lastFrame(), "hello"); // of course, fails
});
