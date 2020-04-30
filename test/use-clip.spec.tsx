import React, { useState } from "react";
import test from "ava";
import { render } from "ink-testing-library";
import { times, sample } from "lodash";

import { Clip } from "../src/clip";
import { PlainOutline } from "../src/plain-outline";
import { initWith, next } from "../src/play-control";
import {
	edit,
	addChild,
	addSiblin,
	moveLeft,
	moveDown,
	moveRight,
} from "../src/outline";

type P = { clip: Clip };
type CB = () => void;

test("play a clip", (t) => {
	// TODO - can this cb hell be simplified?
	let tick: CB;
	let tock: CB;

	const useTimer = (cb: CB) => ((tick = cb), (tock = cb));

	const useClip = (clip: Clip) => {
		const [state, setState] = useState(initWith(clip));
		useTimer(() => setState(next({ ...state, clip })));

		return state.o;
	};

	const PlainClipPlayer = ({ clip }: P) => (
		<PlainOutline n={useClip(clip).visibleRoot} />
	);

	const clip: Clip = {
		initialState: [
			edit("A"),
			addChild(),
			edit("1"),
			addSiblin(),
			edit("2"),
			addSiblin(),
			edit("3"),
			addChild(),
			edit("move me"),
		],
		rate: 0,
		steps: [moveLeft(), moveDown(), moveRight(), moveLeft()],
	};

	const { lastFrame } = render(<PlainClipPlayer {...{ clip }} />);

	const expectedFrames = [
		"A\n  1\n  2\n  3\n    move me", // init
		"A\n  1\n  2\n  3\n  move me", // moveLeft
		"A\n  move me\n  1\n  2\n  3", // moveDown
		"A\n  1\n    move me\n  2\n  3", // moveRight
		"A\n  1\n  move me\n  2\n  3", // moveLeft
	];

	times(
		30, // many times
		(it) => (
			t.is(lastFrame(), expectedFrames[it % expectedFrames.length]),
			sample([tick, tock])!()
		)
	);
});
