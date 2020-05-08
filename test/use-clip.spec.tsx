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
	previousSiblin,
} from "../src/outline";
import { useClip } from "../src/use-clip";

type CB = () => void;
type MS = number;

test.todo("variable rate");
test.todo("unmount -> timeout callback cleared");
test.todo("higher order step - `type(string)` -> many `edit(sub-string)`");

test("useClip", (t) => {
	const PlainClipPlayer = ({ clip }: P) => (
		<PlainOutline n={useClip(clip).visibleRoot} />
	);

	const clipFixture: Clip = {
		rate: 160,
		steps: [
			[
				edit("A"),
				addChild(),
				edit("1"),
				addSiblin(),
				edit("2"),
				previousSiblin(),
			],
			moveRight(),
			moveLeft(),
			edit(""),
			edit("h"),
			edit("he"),
			edit("hel"),
			edit("hell"),
			edit("hello"),
		],
	};

	const clock = FakeTimers.install();

	const { lastFrame } = render(<PlainClipPlayer clip={clipFixture} />);

	const expected = [
		"A\n  1\n  2",
		"A\n  2\n    1",
		"A\n  2\n  1",
		"A\n  2\n  ·",
		"A\n  2\n  h",
		"A\n  2\n  he",
		"A\n  2\n  hel",
		"A\n  2\n  hell",
		"A\n  2\n  hello",
	];

	times(
		40,
		(it) => (
			t.is(lastFrame(), expected[it % expected.length], `${it}`),
			clock.tick(clipFixture.rate)
		)
	);

	clock.uninstall();
});

test("useTimeout", (t) => {
	const clock = FakeTimers.install();

	const useTimeout = (cb: CB, duration: MS, memo: any) =>
		useCallback(() => setTimeout(cb, duration), [memo])();

	const frames = ["A", "B", "C"];
	const frameDurations = [30, 40, 50];

	const PlayerSkeleton = () => {
		const [currentFrame, setCurrentFrame] = useState(0);

		useTimeout(
			() => setCurrentFrame((f) => (f + 1) % frames.length),
			frameDurations[currentFrame],
			currentFrame
		);

		return <>{frames[currentFrame]}</>;
	};

	const { lastFrame } = render(<PlayerSkeleton />);

	times(
		20,
		(it) => (
			t.is(lastFrame(), frames[it % frames.length]),
			clock.tick(frameDurations[it % frames.length])
		)
	);

	clock.uninstall();
});

test("setTimeout", (t) => {
	const clock = FakeTimers.install();

	const useTimeout = () => {
		const [s, set] = useState(0);

		useCallback(() => setTimeout(() => set((state) => state + 1), 100), [s])();

		return s;
	};

	const TimeoutComponent = () => <>{useTimeout()}</>;

	const { lastFrame } = render(<TimeoutComponent />);

	times(5, (it) => (t.is(lastFrame(), `${it}`), clock.tick(100)));

	clock.uninstall();
});

test.failing("useTimer", (t) => {
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

	const useClipTest = (clip: Clip) => {
		const [state, setState] = useState(next({ clip }));
		useTimer(() => setState(next({ ...state, clip })));

		return state.o;
	};

	const PlainClipPlayer = ({ clip }: P) => (
		<PlainOutline n={useClipTest(clip).visibleRoot} />
	);

	const clipFixture: Clip = {
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

	const { lastFrame } = render(<PlainClipPlayer {...{ clip: clipFixture }} />);

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
