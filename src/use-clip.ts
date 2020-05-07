import { useCallback, useState } from "react";

import { next } from "./play-control";
import { Clip } from "./clip";

type CB = () => void;
type MS = number;

// TODO - clearTimeout in useEffect clean-up
const useTimeout = (cb: CB, duration: MS, memo: any) =>
	useCallback(() => setTimeout(cb, duration), [memo])();

export const useClip = (clip: Clip) => {
	const [state, setState] = useState(next({ clip }));

	useTimeout(
		() => setState((s) => next({ ...s, clip })),
		clip.rate,
		state.nextStep
	);

	return state.o;
};
