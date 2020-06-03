import React, { memo, useState } from "react";
import test from "ava";
import { render } from "ink-testing-library";
import { spy } from "sinon";

import { CB } from "../src/types";

const nodeSpy = spy();

const Node = memo(({ text }: { text: string }) => {
	nodeSpy(text);

	return <>{text}</>;
});

const Two = spy(({ lhs, rhs }: { lhs: string; rhs: string }) => (
	<>
		<Node text={lhs} />
		<Node text={rhs} />
	</>
));

let s: CB<void>;
const onSwitch = (cb: CB<void>) => (s = cb);

let setL: CB<string>;
const onL = (cb: CB<string>) => (setL = cb);

const Stateful = spy(() => {
	const [{ r, l }, set] = useState({ r: "X", l: "Y" });

	onSwitch(() => set({ l: r, r: l }));
	onL((value) => set({ l: value, r }));

	return <Two lhs={l} rhs={r} />;
});

test("render", (t) => {
	const { lastFrame, frames } = render(<Stateful />);

	t.is(lastFrame(), "Y\nX");
	t.is(frames.length, 1);

	t.is(Stateful.callCount, 1);
	t.is(nodeSpy.callCount, 2);
	t.is(Two.callCount, 1);

	s();

	t.is(lastFrame(), "X\nY");
	t.is(frames.length, 2);

	t.is(Stateful.callCount, 2);
	t.is(nodeSpy.callCount, 4);
	t.is(Two.callCount, 2);

	setL("O");

	t.is(lastFrame(), "O\nY");
	t.is(frames.length, 3);

	t.is(Stateful.callCount, 3);
	t.is(nodeSpy.callCount, 5);
	t.is(Two.callCount, 3);
});
