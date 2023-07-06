/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.njs', './src/**/*.jsx', './src/**/*.nts', './src/**/*.tsx'],
    theme: {
        extend: {},
        fontFamily: { roboto: ['Roboto', 'sans-serif'] },
    },
    plugins: [],
    darkMode: 'class',
};
