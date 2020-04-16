import React, { useState } from "react";
import PropTypes from "prop-types";
import { Box, useInput } from "ink";

import {
	UncontrolledTextInput as TextInput,
	InkUncontrolledTextInputProps as TextInputProps,
} from "ink-text-input";
import { MirrorInput } from "./mirror-input.component";

const noop = () => undefined;

export const Input = (props: Omit<TextInputProps, "onSubmit">) => (
	<TextInput {...props} highlightPastedText={true} onSubmit={noop} />
);

const Intercept = ({
	down,
	up,
	write,
}: {
	write: (s: string) => void;
	up: () => void;
	down: () => void;
}) => {
	useInput((input, key) => {
		if (key.downArrow) {
			down();
		} else if (key.upArrow) {
			up();
		} else {
			write(input);
		}
	});

	return <></>;
};

const Mediate = () => {
	const [t, setT] = useState(false);
	const [i1, setI1] = useState("");
	const [i2, setI2] = useState("");

	const toggle = () => setT(!t);
	const w = (s: string) => (t ? setI1(i1 + s) : setI2(i2 + s));

	return (
		<>
			<Intercept down={toggle} up={toggle} write={w} />
			<Input focus={t} />
			<Input focus={!t} />
		</>
	);
};

export const App = () => (
	<Box height={20} width="100%" flexDirection="column" justifyContent="center">
		<Box margin={0} flexDirection="row" justifyContent="center">
			<Box margin={0} justifyContent="center">
				<Mediate />
			</Box>
			<MirrorInput />
		</Box>
	</Box>
);

App.propTypes = {
	name: PropTypes.string,
};

App.defaultProps = {
	name: "Stranger",
};
