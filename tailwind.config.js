module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{vue, js, ts, jsx, tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                "moe": ["LXGW WenKai", "sans-serif"],
            }
        }
    },
    plugins: [
        require("@tailwindcss/typography"),
        require("daisyui"),
    ],
    daisyui: {
        themes: ["light", "night"],
        darkTheme: "night",
    }
};

