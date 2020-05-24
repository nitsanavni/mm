import { map as _map, range, reduce } from "lodash";
import { inspect } from "util";
import { Key } from "./key";

type From = {
	input?: string;
	codes?: number[];
	meta?: boolean;
	ctrl?: boolean;
};

type Hash = string;

const codes = (input: string) =>
	_map(range(input.length), (i) => input.charCodeAt(i));
const hash: (from: From) => Hash = (f) =>
	inspect([
		...(f.codes || (f.input && codes(f.input)) || []),
		!!f.ctrl,
		!!f.meta,
	]);

const tuples: [From, Key][] = [
	[{ input: " " }, "space"],
	[{ input: "i", ctrl: true }, "tab"],
	[{ input: "[Z", meta: true }, "shift tab"],
	[{ input: "[3~", meta: true }, "fn backspace"],
	[{ codes: [127] }, "backspace"],
	[{ input: "i", ctrl: true }, "tab"],
	[{ input: "i", ctrl: true }, "tab"],
	[{ codes: [13], meta: true }, "alt return"],
	[{ input: ".", meta: true }, "alt point"],
	[{ input: ",", meta: true }, "alt comma"],
	[{ input: "q" }, "q"],
	[{ input: "d" }, "d"],
	[{ input: "/" }, "slash"],
	[{ input: "`", ctrl: true }, "ctrl space"],
];

// const altLeft = () => isEqual(charCodes, [27, 91, 68]);
// const altRight = () => isEqual(charCodes, [27, 91, 67]);
// const altUp = () => isEqual(charCodes, [27, 91, 65]);
// const altDown = () => isEqual(charCodes, [27, 91, 66]);

const map: Record<Hash, Key> = reduce<[From, Key], Record<Hash, Key>>(
	tuples,
	(acc: Record<Hash, Key>, [from, key]: [From, Key]) => (
		(acc[hash(from)] = key), acc
	),
	{}
);

type GetParams = {
	input: string;
	key: { meta: boolean; ctrl: boolean };
};

export const get = ({ input, key: { meta, ctrl } }: GetParams) =>
	map[hash({ input, meta, ctrl })] || "unrecognized";
