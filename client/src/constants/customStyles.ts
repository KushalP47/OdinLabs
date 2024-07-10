export const customStyles = {
    control: (styles: any) => ({
        ...styles,
        width: "100%",
        // maxWidth: "14rem",
        minWidth: "8rem",
        borderRadius: "5px",
        color: "#767FFE",
        // fontSize: "0.8rem",
        // lineHeight: "1.75rem",
        backgroundColor: "#FFFFFF",
        cursor: "pointer",
        // border: "2px solid #000000",
        ":hover": {
            border: "#767FFE",
        },
    }),
    option: (styles: any) => {
        return {
            ...styles,
            color: "#767FFE",
            backgroundColor: "#FFFFFF",
            ":hover": {
                backgroundColor: "#dbeafe",
                color: "#767FFE",
                cursor: "pointer",
            },
        };
    },
    menu: (styles: any) => {
        return {
            ...styles,
            backgroundColor: "#ffffff",
            // maxWidth: "14rem",
            // border: "2px solid #000000",
            borderRadius: "5px",
        };
    },

    placeholder: () => {
        return {
            // ...defaultStyles,
            color: "#767FFE",
            // fontSize: "0.8rem",
            // lineHeight: "1.75rem",
        };
    },
};