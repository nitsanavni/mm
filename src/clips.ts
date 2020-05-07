import { edit, addChild, addSiblin, previousSiblin, moveUp } from "./outline";
import { Clip } from "./clip";

export const clips: ReadonlyArray<{ name: string; clip: Clip }> = [
	{
		name: "move up",
		clip: {
			rate: 800,
			steps: [
				[
					edit("list"),
					addChild(),
					edit("A - first"),
					addSiblin(),
					edit("B - second"),
					addSiblin(),
					edit("C - third"),
					previousSiblin(),
				],
				moveUp(),
				moveUp(),
				moveUp(),
			],
		},
	},
];
