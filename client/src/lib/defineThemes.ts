import { loader } from "@monaco-editor/react";

const defineTheme = (theme: string) => {
    return new Promise<void>((res) => {
        Promise.all([
            loader.init(),
            import(`../constants/themes/${theme}.json`),
        ]).then(([monaco, themeData]) => {
            monaco.editor.defineTheme(theme, themeData);
            res();
        });
    });
};

export { defineTheme };