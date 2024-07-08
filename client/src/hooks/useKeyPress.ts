import React, { useState } from "react";

type keyPressProps = {
    key: string;
};
const useKeyPress = function (targetKey: string) {
    const [keyPressed, setKeyPressed] = useState(false);

    function downHandler({ key }: keyPressProps) {
        if (key === targetKey) {
            setKeyPressed(true);
        }
    }

    const upHandler = ({ key }: keyPressProps) => {
        if (key === targetKey) {
            setKeyPressed(false);
        }
    };

    React.useEffect(() => {
        document.addEventListener("keydown", downHandler);
        document.addEventListener("keyup", upHandler);

        return () => {
            document.removeEventListener("keydown", downHandler);
            document.removeEventListener("keyup", upHandler);
        };
    });

    return keyPressed;
};

export default useKeyPress;