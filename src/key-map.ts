import {
	Mode,
	Transform,
	expand,
	addChild,
	previousSiblin,
	nextSiblin,
	goToParent,
	child,
	toggleExpandCollapse,
	addSiblin,
	home,
	toggleDeepCollapse,
	toggleCollapseLeft,
	deleteSubTree,
	moveLeft,
	moveRight,
	moveUp,
	moveDown,
} from "./outline";
import { Key } from "./key";

export type Action = {
	fn?: () => void;
	t?: Transform[];
	mode?: Mode;
};

export const map: { [mode in Mode]?: { [key in Key]?: Action } } = {
	browse: {
		up: { t: [previousSiblin()] },
		down: { t: [nextSiblin()] },
		left: { t: [goToParent()] },
		right: { t: [expand(), child()] },
		space: { t: [toggleExpandCollapse()] },
		return: { t: [addSiblin()], mode: "edit node" },
		escape: { t: [home()] },
		"alt up": { t: [moveUp()] },
		"alt down": { t: [moveDown()] },
		"alt left": { t: [moveLeft()] },
		"alt right": { t: [moveRight()] },
		q: { fn: () => process.exit() },
		"ctrl space": { t: [toggleDeepCollapse()] },
		"alt point": { t: [toggleCollapseLeft()] },
		"alt comma": { t: [toggleCollapseLeft()] },
		"fn backspace": { t: [deleteSubTree()] },
		d: { t: [deleteSubTree()] },
		"alt return": { mode: "edit node" },
		backspace: { mode: "edit node" },
		tab: { t: [expand(), addChild()], mode: "edit node" },
	},
	"edit node": {
		tab: { t: [expand(), addChild()], mode: "edit node" },
		return: { mode: "browse" },
		escape: { mode: "browse" },
	},
};
