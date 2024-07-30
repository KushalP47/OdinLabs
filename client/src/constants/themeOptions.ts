export interface themeOption {
    id: number;
    name: string;
    label: string;
    value: string;
}
export const themeOptions: Array<themeOption> = [{
    id: 1,
    name: "light",
    label: "Light",
    value: "light",
}, {
    id: 2,
    name: "dark",
    label: "Dark",
    value: "dark",
}];