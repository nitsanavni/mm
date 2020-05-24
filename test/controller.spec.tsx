import React, { useState, useMemo } from "react";
import test from "ava";
import { render } from "ink-testing-library";
import { noop, camelCase, lowerCase, trim, upperCase, snakeCase } from "lodash";
import { Subject } from "rxjs";

type TextProps = { text: string };
const Text = ({ text }: TextProps) => <>{text}</>;

type CB<T> = (value: T) => void;
type ON<T> = CB<CB<T>>;

type TextCb = CB<string>;
type OnTextCb = ON<string>;

type Transform = (text: string) => string;

// rename to 'Action'?
type Control = "upper" | "lower" | "camel" | "snake" | "reset";

const reset = () => "initial state";

const controlMap: { [key in Control]?: Transform } = {
	upper: upperCase,
	camel: camelCase,
	lower: lowerCase,
	snake: snakeCase,
	reset,
};

const makeComponent = (onControl: ON<Control>) => () => {
	const [text, setText] = useState(reset);

	useMemo(
		() =>
			onControl((control: Control) =>
				setText((txt) => controlMap[control]!(txt))
			),
		[]
	);

	return <>{text}</>;
};

test.todo("component could know rxjs itself, instead of callbacks");
test.todo("takeUntil to prevent leaks?");

test("subscribe to control stream", (t) => {
	const subject = new Subject<Control>();
	const on: ON<Control> = (cb) => subject.subscribe(cb);
	const next: CB<Control> = (control) => subject.next(control);
	const Component = makeComponent(on);
	const { lastFrame } = render(<Component />);

	t.is(lastFrame(), "initial state");

	next("snake");

	t.is(lastFrame(), "initial_state");

	next("camel");

	t.is(lastFrame(), "initialState");
});

test("set of supported transforms, aka controls", (t) => {
	let cb: CB<Control>;
	const Component = makeComponent((controlCb: CB<Control>) => (cb = controlCb));
	const { lastFrame } = render(<Component />);

	t.is(lastFrame(), "initial state");

	cb!("snake");

	t.is(lastFrame(), "initial_state");

	cb!("camel");

	t.is(lastFrame(), "initialState");
});

test("transform text", (t) => {
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

test("skeleton take 2, onControl is not a prop", (t) => {
	const makeStateComponent = (onControl: OnTextCb = noop) => () => {
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
	type StateProps = { onControl?: OnTextCb };

	const State = ({ onControl = noop }: StateProps) => {
		const [text, set] = useState("initial");

		onControl(set);

		return <Text {...{ text }} />;
	};

	t.is(render(<State />).lastFrame(), "initial");

	let ourCb: (text: string) => void;
	const testOnControl = (cb: (text: string) => void) => (ourCb = cb);

	const ControlComponent = () => <State onControl={testOnControl} />;

	const { lastFrame: controlLastFrame } = render(<ControlComponent />);

	t.is(controlLastFrame(), "initial");

	ourCb!("new value");

	t.is(controlLastFrame(), "new value");
});
