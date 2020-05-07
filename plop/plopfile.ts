import { NodePlopAPI } from "plop";

export default function (plop: NodePlopAPI) {
	plop.setGenerator("test", {
		description: "a test",
		prompts: [],
		actions: [],
	});
}
