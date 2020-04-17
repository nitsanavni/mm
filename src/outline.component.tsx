import React, { useState, useEffect } from "react";
import { init, OutlineNode, edit } from "./outline";
import { Box } from "ink";
import { UncontrolledTextInput as Input } from "ink-text-input";
import { map } from "lodash";

// TODO - extract component
const Layout = ({
	n,
	onSubmit,
}: {
	n: OutlineNode;
	onSubmit: (value: string) => void;
}) => (
	<Box flexDirection="column">
		<Input key={`title ${n.key}`} focus={n.focused} onSubmit={onSubmit} />
		{map(n.down, (c) => (
			<Layout n={c} onSubmit={onSubmit} />
		))}
	</Box>
);

export const Outline = () => {
	const [o, setO] = useState(init());

	// TODO - move this to hoc / wrapper
	const [takeInput, setTakeInput] = useState(false);

	useEffect(() => {
		if (!takeInput) {
			setTakeInput(true);
		}

		return () => setTakeInput(false);
	}, []);

	return <Layout n={o.root} onSubmit={(value) => setO(edit(value)(o))} />;
};
