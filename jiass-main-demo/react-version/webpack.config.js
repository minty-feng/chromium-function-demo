const path = require('path');

module.exports = {
    mode: 'development',
    entry: './src/renderer/js/App.tsx',
    output: {
        path: path.resolve(__dirname, 'src/renderer/dist'),
        filename: 'bundle.js',
    },
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/,
                exclude: /node_modules/,
                use: 'ts-loader'
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx']
    },
    target: 'electron-renderer'
};
