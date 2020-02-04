const tailwindcss = require('tailwindcss');

module.exports = {
    plugins: [
        tailwindcss('./src/core/tailwind.config.js'),
        require('autoprefixer'),
    ],
};