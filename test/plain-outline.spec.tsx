import test from "ava";

import {
	pipe,
	init,
	edit,
	addChild,
	addSiblin,
	home,
	parent,
} from "../src/outline";
import { to as toUsingComponent } from "./to-plain-outline";
import { to } from "../src/outline-to-plain";

const emptyNode = "·";

test("to - null", (t) => {
	const outline = pipe(init())(home());

	t.is(toUsingComponent(outline), emptyNode);
	t.is(to(outline), emptyNode);
});

test("to - one node", (t) => {
	const outline = pipe(init())(edit("root"), home());

	t.is(toUsingComponent(outline), "root");
	t.is(to(outline), "root");
});

test("to - child", (t) => {
	const outline = pipe(init())(edit("root"), addChild(), edit("child"), home());

	t.is(
		toUsingComponent(outline),
		`root
  child`
	);
});

test("to - children", (t) => {
	const outline = pipe(init())(
		edit("root"),
		addChild(),
		edit("child"),
		addSiblin(),
		addSiblin(),
		home()
	);
	const expected = `root
  child
  ${emptyNode}
  ${emptyNode}`;
	t.is(toUsingComponent(outline), expected);
	t.is(to(outline), expected);
});

test("to - extended family", (t) => {
	const outline = pipe(init())(
		addChild(),
		addChild(),
		parent(),
		addSiblin(),
		addSiblin(),
		home()
	);
	const expected = `${emptyNode}
  ${emptyNode}
    ${emptyNode}
  ${emptyNode}
  ${emptyNode}`;

	t.is(toUsingComponent(outline), expected);
	t.is(to(outline), expected);
});
