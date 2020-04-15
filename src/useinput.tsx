import * as React from "react";
import { useState, useContext } from "react";
import { useInput, useStdin, Box, AppContext, Text } from "ink";

export const Robot = () => {
    const { exit } = useContext(AppContext);
    const [i, setI] = useState("");

    const { stdin, isRawModeSupported } = useStdin();

    if (isRawModeSupported) {
        useInput((input) => {
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
            <Box height={12} paddingLeft={1} paddingTop={1} textWrap="truncate-middle">
                <Text>{i}</Text>
            </Box>
        </Box>
    );
};
