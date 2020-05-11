// https://github.com/lodash/lodash/issues/2173#issuecomment-406597580
export const rotateLeft = <T>(a: T[]) => (a.push(a.shift()!), a.length - 1);
export const rotateRight = <T>(a: T[]) => (a.unshift(a.pop()!), 0);
