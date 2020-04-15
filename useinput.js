"use strict";
const { useState, useContext } = require("react");
const React = require("react");
const { render, useInput, useStdin, Text, Box, AppContext } = require("ink");

const log = (o) => console.log(o) && o;

const Robot = () => {
    const { exit } = useContext(AppContext);
    const [x, setX] = useState(1);
    const [y, setY] = useState(1);
    const [i, setI] = useState(1);

    const { stdin, isRawModeSupported } = useStdin();

    if (isRawModeSupported) {
        useInput((input, key) => {
            if (input === "q") {
                exit();
            } else {
                setI(input);
            }
        });
    } else {
        stdin.on("data", (d) => {
            stdin.removeAllListeners("data");
            setI(d.toString());
        });
    }

    return (
        <Box flexDirection="column">
            <Text>Use arrow keys to move the face. Press “q” to exit.</Text>
            <Box height={12} paddingLeft={x} paddingTop={y} textWrap="truncate-middle">
                <Text>{i}</Text>
            </Box>
        </Box>
    );
};

module.exports = Robot;
