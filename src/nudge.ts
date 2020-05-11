import { rotateRight, rotateLeft } from "./rotate";
import { swap } from "./swap";

export const nudgeRight = <T>(a: T[], i: number) =>
	i === a.length - 1 ? rotateRight(a) : swap(a, i, i + 1);

export const nudgeLeft = <T>(a: T[], i: number) =>
	i === 0 ? rotateLeft(a) : swap(a, i, i - 1);
