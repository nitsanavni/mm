import React from "react";
import test from "ava";
import { noop } from "lodash";
import { render } from "ink-testing-library";

import { OutlineLayout } from "../src/outline-layout.component";
import { cursor } from "./cursor";
import chalk from "chalk";

test.failing("null layout", (t) => {
	const { lastFrame } = render(
		<OutlineLayout
			onChange={noop}
			mode="browse"
			n={{ focused: true, key: "X", label: "" }}
		/>
	);

	t.is(lastFrame(), "");
});

test.failing("`edit node` mode", (t) => {
	const { lastFrame } = render(
		<OutlineLayout
			onChange={noop}
			mode="edit node"
			n={{ focused: true, key: "X", label: "" }}
		/>
	);

	t.is(lastFrame(), chalk.bold(cursor));
});

test.failing("label", (t) => {
	const { lastFrame } = render(
		<OutlineLayout
			onChange={noop}
			mode="browse"
			n={{ focused: false, key: "X", label: "my label" }}
		/>
	);

	t.is(lastFrame(), "my label");
});

test.failing("value + edit", (t) => {
	const { lastFrame } = render(
		<OutlineLayout
			onChange={noop}
			mode="edit node"
			n={{ focused: true, key: "X", label: "my label" }}
		/>
	);

	t.is(lastFrame(), chalk.bold(`my label${cursor}`));
});
