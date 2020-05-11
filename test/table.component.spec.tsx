import React from "react";
import test from "ava";
import { render } from "ink-testing-library";

import { Table } from "../src/table/component";

test.todo("takes input on its own, as long as serves as delegate");

test("focus POC", (t) => {
	const { lastFrame } = render(
		<Table
			columns={[
				[{ value: "C1" }, { value: "hello", focused: true }],
				[{ value: "C2" }, { value: "world" }],
			]}
		/>
	);

	t.is(lastFrame(), "|C1     |C2   |\n|*hello*|world|");
});

test("empty", (t) => {
	const { lastFrame } = render(<Table />);

	t.is(lastFrame(), "|·|");
});

test("long", (t) => {
	const { lastFrame } = render(
		<Table
			columns={[
				["C1", "lon______g"],
				["C2", "short"],
			].map((c) => c.map((value) => ({ value })))}
		/>
	);

	t.is(lastFrame(), "|C1        |C2   |\n|lon______g|short|");
});

test("table", (t) => {
	const { lastFrame } = render(
		<Table
			columns={[
				["C1", "1", "2", "3"],
				["C2", "4", "5", "6"],
			].map((c) => c.map((value) => ({ value })))}
		/>
	);

	t.is(lastFrame(), "|C1|C2|\n|1 |4 |\n|2 |5 |\n|3 |6 |");
});
