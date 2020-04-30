import { edit, addChild, addSiblin, previousSiblin } from "./outline";

export const clips = {
	"move up": {
		rate: 30,
		initialState: [
			edit("list"),
			addChild(),
			edit("A - first"),
			addSiblin(),
			edit("B - second"),
			addSiblin(),
			edit("C - third"),
			previousSiblin(),
		],
		steps: [{}],
	},
};
