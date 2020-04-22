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
import { to } from "./to-plain-outline";

const emptyNode = "·";

test("to - null", (t) => {
	const outline = pipe(init())(home());

	t.is(to(outline), emptyNode);
});

test("to - one node", (t) => {
	const outline = pipe(init())(edit("root"), home());

	t.is(to(outline), "root");
});

test("to - child", (t) => {
	const outline = pipe(init())(edit("root"), addChild(), edit("child"), home());

	t.is(
		to(outline),
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

	t.is(
		to(outline),
		`root
  child
  ${emptyNode}
  ${emptyNode}`
	);
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

	t.is(
		to(outline),
		`${emptyNode}
  ${emptyNode}
    ${emptyNode}
  ${emptyNode}
  ${emptyNode}`
	);
});
