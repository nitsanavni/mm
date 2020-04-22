import test from "ava";
import { keys, first, values, last } from "lodash";

import { indent, stripIndent, from } from "../src/plain-from-outline";
import { to } from "./to-plain-outline";

test("indent level", (t) => {
	t.is(indent("a") as any, 0);
	t.is(indent("  a" as any), 1);
	t.is(indent("    a"), 2);
});

test("stripIndent", (t) => {
	t.is(stripIndent("  child"), "child");
});

test("single", (t) => {
	const plain = "root";

	t.deepEqual(to(from(plain)), "root");
});

test("from - child", (t) => {
	const plain = "root\n  child";

	t.deepEqual(to(from(plain)), plain);
	t.deepEqual(keys(from(plain).nodes).length, 2);
});

test("from - two children", (t) => {
	const plain = "root\n  child\n  child";

	t.deepEqual(to(from(plain)), plain);
	t.deepEqual(keys(from(plain).nodes).length, 3);
});

test("from - linear", (t) => {
	const plain = "0\n  1\n    2\n      3";

	t.deepEqual(to(from(plain)), plain);
	t.deepEqual(keys(from(plain).nodes).length, 4);
	t.deepEqual(first(values(from(plain).nodes))?.label, "0");
	t.deepEqual(last(values(from(plain).nodes))?.label, "3");
});

test("from - pyramid", (t) => {
	const plain = `0
  1
    2
      3
    4
  5`;

	t.deepEqual(to(from(plain)), plain);
	t.deepEqual(keys(from(plain).nodes).length, 6);
});

test("from - eratic", (t) => {
	const plain = `0
  1
    2
      3
  4
  5
    6
      7
      8
  9`;

	t.deepEqual(to(from(plain)), plain);
	t.deepEqual(keys(from(plain).nodes).length, 10);
});
