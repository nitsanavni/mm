import { NodePlopAPI } from "plop";
import execa from "execa";
import getStream from "get-stream";

export default function (plop: NodePlopAPI) {
	const path = "test/{{name}}.spec.{{ts}}";

	plop.setActionType("git add", async (answers: any, _, p) => {
		const filePath = p?.renderString(path, answers)!;

		await execa("git", ["add", filePath]);

		const { stdout } = await execa("git", ["status", "-s", filePath]);

		return stdout;
	});

	plop.setGenerator("test", {
		description: "a test",
		prompts: [
			{ message: "name", name: "name" },
			{ type: "list", choices: ["ts", "tsx"], name: "ts" },
		],
		actions: [
			(ans: any) => (
				(ans.isReact = ans.ts === "tsx"),
				ans.isReact ? "it's a react test, got it" : "not a react test"
			),
			{
				type: "add",
				path,
				template: `{{#if isReact}}import React from "react";
{{/if}}
import test from "ava";

test("", (t) => {});
`,
			},
			{ type: "git add" },
		],
	});
}
