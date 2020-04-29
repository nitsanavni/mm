import readline from "readline";

export const clearScreen = () => {
	const blank = "\n".repeat(process.stdout.rows);
	// tslint:disable-next-line
	console.log(blank);
	readline.cursorTo(process.stdout, 0, 0);
	readline.clearScreenDown(process.stdout);
};
