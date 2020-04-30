import React, { useState } from "react";
import test from "ava";
import { render } from "ink-testing-library";

import { Clip } from "../src/clip";
import { PlainOutline } from "../src/plain-outline";
import { initWith, next } from "../src/play-control";
import { edit, addChild } from "../src/outline";

test("hmm", (t) => {
	type P = { clip: Clip };

	// TODO - can this cb hell be simplified?
	type CB = () => void;

	let ourCb: CB;

	const tick = () => ourCb && ourCb();

	const useTimer = (cb: CB) => (ourCb = cb);

	const UseClip = ({ clip }: P) => {
		const [o, set] = useState({ o: initWith(clip).o });

		useTimer(() => set({ o: next({ clip, o: o.o, nextStep: 0 }).o }));

		return <PlainOutline n={o.o.visibleRoot} />;
	};

	const clip = {
		initialState: [edit("root"), addChild(), edit("child")],
		rate: 0,
		steps: [edit("modified child")],
	};

	const { lastFrame } = render(<UseClip {...{ clip }} />);

	t.is(lastFrame(), "root\n  child");

	tick();

	t.is(lastFrame(), "root\n  modified child");
});
