import { NodePlopAPI } from "plop";

export default function (plop: NodePlopAPI) {
	plop.setGenerator("test", {
		description: "a test",
		prompts: [
			{ message: "name", name: "name" },
			{ type: "list", choices: ["ts", "tsx"], name: "ts" },
		],
		actions: [
			(ans: any) => ((ans.isReact = ans.ts === "tsx"), ""),
			{
				type: "add",
				path: "test/{{name}}.spec.{{ts}}",
				template: `{{#if isReact}}import React from "react";
{{/if}}
import test from "ava";

test("", (t) => {});
`,
			},
		],
	});
}
