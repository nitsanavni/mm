import React, { useState } from "react";
import test from "ava";
import { render } from "ink-testing-library";
import { noop, camelCase, lowerCase, trim } from "lodash";

type TextProps = { text: string };
const Text = ({ text }: TextProps) => <>{text}</>;

type TextCb = (text: string) => void;
type OnControl = (cb: TextCb) => void;

test("transform text", (t) => {
	type Transform = (text: string) => string;
	type TransformCb = (transform: Transform) => void;
	type OnTransform = (transformCb: TransformCb) => void;

	const makeStateComponent = (onTransform: OnTransform) => () => {
		const [text, setText] = useState("initial state");

		onTransform((transform) => setText(transform(text)));

		return <>{text}</>;
	};

	let cb: TransformCb;
	const State = makeStateComponent((transformCb) => (cb = transformCb));

	const { lastFrame } = render(<State />);

	t.is(lastFrame(), "initial state");

	cb!(camelCase);

	t.is(lastFrame(), "initialState");

	cb!(lowerCase);

	t.is(lastFrame(), "initial state");

	cb!((text) => trim(text, "inte"));

	t.is(lastFrame(), "al sta");
});

test("sanity", (t) => {
	t.is(render(<Text text="hello" />).lastFrame(), "hello");
});

test("skeleton take 2", (t) => {
	const makeStateComponent = (onControl: OnControl = noop) => () => {
		const [text, setText] = useState("initial");

		onControl(setText);

		return <Text {...{ text }} />;
	};

	const NoopState = makeStateComponent();

	t.is(render(<NoopState />).lastFrame(), "initial");

	let cb: TextCb;
	const ControlledState = makeStateComponent((textCb) => (cb = textCb));

	const { lastFrame } = render(<ControlledState />);

	t.is(lastFrame(), "initial");

	cb!("new value");

	t.is(lastFrame(), "new value");

	cb!("yet another value");

	t.is(lastFrame(), "yet another value");
});

test("contolled mindmap skeleton", (t) => {
	// maybe `onControl` shouldn't be a prop?
	type StateProps = { onControl?: OnControl };

	const State = ({ onControl = noop }: StateProps) => {
		const [text, set] = useState("initial");

		onControl(set);

		return <Text {...{ text }} />;
	};

	t.is(render(<State />).lastFrame(), "initial");

	let ourCb: (text: string) => void;
	const testOnControl = (cb: (text: string) => void) => (ourCb = cb);

	const Control = () => <State onControl={testOnControl} />;

	const { lastFrame: controlLastFrame } = render(<Control />);

	t.is(controlLastFrame(), "initial");

	ourCb!("new value");

	t.is(controlLastFrame(), "new value");
});
