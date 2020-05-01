import React, { useState, useCallback } from "react";
import test from "ava";
import { render } from "ink-testing-library";
import { times, sample } from "lodash";
import FakeTimers from "@sinonjs/fake-timers";

import { Clip } from "../src/clip";
import { PlainOutline } from "../src/plain-outline";
import { next } from "../src/play-control";
import {
	edit,
	addChild,
	addSiblin,
	moveLeft,
	moveDown,
	moveRight,
} from "../src/outline";

type CB = () => void;

test("setTimeout", (t) => {
	const clock = FakeTimers.install();

	const TimeoutUser = () => {
		const [s, set] = useState(0);

		useCallback(() => setTimeout(() => set((s) => s + 1), 100), [s])();

		return <>{s}</>;
	};

	const { lastFrame } = render(<TimeoutUser />);

	times(5, (it) => (t.is(lastFrame(), `${it}`), clock.tick(100)));

	clock.uninstall();
});

test.failing("useTimer", (t) => {
	type MS = number;

	type Timeout = (cb: CB, ms: MS) => void;

	const makeUseTimer = (to: Timeout) => (cb: CB, duration: MS) => {
		const [timing, setTiming] = useState(false);

		if (timing) {
			return;
		} else {
			setTiming(true);
			to(() => (setTiming(false), cb()), duration);
		}
	};

	let tick: CB;
	const useTimer = makeUseTimer((cb: CB) => (tick = cb));

	const TimerUser = () => {
		const [s, set] = useState(0);

		useTimer(() => set(s + 1), 70);

		return <>{s}</>;
	};

	const { lastFrame } = render(<TimerUser />);

	t.is(lastFrame(), "0");

	tick!();

	t.is(lastFrame(), "1");

	tick!();
	tick!();
	tick!();

	tick!();
	t.is(lastFrame(), "2");
});

type P = { clip: Clip };

test("play a clip", (t) => {
	// TODO - can this cb hell be simplified?
	let tick: CB;
	let tock: CB;

	const useTimer = (cb: CB) => ((tick = cb), (tock = cb));

	const useClip = (clip: Clip) => {
		const [state, setState] = useState(next({ clip }));
		useTimer(() => setState(next({ ...state, clip })));

		return state.o;
	};

	const PlainClipPlayer = ({ clip }: P) => (
		<PlainOutline n={useClip(clip).visibleRoot} />
	);

	const clip: Clip = {
		rate: 0,
		steps: [
			[
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
			moveLeft(),
			moveDown(),
			moveRight(),
			moveLeft(),
		],
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
			t.is(lastFrame(), expectedFrames[it % expectedFrames.length], `${it}`),
			sample([tick, tock])!()
		)
	);
});
